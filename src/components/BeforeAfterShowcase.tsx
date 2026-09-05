import React, { useState } from 'react';
import { CheckCircle2, Clock, MapPin, Sparkles, UserCheck } from 'lucide-react';

interface CaseStudy {
  id: string;
  title: string;
  ward: string;
  location: string;
  beforeImg: string;
  afterImg: string;
  timeToResolve: string;
  officer: string;
  category: string;
  beforeDesc: string;
  afterDesc: string;
}

const CASES: CaseStudy[] = [
  {
    id: 'case-1',
    title: 'Beach Road Promenade Plastic Cleanup',
    ward: 'Ward 31 • Beach Road / Pandurangapuram',
    location: 'Near Kali Temple Promenade, Beach Road',
    beforeImg: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    timeToResolve: '1 hr 45 min',
    officer: 'V. Srinivasa Rao (Sanitary Inspector)',
    category: 'Plastic Litter',
    beforeDesc: 'Discarded beverage bottles and food wrappers scattered across pedestrian seating after evening crowds.',
    afterDesc: 'Promenade swept clean by Beach Beat Squad #3, 140kg dry recyclables dispatched, twin bins installed.',
  },
  {
    id: 'case-2',
    title: 'MVP Colony Rythu Bazaar Bin Clearance',
    ward: 'Ward 24 • MVP Colony',
    location: 'Sector 4, Main Market Road Junction',
    beforeImg: 'https://images.unsplash.com/photo-1611288875785-5a503e91d643?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    timeToResolve: '2 hrs 15 min',
    officer: 'Smt. P. Sunitha (Sanitary Inspector)',
    category: 'Garbage Overflow',
    beforeDesc: 'Community waste bin overflowing onto pedestrian footpath with vegetable and packaging waste.',
    afterDesc: 'Compactor Truck #12 collected 2.8 tons, footpath disinfected with lime powder and bleaching solution.',
  },
  {
    id: 'case-3',
    title: 'Gajuwaka Storm Drain Desilting',
    ward: 'Ward 45 • Gajuwaka',
    location: 'Opposite Government High School',
    beforeImg: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
    timeToResolve: '3 hrs 30 min',
    officer: 'B. Suresh Kumar (Ward Sanitary Supervisor)',
    category: 'Blocked Drain',
    beforeDesc: 'Drain choked with sediment and plastic waste causing stagnant black water and mosquito breeding.',
    afterDesc: 'Mechanical suction excavator deployed to remove 180kg silt; free gravity drainage flow restored.',
  },
];

export const BeforeAfterShowcase: React.FC = () => {
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'split' | 'before' | 'after'>('split');

  const currentCase = CASES[activeCaseIndex];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-1 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Verified Municipal Resolutions
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Before &amp; After: Citizen Reports in Action
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Real sanitation grievances reported by citizens and resolved by GVMC ward sanitary squads with photographic proof.
          </p>
        </div>

        {/* Tab Selector for Cases */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {CASES.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setActiveCaseIndex(i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeCaseIndex === i
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Case {i + 1}: {c.category}
            </button>
          ))}
        </div>
      </div>

      {/* Main Showcase Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-slate-50/70 rounded-xl p-5 sm:p-6 border border-slate-100">
        {/* Visual Preview Side */}
        <div className="lg:col-span-7 space-y-3">
          {/* View Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {currentCase.location}
            </span>

            <div className="inline-flex bg-slate-200/80 p-0.5 rounded-lg text-[11px] font-bold">
              <button
                onClick={() => setViewMode('split')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  viewMode === 'split' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Side-by-Side
              </button>
              <button
                onClick={() => setViewMode('before')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  viewMode === 'before' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Before
              </button>
              <button
                onClick={() => setViewMode('after')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  viewMode === 'after' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                After Cleaned
              </button>
            </div>
          </div>

          {/* Image Display */}
          {viewMode === 'split' ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="relative rounded-xl overflow-hidden aspect-4/3 border border-rose-200 shadow-xs group">
                <img
                  src={currentCase.beforeImg}
                  alt="Before cleanup"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-2 left-2 bg-rose-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                  BEFORE REPORTED
                </span>
              </div>
              <div className="relative rounded-xl overflow-hidden aspect-4/3 border border-emerald-200 shadow-xs group">
                <img
                  src={currentCase.afterImg}
                  alt="After cleanup"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-2 left-2 bg-emerald-700/90 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> AFTER RESOLVED
                </span>
              </div>
            </div>
          ) : viewMode === 'before' ? (
            <div className="relative rounded-xl overflow-hidden aspect-16/10 border border-rose-200 shadow-xs">
              <img
                src={currentCase.beforeImg}
                alt="Before cleanup"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-md shadow-xs">
                BEFORE (Citizen Photo Logged)
              </span>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden aspect-16/10 border border-emerald-200 shadow-xs">
              <img
                src={currentCase.afterImg}
                alt="After cleanup"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-3 left-3 bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-md shadow-xs flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> AFTER (Verified Resolution by Field Inspector)
              </span>
            </div>
          )}
        </div>

        {/* Narrative & Field Details Side */}
        <div className="lg:col-span-5 space-y-4 text-left">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider">
              {currentCase.ward}
            </span>
            <h4 className="text-lg font-bold text-slate-900 leading-snug">
              {currentCase.title}
            </h4>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-lg bg-rose-50/70 border border-rose-100 text-rose-950">
              <span className="font-bold block text-rose-800 text-[11px] mb-0.5">Problem Reported:</span>
              <p className="text-[11px] leading-relaxed text-rose-900/90">{currentCase.beforeDesc}</p>
            </div>

            <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-100 text-emerald-950">
              <span className="font-bold block text-emerald-800 text-[11px] mb-0.5">Field Action Taken:</span>
              <p className="text-[11px] leading-relaxed text-emerald-900/90">{currentCase.afterDesc}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/80 grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Turnaround</span>
                <span className="font-bold text-slate-900">{currentCase.timeToResolve}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 block font-medium">Supervised By</span>
                <span className="font-bold text-slate-900 truncate block text-[11px]">{currentCase.officer}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
