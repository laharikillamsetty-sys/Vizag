import React, { useState } from 'react';
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Search,
  MapPin,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { Complaint, ComplaintStatus, UserProfile } from '../types.ts';

interface CitizenDashboardProps {
  currentUser: UserProfile;
  complaints: Complaint[];
  onNavigate: (view: string) => void;
  onSelectComplaint: (complaint: Complaint) => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  currentUser,
  complaints,
  onNavigate,
  onSelectComplaint,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // User-specific complaints
  const userComplaints = complaints.filter(
    (c) => c.user_id === currentUser.id || c.user_email === currentUser.email
  );

  // Stats calculation
  const total = userComplaints.length;
  const resolved = userComplaints.filter((c) => c.status === 'RESOLVED').length;
  const active = userComplaints.filter((c) => c.status !== 'RESOLVED').length;
  const highPriority = userComplaints.filter((c) => c.priority === 'High').length;

  // Filtered complaints
  const filtered = userComplaints.filter((c) => {
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesSearch =
      c.complaint_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div id="citizen-dashboard-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Report Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div>
          <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
            Citizen Action Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Welcome, {currentUser.full_name}!
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-xl">
            Track your submitted civic reports, inspect live municipal review statuses, and contribute to a cleaner ward.
          </p>
        </div>

        <button
          onClick={() => onNavigate('report-issue')}
          className="px-6 py-3.5 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 shrink-0 transform hover:-translate-y-0.5"
        >
          <PlusCircle className="w-5 h-5 text-emerald-600" />
          Report New Issue
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Reports</span>
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{total}</p>
          <p className="text-[11px] text-slate-500 mt-1">Logged from your account</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Ongoing</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600">{active}</p>
          <p className="text-[11px] text-slate-500 mt-1">Under review or in progress</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600">{resolved}</p>
          <p className="text-[11px] text-slate-500 mt-1">Sanitized & verified</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">High Priority</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-rose-600">{highPriority}</p>
          <p className="text-[11px] text-slate-500 mt-1">Urgent municipal hazards</p>
        </div>
      </div>

      {/* Reports Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">My Sanitation Complaints</h2>
            <p className="text-xs text-slate-500">History and status of complaints registered by you</p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search my reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-xs py-2 pl-8 pr-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            {/* Status Pills */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              {['ALL', 'REPORTED', 'UNDER REVIEW', 'IN PROGRESS', 'RESOLVED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    statusFilter === st
                      ? 'bg-white text-emerald-800 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Complaints Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No complaints found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchTerm || statusFilter !== 'ALL'
                ? 'Try adjusting your search terms or filter selection.'
                : "You haven't submitted any complaints yet. Report an issue in your neighborhood."}
            </p>
            <button
              onClick={() => onNavigate('report-issue')}
              className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg"
            >
              Report an Issue Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((c) => (
              <div
                key={c.id}
                onClick={() => onSelectComplaint(c)}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-16/10 bg-slate-100 relative overflow-hidden">
                    <img
                      src={c.image_url}
                      alt={c.category}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="font-mono text-[10px] font-extrabold bg-slate-900/80 text-white px-2 py-0.5 rounded backdrop-blur-xs">
                        {c.complaint_id}
                      </span>
                    </div>
                    <span
                      className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.priority === 'High'
                          ? 'bg-rose-600 text-white'
                          : c.priority === 'Medium'
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {c.priority} Priority
                    </span>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-emerald-950">{c.category}</span>
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

                    <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                      {c.description}
                    </p>

                    <p className="text-[11px] text-slate-500 flex items-center gap-1 line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      {c.location}
                    </p>
                  </div>
                </div>

                <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>
                    {new Date(c.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="font-bold text-emerald-700 group-hover:underline flex items-center gap-0.5">
                    View Progress <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
