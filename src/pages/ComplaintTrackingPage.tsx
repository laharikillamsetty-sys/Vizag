import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Calendar,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { Complaint } from '../types.ts';
import { api } from '../services/api.ts';
import { StatusTimeline } from '../components/StatusTimeline.tsx';

interface ComplaintTrackingPageProps {
  initialComplaintId?: string;
  allComplaints?: Complaint[];
  onSelectComplaint?: (complaint: Complaint) => void;
}

export const ComplaintTrackingPage: React.FC<ComplaintTrackingPageProps> = ({
  initialComplaintId,
  allComplaints = [],
}) => {
  const [searchInput, setSearchInput] = useState(initialComplaintId || '');
  const [loading, setLoading] = useState(false);
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchComplaint = async (query: string) => {
    if (!query.trim()) return;
    try {
      setLoading(true);
      setError(null);
      const data = await api.getComplaint(query.trim());
      setComplaint(data);
    } catch (err: any) {
      setComplaint(null);
      setError(err.message || `No complaint found with ID "${query}".`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialComplaintId) {
      fetchComplaint(initialComplaintId);
    } else if (allComplaints.length > 0) {
      // Default to the first complaint for instant preview
      setComplaint(allComplaints[0]);
      setSearchInput(allComplaints[0].complaint_id);
    }
  }, [initialComplaintId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchComplaint(searchInput);
  };

  return (
    <div id="complaint-tracking-page-container" className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
          Public Accountability Engine
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
          Track Your Sanitation Complaint
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Monitor the live verification, dispatch, and cleanup status of any complaint in real time.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Enter Complaint ID (e.g. CC-2026-001, CC-2026-002)..."
            className="w-full text-sm py-3.5 pl-11 pr-28 bg-white border-2 border-emerald-300 rounded-2xl focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 shadow-sm transition-all focus:outline-none font-mono"
          />
          <Search className="w-5 h-5 text-emerald-600 absolute left-4 pointer-events-none" />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Track ID'}
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        {allComplaints.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 text-xs">
            <span className="text-slate-400">Quick test:</span>
            {allComplaints.slice(0, 5).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setSearchInput(c.complaint_id);
                  fetchComplaint(c.complaint_id);
                }}
                className={`font-mono text-[11px] px-2.5 py-1 rounded-md border transition-colors ${
                  complaint?.complaint_id === c.complaint_id
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold'
                    : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 border-slate-200'
                }`}
              >
                {c.complaint_id} ({c.status})
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Error display */}
      {error && (
        <div className="max-w-2xl mx-auto p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          {error}
        </div>
      )}

      {/* Result Card */}
      {complaint && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden animate-in fade-in duration-300">
          {/* Card Header */}
          <div className="bg-slate-900 text-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xl font-black text-emerald-400 tracking-wider">
                  {complaint.complaint_id}
                </span>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    complaint.priority === 'High'
                      ? 'bg-rose-500 text-white'
                      : complaint.priority === 'Medium'
                      ? 'bg-amber-500 text-white'
                      : 'bg-emerald-500 text-white'
                  }`}
                >
                  {complaint.priority} Priority
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">{complaint.category}</h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Current Status:</span>
              <span
                className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                  complaint.status === 'RESOLVED'
                    ? 'bg-emerald-500 text-white'
                    : complaint.status === 'IN PROGRESS'
                    ? 'bg-amber-400 text-slate-900'
                    : complaint.status === 'UNDER REVIEW'
                    ? 'bg-blue-400 text-slate-900'
                    : 'bg-slate-200 text-slate-900'
                }`}
              >
                {complaint.status}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Visual Timeline (Requirement Section 9 Feature 3) */}
            <StatusTimeline currentStatus={complaint.status} history={complaint.history} />

            {/* Photo & Metadata split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="rounded-xl overflow-hidden border border-slate-200 aspect-16/10 bg-slate-100">
                <img
                  src={complaint.image_url}
                  alt={complaint.category}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    Location
                  </span>
                  <p className="text-slate-800 font-semibold text-sm flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    {complaint.location}
                  </p>
                  {complaint.latitude_optional && complaint.longitude_optional && (
                    <span className="text-[11px] text-slate-500 font-mono block mt-1">
                      Coordinates: {complaint.latitude_optional}° N,{' '}
                      {complaint.longitude_optional}° E
                    </span>
                  )}
                </div>

                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    Citizen Description
                  </span>
                  <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 mt-1 leading-relaxed">
                    {complaint.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">
                      Reported On
                    </span>
                    <span className="font-medium text-slate-800">
                      {new Date(complaint.created_at).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">
                      Last Updated
                    </span>
                    <span className="font-medium text-slate-800">
                      {new Date(complaint.updated_at).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Diagnostics Card */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  AI Classification Context
                </span>
                <span className="text-emerald-800 font-semibold text-[11px]">
                  Confidence: {(complaint.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-slate-800">
                <strong>Reason:</strong> {complaint.ai_reason}
              </p>
              <p className="text-emerald-900">
                <strong>Action Assigned:</strong> {complaint.recommended_action}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
