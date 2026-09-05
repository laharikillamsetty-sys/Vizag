import React from 'react';
import { Star, Quote, CheckCircle2, MapPin } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  ward: string;
  location: string;
  rating: number;
  timeframe: string;
  quote: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Dr. K. S. Murthy',
    role: 'Resident Welfare Assoc. Secretary',
    ward: 'Ward 24',
    location: 'MVP Colony, Sector 4',
    rating: 5,
    timeframe: 'Resolved in 2.2 hrs',
    quote:
      'The vegetable market corner was piling up with discarded organic waste attracting stray cattle. I snapped a photo on CleanCity at 9 AM, and by 11:15 AM a GVMC compactor arrived. What gave me total confidence was seeing the before and after proof photo in my notifications.',
  },
  {
    id: 't2',
    name: 'K. Sai Lahari',
    role: 'B.Tech Student, SITAM College',
    ward: 'Ward 12',
    location: 'Siripuram / Campus Road',
    rating: 5,
    timeframe: 'Resolved in 1.5 hrs',
    quote:
      'During college events, plastic bottles and snack wrappers used to scatter around the bus shelter. Our student team logged it through CleanCity. The AI instantly identified it as plastic waste, assigned priority, and the sanitary inspector dispatched a collection auto before afternoon classes.',
  },
  {
    id: 't3',
    name: 'Smt. Lalitha Devi',
    role: 'Vizag Walkers Club Member',
    ward: 'Ward 31',
    location: 'Beach Road, Kali Temple Promenade',
    rating: 5,
    timeframe: 'Resolved in 1.8 hrs',
    quote:
      'Beach Road is the pride of Visakhapatnam. When weekend tourist litter was left overflowing near the seating benches, we reported it. The coastal beat team swept the entire strip clean and even added twin blue/green segregated bins the very next day.',
  },
];

export const CitizenTestimonialsSection: React.FC = () => {
  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
          Citizen Voices &amp; Trust
        </span>
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
          Real Impact Across Greater Visakhapatnam
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Hear how residents, college students, and welfare associations are keeping their neighborhoods clean.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between text-left hover:border-emerald-300 transition-colors"
          >
            <div>
              {/* Top Row: Stars & Turnaround */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  {t.timeframe}
                </span>
              </div>

              {/* Quote */}
              <p className="text-xs text-slate-700 leading-relaxed italic mb-4">
                "{t.quote}"
              </p>
            </div>

            {/* Author Details */}
            <div className="pt-3 border-t border-slate-100">
              <div className="font-bold text-xs text-slate-900">{t.name}</div>
              <div className="text-[11px] text-slate-500">{t.role}</div>
              <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-medium mt-1">
                <MapPin className="w-3 h-3" />
                <span>{t.location} ({t.ward})</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
