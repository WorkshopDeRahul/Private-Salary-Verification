import React, { useState } from "react";
import { ShieldCheck, Lock, Eye, EyeOff, Cpu, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, Key, Landmark, Sparkles } from "lucide-react";

interface VerificationFormProps {
  onExecuteProof: (salary: bigint, threshold: bigint, salt: string) => Promise<{ success: boolean; hash: string; message: string }>;
  contractAddress: string;
}

export const VerificationForm: React.FC<VerificationFormProps> = ({
  onExecuteProof,
  contractAddress,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [requestedThreshold, setRequestedThreshold] = useState<string>("75000");
  const [secretSalary, setSecretSalary] = useState<string>("95000");
  const [secretSalt, setSecretSalt] = useState<string>("employee-secret-salt-2026");
  const [showSecretSalary, setShowSecretSalary] = useState<boolean>(false);
  
  const [proofState, setProofState] = useState<"IDLE" | "GENERATING" | "SUCCESS" | "FAILURE">("IDLE");
  const [provingStepMessage, setProvingStepMessage] = useState<string>("");
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    commitmentHash: string;
    message: string;
    timestamp: string;
  } | null>(null);

  const handleStartProving = async (e: React.FormEvent) => {
    e.preventDefault();
    const thresholdVal = BigInt(requestedThreshold || "0");
    const salaryVal = BigInt(secretSalary || "0");

    if (thresholdVal <= 0n || salaryVal <= 0n) {
      alert("Please enter valid positive salary and threshold values.");
      return;
    }

    setCurrentStep(4);
    setProofState("GENERATING");

    try {
      setProvingStepMessage("1/3 Constructing ZK witness & private salary constraints...");
      await new Promise((r) => setTimeout(r, 600));

      setProvingStepMessage("2/3 Executing Compact circuit: verifying (secretSalary >= requestedThreshold)...");
      await new Promise((r) => setTimeout(r, 800));

      setProvingStepMessage("3/3 Generating 32-byte cryptographic salt commitment hash...");
      const res = await onExecuteProof(salaryVal, thresholdVal, secretSalt);

      await new Promise((r) => setTimeout(r, 400));

      setVerificationResult({
        success: res.success,
        commitmentHash: res.hash,
        message: res.message,
        timestamp: new Date().toLocaleTimeString(),
      });

      setProofState(res.success ? "SUCCESS" : "FAILURE");
      setCurrentStep(5);
    } catch (err: any) {
      setProofState("FAILURE");
      setVerificationResult({
        success: false,
        commitmentHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
        message: err.message || "Failed to generate Zero-Knowledge proof",
        timestamp: new Date().toLocaleTimeString(),
      });
      setCurrentStep(5);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setProofState("IDLE");
    setVerificationResult(null);
  };

  return (
    <div className="rounded-3xl bg-white border border-slate-200 p-6 md:p-8 shadow-xl space-y-8">
      {/* Header & Step Wizard */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#6D5DF6]" />
              Zero-Knowledge Salary Prover Wizard
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Construct an interactive ZK proof enforcing minimum income threshold requirements without disclosing actual earnings.
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-[#6D5DF6] font-mono text-xs font-bold">
            <Lock className="w-3.5 h-3.5" />
            Compact 0.31.1 ZK Engine
          </span>
        </div>

        {/* 5-Step Progress Bar */}
        <div className="grid grid-cols-5 gap-2 pt-2">
          {[
            { step: 1, title: "Threshold" },
            { step: 2, title: "Salary" },
            { step: 3, title: "Salt" },
            { step: 4, title: "Proving" },
            { step: 5, title: "Result" },
          ].map((s) => {
            const isCompleted = currentStep > s.step;
            const isCurrent = currentStep === s.step;
            return (
              <div
                key={s.step}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? "bg-purple-50 border-purple-300 text-[#6D5DF6] font-bold shadow-xs"
                    : isCompleted
                    ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                    : "bg-slate-50 border-slate-200 text-slate-400"
                }`}
              >
                <div className="text-[10px] font-mono uppercase tracking-wider">Step {s.step}</div>
                <div className="text-xs font-semibold mt-0.5 truncate">{s.title}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Required Threshold */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Step 1: Required Minimum Salary Threshold ($ USD)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-lg font-bold">$</span>
              <input
                type="number"
                value={requestedThreshold}
                onChange={(e) => setRequestedThreshold(e.target.value)}
                placeholder="75000"
                className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-3 text-slate-900 font-mono text-lg font-bold focus:outline-none focus:border-[#6D5DF6]"
              />
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-[#6D5DF6]" />
              This is the public minimum earnings required by the verifier (e.g. landlord, mortgage officer).
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6D5DF6] to-purple-600 text-white font-bold text-xs hover:opacity-95 transition-all shadow-md shadow-purple-500/20"
            >
              Next: Enter Private Salary
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Private Salary Witness */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Step 2: Confidential Actual Salary ($ USD)
              </label>
              <span className="text-[10px] text-emerald-700 font-mono font-bold flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" />
                Witness values NEVER leave your local client
              </span>
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-lg font-bold">$</span>
              <input
                type={showSecretSalary ? "text" : "password"}
                value={secretSalary}
                onChange={(e) => setSecretSalary(e.target.value)}
                placeholder="95000"
                className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-12 py-3 text-slate-900 font-mono text-lg font-bold focus:outline-none focus:border-[#6D5DF6]"
              />
              <button
                type="button"
                onClick={() => setShowSecretSalary(!showSecretSalary)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700"
              >
                {showSecretSalary ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Your confidential earnings ($95,000) are evaluated locally inside the ZK witness and never posted to the blockchain.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2.5 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6D5DF6] to-purple-600 text-white font-bold text-xs hover:opacity-95 transition-all shadow-md shadow-purple-500/20"
            >
              Next: Enter Secret Salt Key
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Secret Salt Key */}
      {currentStep === 3 && (
        <form onSubmit={handleStartProving} className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Step 3: Secret Salt Key & Entropy
            </label>
            <div className="relative">
              <input
                type="text"
                value={secretSalt}
                onChange={(e) => setSecretSalt(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-slate-900 font-mono text-xs font-bold focus:outline-none focus:border-[#6D5DF6]"
              />
              <Key className="w-4 h-4 text-[#6D5DF6] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <p className="text-xs text-slate-500">
              A 32-byte cryptographic salt key used to construct a unique, unforgeable commitment hash on-chain.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2.5 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-[#6D5DF6] via-purple-600 to-indigo-600 text-white font-bold text-xs hover:opacity-95 transition-all shadow-lg shadow-purple-500/25"
            >
              <Cpu className="w-4 h-4" />
              Generate ZK Proof
            </button>
          </div>
        </form>
      )}

      {/* STEP 4: ZK Proving Pipeline Animation */}
      {currentStep === 4 && (
        <div className="bg-slate-50 p-8 rounded-2xl border border-purple-200 text-center space-y-6">
          <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-purple-200 animate-ping" />
            <div className="w-16 h-16 rounded-full border-4 border-[#6D5DF6] border-t-transparent animate-spin flex items-center justify-center">
              <Cpu className="w-6 h-6 text-[#6D5DF6]" />
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-lg font-extrabold text-slate-900">Generating Zero-Knowledge Proof</h4>
            <p className="text-xs font-mono text-[#6D5DF6] font-bold animate-pulse">{provingStepMessage}</p>
          </div>

          <div className="max-w-md mx-auto bg-white p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2 font-mono text-slate-600 shadow-xs">
            <div className="flex justify-between">
              <span>Circuit:</span>
              <span className="text-purple-700 font-bold">verifySalaryThreshold</span>
            </div>
            <div className="flex justify-between">
              <span>Public Threshold:</span>
              <span className="text-slate-900 font-bold">${requestedThreshold}</span>
            </div>
            <div className="flex justify-between">
              <span>Private Witness:</span>
              <span className="text-emerald-600 font-bold">[Masked Local Client]</span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: Verification Result & On-Chain Record */}
      {currentStep === 5 && verificationResult && (
        <div className="space-y-6">
          <div
            className={`p-6 rounded-2xl border ${
              verificationResult.success
                ? "bg-emerald-50 border-emerald-300"
                : "bg-rose-50 border-rose-300"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  verificationResult.success
                    ? "bg-emerald-100 text-emerald-600 border border-emerald-300"
                    : "bg-rose-100 text-rose-600 border border-rose-300"
                }`}
              >
                {verificationResult.success ? (
                  <CheckCircle2 className="w-7 h-7" />
                ) : (
                  <AlertCircle className="w-7 h-7" />
                )}
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-extrabold text-slate-900">
                    {verificationResult.success ? "Verification Successful!" : "Verification Failed"}
                  </h4>
                  <span className="text-xs font-mono text-slate-500 font-bold">{verificationResult.timestamp}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{verificationResult.message}</p>

                {/* Commitment Hash */}
                <div className="mt-3 bg-white p-3.5 rounded-xl border border-slate-200 text-xs font-mono space-y-1.5">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Cryptographic Salt Commitment Hash</div>
                  <div className="text-purple-700 font-bold break-all">{verificationResult.commitmentHash}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200"
            >
              <RefreshCw className="w-4 h-4" />
              Verify Another Salary
            </button>
            <span className="text-xs font-mono text-emerald-700 font-bold flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              On-Chain Public State Updated
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
