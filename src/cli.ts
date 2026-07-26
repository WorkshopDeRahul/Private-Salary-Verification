/**
 * Interactive CLI for Private Salary Verification dApp
 */
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import * as path from "node:path";
import * as fs from "node:fs";
import * as crypto from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolveNetwork, getOrCreateSeed, getDeployment } from "./network.js";
import { createWallet, persistWalletState, unshieldedToken } from "./wallet.js";
import { WebSocket } from "ws";
import { httpClientProofProvider } from "@midnight-ntwrk/midnight-js-http-client-proof-provider";
import { indexerPublicDataProvider } from "@midnight-ntwrk/midnight-js-indexer-public-data-provider";
import { levelPrivateStateProvider } from "@midnight-ntwrk/midnight-js-level-private-state-provider";
import { NodeZkConfigProvider } from "@midnight-ntwrk/midnight-js-node-zk-config-provider";
import { findDeployedContract } from "@midnight-ntwrk/midnight-js-contracts";
import { CompiledContract } from "@midnight-ntwrk/midnight-js-protocol/compact-js";

// @ts-expect-error Required for WebSocket in Node environment
globalThis.WebSocket = WebSocket;

const PRIVATE_STATE_ID = "privateSalaryVerificationState";

const { network, config: networkConfig } = resolveNetwork();
const SEED = getOrCreateSeed(network);

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

async function createProviders(walletCtx: any) {
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
  console.log("║           Private Salary Verification - CLI Console           ║");
  console.log("╚══════════════════════════════════════════════════════════════╝\n");

  const rl = createInterface({ input: stdin, output: stdout });

  const deployment = getDeployment(network);
  if (!deployment) {
    console.error(`No deployment recorded for network "${network}". Run \`npm run setup -- --network ${network}\` first.`);
    process.exit(1);
  }

  console.log(`  Contract Address: ${deployment.address}`);
  console.log(`  Network Target:   ${network}\n`);

  try {
    console.log("  Connecting wallet and syncing network state...");
    const walletCtx = await createWallet({ network, networkConfig, seed: SEED });
    await walletCtx.wallet.waitForSyncedState();
    console.log("  ✓ Wallet synced!\n");

    console.log("  Connecting to contract on Midnight ledger...");
    const providers = await createProviders(walletCtx);

    const deployed: any = await findDeployedContract(providers, {
      compiledContract: compiledContract as any,
      contractAddress: deployment.address,
      privateStateId: PRIVATE_STATE_ID,
      initialPrivateState: {},
    });

    console.log("  ✅ Connected to Private Salary Verification contract!\n");

    let running = true;
    while (running) {
      console.log("─── Main Menu ──────────────────────────────────────────────────");
      console.log("  1. Initialize Verifier Authority Key");
      console.log("  2. Privately Verify Salary Threshold (ZK Proof)");
      console.log("  3. Query Public Ledger Verification State");
      console.log("  4. Check Wallet Balance & DUST Tokens");
      console.log("  5. Exit\n");

      const choice = await rl.question("  Select an option (1-5): ");

      switch (choice.trim()) {
        case "1": {
          console.log("\n  Generating verifier public key hash...");
          const dummyKey = new Uint8Array(32);
          for (let i = 0; i < 32; i++) dummyKey[i] = (i + 7) % 256;

          console.log("  Submitting initializeVerifier transaction...");
          try {
            const tx = await deployed.callTx.initializeVerifier(dummyKey);
            console.log("  ✅ Verifier initialized successfully!");
            console.log(`  Tx ID: ${tx.public.txId}`);
            console.log(`  Block Height: ${tx.public.blockHeight}\n`);
          } catch (err: any) {
            console.error("  ❌ Initialization failed:", err?.message || err);
          }
          break;
        }

        case "2": {
          console.log("\n  ── Private Salary Verification Input ──");
          const thresholdStr = await rl.question("  Enter Minimum Salary Threshold (e.g. 75000): ");
          const salaryStr = await rl.question("  Enter Secret Actual Salary     (e.g. 95000): ");
          const saltStr = await rl.question("  Enter Employee Secret Salt    (e.g. secret-salt-123): ");

          const threshold = BigInt(thresholdStr.trim() || "75000");
          const salary = BigInt(salaryStr.trim() || "95000");
          
          const saltBytes = new Uint8Array(32);
          const saltEncoded = new TextEncoder().encode(saltStr.trim() || "secret-salt-123");
          saltBytes.set(saltEncoded.subarray(0, 32));

          console.log(`\n  Generating ZK Proof that Salary >= ${threshold.toLocaleString()}...`);
          console.log("  (Proving locally via Midnight proof-server on port 6300)...");
          const startTime = Date.now();

          try {
            const tx = await deployed.callTx.verifySalaryThreshold(threshold, salary, saltBytes);
            const duration = ((Date.now() - startTime) / 1000).toFixed(1);
            console.log(`\n  ✅ ZK Proof & Verification Transaction Confirmed (${duration}s)!`);
            console.log(`  Tx ID:        ${tx.public.txId}`);
            console.log(`  Block Height: ${tx.public.blockHeight}`);
            console.log(`  Disclosed Threshold: $${threshold.toLocaleString()}`);
            console.log("  Private Salary Disclosed: NONE (Preserved in ZK witness!)\n");
          } catch (err: any) {
            console.error("\n  ❌ Salary Verification Failed:", err?.message || err);
          }
          break;
        }

        case "3": {
          console.log("\n  Querying public ledger data from Indexer...");
          try {
            const contractState = await providers.publicDataProvider.queryContractState(deployment.address);
            if (contractState) {
              const ledgerState = SalaryContract.ledger(contractState.data);
              console.log("\n  📋 Public Ledger State:");
              console.log(`     - Verification Count:      ${ledgerState.verificationCount.toString()}`);
              console.log(`     - Latest Verified Threshold:$${ledgerState.latestVerifiedThreshold.toLocaleString()}`);
              console.log(`     - Latest Status Verified:   ${ledgerState.isVerified ? "TRUE (Verified)" : "FALSE"}`);
              console.log(`     - Verifier Owner Key:       ${Buffer.from(ledgerState.verifierOwner).toString("hex").substring(0, 16)}...`);
              console.log(`     - Verified Commitment Hash: ${Buffer.from(ledgerState.verifiedCommitmentHash).toString("hex").substring(0, 16)}...\n`);
            } else {
              console.log("\n  📋 Contract state is empty (not initialized yet).\n");
            }
          } catch (err: any) {
            console.error("\n  ❌ Ledger query failed:", err?.message || err);
          }
          break;
        }

        case "4": {
          console.log("\n  Fetching updated balance...");
          const currentState = await walletCtx.wallet.waitForSyncedState();
          const currentBalance = currentState.unshielded.balances[unshieldedToken().raw] ?? 0n;
          const dustBalance = currentState.dust.balance(new Date());
          console.log(`\n  tNIGHT Balance: ${currentBalance.toLocaleString()}`);
          console.log(`  DUST Balance:   ${dustBalance.toLocaleString()}\n`);
          break;
        }

        case "5":
          running = false;
          console.log("\n  👋 Exiting CLI. Goodbye!\n");
          break;

        default:
          console.log("\n  ❌ Choice invalid. Enter 1-5.\n");
      }
    }

    await persistWalletState(network, walletCtx);
    await walletCtx.wallet.stop();
  } catch (err: any) {
    console.error("\n❌ CLI Error:", err?.message || err);
  } finally {
    rl.close();
  }
}

main().catch(console.error);
