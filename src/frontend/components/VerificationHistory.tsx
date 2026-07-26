import React, { useState } from "react";
import { Search, Filter, CheckCircle2, XCircle, Copy, Clock, Key, Inbox } from "lucide-react";

export interface VerificationLogItem {
  id: string;
  timestamp: string;
  threshold: string;
  result: "PASSED" | "FAILED";
  commitmentHash: string;
  network: string;
}

interface VerificationHistoryProps {
  logs: VerificationLogItem[];
}

export const VerificationHistory: React.FC<VerificationHistoryProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterResult, setFilterResult] = useState<string>("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.commitmentHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.threshold.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.timestamp.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesResult = filterResult === "ALL" || log.result === filterResult;
    return matchesSearch && matchesResult;
  });

  const handleCopy = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="rounded-3xl bg-white border border-slate-200 p-6 md:p-8 shadow-xl space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by hash, date, or threshold..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#6D5DF6]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={filterResult}
            onChange={(e) => setFilterResult(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-xs text-slate-700 font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-[#6D5DF6]"
          >
            <option value="ALL">All Results</option>
            <option value="PASSED font-semibold">Passed Only</option>
            <option value="FAILED font-semibold">Failed Only</option>
          </select>
        </div>
      </div>

      {/* History Log Table */}
      {filteredLogs.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-mono uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 font-bold">Timestamp</th>
                <th className="py-3.5 px-4 font-bold">Threshold ($)</th>
                <th className="py-3.5 px-4 font-bold">ZK Result</th>
                <th className="py-3.5 px-4 font-bold">Commitment Hash</th>
                <th className="py-3.5 px-4 text-right font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-slate-700 flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {log.timestamp}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-black text-slate-900">${log.threshold}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
                        log.result === "PASSED"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                          : "bg-rose-50 text-rose-700 border-rose-300"
                      }`}
                    >
                      {log.result === "PASSED" ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <XCircle className="w-3 h-3 text-rose-600" />
                      )}
                      {log.result}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    <span className="flex items-center gap-1 font-bold text-[#6D5DF6]">
                      <Key className="w-3 h-3 text-[#6D5DF6] shrink-0" />
                      {log.commitmentHash.substring(0, 16)}...
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleCopy(log.commitmentHash, log.id)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold inline-flex items-center gap-1 transition-colors border border-slate-200"
                      title="Copy Commitment Hash"
                    >
                      <Copy className="w-3 h-3 text-[#6D5DF6]" />
                      {copiedId === log.id ? "Copied" : "Copy"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Empty State */
        <div className="py-12 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
            <Inbox className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">No Verification Logs Found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No historical ZK verification logs match your current search query or filter settings.
          </p>
        </div>
      )}
    </div>
  );
};
