import React from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Recycle,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { AnalyticsData } from '../types.ts';

interface AnalyticsPageProps {
  analytics: AnalyticsData;
  onNavigate: (view: string) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ analytics, onNavigate }) => {
  const total = analytics.totalComplaints || 0;
  const resolved = analytics.resolved || 0;
  const pending = analytics.pendingCount || 0;
  const resolutionRate = analytics.resolutionPercentage || 0;
  const commonCategory = analytics.mostCommonCategory || 'Garbage Overflow';
  const byCategory = analytics.byCategory || [];
  const byStatus = analytics.byStatus || [];
  const recent = analytics.recentComplaints || [];

  // Find max category count for bar proportion
  const maxCategoryCount = Math.max(...byCategory.map((c) => c.count), 1);

  // Status mapping
  const reportedCount = byStatus.find((s) => s.status === 'REPORTED')?.count || 0;
  const underReviewCount = byStatus.find((s) => s.status === 'UNDER REVIEW')?.count || 0;
  const inProgressCount = byStatus.find((s) => s.status === 'IN PROGRESS')?.count || 0;
  const resolvedCount = byStatus.find((s) => s.status === 'RESOLVED')?.count || 0;

  return (
    <div id="analytics-page-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Public Sanitation Intelligence
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
            City Civic Sanitation Analytics
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Real-time metric transparency for municipal wards, college campuses, and civic stakeholders.
          </p>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Complaints
          </span>
          <p className="text-3xl font-black text-slate-900 mt-1">{total}</p>
          <span className="text-xs text-slate-500 mt-1 block">Cumulative civic logs</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Resolution Rate
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-3xl font-black text-emerald-600">{resolutionRate}%</p>
            <span className="text-xs font-bold text-emerald-700">Verified Cleared</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-700"
              style={{ width: `${resolutionRate}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Active / Pending
          </span>
          <p className="text-3xl font-black text-amber-600 mt-1">{pending}</p>
          <span className="text-xs text-slate-500 mt-1 block">Under review or in action</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Most Common Issue
          </span>
          <p className="text-lg font-extrabold text-slate-900 mt-1 line-clamp-1">
            {commonCategory}
          </p>
          <span className="text-xs text-emerald-700 font-semibold mt-1 block">
            Primary Sanitation Priority
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              Complaints by Sanitation Category
            </h3>
            <span className="text-xs text-slate-400 font-medium">Distribution count</span>
          </div>

          <div className="space-y-3.5">
            {byCategory.map((item) => {
              const pct = total > 0 ? ((item.count / total) * 100).toFixed(0) : '0';
              const barWidth = (item.count / maxCategoryCount) * 100;
              return (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{item.category}</span>
                    <span className="font-bold text-slate-900">
                      {item.count}{' '}
                      <span className="text-slate-400 font-normal">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-600" />
                Workflow Status Breakdown
              </h3>
              <span className="text-xs text-slate-400 font-medium">Lifecycle balance</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Reported
                </span>
                <p className="text-xl font-black text-slate-800 mt-0.5">{reportedCount}</p>
                <span className="text-[11px] text-slate-400">Awaiting officer</span>
              </div>

              <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200">
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
                  Under Review
                </span>
                <p className="text-xl font-black text-blue-800 mt-0.5">{underReviewCount}</p>
                <span className="text-[11px] text-blue-600">Site inspection</span>
              </div>

              <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                  In Progress
                </span>
                <p className="text-xl font-black text-amber-800 mt-0.5">{inProgressCount}</p>
                <span className="text-[11px] text-amber-600">Trucks active</span>
              </div>

              <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                  Resolved
                </span>
                <p className="text-xl font-black text-emerald-800 mt-0.5">{resolvedCount}</p>
                <span className="text-[11px] text-emerald-600">Cleared & checked</span>
              </div>
            </div>
          </div>

          {/* High Priority Highlight */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              High Priority Municipal Incidents:
            </span>
            <span className="bg-rose-100 text-rose-800 text-xs font-black px-3 py-1 rounded-full">
              {analytics.highPriority} Urgent
            </span>
          </div>
        </div>
      </div>

      {/* Recent Resolutions / Complaints Log */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Recent Municipal Complaints Audit Log
            </h3>
            <p className="text-xs text-slate-500">
              Real-time feed of logged and updated public sanitation reports
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {recent.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No complaints recorded yet.</p>
          ) : (
            recent.map((c) => (
              <div key={c.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{c.complaint_id}</span>
                    <span className="font-semibold text-emerald-950">{c.category}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        c.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : c.status === 'IN PROGRESS'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : c.status === 'UNDER REVIEW'
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-slate-100 text-slate-800 border-slate-300'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <p className="text-slate-500 truncate mt-0.5">{c.location}</p>
                </div>
                <div className="text-right shrink-0 text-[11px] text-slate-400">
                  {new Date(c.updated_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
