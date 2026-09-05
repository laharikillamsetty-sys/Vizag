import React, { useState } from 'react';
import { Search, MapPin, Phone, Clock, UserCheck, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface WardInfo {
  wardNumber: number;
  zone: string;
  name: string;
  landmarks: string[];
  inspector: string;
  phone: string;
  schedule: string;
  workersCount: number;
  status: string;
}

const WARDS: WardInfo[] = [
  {
    wardNumber: 12,
    zone: 'Zone 2 (Central Vizag)',
    name: 'Siripuram & Waltair Uplands',
    landmarks: ['Siripuram Circle', 'HSBC Junction', 'Andhra University South Gate', 'VIP Road'],
    inspector: 'Sri K. Ramana Murthy',
    phone: '0891-2746412',
    schedule: '6:00 AM – 9:30 AM (Daily Door-to-Door)',
    workersCount: 28,
    status: 'All 8 community bins cleared this morning',
  },
  {
    wardNumber: 24,
    zone: 'Zone 2 (East Vizag)',
    name: 'MVP Colony (Sectors 1 to 9)',
    landmarks: ['MVP Rythu Bazaar', 'Sector 4 Park', 'AS Raja Grounds', 'Appughar Road'],
    inspector: 'Smt. P. Sunitha',
    phone: '0891-2746424',
    schedule: '6:15 AM – 10:00 AM (Segregated Wet/Dry)',
    workersCount: 34,
    status: 'Active waste compaction at market junction',
  },
  {
    wardNumber: 31,
    zone: 'Zone 3 (Coastal Belt)',
    name: 'Beach Road & Pandurangapuram',
    landmarks: ['Kali Temple Promenade', 'Submarine Museum', 'RK Beach', 'Kurupam Tomb'],
    inspector: 'Sri V. Srinivasa Rao',
    phone: '0891-2746431',
    schedule: '5:30 AM – 9:00 AM & 6:00 PM Evening Sweep',
    workersCount: 24,
    status: 'Coastal walkway swept & bins sanitized',
  },
  {
    wardNumber: 18,
    zone: 'Zone 2 (Central)',
    name: 'Dwaraka Nagar & Diamond Park',
    landmarks: ['RTC Complex Road', 'Diamond Park', 'Sangeeth Theatre Lane', 'Station Approach'],
    inspector: 'Sri M. Appala Naidu',
    phone: '0891-2746418',
    schedule: '6:30 AM – 10:30 AM (Commercial Focus)',
    workersCount: 32,
    status: 'Carton and packaging pickup in progress',
  },
  {
    wardNumber: 45,
    zone: 'Zone 5 (Gajuwaka Industrial)',
    name: 'Gajuwaka & Auto Nagar',
    landmarks: ['High School Junction', 'Old Gajuwaka Market', 'BHPV Gate', 'Kanithi Road'],
    inspector: 'Sri B. Suresh Kumar',
    phone: '0891-2746445',
    schedule: '6:00 AM – 10:00 AM',
    workersCount: 30,
    status: 'Monsoon drain desilting drive active',
  },
  {
    wardNumber: 8,
    zone: 'Zone 1 (Madhurawada / North)',
    name: 'Madhurawada & IT SEZ',
    landmarks: ['Cricket Stadium Road', 'Hill 2 IT SEZ', 'Kommadi Junction', 'Car Shed'],
    inspector: 'Sri G. Venkata Ratnam',
    phone: '0891-2746408',
    schedule: '6:30 AM – 10:00 AM',
    workersCount: 26,
    status: 'Highway approach plot cleared of debris',
  },
];

interface WardDirectorySectionProps {
  onReportInWard?: (wardName: string) => void;
}

export const WardDirectorySection: React.FC<WardDirectorySectionProps> = ({ onReportInWard }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWard, setSelectedWard] = useState<WardInfo>(WARDS[0]);

  const filteredWards = WARDS.filter((w) => {
    const q = searchTerm.toLowerCase();
    return (
      w.name.toLowerCase().includes(q) ||
      w.zone.toLowerCase().includes(q) ||
      w.inspector.toLowerCase().includes(q) ||
      w.landmarks.some((l) => l.toLowerCase().includes(q)) ||
      w.wardNumber.toString() === q
    );
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-1 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Ward Sanitation Governance
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Know Your Ward &amp; Sanitary Inspector
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Check your ward sanitation squad strength, daily collection schedule, and direct municipal officer contact.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by area, landmark or Ward #"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-slate-50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ward Quick Selector List */}
        <div className="lg:col-span-5 space-y-2 max-h-[380px] overflow-y-auto pr-1">
          {filteredWards.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No matching ward found for "{searchTerm}".
            </div>
          ) : (
            filteredWards.map((w) => (
              <div
                key={w.wardNumber}
                onClick={() => setSelectedWard(w)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all text-left ${
                  selectedWard.wardNumber === w.wardNumber
                    ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
                    : 'border-slate-100 hover:border-slate-300 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-xs text-slate-900">
                    Ward {w.wardNumber}: {w.name}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {w.zone.split(' ')[0]}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  {w.landmarks.join(' • ')}
                </p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/50 text-[10px] text-slate-500">
                  <span className="font-medium text-emerald-800">{w.inspector}</span>
                  <span className="text-slate-400">{w.workersCount} Staff</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected Ward Profile Card */}
        <div className="lg:col-span-7 bg-slate-50/80 rounded-xl p-5 sm:p-6 border border-slate-200 flex flex-col justify-between text-left">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block">
                  {selectedWard.zone}
                </span>
                <h4 className="text-lg font-bold text-slate-900">
                  Ward {selectedWard.wardNumber}: {selectedWard.name}
                </h4>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Active Jurisdiction
              </span>
            </div>

            {/* Landmarks Covered */}
            <div>
              <span className="text-[11px] font-bold text-slate-700 block mb-1">Key Localities Covered:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedWard.landmarks.map((l, i) => (
                  <span key={i} className="text-[11px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
                    {l}
                  </span>
                ))}
              </div>
            </div>

            {/* Inspector Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-2 text-slate-500 text-[11px] mb-1">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sanitary Inspector in Charge</span>
                </div>
                <div className="font-bold text-xs text-slate-900">{selectedWard.inspector}</div>
                <a
                  href={`tel:${selectedWard.phone}`}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 hover:text-emerald-900 mt-1"
                >
                  <Phone className="w-3 h-3" /> {selectedWard.phone}
                </a>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-2 text-slate-500 text-[11px] mb-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Door-to-Door Collection</span>
                </div>
                <div className="font-bold text-xs text-slate-900">{selectedWard.schedule}</div>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Dedicated Field Staff: {selectedWard.workersCount} sweepers &amp; drivers
                </span>
              </div>
            </div>

            {/* Live Ward Status Box */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-900 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-[11px] block">Current Ward Status:</span>
                <span className="text-[11px] text-emerald-800">{selectedWard.status}</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Notice an issue in Ward {selectedWard.wardNumber}?
            </span>
            <button
              onClick={() => onReportInWard && onReportInWard(`Ward ${selectedWard.wardNumber} - ${selectedWard.name}`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors shadow-xs"
            >
              Report Here <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
