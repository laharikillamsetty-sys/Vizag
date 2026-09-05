import React from 'react';
import { CheckCircle2, Clock, PlayCircle, ShieldCheck } from 'lucide-react';
import { ComplaintStatus, StatusHistoryItem } from '../types.ts';

interface StatusTimelineProps {
  currentStatus: ComplaintStatus;
  history?: StatusHistoryItem[];
}

const STEPS: { status: ComplaintStatus; label: string; description: string }[] = [
  {
    status: 'REPORTED',
    label: 'Reported',
    description: 'Complaint registered with photo, location & AI analysis.',
  },
  {
    status: 'UNDER REVIEW',
    label: 'Under Review',
    description: 'Sanitation supervisory officer inspecting & dispatching team.',
  },
  {
    status: 'IN PROGRESS',
    label: 'In Progress',
    description: 'Sanitation vehicle or municipal crew deployed on ground.',
  },
  {
    status: 'RESOLVED',
    label: 'Resolved',
    description: 'Sanitation cleared, area sanitized & verified.',
  },
];

const ORDER: Record<ComplaintStatus, number> = {
  'REPORTED': 0,
  'UNDER REVIEW': 1,
  'IN PROGRESS': 2,
  'RESOLVED': 3,
};

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ currentStatus, history = [] }) => {
  const currentIndex = ORDER[currentStatus] ?? 0;

  return (
    <div id="complaint-status-timeline" className="w-full bg-white rounded-xl p-5 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Accountability Progress Tracker
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent lifecycle tracking from citizen submission to final clearance
          </p>
        </div>
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full border ${
            currentStatus === 'RESOLVED'
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
              : currentStatus === 'IN PROGRESS'
              ? 'bg-amber-100 text-amber-800 border-amber-300'
              : currentStatus === 'UNDER REVIEW'
              ? 'bg-blue-100 text-blue-800 border-blue-300'
              : 'bg-slate-100 text-slate-800 border-slate-300'
          }`}
        >
          Status: {currentStatus}
        </span>
      </div>

      {/* Visual Stepper */}
      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden sm:block absolute top-5 left-[12%] right-[12%] h-1 bg-slate-200 -z-0">
            <div
              className="h-full bg-emerald-600 transition-all duration-500"
              style={{ width: `${(currentIndex / 3) * 100}%` }}
            />
          </div>

          {STEPS.map((step, idx) => {
            const isPassed = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isUpcoming = idx > currentIndex;

            // Matching history item if available
            const matchingHistory = history.filter((h) => h.new_status === step.status).pop();

            return (
              <div
                key={step.status}
                className="flex sm:flex-col items-center sm:items-center text-left sm:text-center gap-3 sm:gap-2 relative z-10"
              >
                {/* Status Dot / Icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-sm shrink-0 ${
                    isPassed
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                      : isCurrent
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-200 animate-pulse'
                      : 'bg-slate-100 text-slate-400 border border-slate-300'
                  }`}
                >
                  {isPassed ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : isCurrent ? (
                    <PlayCircle className="w-5 h-5 text-white" />
                  ) : (
                    <Clock className="w-5 h-5 text-slate-400" />
                  )}
                </div>

                {/* Text Labels */}
                <div className="min-w-0 flex-1 sm:w-full">
                  <div className="flex items-center gap-1.5 sm:justify-center">
                    <span
                      className={`text-sm font-bold ${
                        isCurrent
                          ? 'text-emerald-800'
                          : isPassed
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </span>
                    {isPassed && (
                      <span className="text-xs text-emerald-600 font-semibold sm:hidden">✓</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight mt-0.5 line-clamp-2">
                    {step.description}
                  </p>
                  {matchingHistory && (
                    <p className="text-[10px] text-emerald-700 font-medium mt-1">
                      {new Date(matchingHistory.changed_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* History Log Feed */}
      {history.length > 0 && (
        <div className="mt-6 pt-5 border-t border-slate-100">
          <h5 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Verified Status History Audit Trail
          </h5>
          <div className="space-y-2.5">
            {history.map((h, i) => (
              <div
                key={h.id || i}
                className="flex items-start justify-between gap-3 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-150"
              >
                <div>
                  <span className="font-semibold text-slate-800">
                    {h.old_status === 'NEW' ? 'Submitted' : `Changed to ${h.new_status}`}
                  </span>
                  <span className="text-slate-500 ml-1.5">by {h.changed_by}</span>
                  {h.note && <p className="text-slate-600 mt-1 italic">"{h.note}"</p>}
                </div>
                <time className="text-[11px] text-slate-400 whitespace-nowrap shrink-0">
                  {new Date(h.changed_at).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </time>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
