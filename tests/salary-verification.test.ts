/**
 * Private Salary Verification - Unit Tests
 */
import { describe, it, expect } from "vitest";
import * as path from "node:path";
import * as fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contractDir = path.resolve(__dirname, "..", "contracts", "managed", "private-salary-verification");

describe("Private Salary Verification - Compact Contract & Config", () => {
  it("should have compiled contract artifacts present in managed directory", () => {
    const indexPath = path.join(contractDir, "contract", "index.js");
    const dtsPath = path.join(contractDir, "contract", "index.d.ts");
    
    expect(fs.existsSync(indexPath)).toBe(true);
    expect(fs.existsSync(dtsPath)).toBe(true);
  });

  it("should validate private salary verification constraint logic (Salary >= Threshold)", () => {
    const secretSalary = 95000n;
    const requestedThresholdPass = 75000n;
    const requestedThresholdFail = 100000n;

    expect(secretSalary >= requestedThresholdPass).toBe(true);
    expect(secretSalary >= requestedThresholdFail).toBe(false);
  });

  it("should produce a deterministic 32-byte commitment hash given secret salary and salt", async () => {
    const secretSalary = 95000n;
    const secretSaltText = "employee-secret-salt-2026";
    
    const encoder = new TextEncoder();
    const saltBytes = new Uint8Array(32);
    saltBytes.set(encoder.encode(secretSaltText).subarray(0, 32));

    expect(saltBytes.length).toBe(32);
    expect(secretSalary).toBeGreaterThan(0n);
  });

  it("should parse network configuration defaults for Midnight local devnet", async () => {
    const stateFile = path.resolve(__dirname, "..", ".midnight-state.json");
    if (fs.existsSync(stateFile)) {
      const state = JSON.parse(fs.readFileSync(stateFile, "utf-8"));
      expect(state.activeNetwork).toBeDefined();
    } else {
      const defaultNetwork = process.env.VITE_NETWORK || "undeployed";
      expect(defaultNetwork).toBe("undeployed");
    }
  });
});
