import React, { useState } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  User,
  CheckCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Complaint, ComplaintStatus, UserRole } from '../types.ts';
import { StatusTimeline } from './StatusTimeline.tsx';

interface ComplaintDetailModalProps {
  complaint: Complaint | null;
  userRole?: UserRole;
  currentUserName?: string;
  onClose: () => void;
  onUpdateStatus?: (complaintId: string, newStatus: ComplaintStatus, note?: string) => Promise<void>;
}

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({
  complaint,
  userRole,
  currentUserName,
  onClose,
  onUpdateStatus,
}) => {
  if (!complaint) return null;

  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus>(complaint.status);
  const [adminNote, setAdminNote] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateStatus) return;
    try {
      setUpdating(true);
      await onUpdateStatus(complaint.id, selectedStatus, adminNote);
      setStatusMessage(`Status updated to ${selectedStatus} successfully.`);
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div
      id="complaint-detail-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <span className="font-mono text-base font-extrabold text-emerald-950 bg-emerald-100/80 px-2.5 py-1 rounded-md border border-emerald-300">
              {complaint.complaint_id}
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                {complaint.category}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                {complaint.location}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Main Photo & Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Image */}
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-4/3 relative">
              <img
                src={complaint.image_url}
                alt={complaint.category}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span
                className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full shadow-md ${
                  complaint.priority === 'High'
                    ? 'bg-rose-600 text-white'
                    : complaint.priority === 'Medium'
                    ? 'bg-amber-500 text-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {complaint.priority} Priority
              </span>
            </div>

            {/* Details */}
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
                  Description
                </h4>
                <p className="text-slate-800 text-sm mt-1 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {complaint.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-slate-600">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Reported By
                  </span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    {complaint.user_name || 'Citizen User'}
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Submission Date
                  </span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    {new Date(complaint.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {/* Coordinates if present */}
              {complaint.latitude_optional && complaint.longitude_optional && (
                <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono bg-emerald-50/70 p-2 rounded-lg border border-emerald-200">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  GPS: {complaint.latitude_optional.toFixed(4)}° N,{' '}
                  {complaint.longitude_optional.toFixed(4)}° E
                </div>
              )}
            </div>
          </div>

          {/* AI Analysis Card */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-emerald-900 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                AI Computer Vision & Context Analysis
              </span>
              <span className="bg-emerald-200/80 text-emerald-900 font-bold px-2 py-0.5 rounded-full text-[10px]">
                Confidence: {(complaint.confidence * 100).toFixed(0)}%
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              <div>
                <span className="font-semibold text-slate-600 block text-[11px]">
                  Classification Reason:
                </span>
                <p className="text-slate-800 mt-0.5 leading-relaxed">{complaint.ai_reason}</p>
              </div>
              <div>
                <span className="font-semibold text-slate-600 block text-[11px]">
                  Recommended Municipal Action:
                </span>
                <p className="text-emerald-900 font-medium mt-0.5 leading-relaxed">
                  {complaint.recommended_action}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-emerald-700/80 mt-2 italic">
              * AI priority is an advisory recommendation for sanitation staff. Not an official government determination.
            </p>
          </div>

          {/* Status Timeline */}
          <StatusTimeline currentStatus={complaint.status} history={complaint.history} />

          {/* Admin Status Management Box */}
          {userRole === 'ADMIN' && onUpdateStatus && (
            <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5 mb-3">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                Administrative Status Authority Control
              </h4>
              <form onSubmit={handleStatusChange} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Update Current Status:
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value as ComplaintStatus)}
                      className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
                    >
                      <option value="REPORTED">REPORTED</option>
                      <option value="UNDER REVIEW">UNDER REVIEW</option>
                      <option value="IN PROGRESS">IN PROGRESS</option>
                      <option value="RESOLVED">RESOLVED</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Action / Inspection Note:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sanitation compactor vehicle #14 dispatched"
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  {statusMessage ? (
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> {statusMessage}
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-500">
                      Updating will notify the citizen and record an audit log.
                    </span>
                  )}
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {updating ? 'Updating...' : 'Save Status Update'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
