import React from 'react';
import { Bell, CheckCheck, Clock, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';
import { InAppNotification } from '../types.ts';

interface NotificationsPageProps {
  notifications: InAppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onTrackComplaint: (complaintId: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onTrackComplaint,
}) => {
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div id="notifications-page-container" className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-emerald-600" />
            In-App Notifications
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time updates regarding your filed complaints and municipal activity.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 self-start"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all {unreadCount} read
          </button>
        )}
      </div>

      {/* List */}
      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No notifications yet</h3>
          <p className="text-xs text-slate-400 mt-1">
            You'll receive notifications when the status of your reported complaints changes.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const isUnread = !n.is_read;
            const isResolved = n.message.toLowerCase().includes('resolved');
            const isPriority = n.message.toLowerCase().includes('priority') || n.message.toLowerCase().includes('urgent');

            return (
              <div
                key={n.id}
                className={`p-4 rounded-xl border transition-all text-xs flex items-start justify-between gap-4 ${
                  isUnread
                    ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      isUnread
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isResolved ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isPriority ? (
                      <ShieldAlert className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">
                        {isResolved
                          ? 'Sanitation Complaint Resolved'
                          : isPriority
                          ? 'High Priority Alert'
                          : 'Complaint Status Update'}
                      </h4>
                      {isUnread && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
                    </div>
                    <p className="text-slate-700 leading-relaxed">{n.message}</p>
                    <time className="text-[11px] text-slate-400 block pt-1">
                      {new Date(n.created_at).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </time>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  {n.complaint_id && (
                    <button
                      onClick={() => {
                        if (isUnread) onMarkAsRead(n.id);
                        onTrackComplaint(n.complaint_id);
                      }}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-emerald-200 shadow-2xs"
                    >
                      Track <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                  {isUnread && (
                    <button
                      onClick={() => onMarkAsRead(n.id)}
                      className="text-[10px] text-slate-400 hover:text-slate-600 underline"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
