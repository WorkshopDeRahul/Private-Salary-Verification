import React from "react";
import { VerificationHistory, VerificationLogItem } from "../components/VerificationHistory";
import { History } from "lucide-react";

interface HistoryPageProps {
  logs: VerificationLogItem[];
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ logs }) => {
  return (
    <div className="space-y-8 py-4">
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs font-mono font-bold text-[#6D5DF6] uppercase tracking-wider">
          Audit Trail
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5 flex items-center gap-2.5">
          <History className="w-7 h-7 text-[#6D5DF6]" />
          Verification History Logs
        </h1>
        <p className="text-xs text-slate-600">
          Historical record of zero-knowledge salary threshold proofs executed on Midnight Network.
        </p>
      </div>

      <VerificationHistory logs={logs} />
    </div>
  );
};
