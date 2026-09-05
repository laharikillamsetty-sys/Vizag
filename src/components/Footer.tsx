import React from 'react';
import { Recycle, Github, Database, Shield, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenSchema?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSchema }) => {
  return (
    <footer className="bg-emerald-950 text-slate-300 border-t border-emerald-900/60 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <Recycle className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Clean<span className="text-emerald-400">City</span>
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed mb-3">
              AI-Powered Citizen Sanitation Reporting and Accountability Platform.
              "Report. Track. Clean."
            </p>
            <div className="text-[11px] text-emerald-400/90 font-medium">
              SITAM Engineering College • Final Year CSE Project
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Citizen Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('report-issue')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Report Sanitation Issue
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('track-complaint')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Track Complaint by ID
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('landing-workflow')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  How AI Analysis Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('citizen-dashboard')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Citizen Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Admin & System */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Governance & Admin
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('admin-dashboard')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  Authority Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('analytics')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Civic Sanitation Analytics
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('profile')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  Supabase & Backend Schema
                </button>
              </li>
            </ul>
          </div>

          {/* Academic & Open Source */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Civic Innovation & Research
            </h4>
            <p className="text-xs text-emerald-200/70 leading-relaxed mb-3">
              Jointly developed by Dept. of Computer Science &amp; Engineering, SITAM, in collaboration with Greater Visakhapatnam Municipal Corporation (GVMC) to advance Swachh Bharat Urban sanitation goals.
            </p>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-900/60 text-emerald-300 text-[11px] font-semibold border border-emerald-700/50">
                <Shield className="w-3.5 h-3.5" />
                Swachh Bharat Mission (Urban)
              </span>
            </div>
          </div>
        </div>

        {/* Institutional Partner Showcase */}
        <div className="pt-6 pb-6 border-t border-emerald-900/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 sm:gap-6">
            <span className="text-[11px] font-bold text-emerald-300/80 uppercase tracking-wider">
              Institutional Touchpoints:
            </span>
            <div className="flex items-center gap-2 bg-emerald-900/40 px-3 py-1.5 rounded-lg border border-emerald-800/60">
              <img src="/logos/sitam-logo.svg" alt="SITAM College" className="w-6 h-6 object-contain rounded-full bg-white" />
              <div className="text-[10px] leading-tight text-left">
                <span className="font-bold text-white block">SITAM College</span>
                <span className="text-emerald-300/80">Since 1996 • CSE</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-emerald-900/40 px-3 py-1.5 rounded-lg border border-emerald-800/60">
              <img src="/logos/gvmc-logo.svg" alt="GVMC Visakhapatnam" className="w-6 h-6 object-contain rounded-full bg-white" />
              <div className="text-[10px] leading-tight text-left">
                <span className="font-bold text-white block">GVMC</span>
                <span className="text-emerald-300/80">City of Destiny</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-emerald-900/40 px-3 py-1.5 rounded-lg border border-emerald-800/60">
              <img src="/logos/greencity-logo.svg" alt="GreenCity NGO" className="w-6 h-6 object-contain rounded-full bg-white" />
              <div className="text-[10px] leading-tight text-left">
                <span className="font-bold text-white block">GreenCity</span>
                <span className="text-emerald-300/80">Eco Community NGO</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-emerald-900/40 px-3 py-1.5 rounded-lg border border-emerald-800/60">
              <img src="/logos/police-logo.svg" alt="Civic Police Liaison" className="w-6 h-6 object-contain rounded-full bg-white" />
              <div className="text-[10px] leading-tight text-left">
                <span className="font-bold text-white block">Civic Police</span>
                <span className="text-emerald-300/80">Law &amp; Order</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="pt-6 border-t border-emerald-900/60 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} CleanCity. Educational demonstration project for academic purposes.
          </p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-300/80">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
            <span>by CSE Final Year Student Team (Vibe Coding)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
