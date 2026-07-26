import React from "react";
import { PrivacyPanel } from "../components/PrivacyPanel";
import { Lock } from "lucide-react";

export const PrivacyPage: React.FC = () => {
  return (
    <div className="space-y-8 py-4">
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs font-mono font-bold text-[#6D5DF6] uppercase tracking-wider">
          Privacy Center
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5 flex items-center gap-2.5">
          <Lock className="w-7 h-7 text-[#6D5DF6]" />
          Zero-Knowledge Privacy Model
        </h1>
        <p className="text-xs text-slate-600">
          Deep-dive architecture into confidential witnesses, public ledger states, and deliberate disclosures in Compact smart contracts.
        </p>
      </div>

      <PrivacyPanel />
    </div>
  );
};
