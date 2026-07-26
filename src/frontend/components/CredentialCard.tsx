import React from "react";
import { ShieldCheck, Calendar, Key, Lock, Trash2, Download, CheckCircle2 } from "lucide-react";

export interface CredentialItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  status: "ACTIVE" | "VERIFIED" | "REVOKED";
  thresholdTested: string;
  commitmentHash: string;
}

interface CredentialCardProps {
  credential: CredentialItem;
  onRevoke?: (id: string) => void;
  onExport?: (id: string) => void;
}

export const CredentialCard: React.FC<CredentialCardProps> = ({
  credential,
  onRevoke,
  onExport,
}) => {
  const statusColors = {
    ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-300",
    VERIFIED: "bg-purple-50 text-[#6D5DF6] border-purple-300",
    REVOKED: "bg-rose-50 text-rose-700 border-rose-300",
  };

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-purple-200 transition-all flex flex-col justify-between space-y-5">
      {/* Top Bar */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-[#6D5DF6]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">{credential.title}</h4>
            <p className="text-xs text-slate-500">Issuer: {credential.issuer}</p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-bold border ${statusColors[credential.status]}`}>
          {credential.status}
        </span>
      </div>

      {/* Dates Grid */}
      <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
        <div>
          <span className="text-slate-400 block text-[9px] font-mono font-bold uppercase">Issued</span>
          <span className="text-slate-700 font-semibold flex items-center gap-1 mt-0.5">
            <Calendar className="w-3 h-3 text-[#6D5DF6]" />
            {credential.issueDate}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[9px] font-mono font-bold uppercase">Expires</span>
          <span className="text-slate-700 font-semibold flex items-center gap-1 mt-0.5">
            <Calendar className="w-3 h-3 text-purple-600" />
            {credential.expiryDate}
          </span>
        </div>
      </div>

      {/* ZK Proof Commitment */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between text-slate-600">
          <span className="flex items-center gap-1 text-slate-900 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Verified Threshold:
          </span>
          <span className="font-bold text-slate-900 font-mono">{credential.thresholdTested}</span>
        </div>

        <div className="flex items-center justify-between text-slate-500 text-[11px] font-mono bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
          <span className="flex items-center gap-1">
            <Key className="w-3 h-3 text-[#6D5DF6]" />
            Commitment:
          </span>
          <span className="text-slate-700 font-bold">{credential.commitmentHash.substring(0, 10)}...</span>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-mono font-bold pt-1">
          <Lock className="w-3 h-3 text-emerald-600" />
          <span>Zero-Knowledge Witness: Actual salary hidden</span>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
        <button
          onClick={() => onExport && onExport(credential.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors border border-slate-200"
        >
          <Download className="w-3.5 h-3.5 text-[#6D5DF6]" />
          Export Proof JSON
        </button>
        <button
          onClick={() => onRevoke && onRevoke(credential.id)}
          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors"
          title="Revoke Credential"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
