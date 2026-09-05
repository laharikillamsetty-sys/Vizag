import React, { useState } from 'react';
import {
  Recycle,
  PlusCircle,
  Search,
  Bell,
  BarChart3,
  User,
  LogOut,
  Menu,
  X,
  FileText,
  Shield,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '../types.ts';
import { InstitutionalBranding } from './InstitutionalBranding.tsx';

interface NavbarProps {
  currentUser: UserProfile | null;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onQuickLogin: (role: 'CITIZEN' | 'ADMIN') => void;
  unreadNotificationsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentView,
  onNavigate,
  onLogout,
  onQuickLogin,
  unreadNotificationsCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);

  const handleNav = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur shadow-xs border-b border-slate-200">
      {/* Institutional Branding Top Bar */}
      <InstitutionalBranding />

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div
            id="brand-logo-button"
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => handleNav(currentUser ? (currentUser.role === 'ADMIN' ? 'admin-dashboard' : 'citizen-dashboard') : 'landing')}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-700/20">
              <Recycle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-emerald-950">
                  Clean<span className="text-emerald-600">City</span>
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide">
                  Civic Portal
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 tracking-wide">
                Greater Visakhapatnam Municipal Services
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {!currentUser ? (
              <>
                <button
                  id="nav-landing-btn"
                  onClick={() => handleNav('landing')}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    currentView === 'landing'
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                  }`}
                >
                  Home
                </button>
                <button
                  id="nav-how-it-works-btn"
                  onClick={() => handleNav('landing-workflow')}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-slate-50 transition-colors"
                >
                  How It Works
                </button>
                <button
                  id="nav-track-public-btn"
                  onClick={() => handleNav('track-complaint')}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                    currentView === 'track-complaint'
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                  }`}
                >
                  <Search className="w-4 h-4 text-emerald-600" />
                  Track Complaint
                </button>
              </>
            ) : currentUser.role === 'ADMIN' ? (
              <>
                <button
                  id="nav-admin-dash-btn"
                  onClick={() => handleNav('admin-dashboard')}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                    currentView === 'admin-dashboard'
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                  }`}
                >
                  <Shield className="w-4 h-4 text-emerald-600" />
                  Admin Dashboard
                </button>
                <button
                  id="nav-all-complaints-btn"
                  onClick={() => handleNav('admin-complaints')}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                    currentView === 'admin-complaints'
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="w-4 h-4 text-emerald-600" />
                  All Complaints
                </button>
                <button
                  id="nav-analytics-btn"
                  onClick={() => handleNav('analytics')}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                    currentView === 'analytics'
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  Analytics
                </button>
              </>
            ) : (
              <>
                <button
                  id="nav-citizen-dash-btn"
                  onClick={() => handleNav('citizen-dashboard')}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    currentView === 'citizen-dashboard'
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  id="nav-report-issue-btn"
                  onClick={() => handleNav('report-issue')}
                  className="px-3 py-2 rounded-lg text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 flex items-center gap-1.5 transition-colors border border-emerald-200"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-600" />
                  Report Issue
                </button>
                <button
                  id="nav-my-complaints-btn"
                  onClick={() => handleNav('my-complaints')}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                    currentView === 'my-complaints'
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="w-4 h-4 text-emerald-600" />
                  My Reports
                </button>
                <button
                  id="nav-track-btn"
                  onClick={() => handleNav('track-complaint')}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                    currentView === 'track-complaint'
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                  }`}
                >
                  <Search className="w-4 h-4 text-emerald-600" />
                  Track
                </button>
              </>
            )}
          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Demo Switcher for CSE Student Presentation */}
            <div className="relative">
              <button
                id="quick-demo-toggle-btn"
                type="button"
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-50 border border-emerald-300 rounded-lg hover:bg-emerald-100 transition-colors"
                title="1-Click login as demo student or municipal admin for presentations"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Demo Switcher
              </button>

              {demoDropdownOpen && (
                <div
                  id="quick-demo-dropdown-menu"
                  className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 text-xs"
                >
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Quick Presentation Login
                  </div>
                  <button
                    id="demo-login-citizen-btn"
                    onClick={() => {
                      onQuickLogin('CITIZEN');
                      setDemoDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-emerald-50 flex items-center justify-between text-slate-700 hover:text-emerald-900 font-medium"
                  >
                    <span>Priya Sharma (Student)</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                      Citizen
                    </span>
                  </button>
                  <button
                    id="demo-login-admin-btn"
                    onClick={() => {
                      onQuickLogin('ADMIN');
                      setDemoDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-emerald-50 flex items-center justify-between text-slate-700 hover:text-emerald-900 font-medium"
                  >
                    <span>Inspector Verma</span>
                    <span className="bg-purple-100 text-purple-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                      Admin
                    </span>
                  </button>
                </div>
              )}
            </div>

            {currentUser ? (
              <div className="flex items-center gap-2">
                {/* Notifications Button */}
                <button
                  id="nav-notifications-btn"
                  onClick={() => handleNav('notifications')}
                  className="relative p-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                  title="In-App Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotificationsCount > 0 && (
                    <span
                      id="unread-notifications-count-badge"
                      className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce"
                    >
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {/* Profile Pill */}
                <button
                  id="nav-profile-btn"
                  onClick={() => handleNav('profile')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    {currentUser.full_name.charAt(0)}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-xs font-bold text-slate-800 leading-none">
                      {currentUser.full_name}
                    </p>
                    <p className="text-[10px] font-semibold text-emerald-600 uppercase mt-0.5">
                      {currentUser.role}
                    </p>
                  </div>
                </button>

                {/* Logout Button */}
                <button
                  id="nav-logout-btn"
                  onClick={onLogout}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="nav-login-btn"
                  onClick={() => handleNav('login')}
                  className="px-3.5 py-1.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  Login
                </button>
                <button
                  id="nav-register-btn"
                  onClick={() => handleNav('register')}
                  className="px-4 py-1.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm shadow-emerald-700/20 transition-all"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-2 md:hidden">
            {currentUser && unreadNotificationsCount > 0 && (
              <button
                onClick={() => handleNav('notifications')}
                className="relative p-2 text-slate-600"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              </button>
            )}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {currentUser ? (
            <>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                  {currentUser.full_name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{currentUser.full_name}</p>
                  <p className="text-xs text-emerald-700 font-semibold">{currentUser.role} • {currentUser.city}</p>
                </div>
              </div>

              {currentUser.role === 'ADMIN' ? (
                <>
                  <button
                    onClick={() => handleNav('admin-dashboard')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4 text-emerald-600" /> Admin Dashboard
                  </button>
                  <button
                    onClick={() => handleNav('admin-complaints')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-emerald-600" /> All Complaints
                  </button>
                  <button
                    onClick={() => handleNav('analytics')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                  >
                    <BarChart3 className="w-4 h-4 text-emerald-600" /> Analytics
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNav('citizen-dashboard')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => handleNav('report-issue')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-emerald-800 bg-emerald-50 flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4 text-emerald-600" /> Report Issue
                  </button>
                  <button
                    onClick={() => handleNav('my-complaints')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    My Reports
                  </button>
                  <button
                    onClick={() => handleNav('track-complaint')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Track Complaint
                  </button>
                </>
              )}

              <button
                onClick={() => handleNav('notifications')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-emerald-600" /> Notifications
                </span>
                {unreadNotificationsCount > 0 && (
                  <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleNav('profile')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2"
              >
                <User className="w-4 h-4 text-emerald-600" /> Profile & System Status
              </button>
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-slate-100 pt-3 mt-2"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNav('landing')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Home
              </button>
              <button
                onClick={() => handleNav('track-complaint')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Track Complaint
              </button>
              <div className="pt-2 grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleNav('login')}
                  className="w-full py-2.5 text-center text-sm font-semibold text-emerald-800 bg-emerald-50 rounded-lg"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="w-full py-2.5 text-center text-sm font-bold text-white bg-emerald-600 rounded-lg"
                >
                  Register
                </button>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs space-y-1">
                <p className="font-bold text-slate-400 uppercase tracking-wider">Quick Demo Login:</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onQuickLogin('CITIZEN');
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-emerald-50 rounded text-[11px] font-semibold text-slate-700"
                  >
                    Citizen Demo
                  </button>
                  <button
                    onClick={() => {
                      onQuickLogin('ADMIN');
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-emerald-50 rounded text-[11px] font-semibold text-slate-700"
                  >
                    Admin Demo
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};
