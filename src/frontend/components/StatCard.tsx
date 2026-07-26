import React, { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  subtitle?: string;
  badge?: string;
  badgeType?: "success" | "info" | "purple" | "emerald";
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  subtitle,
  badge,
  badgeType = "info",
}) => {
  const badgeStyles = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    info: "bg-purple-50 text-[#6D5DF6] border-purple-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    emerald: "bg-teal-50 text-teal-700 border-teal-200",
  };

  return (
    <div className="relative group overflow-hidden rounded-2xl bg-white border border-slate-200 p-5 shadow-xs transition-all hover:border-purple-300 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:scale-105 transition-transform">
          {icon}
        </div>
      </div>

      {(subtitle || badge) && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-500 text-[11px]">{subtitle}</span>}
          {badge && (
            <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold border ${badgeStyles[badgeType]}`}>
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
