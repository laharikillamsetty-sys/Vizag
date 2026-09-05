import React from 'react';
import { PhoneCall, ShieldCheck } from 'lucide-react';
import { SitamLogo, GvmcLogo, GreenCityLogo, PoliceLogo } from './PartnerLogos.tsx';

export const InstitutionalBranding: React.FC = () => {
  return (
    <div id="institutional-branding-bar" className="bg-emerald-950 text-emerald-100 border-b border-emerald-800/80 py-2 px-3 sm:px-4 text-xs select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        {/* Logos & Touchpoints */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-300 uppercase tracking-wider hidden lg:flex">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Civic Touchpoints:</span>
          </div>

          {/* 1. College / SITAM Logo */}
          <div
            id="partner-sitam-badge"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-emerald-600/50 hover:border-emerald-400/80 px-2.5 py-1 rounded-lg transition-all shadow-xs cursor-default"
            title="SITAM Engineering College - Academic & Research Partner (Since 1996)"
          >
            <SitamLogo className="w-6 h-6 shrink-0" />
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-white text-[11px] leading-tight">SITAM</span>
              <span className="text-[9px] text-emerald-200 font-medium">Dept. of CSE • Since 1996</span>
            </div>
          </div>

          {/* 2. Municipal Corporation Logo (GVMC) */}
          <div
            id="partner-municipal-badge"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-emerald-600/50 hover:border-emerald-400/80 px-2.5 py-1 rounded-lg transition-all shadow-xs cursor-default"
            title="Greater Visakhapatnam Municipal Corporation (GVMC) - Official Solid Waste Management Authority"
          >
            <GvmcLogo className="w-6 h-6 shrink-0" />
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-white text-[11px] leading-tight">GVMC</span>
              <span className="text-[9px] text-emerald-200 font-medium">City of Destiny • Swachh Vizag</span>
            </div>
          </div>

          {/* 3. GreenCity Community / NGO Partner Logo */}
          <div
            id="partner-ngo-badge"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-emerald-600/50 hover:border-emerald-400/80 px-2.5 py-1 rounded-lg transition-all shadow-xs cursor-default"
            title="GreenCity Citizens Action & Environmental Alliance"
          >
            <GreenCityLogo className="w-6 h-6 shrink-0" />
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-white text-[11px] leading-tight">GreenCity</span>
              <span className="text-[9px] text-emerald-200 font-medium">Citizen Action NGO</span>
            </div>
          </div>

          {/* 4. Police Station Civic Liaison */}
          <div
            id="partner-police-badge"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-emerald-600/50 hover:border-emerald-400/80 px-2.5 py-1 rounded-lg transition-all shadow-xs cursor-default"
            title="Civic & Traffic Police Liaison for Encroachments & Public Order"
          >
            <PoliceLogo className="w-6 h-6 shrink-0" />
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-white text-[11px] leading-tight">Civic Police</span>
              <span className="text-[9px] text-emerald-200 font-medium">Public Order Liaison</span>
            </div>
          </div>
        </div>

        {/* Human Civic Contact & Telugu Tagline */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 text-emerald-200 text-[11px]">
          <span className="font-semibold text-emerald-300 hidden sm:inline">
            స్వచ్ఛ విశాఖ • మన బాధ్యత
          </span>
          <span className="text-emerald-600 hidden sm:inline">•</span>
          <a
            href="tel:180042500011"
            className="inline-flex items-center gap-1.5 bg-emerald-900/90 hover:bg-emerald-800 text-emerald-100 px-2.5 py-1 rounded-md border border-emerald-700/80 transition-colors"
            title="GVMC 24/7 Sanitation Toll-Free Control Room"
          >
            <PhoneCall className="w-3 h-3 text-emerald-400" />
            <span className="font-medium">Toll Free: 1800-425-00011</span>
          </a>
        </div>
      </div>
    </div>
  );
};
