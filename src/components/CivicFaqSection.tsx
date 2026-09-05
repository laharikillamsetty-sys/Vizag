import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
  category: string;
}

const FAQS: FaqItem[] = [
  {
    category: "Response Times & SLAs",
    q: "What is the official GVMC turnaround time for a reported issue?",
    a: "Under the GVMC Citizen's Charter, minor plastic litter and community bin overflows are cleared within 2 to 4 hours of verification. Blocked stormwater drains requiring suction desilting machines or commercial debris dumps are addressed within 12 to 24 hours. You receive live SMS and in-app notifications at every stage.",
  },
  {
    category: "Reporting & Anonymity",
    q: "Do I need to sign up or log in to report a sanitation issue?",
    a: "No. You can report immediately as a guest citizen! Once submitted, you receive a unique Complaint ID (e.g., CC-2026-042) that you can search anytime on the \"Track Complaint\" page without logging in. Logging in simply allows you to track all your historical reports and receive in-app alerts.",
  },
  {
    category: "AI Image Verification",
    q: "How does the Gemini Vision AI verify the complaint photo?",
    a: "CleanCity uses multimodal vision AI to analyze the photo in real time. It confirms the presence of actual municipal solid waste (plastics, organic waste, blocked silt, or demolition debris), estimates the severity level (High, Medium, Low), and recommends the appropriate cleanup equipment (such as a 2.5-ton compactor truck or manual desilting squad). Non-sanitation photos are automatically flagged.",
  },
  {
    category: "Jurisdiction & Private Plots",
    q: "What happens if the garbage is dumped on an empty private plot?",
    a: "GVMC issues an immediate statutory notice to the registered vacant plot owner under the Andhra Pradesh Municipalities Act to clear the perimeter within 48 hours. If unattended, the municipal sanitary squad executes emergency clearance to prevent disease outbreak and levies penalty charges to the property tax account.",
  },
  {
    category: "Privacy & Safety",
    q: "Is my personal contact information visible to the public?",
    a: "No. Your phone number and email are kept strictly confidential and are only accessible by the authorized GVMC Ward Sanitary Inspector if they require landmark clarification during field dispatch.",
  },
];

export const CivicFaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-1 border border-emerald-200">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
          Citizen Knowledge Base
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
          Frequently Asked Questions
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Everything you need to know about municipal complaint resolution, SLAs, and AI verification.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {FAQS.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className={`rounded-xl border transition-colors text-left overflow-hidden ${
                isOpen ? 'border-emerald-400 bg-emerald-50/20' : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFaq(i)}
                className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left font-bold text-xs sm:text-sm text-slate-900 focus:outline-hidden"
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>{faq.q}</span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-emerald-700 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-emerald-100/60">
                  <p>{faq.a}</p>
                  <div className="mt-2 text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Verified under GVMC Solid Waste Management By-Laws
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
