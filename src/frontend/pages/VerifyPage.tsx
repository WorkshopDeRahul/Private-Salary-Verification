import React from "react";
import { VerificationForm } from "../components/VerificationForm";

interface VerifyPageProps {
  onExecuteProof: (salary: bigint, threshold: bigint, salt: string) => Promise<{ success: boolean; hash: string; message: string }>;
  contractAddress: string;
}

export const VerifyPage: React.FC<VerifyPageProps> = ({
  onExecuteProof,
  contractAddress,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Confidential Salary Verification Workspace
        </h1>
        <p className="text-xs text-slate-600 max-w-xl mx-auto">
          Generate Zero-Knowledge proof claims for third-party verifiers (landlords, loan officers) without revealing your secret salary or bank details.
        </p>
      </div>

      <VerificationForm onExecuteProof={onExecuteProof} contractAddress={contractAddress} />
    </div>
  );
};
