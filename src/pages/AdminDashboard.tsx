import React, { useState } from 'react';
import {
  ShieldCheck,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  PlayCircle,
  FileText,
  MapPin,
  Sparkles,
  ArrowUpDown,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';
import { Complaint, ComplaintCategory, ComplaintPriority, ComplaintStatus, UserProfile } from '../types.ts';

interface AdminDashboardProps {
  currentUser: UserProfile;
  complaints: Complaint[];
  onSelectComplaint: (complaint: Complaint) => void;
  onUpdateStatus: (complaintId: string, newStatus: ComplaintStatus, note?: string) => Promise<void>;
  onDeleteComplaint?: (complaintId: string) => Promise<void>;
  onNavigate: (view: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  complaints,
  onSelectComplaint,
  onUpdateStatus,
  onDeleteComplaint,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Quick inline update modal state
  const [activeComplaintForUpdate, setActiveComplaintForUpdate] = useState<Complaint | null>(null);
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('UNDER REVIEW');
  const [actionNote, setActionNote] = useState('');
  const [saving, setSaving] = useState(false);

  // Metrics
  const total = complaints.length;
  const underReview = complaints.filter((c) => c.status === 'UNDER REVIEW').length;
  const inProgress = complaints.filter((c) => c.status === 'IN PROGRESS').length;
  const resolved = complaints.filter((c) => c.status === 'RESOLVED').length;
  const highPriority = complaints.filter((c) => c.priority === 'High').length;

  // Filtered complaints
  const filtered = complaints.filter((c) => {
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || c.category === categoryFilter;
    const matchesPriority = priorityFilter === 'ALL' || c.priority === priorityFilter;
    const matchesSearch =
      c.complaint_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.user_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesCategory && matchesPriority && matchesSearch;
  });

  const handleQuickStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeComplaintForUpdate) return;
    try {
      setSaving(true);
      await onUpdateStatus(activeComplaintForUpdate.id, newStatus, actionNote);
      setActiveComplaintForUpdate(null);
      setActionNote('');
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div id="admin-dashboard-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-500/40 text-purple-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            Municipal Officer Control Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Civic Sanitation Authority Dashboard
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
            Logged in as <strong className="text-white">{currentUser.full_name}</strong> ({currentUser.city}).
            Review incoming citizen complaints, dispatch municipal cleanup squads, and track resolutions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('analytics')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
          >
            View City Analytics
          </button>
        </div>
      </div>

      {/* Top 5 Metrics Cards (Section 14) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Reports</span>
            <FileText className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{total}</p>
          <span className="text-[10px] text-slate-400">All registered complaints</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-blue-600 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Under Review</span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-blue-600">{underReview}</p>
          <span className="text-[10px] text-slate-400">Awaiting inspection dispatch</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-amber-600 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">In Progress</span>
            <PlayCircle className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-amber-600">{inProgress}</p>
          <span className="text-[10px] text-slate-400">Field trucks deployed</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-emerald-600 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Resolved</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-emerald-600">{resolved}</p>
          <span className="text-[10px] text-slate-400">Fully sanitized</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-rose-600 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">High Priority</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-rose-600">{highPriority}</p>
          <span className="text-[10px] text-slate-400">Immediate action needed</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative md:col-span-1">
            <input
              type="text"
              placeholder="Search ID, location, description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs py-2 pl-8 pr-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none font-semibold text-slate-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="REPORTED">REPORTED</option>
              <option value="UNDER REVIEW">UNDER REVIEW</option>
              <option value="IN PROGRESS">IN PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none font-semibold text-slate-700"
            >
              <option value="ALL">All Categories</option>
              <option value="Garbage Overflow">Garbage Overflow</option>
              <option value="Illegal Dumping">Illegal Dumping</option>
              <option value="Blocked Drain">Blocked Drain</option>
              <option value="Plastic Waste">Plastic Waste</option>
              <option value="Unclean Public Space">Unclean Public Space</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none font-semibold text-slate-700"
            >
              <option value="ALL">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>
            Showing <strong>{filtered.length}</strong> of {total} complaints
          </span>
          {(searchTerm || statusFilter !== 'ALL' || categoryFilter !== 'ALL' || priorityFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
                setCategoryFilter('ALL');
                setPriorityFilter('ALL');
              }}
              className="text-purple-600 hover:text-purple-800 font-semibold"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Complaint ID</th>
                <th className="py-3.5 px-3">Photo</th>
                <th className="py-3.5 px-4">Category & Location</th>
                <th className="py-3.5 px-3">AI Priority</th>
                <th className="py-3.5 px-3">Current Status</th>
                <th className="py-3.5 px-3">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    No complaints match the filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {c.complaint_id}
                    </td>

                    {/* Photo */}
                    <td className="py-3.5 px-3">
                      <div className="w-12 h-9 rounded-md overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        <img
                          src={c.image_url}
                          alt={c.category}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </td>

                    {/* Category & Location */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{c.category}</div>
                      <div className="text-slate-500 flex items-center gap-1 text-[11px] mt-0.5 line-clamp-1">
                        <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                        {c.location}
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                          c.priority === 'High'
                            ? 'bg-rose-100 text-rose-800'
                            : c.priority === 'Medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {c.priority}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] border ${
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
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                      {new Date(c.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectComplaint(c)}
                          className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md font-semibold text-[11px] transition-colors flex items-center gap-1"
                          title="View complete details & timeline"
                        >
                          <Eye className="w-3 h-3" />
                          Inspect
                        </button>
                        <button
                          onClick={() => {
                            setActiveComplaintForUpdate(c);
                            setNewStatus(c.status);
                            setActionNote('');
                          }}
                          className="px-2.5 py-1 text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-md font-bold text-[11px] transition-colors flex items-center gap-1 border border-purple-200"
                        >
                          <Edit className="w-3 h-3" />
                          Update
                        </button>
                        {onDeleteComplaint && (
                          <button
                            onClick={async () => {
                              if (confirm(`Are you sure you want to permanently delete complaint ${c.complaint_id}?`)) {
                                setDeletingId(c.id);
                                try {
                                  await onDeleteComplaint(c.id);
                                } finally {
                                  setDeletingId(null);
                                }
                              }
                            }}
                            disabled={deletingId === c.id}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded-md transition-colors border border-rose-200 disabled:opacity-40"
                            title="Delete complaint record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Status Update Modal */}
      {activeComplaintForUpdate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Update Complaint Status
                </h3>
                <p className="text-xs font-mono text-emerald-800 mt-0.5">
                  {activeComplaintForUpdate.complaint_id} • {activeComplaintForUpdate.category}
                </p>
              </div>
              <button
                onClick={() => setActiveComplaintForUpdate(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickStatusSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Change Status To:
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                  className="w-full text-xs font-semibold py-2 px-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
                >
                  <option value="REPORTED">REPORTED</option>
                  <option value="UNDER REVIEW">UNDER REVIEW</option>
                  <option value="IN PROGRESS">IN PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Official Sanitation Dispatch Note:
                </label>
                <textarea
                  rows={2}
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  placeholder="e.g. Ward sanitation supervisor inspected; mechanical sweeper and 4 workers assigned."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveComplaintForUpdate(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-bold shadow-xs disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Apply Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
