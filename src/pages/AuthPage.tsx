import React, { useState } from 'react';
import {
  Recycle,
  Lock,
  Mail,
  User,
  MapPin,
  Phone,
  Shield,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { UserProfile, UserRole } from '../types.ts';
import { api } from '../services/api.ts';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
  onAuthSuccess: (user: UserProfile) => void;
  onNavigate: (view: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onAuthSuccess,
  onNavigate,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [city, setCity] = useState('Visakhapatnam');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('CITIZEN');

  // Loading & error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Quick Demo Login Handler
  const handleQuickDemo = async (demoRole: 'CITIZEN' | 'ADMIN') => {
    try {
      setLoading(true);
      setError(null);
      const email = demoRole === 'ADMIN' ? 'admin@cleancity.gov' : 'citizen@cleancity.demo';
      const password = demoRole === 'ADMIN' ? 'admin123' : 'password123';
      const res = await api.login({ email, password });
      onAuthSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.login({
        email: loginEmail.trim(),
        password: loginPassword,
      });
      onAuthSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !regEmail || !regPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (regPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.register({
        full_name: fullName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        confirm_password: confirmPassword,
        city: city.trim(),
        phone_optional: phone.trim(),
        role,
      });
      setSuccessMsg('Account registered successfully! Logging you in...');
      setTimeout(() => {
        onAuthSuccess(res.user);
      }, 700);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-page-container" className="max-w-md mx-auto px-4 py-12">
      {/* Brand Icon Header */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-700/20 mb-3">
          <Recycle className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Clean<span className="text-emerald-600">City</span> Authentication
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          "Report. Track. Clean." — AI Citizen Sanitation Platform
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl mb-6 text-xs font-bold">
        <button
          type="button"
          onClick={() => {
            setMode('login');
            setError(null);
          }}
          className={`flex-1 py-2 rounded-lg transition-all ${
            mode === 'login'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('register');
            setError(null);
          }}
          className={`flex-1 py-2 rounded-lg transition-all ${
            mode === 'register'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Register New Account
        </button>
      </div>

      {/* Error / Success Feedback */}
      {error && (
        <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          {error}
        </div>
      )}

      {successMsg && (
        <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Quick 1-Click Demo Section (Section 28) */}
      <div className="mb-6 p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs">
        <span className="font-bold text-emerald-950 flex items-center gap-1.5 uppercase tracking-wider text-[11px] mb-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Instant Demo Access (For Presentation & Testing)
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleQuickDemo('CITIZEN')}
            className="p-2 bg-white border border-emerald-300 rounded-lg hover:bg-emerald-100/60 font-semibold text-emerald-900 text-left transition-colors"
          >
            <div className="font-bold">Citizen Demo</div>
            <div className="text-[10px] text-slate-500">Priya Sharma</div>
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleQuickDemo('ADMIN')}
            className="p-2 bg-white border border-purple-300 rounded-lg hover:bg-purple-50 font-semibold text-purple-900 text-left transition-colors"
          >
            <div className="font-bold">Admin Demo</div>
            <div className="text-[10px] text-slate-500">Inspector Verma</div>
          </button>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        {mode === 'login' ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="citizen@cleancity.demo or your email"
                  required
                  className="w-full py-2.5 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full py-2.5 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* REGISTER FORM (Section 9 Feature 1) */
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  required
                  className="w-full py-2 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="priya@college.edu"
                  required
                  className="w-full py-2 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Min 6 chars"
                  required
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">City / Area</label>
                <div className="relative">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Visakhapatnam"
                    className="w-full py-2 pl-8 pr-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone (Optional)</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full py-2 pl-8 pr-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Role Selection for Demo Flexibility */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Account Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('CITIZEN')}
                  className={`p-2 rounded-lg border text-center font-bold transition-colors ${
                    role === 'CITIZEN'
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  Citizen / Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('ADMIN')}
                  className={`p-2 rounded-lg border text-center font-bold transition-colors ${
                    role === 'ADMIN'
                      ? 'bg-purple-100 text-purple-900 border-purple-400'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  Municipal Admin
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {loading ? 'Creating Profile...' : 'Complete Registration'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
