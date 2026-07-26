import React from "react";
import { ShieldCheck, Eye, EyeOff, Lock, CheckCircle2, Code2, Sparkles } from "lucide-react";

export const PrivacyPanel: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-purple-50 via-white to-indigo-50 border border-purple-200/80 p-6 md:p-8 shadow-sm space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 border border-purple-200 text-[#6D5DF6] text-xs font-mono font-bold">
          <Lock className="w-3.5 h-3.5 text-[#6D5DF6]" />
          Midnight Zero-Knowledge Witness Architecture
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          How ZK Proofs Protect Your Financial Privacy
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          Traditional verification forces you to hand over pay stubs, W-2 forms, and full bank statements. Midnight Network uses Zero-Knowledge (ZK) circuits to prove <span className="text-[#6D5DF6] font-bold font-mono">secretSalary &gt;= requestedThreshold</span> without disclosing your actual income amount or banking history to anyone.
        </p>
      </div>

      {/* Side-by-Side Comparison: Public vs Private */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: What Observers CAN See (Public State) */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Public Ledger State</h3>
              <p className="text-xs text-slate-500">What observers & verifiers can see</p>
            </div>
          </div>

          <ul className="space-y-3 text-xs text-slate-700">
            <li className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Verification Result (`isVerified = true`)</span>
                Confirming that the applicant meets or exceeds the required threshold.
              </div>
            </li>
            <li className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Requested Threshold (`$75,000`)</span>
                The minimum earnings benchmark specified by the verifier.
              </div>
            </li>
            <li className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Salt Commitment Hash (`32-byte hash`)</span>
                Cryptographic commitment ensuring the claim is tamper-proof.
              </div>
            </li>
          </ul>
        </div>

        {/* Card 2: What Observers CANNOT See (Private Witness) */}
        <div className="rounded-2xl bg-white border border-purple-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-[#6D5DF6]">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Confidential ZK Witness</h3>
              <p className="text-xs text-slate-500">What remains 100% private to you</p>
            </div>
          </div>

          <ul className="space-y-3 text-xs text-slate-700">
            <li className="flex items-start gap-2 bg-purple-50/50 p-3 rounded-xl border border-purple-100">
              <Lock className="w-4 h-4 text-[#6D5DF6] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Secret Actual Salary (`$95,000`)</span>
                Your exact earnings never leave your local client machine or browser.
              </div>
            </li>
            <li className="flex items-start gap-2 bg-purple-50/50 p-3 rounded-xl border border-purple-100">
              <Lock className="w-4 h-4 text-[#6D5DF6] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Employer Payroll Details</span>
                Pay stub files, W-2 forms, tax deductions, and employer banking metadata.
              </div>
            </li>
            <li className="flex items-start gap-2 bg-purple-50/50 p-3 rounded-xl border border-purple-100">
              <Lock className="w-4 h-4 text-[#6D5DF6] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Personal Signing Keys & Salt</span>
                Local entropy keys are evaluated inside ZK proof generation locally.
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Code Box: Compact disclose() */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-3 font-mono text-xs text-white">
        <div className="flex items-center justify-between text-slate-400">
          <span className="flex items-center gap-2 text-purple-400 font-bold">
            <Code2 className="w-4 h-4" />
            Compact Smart Contract Disclose Discipline
          </span>
          <span className="text-[10px] text-slate-500 font-bold">contracts/private-salary-verification.compact</span>
        </div>
        <pre className="bg-slate-950 p-4 rounded-xl text-slate-200 overflow-x-auto border border-slate-800">
{`circuit verifySalaryThreshold(secretSalary: Uint<64>, secretSalt: Bytes<32>, requestedThreshold: Uint<64>): Void {
  // Private constraint evaluated in Zero-Knowledge
  assert(secretSalary >= requestedThreshold, "Salary is below requested threshold");

  // Deliberate disclosures for non-sensitive public updates
  verificationCount = disclose((verificationCount + 1) as Uint<64>);
  latestVerifiedThreshold = disclose(requestedThreshold);
  isVerified = disclose(true);
  verifiedCommitmentHash = disclose(secretSalt);
}`}
        </pre>
      </div>
    </div>
  );
};
