import React, { useState } from "react";
import { CredentialCard, CredentialItem } from "../components/CredentialCard";
import { Plus, Award, Shield, Lock, Search, Filter } from "lucide-react";

export const CredentialsPage: React.FC = () => {
  const [credentials, setCredentials] = useState<CredentialItem[]>([
    {
      id: "cred-101",
      title: "Senior Software Engineer Salary Credential",
      issuer: "Acme Tech Corp Payroll",
      issueDate: "2026-01-15",
      expiryDate: "2027-01-15",
      status: "ACTIVE",
      thresholdTested: "$75,000",
      commitmentHash: "0x444f33167a85a49ed3a197e2944742463bca0a98364570caa8f116c13cb91954",
    },
    {
      id: "cred-102",
      title: "Verified Income Tier 1 Credential",
      issuer: "Global Enterprise Payroll Services",
      issueDate: "2026-03-01",
      expiryDate: "2027-03-01",
      status: "VERIFIED",
      thresholdTested: "$85,000",
      commitmentHash: "0x944742463bca0a98364570caa8f116c13cb91954444f33167a85a49ed3a197e2",
    },
    {
      id: "cred-103",
      title: "Consultant Minimum Earnings Credential",
      issuer: "Apex Financial Advisory",
      issueDate: "2025-11-20",
      expiryDate: "2026-11-20",
      status: "ACTIVE",
      thresholdTested: "$60,000",
      commitmentHash: "0x3bca0a98364570caa8f116c13cb91954444f33167a85a49ed3a197e294474246",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newIssuer, setNewIssuer] = useState<string>("");
  const [newThreshold, setNewThreshold] = useState<string>("75000");

  const handleRevoke = (id: string) => {
    setCredentials((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "REVOKED" as const } : c))
    );
  };

  const handleExport = (id: string) => {
    const cred = credentials.find((c) => c.id === id);
    if (!cred) return;
    const jsonStr = JSON.stringify(cred, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${cred.id}-zk-credential.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCreateCredential = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newIssuer) return;

    const newCred: CredentialItem = {
      id: `cred-${Date.now().toString().slice(-4)}`,
      title: newTitle,
      issuer: newIssuer,
      issueDate: new Date().toISOString().split("T")[0],
      expiryDate: "2027-12-31",
      status: "ACTIVE",
      thresholdTested: `$${parseInt(newThreshold).toLocaleString()}`,
      commitmentHash: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
    };

    setCredentials([newCred, ...credentials]);
    setNewTitle("");
    setNewIssuer("");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-[#6D5DF6] uppercase tracking-wider">
            Credential Vault
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5 flex items-center gap-2.5">
            <Award className="w-7 h-7 text-[#6D5DF6]" />
            Employer Credential Vault
          </h1>
          <p className="text-xs text-slate-600">
            Simulated employer-issued Zero-Knowledge credentials for private income verification.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6D5DF6] to-purple-600 text-white font-bold text-xs hover:opacity-95 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Credential
        </button>
      </div>

      {/* Grid of Credentials */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {credentials.map((cred) => (
          <CredentialCard
            key={cred.id}
            credential={cred}
            onRevoke={handleRevoke}
            onExport={handleExport}
          />
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#6D5DF6]" />
                Issue New ZK Credential
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCredential} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold">Credential Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Staff Income Credential"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#6D5DF6]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold">Issuer / Employer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Global Payroll Inc"
                  value={newIssuer}
                  onChange={(e) => setNewIssuer(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#6D5DF6]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold">Verified Threshold ($ USD)</label>
                <input
                  type="number"
                  required
                  placeholder="75000"
                  value={newThreshold}
                  onChange={(e) => setNewThreshold(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#6D5DF6] font-mono font-bold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#6D5DF6] text-white font-bold hover:bg-purple-700 shadow-sm"
                >
                  Issue Credential
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
