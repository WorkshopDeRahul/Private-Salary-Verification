import React from "react";
import { Shield, Award, Cpu, Lock, CheckCircle2, FileText, Code2, Globe } from "lucide-react";

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-10 py-4">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-50 via-white to-indigo-50 border border-purple-200 p-8 shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 border border-purple-200 text-[#6D5DF6] text-xs font-mono font-bold">
          <Award className="w-3.5 h-3.5" />
          Midnight Network Submission - Level 3
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          About Private Salary Verification
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          An enterprise-grade Zero-Knowledge full-stack Midnight dApp built under the <strong className="text-slate-900 font-bold">Confidential Credentials</strong> category. Private Salary Verification allows individuals to prove income eligibility to third parties without exposing exact salaries, employer identities, or bank statements.
        </p>
      </div>

      {/* Grid: Problem vs Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-3 shadow-xs">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            The Financial Privacy Problem
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            When applying for apartment leases, car loans, or mortgages, applicants are routinely required to upload pay stubs, W-2 forms, or tax returns. This leads to **over-disclosure** (revealing exact salary and personal spending) and **identity theft risk** if third-party databases are breached.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-purple-200 p-6 space-y-3 shadow-xs">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            The Midnight ZK Solution
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Using Midnight Compact smart contracts, applicants generate a local Zero-Knowledge proof demonstrating <code className="text-[#6D5DF6] font-bold font-mono">secretSalary &gt;= requestedThreshold</code>. The public ledger records a verified flag while keeping actual salary values hidden inside the private witness.
          </p>
        </div>
      </div>

      {/* Technical Stack */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-6 shadow-xs">
        <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#6D5DF6]" />
          Technical Stack & System Architecture
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
            <span className="text-slate-500 font-mono text-[10px] font-bold uppercase">Smart Contract Engine</span>
            <h4 className="font-bold text-slate-900 text-sm">Compact 0.31.1</h4>
            <p className="text-slate-600">Strict disclosure controls & Uint64 arithmetic types.</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
            <span className="text-slate-500 font-mono text-[10px] font-bold uppercase">Frontend Application</span>
            <h4 className="font-bold text-slate-900 text-sm">React 18 + Vite 6</h4>
            <p className="text-slate-600">Tailwind CSS fintech light theme & Lace Wallet integration.</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
            <span className="text-slate-500 font-mono text-[10px] font-bold uppercase">ZK Proving Engine</span>
            <h4 className="font-bold text-slate-900 text-sm">Midnight Proof Server</h4>
            <p className="text-slate-600">Standalone Docker containers on port 6300 with SRS parameters.</p>
          </div>
        </div>
      </div>

      {/* Developer Specs */}
      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 space-y-3 text-xs font-mono text-slate-700">
        <h4 className="text-sm font-extrabold text-slate-900 font-sans flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#6D5DF6]" />
          Submission & Developer Metadata
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 pt-2 font-bold">
          <div><span className="text-slate-400 font-normal">Developer:</span> Rahul Saha</div>
          <div><span className="text-slate-400 font-normal">GitHub:</span> WorkshopDeRahul</div>
          <div><span className="text-slate-400 font-normal">Netlify URL:</span> https://privatesalaryverification.netlify.app/</div>
          <div><span className="text-slate-400 font-normal">Repository:</span> Private-Salary-Verification-midnight</div>
        </div>
      </div>
    </div>
  );
};
