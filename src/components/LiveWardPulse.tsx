import React, { useState, useEffect } from 'react';
import { Activity, Clock, MapPin, CheckCircle2, Truck, Bell } from 'lucide-react';

interface PulseItem {
  id: string;
  ward: string;
  zone: string;
  action: string;
  timeAgo: string;
  status: 'COMPLETED' | 'IN_TRANSIT' | 'ACTIVE';
}

const PULSE_DATA: PulseItem[] = [
  {
    id: 'p1',
    ward: 'Ward 12 (Siripuram)',
    zone: 'Zone 2 (Central)',
    action: 'Primary compactor truck #12 cleared 4 community bins along Waltair Road',
    timeAgo: '12m ago',
    status: 'COMPLETED',
  },
  {
    id: 'p2',
    ward: 'Ward 24 (MVP Colony)',
    zone: 'Zone 2 (East)',
    action: 'Sanitary squad dispatched for Rythu Bazaar vegetable waste segregation',
    timeAgo: '24m ago',
    status: 'ACTIVE',
  },
  {
    id: 'p3',
    ward: 'Ward 31 (Beach Road)',
    zone: 'Zone 3 (Coastal)',
    action: 'Promenade morning sweep complete; 180kg beach litter dispatched to recyclers',
    timeAgo: '45m ago',
    status: 'COMPLETED',
  },
  {
    id: 'p4',
    ward: 'Ward 18 (Dwaraka Nagar)',
    zone: 'Zone 2 (Central)',
    action: 'Tipper Auto #18 en route to Commercial Lane near Complex for carton clearance',
    timeAgo: 'Just now',
    status: 'IN_TRANSIT',
  },
  {
    id: 'p5',
    ward: 'Ward 45 (Gajuwaka)',
    zone: 'Zone 5 (Industrial)',
    action: 'Suction desilting machine clearing storm drain near High School',
    timeAgo: '1 hr ago',
    status: 'ACTIVE',
  },
  {
    id: 'p6',
    ward: 'Ward 08 (Madhurawada)',
    zone: 'Zone 1 (North)',
    action: 'Highway approach plot cleared of construction debris; lime powder applied',
    timeAgo: '1.5 hrs ago',
    status: 'COMPLETED',
  },
];

export const LiveWardPulse: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PULSE_DATA.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const activeItem = PULSE_DATA[currentIndex];

  return (
    <div className="bg-emerald-900/90 text-white border-y border-emerald-700/60 py-2.5 px-4 text-xs select-none">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        {/* Left Pulse Pill */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-300"></span>
          </span>
          <span className="font-extrabold uppercase tracking-wider text-[11px] text-emerald-200 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-emerald-300" />
            Live Ward Pulse:
          </span>
        </div>

        {/* Center Live Message */}
        <div className="flex-1 text-center sm:text-left truncate px-2">
          <span className="font-bold text-emerald-200 mr-2">
            [{activeItem.ward}]:
          </span>
          <span className="text-white/95 text-xs">
            {activeItem.action}
          </span>
        </div>

        {/* Right Status Badge */}
        <div className="flex items-center gap-2 shrink-0 text-[11px]">
          <span className="text-emerald-300 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {activeItem.timeAgo}
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              activeItem.status === 'COMPLETED'
                ? 'bg-emerald-800 text-emerald-100 border border-emerald-600'
                : activeItem.status === 'IN_TRANSIT'
                ? 'bg-amber-600/80 text-amber-100 border border-amber-500'
                : 'bg-blue-600/80 text-blue-100 border border-blue-500'
            }`}
          >
            {activeItem.status === 'COMPLETED'
              ? 'CLEARED'
              : activeItem.status === 'IN_TRANSIT'
              ? 'EN ROUTE'
              : 'IN PROGRESS'}
          </span>
        </div>
      </div>
    </div>
  );
};
