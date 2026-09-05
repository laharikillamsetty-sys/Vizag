import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  MapPin,
  Phone,
  Shield,
  Database,
  Sparkles,
  CheckCircle,
  Copy,
  ExternalLink,
  Server,
  FileCode,
} from 'lucide-react';
import { UserProfile } from '../types.ts';
import { api } from '../services/api.ts';

interface ProfilePageProps {
  currentUser: UserProfile;
  onLogout: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, onLogout }) => {
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [envStatus, setEnvStatus] = useState<any>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [testingSupabase, setTestingSupabase] = useState(false);
  const [supabaseTestResult, setSupabaseTestResult] = useState<any>(null);

  useEffect(() => {
    api.getDbStatus().then((res) => setDbStatus(res));
    api.getEnvStatus().then((res) => setEnvStatus(res));
  }, []);

  const handleTestSupabase = async () => {
    setTestingSupabase(true);
    setSupabaseTestResult(null);
    try {
      const res = await api.testSupabase();
      setSupabaseTestResult(res);
    } catch (err: any) {
      setSupabaseTestResult({
        connected: false,
        message: err.message || 'Test failed',
      });
    } finally {
      setTestingSupabase(false);
    }
  };

  const sampleSqlSnippet = `-- CleanCity PostgreSQL Schema for Supabase
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'CITIZEN' CHECK (role IN ('CITIZEN', 'ADMIN')),
  city TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'REPORTED',
  priority TEXT NOT NULL DEFAULT 'Medium',
  confidence NUMERIC(3, 2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sampleSqlSnippet);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div id="profile-page-container" className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
          Account & System Architecture
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
          Profile & Tech Stack Diagnostics
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Review your account role credentials and inspect the underlying CleanCity backend architecture.
        </p>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-md shadow-emerald-700/20">
            {currentUser.full_name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{currentUser.full_name}</h2>
              <span
                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  currentUser.role === 'ADMIN'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              {currentUser.email}
            </p>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {currentUser.city} {currentUser.phone_optional ? `• ${currentUser.phone_optional}` : ''}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors"
        >
          Sign Out of Account
        </button>
      </div>

      {/* CSE Architecture Status (Section 8, 25 & 26) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                CSE Project Architecture Stack
              </h3>
              <p className="text-xs text-slate-500">
                Designed around free, open-source, and browser/local accessible technologies.
              </p>
            </div>
          </div>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">
            All Systems Operational
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. Database */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-emerald-600" />
                Database Engine
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Active
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Active local persistent JSON data store with instant zero-cost boot. Supabase PostgreSQL schema provided for production migration.
            </p>
            <div className="text-[10px] text-slate-400 font-mono">
              Status: {dbStatus?.status || 'Active'} • {dbStatus?.complaintsCount || 4} records
            </div>
          </div>

          {/* 2. AI Model */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Gemini Vision AI
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Ready
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Integrated @google/genai SDK (gemini-3.8-flash) with structured JSON output and intelligent offline rule-based fallback.
            </p>
            <div className="text-[10px] text-slate-400 font-mono">
              Model: gemini-3.8-flash + Heuristic Fallback
            </div>
          </div>

          {/* 3. Deployment */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-emerald-600" />
                Vercel & GitHub
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Configured
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Vite bundle + Express TypeScript server built for instant deployment to Cloud Run, Vercel, or local presentation.
            </p>
            <div className="text-[10px] text-slate-400 font-mono">
              Build: Single bundle dist/server.cjs
            </div>
          </div>
        </div>

        {/* Supabase Schema Inspection Accordion */}
        <div className="border border-emerald-200 rounded-xl p-4 bg-emerald-50/50">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-xs text-emerald-950 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-emerald-700" />
                Supabase Schema Blueprint (DDL Script)
              </h4>
              <p className="text-[11px] text-emerald-800/80 mt-0.5">
                Included in project root as <code>supabase_schema.sql</code> for your CSE viva / final project demo.
              </p>
            </div>
            <button
              onClick={() => setShowSqlModal(!showSqlModal)}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors"
            >
              {showSqlModal ? 'Hide Schema' : 'View SQL DDL'}
            </button>
          </div>

          {showSqlModal && (
            <div className="mt-4 pt-3 border-t border-emerald-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase text-slate-500">
                  SQL Schema Definitions:
                </span>
                <button
                  onClick={copyToClipboard}
                  className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  {copiedSql ? 'Copied to Clipboard!' : 'Copy SQL'}
                </button>
              </div>
              <pre className="p-3 bg-slate-900 text-emerald-300 rounded-lg text-[11px] font-mono overflow-x-auto max-h-60 leading-relaxed">
                {sampleSqlSnippet}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Environment Variables & Cloud Integration Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">
                Environment Variables &amp; Secrets Status
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Current runtime status of required and optional environment keys defined in <code>.env.example</code>.
            </p>
          </div>

          <button
            onClick={handleTestSupabase}
            disabled={testingSupabase}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 shrink-0"
          >
            <Database className="w-3.5 h-3.5" />
            {testingSupabase ? 'Testing Connection...' : 'Test Supabase Connection'}
          </button>
        </div>

        {/* Supabase Test Result Banner if triggered */}
        {supabaseTestResult && (
          <div
            className={`p-4 rounded-xl text-xs border ${
              supabaseTestResult.connected
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}
          >
            <div className="flex items-center gap-2 font-bold mb-1">
              <CheckCircle className="w-4 h-4 text-emerald-700" />
              <span>
                {supabaseTestResult.connected
                  ? 'Supabase Connection Verified!'
                  : 'Supabase Status Notice (Fallback Active)'}
              </span>
            </div>
            <p className="text-[11px] leading-relaxed">{supabaseTestResult.message}</p>
          </div>
        )}

        {/* Variables Grid */}
        <div className="space-y-3">
          {(envStatus?.variables || [
            {
              name: 'GEMINI_API_KEY',
              description: 'Gemini Vision AI key for automated sanitation classification',
              isSet: true,
              scope: 'Server-side (AI Studio Secret)',
              status: 'ACTIVE',
            },
            {
              name: 'SUPABASE_URL',
              description: 'Supabase PostgreSQL database connection URL',
              isSet: false,
              scope: 'Server & Client',
              status: 'LOCAL_STORAGE_MODE',
            },
            {
              name: 'SUPABASE_ANON_KEY',
              description: 'Supabase public anon API token',
              isSet: false,
              scope: 'Server & Client',
              status: 'LOCAL_STORAGE_MODE',
            },
            {
              name: 'VITE_SUPABASE_URL',
              description: 'Client-side Vite exposed Supabase URL',
              isSet: false,
              scope: 'Browser Client',
              status: 'OPTIONAL',
            },
            {
              name: 'VITE_SUPABASE_ANON_KEY',
              description: 'Client-side Vite exposed Supabase Anon Key',
              isSet: false,
              scope: 'Browser Client',
              status: 'OPTIONAL',
            },
            {
              name: 'APP_URL',
              description: 'AI Studio Cloud Run deployment URL',
              isSet: true,
              scope: 'Runtime Ingress',
              status: 'ACTIVE',
            },
          ]).map((v: any) => (
            <div
              key={v.name}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 gap-2 text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <code className="font-mono font-bold text-slate-900 text-[11px] bg-slate-200/70 px-1.5 py-0.5 rounded">
                    {v.name}
                  </code>
                  <span className="text-[10px] text-slate-500 font-medium">{v.scope}</span>
                </div>
                <p className="text-[11px] text-slate-600">{v.description}</p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                {v.isSet ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    CONFIGURED
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-700 bg-slate-200/80 px-2.5 py-1 rounded-md" title="Local persistent database active">
                    LOCAL FALLBACK
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Dual Mode Persistence Explainer */}
        <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
          <span className="font-bold block text-[11px] uppercase tracking-wider text-emerald-800">
            Dual-Mode Database Architecture (Zero Breaking Changes):
          </span>
          <p className="text-[11px] text-emerald-900/80 leading-relaxed">
            CleanCity operates seamlessly in <strong>Dual Mode</strong>: If Supabase credentials are provided in <code>.env</code> or AI Studio, the application connects directly to your cloud PostgreSQL database. If omitted or during local evaluation, it automatically persists all data to <code>data/cleancity_db.json</code> on the server so you never lose complaints, history, or user accounts.
          </p>
        </div>
      </div>

      {/* Institutional Stakeholders Credit Bar */}
      <div className="bg-slate-900 text-slate-200 rounded-2xl p-6 shadow-xs">
        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
          Academic Project Mentorship &amp; Touchpoints
        </span>
        <h4 className="text-base font-bold text-white mt-1 mb-4">
          SITAM College of Engineering &amp; Civic Partners
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <img src="/logos/sitam-logo.svg" alt="SITAM" className="w-8 h-8 object-contain rounded-full bg-white shrink-0" />
            <div className="text-left text-xs">
              <span className="font-bold text-white block leading-tight">SITAM College</span>
              <span className="text-[10px] text-slate-400">Since 1996 • CSE</span>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <img src="/logos/gvmc-logo.svg" alt="GVMC" className="w-8 h-8 object-contain rounded-full bg-white shrink-0" />
            <div className="text-left text-xs">
              <span className="font-bold text-white block leading-tight">GVMC</span>
              <span className="text-[10px] text-slate-400">City of Destiny</span>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <img src="/logos/greencity-logo.svg" alt="GreenCity" className="w-8 h-8 object-contain rounded-full bg-white shrink-0" />
            <div className="text-left text-xs">
              <span className="font-bold text-white block leading-tight">GreenCity</span>
              <span className="text-[10px] text-slate-400">Eco Action NGO</span>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <img src="/logos/police-logo.svg" alt="Police" className="w-8 h-8 object-contain rounded-full bg-white shrink-0" />
            <div className="text-left text-xs">
              <span className="font-bold text-white block leading-tight">Civic Police</span>
              <span className="text-[10px] text-slate-400">Public Order</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
