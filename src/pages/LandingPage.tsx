import React from 'react';
import {
  Camera,
  Sparkles,
  MapPin,
  TrendingUp,
  Recycle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
  Clock,
  Search,
  ExternalLink,
  PhoneCall,
  UserCheck,
  ShieldAlert,
} from 'lucide-react';
import { Complaint } from '../types.ts';
import { LiveWardPulse } from '../components/LiveWardPulse.tsx';
import { BeforeAfterShowcase } from '../components/BeforeAfterShowcase.tsx';
import { WardDirectorySection } from '../components/WardDirectorySection.tsx';
import { CitizenTestimonialsSection } from '../components/CitizenTestimonialsSection.tsx';
import { CivicHotlineSection } from '../components/CivicHotlineSection.tsx';
import { CivicFaqSection } from '../components/CivicFaqSection.tsx';

interface LandingPageProps {
  onNavigate: (view: string) => void;
  onQuickLogin: (role: 'CITIZEN' | 'ADMIN') => void;
  featuredComplaints: Complaint[];
  onSelectComplaint: (complaint: Complaint) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onQuickLogin,
  featuredComplaints,
  onSelectComplaint,
}) => {
  return (
    <div id="landing-page-container" className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white pt-14 pb-18 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Civic Banner Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/60 text-emerald-200 text-xs font-semibold mb-6 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Greater Visakhapatnam Smart Sanitation &amp; Grievance Portal
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Keep Visakhapatnam <span className="text-emerald-300">Clean, Green &amp; Healthy</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-emerald-100/90 leading-relaxed mb-8">
            Notice an overflowing bin, illegal dump, or clogged storm drain? Snap a photo, tag the ward, and let GVMC field sanitary crews resolve it with photo-verified proof.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10">
            <button
              id="hero-report-issue-btn"
              onClick={() => onNavigate('report-issue')}
              className="px-6 py-3.5 rounded-xl text-sm font-bold bg-emerald-400 hover:bg-emerald-300 text-emerald-950 shadow-lg shadow-emerald-950/40 transition-all flex items-center gap-2 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-emerald-950" />
              Report Sanitation Issue
            </button>

            <button
              id="hero-track-complaint-btn"
              onClick={() => onNavigate('track-complaint')}
              className="px-6 py-3.5 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-emerald-500/50 shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4 text-emerald-300" />
              Track Grievance Status
            </button>

            <button
              id="hero-login-btn"
              onClick={() => onNavigate('login')}
              className="px-5 py-3.5 rounded-xl text-sm font-semibold text-emerald-200 hover:text-white hover:bg-white/10 border border-emerald-700/60 transition-colors cursor-pointer"
            >
              Sign In
            </button>
          </div>

          {/* Trust Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-6 border-t border-emerald-800/80 text-left sm:text-center">
            <div className="p-3 bg-emerald-900/50 rounded-xl border border-emerald-800/60">
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-300">4,820+</div>
              <div className="text-[11px] text-emerald-200/80 font-medium">Grievances Resolved</div>
            </div>
            <div className="p-3 bg-emerald-900/50 rounded-xl border border-emerald-800/60">
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-300">2.4 Hrs</div>
              <div className="text-[11px] text-emerald-200/80 font-medium">Average Response SLA</div>
            </div>
            <div className="p-3 bg-emerald-900/50 rounded-xl border border-emerald-800/60">
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-300">98 Wards</div>
              <div className="text-[11px] text-emerald-200/80 font-medium">Covered Across Vizag</div>
            </div>
            <div className="p-3 bg-emerald-900/50 rounded-xl border border-emerald-800/60">
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-300">100%</div>
              <div className="text-[11px] text-emerald-200/80 font-medium">Photo Proof Verified</div>
            </div>
          </div>

          {/* Persona Switcher Bar */}
          <div className="mt-8 pt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-emerald-200/80">
            <span className="font-semibold text-emerald-300">Quick Persona Preview:</span>
            <button
              onClick={() => onQuickLogin('CITIZEN')}
              className="px-3 py-1 bg-emerald-800/90 hover:bg-emerald-700 rounded-md border border-emerald-600/70 text-white font-medium transition-colors cursor-pointer"
            >
              Citizen (Priya Sharma)
            </button>
            <button
              onClick={() => onQuickLogin('ADMIN')}
              className="px-3 py-1 bg-emerald-800/90 hover:bg-emerald-700 rounded-md border border-emerald-600/70 text-white font-medium transition-colors cursor-pointer"
            >
              Municipal Inspector (R. Verma)
            </button>
          </div>
        </div>
      </section>

      {/* 2. Live Municipal Dispatch Ticker */}
      <div className="-mt-12 sm:-mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <LiveWardPulse />
      </div>

      {/* 3. Institutional Stakeholders & Logos Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Institutional Partnership &amp; Governance
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                Collaborative Civic Sanitation Framework
              </h3>
              <p className="text-slate-500 text-xs mt-1 max-w-xl">
                Bridging computer science engineering research at SITAM with municipal operations of GVMC to accelerate clean ward outcomes.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 w-full md:w-auto">
              {/* SITAM */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 bg-slate-50/80 hover:bg-emerald-50/50 hover:border-emerald-200 transition-colors">
                <img src="/logos/sitam-logo.svg" alt="SITAM College" className="w-10 h-10 object-contain rounded-full bg-white shadow-2xs shrink-0" />
                <div className="text-left">
                  <span className="font-extrabold text-slate-900 text-xs block leading-tight">SITAM</span>
                  <span className="text-[10px] text-slate-500 font-medium">Since 1996 • CSE</span>
                </div>
              </div>

              {/* GVMC */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 bg-slate-50/80 hover:bg-emerald-50/50 hover:border-emerald-200 transition-colors">
                <img src="/logos/gvmc-logo.svg" alt="GVMC Visakhapatnam" className="w-10 h-10 object-contain rounded-full bg-white shadow-2xs shrink-0" />
                <div className="text-left">
                  <span className="font-extrabold text-slate-900 text-xs block leading-tight">GVMC</span>
                  <span className="text-[10px] text-slate-500 font-medium">City of Destiny</span>
                </div>
              </div>

              {/* GreenCity */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 bg-slate-50/80 hover:bg-emerald-50/50 hover:border-emerald-200 transition-colors">
                <img src="/logos/greencity-logo.svg" alt="GreenCity Foundation" className="w-10 h-10 object-contain rounded-full bg-white shadow-2xs shrink-0" />
                <div className="text-left">
                  <span className="font-extrabold text-slate-900 text-xs block leading-tight">GreenCity</span>
                  <span className="text-[10px] text-slate-500 font-medium">Eco Action NGO</span>
                </div>
              </div>

              {/* Police Liaison */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 bg-slate-50/80 hover:bg-emerald-50/50 hover:border-emerald-200 transition-colors">
                <img src="/logos/police-logo.svg" alt="Civic Police Liaison" className="w-10 h-10 object-contain rounded-full bg-white shadow-2xs shrink-0" />
                <div className="text-left">
                  <span className="font-extrabold text-slate-900 text-xs block leading-tight">Civic Police</span>
                  <span className="text-[10px] text-slate-500 font-medium">Public Grievances</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive Before & After Resolution Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BeforeAfterShowcase />
      </section>

      {/* 5. Know Your Ward & Sanitary Inspector Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <WardDirectorySection onReportInWard={(ward) => onNavigate('report-issue')} />
      </section>

      {/* 6. Four-Step Civic Accountability SLA Pipeline */}
      <section id="landing-workflow" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-6 sm:p-10">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Citizen Accountability SLA Pipeline
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 mt-1">
              How Your Complaint Gets Resolved
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2">
              From the moment you snap a photo to final disinfected street clearance, every step is logged and transparent.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-xl border border-emerald-100 shadow-xs text-left">
              <div className="text-xs font-bold text-emerald-600 mb-1">STAGE 1 • 0-5 MINS</div>
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm mb-3">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Citizen Capture</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Citizen uploads a photo with GPS pin &amp; landmark. System issues a unique tracking token (e.g. CC-2026-042).
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-emerald-100 shadow-xs text-left">
              <div className="text-xs font-bold text-emerald-600 mb-1">STAGE 2 • INSTANT</div>
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm mb-3">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Vision AI Triage</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Gemini Vision analyzes the waste category, checks severity, and recommends truck equipment (compactor vs tipper auto).
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-emerald-100 shadow-xs text-left">
              <div className="text-xs font-bold text-emerald-600 mb-1">STAGE 3 • 1-2 HOURS</div>
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm mb-3">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Sanitary Squad Dispatched</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ward Sanitary Inspector assigns field sweepers, collects waste, and treats ground with anti-larval lime powder.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-emerald-100 shadow-xs text-left">
              <div className="text-xs font-bold text-emerald-600 mb-1">STAGE 4 • VERIFIED</div>
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm mb-3">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Photo Proof &amp; Close</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Field team uploads after-photo proof. Citizen receives resolution notification and rates municipal performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Live Active Community Complaints Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Transparency in Action
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
              Active Community Reports
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live sanitation grievances submitted by residents across Visakhapatnam.
            </p>
          </div>
          <button
            onClick={() => onNavigate('track-complaint')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            Track by Complaint ID <Search className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredComplaints.slice(0, 4).map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectComplaint(c)}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="aspect-16/10 bg-slate-100 relative overflow-hidden">
                  <img
                    src={c.image_url}
                    alt={c.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2.5 left-2.5 flex gap-1">
                    <span className="font-mono text-[10px] font-extrabold bg-slate-900/85 text-white px-2 py-0.5 rounded backdrop-blur-xs">
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

                <div className="p-4 text-left">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-emerald-900">{c.category}</span>
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
                <span>{new Date(c.created_at).toLocaleDateString()}</span>
                <span className="font-bold text-emerald-700 group-hover:underline flex items-center gap-0.5">
                  Timeline &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Citizen Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CitizenTestimonialsSection />
      </section>

      {/* 9. Civic Hotlines & WhatsApp Bot Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CivicHotlineSection />
      </section>

      {/* 10. Reassuring Civic FAQ Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CivicFaqSection />
      </section>
    </div>
  );
};
