/**
 * Deploy private-salary-verification contract to a Midnight network.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { resolveNetwork, getOrCreateSeed, recordDeployment } from "./network.js";
import { createWallet, persistWalletState, unshieldedToken, type WalletContext } from "./wallet.js";
import { fileURLToPath, pathToFileURL } from "node:url";
import { WebSocket } from "ws";
import * as Rx from "rxjs";

// Midnight SDK imports
import { deployContract } from "@midnight-ntwrk/midnight-js-contracts";
import { httpClientProofProvider } from "@midnight-ntwrk/midnight-js-http-client-proof-provider";
import { indexerPublicDataProvider } from "@midnight-ntwrk/midnight-js-indexer-public-data-provider";
import { levelPrivateStateProvider } from "@midnight-ntwrk/midnight-js-level-private-state-provider";
import { NodeZkConfigProvider } from "@midnight-ntwrk/midnight-js-node-zk-config-provider";
import { CompiledContract } from "@midnight-ntwrk/midnight-js-protocol/compact-js";

// @ts-expect-error Required for wallet sync
globalThis.WebSocket = WebSocket;

const PRIVATE_STATE_ID = "privateSalaryVerificationState";

const { network, config: networkConfig } = resolveNetwork();
const SEED = getOrCreateSeed(network);

async function waitForProofServer(maxAttempts = 60, delayMs = 2000): Promise<boolean> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await fetch(networkConfig.proofServer, {
        method: "GET",
        signal: AbortSignal.timeout(3000),
      });
      return true;
    } catch (err: any) {
      const code = err?.cause?.code || err?.code || "";
      if (code !== "ECONNREFUSED" && code !== "UND_ERR_CONNECT_TIMEOUT" && code !== "UND_ERR_SOCKET") {
        return true;
      }
    }
    if (attempt < maxAttempts) {
      process.stdout.write(`\r  Waiting for proof server... (${attempt}/${maxAttempts})   `);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  return false;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const zkConfigPath = path.resolve(__dirname, "..", "contracts", "managed", "private-salary-verification");
const contractPath = path.join(zkConfigPath, "contract", "index.js");

if (!fs.existsSync(contractPath)) {
  console.error("\n❌ Contract not compiled! Run: npm run compile\n");
  process.exit(1);
}

const SalaryContract = await import(pathToFileURL(contractPath).href);

const compiledContract = CompiledContract.make("private-salary-verification", SalaryContract.Contract).pipe(
  CompiledContract.withVacantWitnesses,
  CompiledContract.withCompiledFileAssets(zkConfigPath),
);

async function createProviders(walletCtx: WalletContext) {
  const privateStatePassword = process.env.PRIVATE_STATE_PASSWORD?.trim() || "Local-Devnet-Development-Placeholder-1";

  const walletProvider = {
    getCoinPublicKey: () => walletCtx.shieldedSecretKeys.coinPublicKey,
    getEncryptionPublicKey: () => walletCtx.shieldedSecretKeys.encryptionPublicKey,
    async balanceTx(tx: any, ttl?: Date) {
      const recipe = await walletCtx.wallet.balanceUnboundTransaction(
        tx,
        { shieldedSecretKeys: walletCtx.shieldedSecretKeys, dustSecretKey: walletCtx.dustSecretKey },
        { ttl: ttl ?? new Date(Date.now() + 30 * 60 * 1000) },
      );
      return walletCtx.wallet.finalizeRecipe(recipe);
    },
    submitTx: (tx: any) => walletCtx.wallet.submitTransaction(tx) as any,
  };

  const zkConfigProvider = new NodeZkConfigProvider(zkConfigPath);
  const accountId = walletCtx.unshieldedKeystore.getBech32Address().toString();

  return {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: "private-salary-verification-state",
      accountId,
      privateStoragePasswordProvider: () => privateStatePassword,
    }),
    publicDataProvider: indexerPublicDataProvider(networkConfig.indexer, networkConfig.indexerWS),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(networkConfig.proofServer, zkConfigProvider),
    walletProvider,
    midnightProvider: walletProvider,
  };
}

async function main() {
  console.log("\n╔══════════════════════════════════════════════════════════════╗");
  console.log("║         Deploy Private Salary Verification Contract          ║");
  console.log("╚══════════════════════════════════════════════════════════════╝\n");

  console.log(`  Network: ${network}`);
  console.log(`  RPC:     ${networkConfig.node}`);
  console.log(`  Indexer: ${networkConfig.indexer}`);
  console.log(`  Proof:   ${networkConfig.proofServer}\n`);

  console.log("  Initializing wallet...");
  const walletCtx = await createWallet({ network, networkConfig, seed: SEED });
  const restoredCount = Object.values(walletCtx.restored).filter(Boolean).length;
  if (restoredCount > 0) {
    console.log(`  Restored wallet state from cache.`);
  }

  console.log("  Syncing with network state...");
  const syncStart = Date.now();
  const syncInterval = setInterval(() => {
    const elapsed = Math.round((Date.now() - syncStart) / 1000);
    process.stdout.write(`\r  ⏳ Syncing... (${elapsed}s elapsed)   `);
  }, 5000);
  const initialSyncState = await walletCtx.wallet.waitForSyncedState();
  clearInterval(syncInterval);
  process.stdout.write("\r  ✓ Synced with network.                                      \n");

  const address = walletCtx.unshieldedKeystore.getBech32Address();
  console.log(`  Address: ${address}\n`);

  let balance = initialSyncState.unshielded.balances[unshieldedToken().raw] ?? 0n;
  console.log(`  Initial tNIGHT balance: ${balance.toLocaleString()}\n`);

  if (balance === 0n) {
    if (network === "undeployed") {
      console.log("  Requesting tokens from local devnet faucet...");
      const walletAny = walletCtx.wallet as any;
      if (typeof walletAny.requestTokensFromFaucet === "function") {
        const funded = await walletAny.requestTokensFromFaucet();
        if (funded) console.log("  ✓ Local faucet request succeeded.");
      }
      process.stdout.write("  Waiting for balance update...");
      await Rx.firstValueFrom(
        walletCtx.wallet.state().pipe(
          Rx.filter((s) => s.isSynced),
          Rx.filter((s) => (s.unshielded.balances[unshieldedToken().raw] ?? 0n) > 0n),
        ),
      );
      const syncedState = await walletCtx.wallet.waitForSyncedState();
      balance = syncedState.unshielded.balances[unshieldedToken().raw] ?? 0n;
      console.log(`\n  ✓ Funded! Balance: ${balance.toLocaleString()} tNIGHT\n`);
    } else {
      console.log("  ⚠ Public Network deployment requires tNIGHT funds.");
      console.log(`  Fund wallet address: ${address}`);
      console.log(`  Faucet URL: ${networkConfig.faucet}\n`);
    }
  }

  console.log("─── DUST Token Setup ───────────────────────────────────────────\n");
  const dustState = await Rx.firstValueFrom(walletCtx.wallet.state().pipe(Rx.filter((s) => s.isSynced)));

  const unregisteredUtxos = dustState.unshielded.availableCoins.filter(
    (c: any) => !c.meta?.registeredForDustGeneration,
  );
  if (unregisteredUtxos.length > 0) {
    console.log(`  Registering ${unregisteredUtxos.length} NIGHT UTXOs for DUST generation...`);
    const recipe = await walletCtx.wallet.registerNightUtxosForDustGeneration(
      unregisteredUtxos,
      walletCtx.unshieldedKeystore.getPublicKey(),
      (payload) => walletCtx.unshieldedKeystore.signData(payload),
    );
    const finalized = await walletCtx.wallet.finalizeRecipe(recipe);
    await walletCtx.wallet.submitTransaction(finalized);
  }

  if (dustState.dust.balance(new Date()) === 0n) {
    console.log("  Waiting for DUST tokens...");
    await Rx.firstValueFrom(
      walletCtx.wallet.state().pipe(
        Rx.throttleTime(5000),
        Rx.filter((s) => s.isSynced),
        Rx.filter((s) => s.dust.balance(new Date()) > 0n),
      ),
    );
  }
  console.log("  DUST tokens ready!\n");

  console.log("─── Deploy Contract ────────────────────────────────────────────\n");
  const proofServerReady = await waitForProofServer();
  if (!proofServerReady) {
    console.log("\n  ❌ Proof server unreachable. Ensure proof-server container is running on port 6300.\n");
    await walletCtx.wallet.stop();
    process.exit(1);
  }

  console.log("  Setting up providers...");
  const providers = await createProviders(walletCtx);

  process.stdout.write("  Preparing proof environment...");
  await new Promise((r) => setTimeout(r, 6000));
  console.log(" done.\n");

  console.log("  Deploying contract...\n");

  const MAX_RETRIES = 20;
  const RETRY_DELAY_MS = 5000;
  let deployed: Awaited<ReturnType<typeof deployContract>> | undefined;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      deployed = await deployContract(providers, {
        compiledContract: compiledContract as any,
        args: [],
        privateStateId: PRIVATE_STATE_ID,
        initialPrivateState: {},
      });
      break;
    } catch (err: any) {
      const errMsg = err?.message || err?.toString() || "";
      const errCause = err?.cause?.message || err?.cause?.toString() || "";
      const fullError = `${errMsg} ${errCause}`;

      const isDustShortage =
        fullError.includes("Not enough Dust") ||
        fullError.includes("Insufficient Funds") ||
        fullError.includes("could not balance dust");

      if (!(isDustShortage && attempt === 1)) {
        console.error(`\n  Attempt ${attempt} error: ${errMsg}`);
      }

      if (isDustShortage) {
        const currentState = await walletCtx.wallet.waitForSyncedState();
        const dustBalance = currentState.dust.balance(new Date());
        if (attempt < MAX_RETRIES) {
          console.log(`  ⏳ Retrying deployment in ${RETRY_DELAY_MS / 1000}s (DUST: ${dustBalance.toLocaleString()})...`);
          await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        } else {
          console.log(`  ❌ Not enough DUST after ${MAX_RETRIES} attempts.`);
          await walletCtx.wallet.stop();
          process.exit(1);
        }
      } else {
        throw err;
      }
    }
  }

  if (!deployed) throw new Error("Deployment failed after all retries");

  const contractAddress = deployed.deployTxData.public.contractAddress;
  console.log("  ✅ Contract deployed successfully!\n");
  console.log(`  Contract Address: ${contractAddress}\n`);

  recordDeployment(network, contractAddress, address.toString());
  console.log("  Saved contract deployment record to .midnight-state.json\n");

  await persistWalletState(network, walletCtx);
  await walletCtx.wallet.stop();
  console.log("─── Deployment complete ────────────────────────────────────────\n");
}

main().catch((err) => {
  console.error("❌ Fatal Deployment Error:", err);
  process.exit(1);
});
