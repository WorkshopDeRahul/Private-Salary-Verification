import React from "react";
import { Shield, Lock, ExternalLink, Github } from "lucide-react";
import { Link } from "../router";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-600 py-12 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-100 border border-purple-200 flex items-center justify-center">
                <Shield className="w-4 h-4 text-[#6D5DF6]" />
              </div>
              <span className="font-bold text-slate-900 text-sm">Private Salary Verification</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Zero-Knowledge Confidential Credentials dApp on Midnight Network. Prove income eligibility without disclosing salary or bank statements.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-1.5">
              <li><Link to="/" className="hover:text-[#6D5DF6] transition-colors">Home</Link></li>
              <li><Link to="/verify" className="hover:text-[#6D5DF6] transition-colors">Salary Verification</Link></li>
              <li><Link to="/credentials" className="hover:text-[#6D5DF6] transition-colors">Credential Vault</Link></li>
              <li><Link to="/history" className="hover:text-[#6D5DF6] transition-colors">Verification History</Link></li>
            </ul>
          </div>

          {/* Protocol */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Protocol & ZK</h4>
            <ul className="space-y-1.5">
              <li><Link to="/privacy" className="hover:text-[#6D5DF6] transition-colors">Privacy Model & Disclose</Link></li>
              <li><Link to="/about" className="hover:text-[#6D5DF6] transition-colors">Architecture Overview</Link></li>
              <li>
                <a
                  href="https://midnight.network"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#6D5DF6] inline-flex items-center gap-1 transition-colors"
                >
                  Midnight Network
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Source & Deployment */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Deployment & Source</h4>
            <div className="flex flex-col gap-2">
              <a
                href="https://privatesalaryverification.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-mono text-emerald-700 hover:border-emerald-300 transition-colors shadow-xs"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Netlify Live Production</span>
              </a>
              
              <a
                href="https://github.com/WorkshopDeRahul/Private-Salary-Verification-midnight"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-mono text-slate-700 hover:text-slate-900 hover:border-slate-300 transition-colors shadow-xs"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Source Code (GitHub)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-[#6D5DF6]" />
            <span>Built under Level 3 Confidential Credentials Category for Midnight Hackathon.</span>
          </div>
          <div>
            <span>© 2026 Rahul Saha. MIT Licensed.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
