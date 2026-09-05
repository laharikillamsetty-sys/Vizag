import React from 'react';
import { PhoneCall, MessageSquare, AlertTriangle, ShieldCheck, Clock, ExternalLink } from 'lucide-react';

export const CivicHotlineSection: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-2xl text-white p-6 sm:p-8 shadow-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-700/80 pb-4">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
            Emergency &amp; Direct Citizen Assistance
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            GVMC 24/7 Sanitation Control Room &amp; Helplines
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Need urgent assistance for toxic chemical dumping, overflowing hospital waste, or severe drain blockages?
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            Active 24 Hours • 365 Days
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Hotline 1 */}
        <div className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 p-4 rounded-xl transition-colors text-left flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-emerald-600/30 text-emerald-400 flex items-center justify-center mb-2.5">
              <PhoneCall className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
              GVMC Toll-Free Center
            </span>
            <div className="text-lg font-extrabold text-white mt-0.5">1800-425-00011</div>
            <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
              Main municipal solid waste dispatch &amp; compactor allocation desk.
            </p>
          </div>
          <a
            href="tel:180042500011"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 mt-3"
          >
            Call Toll-Free Now &rarr;
          </a>
        </div>

        {/* Hotline 2 */}
        <div className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 p-4 rounded-xl transition-colors text-left flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-emerald-600/30 text-emerald-400 flex items-center justify-center mb-2.5">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
              WhatsApp Grievance Bot
            </span>
            <div className="text-lg font-extrabold text-white mt-0.5">+91 91542 09292</div>
            <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
              Send geo-tagged photo directly via WhatsApp for automatic ticket generation.
            </p>
          </div>
          <a
            href="https://wa.me/919154209292"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 mt-3"
          >
            Open WhatsApp Chat &rarr;
          </a>
        </div>

        {/* Hotline 3 */}
        <div className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 p-4 rounded-xl transition-colors text-left flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-emerald-600/30 text-emerald-400 flex items-center justify-center mb-2.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
              Mosquito Fogging &amp; Drains
            </span>
            <div className="text-lg font-extrabold text-white mt-0.5">0891-2746400</div>
            <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
              Anti-larval spray squad, stagnant water oiling, and mechanical desilting tankers.
            </p>
          </div>
          <a
            href="tel:08912746400"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 mt-3"
          >
            Call Health Cell &rarr;
          </a>
        </div>

        {/* Hotline 4 */}
        <div className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 p-4 rounded-xl transition-colors text-left flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-emerald-600/30 text-emerald-400 flex items-center justify-center mb-2.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
              National Swachhata Helpline
            </span>
            <div className="text-lg font-extrabold text-white mt-0.5">1969</div>
            <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
              Ministry of Housing and Urban Affairs (MoHUA) Pan-India Swachhata line.
            </p>
          </div>
          <a
            href="tel:1969"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 mt-3"
          >
            Dial 1969 &rarr;
          </a>
        </div>
      </div>
    </div>
  );
};
