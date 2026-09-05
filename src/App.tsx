import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { ComplaintDetailModal } from './components/ComplaintDetailModal.tsx';
import { LandingPage } from './pages/LandingPage.tsx';
import { ReportIssuePage } from './pages/ReportIssuePage.tsx';
import { ComplaintTrackingPage } from './pages/ComplaintTrackingPage.tsx';
import { CitizenDashboard } from './pages/CitizenDashboard.tsx';
import { AdminDashboard } from './pages/AdminDashboard.tsx';
import { AnalyticsPage } from './pages/AnalyticsPage.tsx';
import { NotificationsPage } from './pages/NotificationsPage.tsx';
import { AuthPage } from './pages/AuthPage.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';
import { Complaint, ComplaintStatus, InAppNotification, UserProfile, AnalyticsData } from './types.ts';
import { api, getStoredUser } from './services/api.ts';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<string>('landing');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [trackInitialId, setTrackInitialId] = useState<string>('');
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Load initial data
  useEffect(() => {
    const init = async () => {
      try {
        const stored = await api.getCurrentUser();
        if (stored) {
          setCurrentUser(stored);
        }

        const [complaintList, analyticsData] = await Promise.all([
          api.getComplaints(),
          api.getAnalytics(),
        ]);

        setComplaints(complaintList);
        setAnalytics(analyticsData);

        if (stored) {
          const notes = await api.getNotifications(stored.id);
          setNotifications(notes);
        }
      } catch (err) {
        console.warn('Initial data load warning:', err);
      } finally {
        setLoadingInitial(false);
      }
    };
    init();
  }, []);

  // Fetch notifications when user changes
  useEffect(() => {
    if (currentUser) {
      api.getNotifications(currentUser.id).then(setNotifications).catch(console.warn);
    } else {
      setNotifications([]);
    }
  }, [currentUser]);

  // Refresh complaints & analytics
  const refreshData = async () => {
    try {
      const [list, stats] = await Promise.all([api.getComplaints(), api.getAnalytics()]);
      setComplaints(list);
      setAnalytics(stats);
      if (currentUser) {
        const notes = await api.getNotifications(currentUser.id);
        setNotifications(notes);
      }
    } catch (e) {
      console.warn('Refresh error:', e);
    }
  };

  // Quick Demo Login for Presentations / Evaluators
  const handleQuickLogin = async (role: 'CITIZEN' | 'ADMIN') => {
    try {
      const email = role === 'ADMIN' ? 'admin@cleancity.gov' : 'citizen@cleancity.demo';
      const password = role === 'ADMIN' ? 'admin123' : 'password123';
      const res = await api.login({ email, password });
      setCurrentUser(res.user);
      if (role === 'ADMIN') {
        setCurrentView('admin-dashboard');
      } else {
        setCurrentView('citizen-dashboard');
      }
      refreshData();
    } catch (err) {
      console.error('Quick demo login failed:', err);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const handleComplaintSubmitted = (newComplaint: Complaint) => {
    setComplaints((prev) => [newComplaint, ...prev]);
    refreshData();
  };

  const handleUpdateStatus = async (
    complaintId: string,
    newStatus: ComplaintStatus,
    note?: string
  ) => {
    const changedBy = currentUser?.full_name || 'Sanitation Inspector';
    const res = await api.updateComplaintStatus(complaintId, newStatus, changedBy, note);

    // Update in local state
    setComplaints((prev) =>
      prev.map((c) => (c.id === res.complaint.id ? res.complaint : c))
    );

    if (selectedComplaint?.id === res.complaint.id) {
      setSelectedComplaint(res.complaint);
    }

    refreshData();
  };

  const handleDeleteComplaint = async (complaintId: string) => {
    await api.deleteComplaint(complaintId);
    setComplaints((prev) => prev.filter((c) => c.id !== complaintId && c.complaint_id !== complaintId));
    if (selectedComplaint?.id === complaintId || selectedComplaint?.complaint_id === complaintId) {
      setSelectedComplaint(null);
    }
    refreshData();
  };

  const handleMarkNotificationRead = async (id: string) => {
    if (!currentUser) return;
    await api.markNotificationRead(id, currentUser.id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const handleMarkAllNotificationsRead = async () => {
    if (!currentUser) return;
    await api.markAllNotificationsRead(currentUser.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Navbar with Brand, Links, Demo Switcher */}
      <Navbar
        currentUser={currentUser}
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'landing-workflow') {
            setCurrentView('landing');
            setTimeout(() => {
              const el = document.getElementById('landing-workflow');
              el?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          } else {
            setCurrentView(view);
          }
        }}
        onLogout={handleLogout}
        onQuickLogin={handleQuickLogin}
        unreadNotificationsCount={unreadNotificationsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onNavigate={(view) => setCurrentView(view)}
            onQuickLogin={handleQuickLogin}
            featuredComplaints={complaints}
            onSelectComplaint={(c) => {
              setSelectedComplaint(c);
            }}
          />
        )}

        {currentView === 'report-issue' && (
          <ReportIssuePage
            currentUser={currentUser}
            onComplaintSubmitted={handleComplaintSubmitted}
            onNavigate={(view) => setCurrentView(view)}
            onRequireLogin={() => setCurrentView('login')}
          />
        )}

        {currentView === 'track-complaint' && (
          <ComplaintTrackingPage
            initialComplaintId={trackInitialId}
            allComplaints={complaints}
            onSelectComplaint={(c) => setSelectedComplaint(c)}
          />
        )}

        {currentView === 'citizen-dashboard' && currentUser && (
          <CitizenDashboard
            currentUser={currentUser}
            complaints={complaints}
            onNavigate={(view) => setCurrentView(view)}
            onSelectComplaint={(c) => setSelectedComplaint(c)}
          />
        )}

        {currentView === 'my-complaints' && currentUser && (
          <CitizenDashboard
            currentUser={currentUser}
            complaints={complaints}
            onNavigate={(view) => setCurrentView(view)}
            onSelectComplaint={(c) => setSelectedComplaint(c)}
          />
        )}

        {(currentView === 'admin-dashboard' || currentView === 'admin-complaints') && (
          <AdminDashboard
            currentUser={
              currentUser || {
                id: 'usr-admin-default',
                full_name: 'Inspector Rajesh Verma',
                email: 'admin@cleancity.gov',
                role: 'ADMIN',
                city: 'Visakhapatnam Municipal Corporation',
                created_at: new Date().toISOString(),
              }
            }
            complaints={complaints}
            onSelectComplaint={(c) => setSelectedComplaint(c)}
            onUpdateStatus={handleUpdateStatus}
            onDeleteComplaint={handleDeleteComplaint}
            onNavigate={(view) => setCurrentView(view)}
          />
        )}

        {currentView === 'analytics' && analytics && (
          <AnalyticsPage
            analytics={analytics}
            onNavigate={(view) => setCurrentView(view)}
          />
        )}

        {currentView === 'notifications' && (
          <NotificationsPage
            notifications={notifications}
            onMarkAsRead={handleMarkNotificationRead}
            onMarkAllAsRead={handleMarkAllNotificationsRead}
            onTrackComplaint={(id) => {
              setTrackInitialId(id);
              setCurrentView('track-complaint');
            }}
          />
        )}

        {currentView === 'profile' && currentUser && (
          <ProfilePage currentUser={currentUser} onLogout={handleLogout} />
        )}

        {(currentView === 'login' || currentView === 'register') && (
          <AuthPage
            initialMode={currentView === 'register' ? 'register' : 'login'}
            onAuthSuccess={(user) => {
              setCurrentUser(user);
              if (user.role === 'ADMIN') {
                setCurrentView('admin-dashboard');
              } else {
                setCurrentView('citizen-dashboard');
              }
              refreshData();
            }}
            onNavigate={(view) => setCurrentView(view)}
          />
        )}
      </main>

      {/* Detail Modal */}
      {selectedComplaint && (
        <ComplaintDetailModal
          complaint={selectedComplaint}
          userRole={currentUser?.role || 'CITIZEN'}
          currentUserName={currentUser?.full_name}
          onClose={() => setSelectedComplaint(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* Footer with SITAM College attribution & partner logo links */}
      <Footer
        onNavigate={(view) => {
          if (view === 'landing-workflow') {
            setCurrentView('landing');
            setTimeout(() => {
              const el = document.getElementById('landing-workflow');
              el?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          } else {
            setCurrentView(view);
          }
        }}
        onOpenSchema={() => {
          setCurrentView('profile');
        }}
      />
    </div>
  );
}
