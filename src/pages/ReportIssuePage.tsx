import React, { useState } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  MapPin,
  CheckCircle,
  AlertCircle,
  X,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react';
import { ComplaintCategory, ComplaintPriority, AIAnalysisResult, UserProfile, Complaint } from '../types.ts';
import { api } from '../services/api.ts';

interface ReportIssuePageProps {
  currentUser: UserProfile | null;
  onComplaintSubmitted: (complaint: Complaint) => void;
  onNavigate: (view: string) => void;
  onRequireLogin: () => void;
}

const CATEGORIES: ComplaintCategory[] = [
  'Garbage Overflow',
  'Illegal Dumping',
  'Blocked Drain',
  'Plastic Waste',
  'Unclean Public Space',
  'Other',
];

// Sample images for 1-click test simulation
const SAMPLE_PRESETS = [
  {
    name: 'College Bin Overflow',
    url: 'https://images.unsplash.com/photo-1611288875785-5a503e91d643?auto=format&fit=crop&w=800&q=80',
    category: 'Garbage Overflow' as ComplaintCategory,
    desc: 'Public bins outside college canteen overflowing with plastic food boxes and paper cups.',
    loc: 'SITAM Engineering College, Canteen Square',
  },
  {
    name: 'Blocked Storm Drain',
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    category: 'Blocked Drain' as ComplaintCategory,
    desc: 'Roadside drain choked with solid sediment and discarded packaging; dark stagnant water causing foul odor.',
    loc: 'Opposite Government High School, Gajuwaka',
  },
  {
    name: 'Plastic Beach Litter',
    url: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80',
    category: 'Plastic Waste' as ComplaintCategory,
    desc: 'Dense scatter of plastic beverage bottles and snack packaging left along the coastal pavement.',
    loc: 'Promenade Strip, Beach Road',
  },
];

export const ReportIssuePage: React.FC<ReportIssuePageProps> = ({
  currentUser,
  onComplaintSubmitted,
  onNavigate,
  onRequireLogin,
}) => {
  const [category, setCategory] = useState<ComplaintCategory>('Garbage Overflow');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [coords, setCoords] = useState<{ lat?: number; lng?: number }>({});
  const [locationLoading, setLocationLoading] = useState(false);

  // Image state
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageBase64, setImageBase64] = useState<string>('');
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');

  // AI state
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Guest reporter details (for unauthenticated citizens)
  const [guestName, setGuestName] = useState('Priya Sharma');
  const [guestPhone, setGuestPhone] = useState('+91 98480 22338');
  const [guestEmail, setGuestEmail] = useState('priya.citizen@vizag.gov.in');

  // Handle image upload from file picker
  const handleImageFile = (file: File) => {
    // Validate format
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setFormError('Please upload a valid image file (JPG, JPEG, PNG, WEBP).');
      return;
    }

    // Validate size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      setFormError('Image file size exceeds 8MB limit. Please choose a smaller photo.');
      return;
    }

    setFormError(null);
    setImageMimeType(file.type);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);
      setImageBase64(dataUrl);

      // Auto trigger AI if description exists
      if (description.trim().length >= 5) {
        runAIAnalysis(dataUrl, file.type, description);
      }
    };
    reader.readAsDataURL(file);
  };

  // Browser Geolocation
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setFormError('Geolocation is not supported by your browser.');
      return;
    }

    setLocationLoading(true);
    setFormError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationLoading(false);
        const lat = Number(pos.coords.latitude.toFixed(5));
        const lng = Number(pos.coords.longitude.toFixed(5));
        setCoords({ lat, lng });
        if (!location) {
          setLocation(`Wards Near GPS: ${lat}° N, ${lng}° E`);
        }
      },
      (err) => {
        setLocationLoading(false);
        let msg = 'Unable to fetch browser location. You can enter location manually.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Location permission denied. Please enter the problem location manually.';
        }
        setFormError(msg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Run AI Analysis
  const runAIAnalysis = async (imgData?: string, mime?: string, desc?: string) => {
    const textToAnalyze = desc || description;
    const imgToAnalyze = imgData || imageBase64;

    if (!textToAnalyze && !imgToAnalyze) {
      setAiError('Please provide a brief description or photo before running AI analysis.');
      return;
    }

    try {
      setAiAnalyzing(true);
      setAiError(null);

      const result = await api.analyzeIssue({
        description: textToAnalyze || 'Sanitation issue in public area',
        imageBase64: imgToAnalyze,
        imageMimeType: mime || imageMimeType,
        location,
        categoryHint: category,
      });

      setAiResult(result);
      // Synchronize category
      if (result.category) {
        setCategory(result.category);
      }
    } catch (err: any) {
      console.warn('AI analysis notice:', err);
      // Fallback result will be automatically provided by server, but if network completely fails:
      setAiResult({
        category: category || 'Garbage Overflow',
        priority: 'Medium',
        confidence: 0.85,
        reason: 'Automated fallback evaluation for civic complaint.',
        recommendedAction: 'Inspect and clear sanitation site.',
      });
    } finally {
      setAiAnalyzing(false);
    }
  };

  // Submit Complaint
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      setFormError('Please enter a description of the sanitation problem.');
      return;
    }

    if (!location.trim()) {
      setFormError('Please specify the location or use the GPS button.');
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);

      // If AI wasn't run yet, run rule-based or server analysis
      let priority: ComplaintPriority = aiResult?.priority || 'Medium';
      let confidence = aiResult?.confidence || 0.9;
      let reason = aiResult?.reason || 'Identified public sanitation concern.';
      let action = aiResult?.recommendedAction || 'Schedule municipal sanitation clearance.';

      const finalImageUrl =
        imagePreview ||
        'https://images.unsplash.com/photo-1611288875785-5a503e91d643?auto=format&fit=crop&w=800&q=80';

      const reporterId = currentUser ? currentUser.id : `guest-${Date.now().toString(36)}`;
      const reporterName = currentUser ? currentUser.full_name : (guestName.trim() || 'Citizen Guest');
      const reporterEmail = currentUser ? currentUser.email : (guestEmail.trim() || 'citizen.guest@visakhapatnam.gov.in');

      const response = await api.submitComplaint({
        user_id: reporterId,
        user_name: reporterName,
        user_email: reporterEmail,
        image_url: finalImageUrl,
        description: description.trim(),
        location: location.trim(),
        latitude_optional: coords.lat,
        longitude_optional: coords.lng,
        category,
        priority,
        confidence,
        ai_reason: reason,
        recommended_action: action,
      });

      setSubmittedComplaint(response.complaint);
      onComplaintSubmitted(response.complaint);
    } catch (err: any) {
      setFormError(err.message || 'Unable to submit complaint. Please check connection.');
    } finally {
      setSubmitting(false);
    }
  };

  // Reset Form
  const handleReset = () => {
    setSubmittedComplaint(null);
    setDescription('');
    setLocation('');
    setCoords({});
    setImagePreview('');
    setImageBase64('');
    setAiResult(null);
    setFormError(null);
  };

  // -------------------------------------------------------------
  // SUCCESS VIEW (Section 9 Feature 1)
  // -------------------------------------------------------------
  if (submittedComplaint) {
    return (
      <div id="complaint-submission-success-view" className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl p-8 border border-emerald-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
            <CheckCircle className="w-9 h-9" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Complaint Submitted Successfully!
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Your civic sanitation report has been logged in the municipal database and assigned a tracking ID.
            </p>
          </div>

          {/* Key Confirmation Card */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-5 text-left space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-200/80 pb-3">
              <span className="text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                Complaint ID
              </span>
              <span className="font-mono text-base font-extrabold text-emerald-800 bg-white px-3 py-1 rounded-md border border-emerald-300">
                {submittedComplaint.complaint_id}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Category:</span>
                <span className="font-bold text-slate-800">{submittedComplaint.category}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Priority:</span>
                <span
                  className={`font-bold inline-block px-2 py-0.5 rounded text-[11px] ${
                    submittedComplaint.priority === 'High'
                      ? 'bg-rose-100 text-rose-800'
                      : submittedComplaint.priority === 'Medium'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {submittedComplaint.priority}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Location:</span>
                <span className="font-medium text-slate-800 line-clamp-1">
                  {submittedComplaint.location}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Initial Status:</span>
                <span className="font-bold text-emerald-700">REPORTED</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('track-complaint')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2"
            >
              Track This Complaint <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-5 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Report Another Issue
            </button>
            <button
              onClick={() => onNavigate('citizen-dashboard')}
              className="w-full sm:w-auto px-5 py-3 rounded-xl text-sm font-semibold text-emerald-800 hover:bg-emerald-50 transition-colors"
            >
              View My Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // REPORT FORM
  // -------------------------------------------------------------
  return (
    <div id="report-issue-page-container" className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
          Citizen Reporting Portal
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
          Report a Sanitation Problem
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Upload a photo, describe the situation, and let CleanCity AI assist in routing to sanitation authorities.
        </p>
      </div>

      {formError && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          {formError}
        </div>
      )}

      {/* Quick Test Presets for CSE Viva/Demonstration */}
      <div className="mb-8 bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Instant Demo Presets (Click to autofill for testing)
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">1-Click CSE Test Data</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {SAMPLE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setImagePreview(preset.url);
                setImageBase64(preset.url);
                setDescription(preset.desc);
                setLocation(preset.loc);
                setCategory(preset.category);
                runAIAnalysis(preset.url, 'image/jpeg', preset.desc);
              }}
              className="text-left p-2.5 bg-white border border-emerald-200 rounded-lg hover:border-emerald-500 hover:shadow-xs transition-all text-xs"
            >
              <div className="font-bold text-slate-800">{preset.name}</div>
              <div className="text-[11px] text-emerald-700 truncate">{preset.category}</div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Citizen Reporter Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          {currentUser ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  {currentUser.full_name[0]}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider block">
                    Verified Citizen Profile
                  </span>
                  <div className="font-bold text-slate-900 text-sm">{currentUser.full_name}</div>
                  <span className="text-slate-500 text-[11px]">{currentUser.email} • {currentUser.phone || '+91 98480 22338'}</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold self-start sm:self-auto">
                Ward Resident
              </span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider block">
                    Citizen Reporter Contact
                  </span>
                  <p className="text-xs text-slate-600">
                    No sign-in required. Enter your details so the Ward Sanitary Inspector can notify you on resolution.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onRequireLogin}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline self-start sm:self-auto"
                >
                  Already have an account? Sign In &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g., Priya Sharma"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Mobile Number (For WhatsApp / SMS alerts)
                  </label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="e.g., +91 98480 22338"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step 1: Photo Upload */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-600" />
              1. Upload Sanitation Photo <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs text-slate-400">JPG, PNG, WEBP (Max 8MB)</span>
          </div>

          {imagePreview ? (
            <div className="relative rounded-xl overflow-hidden border border-slate-200 max-w-md aspect-16/10 bg-slate-100">
              <img
                src={imagePreview}
                alt="Sanitation Issue"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview('');
                  setImageBase64('');
                  setAiResult(null);
                }}
                className="absolute top-3 right-3 p-1.5 bg-slate-900/70 text-white rounded-full hover:bg-slate-900 transition-colors"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-emerald-500 transition-colors bg-slate-50/50">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700">
                Click to browse or drag & drop a photo of the sanitation problem
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Clear photos help AI analyze severity and assign field crews
              </p>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleImageFile(e.target.files[0]);
                  }
                }}
                className="mt-4 text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Step 2: Description & Category */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <label className="text-sm font-bold text-slate-900 block">
            2. Problem Category & Description <span className="text-rose-500">*</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border text-left transition-colors ${
                  category === cat
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what is visible, e.g. Overflowing garbage bins with stray animals, drain clogged with bottles causing flooding..."
              className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
              <span>Be specific to assist sanitation workers</span>
              <span>{description.length} characters</span>
            </div>
          </div>
        </div>

        {/* Step 3: Location */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              3. Problem Location <span className="text-rose-500">*</span>
            </label>
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={locationLoading}
              className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${locationLoading ? 'animate-spin' : ''}`} />
              {locationLoading ? 'Detecting...' : 'Use My GPS Location'}
            </button>
          </div>

          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Street address, nearby landmark, college gate, or ward name"
            className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />

          {coords.lat && coords.lng && (
            <p className="text-[11px] text-emerald-800 font-mono bg-emerald-50 p-2 rounded-lg border border-emerald-200">
              ✓ Geolocation captured: {coords.lat}° N, {coords.lng}° E
            </p>
          )}

          {/* Quick Landmark Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[11px] text-slate-400 self-center mr-1">Quick landmarks:</span>
            {['SITAM College South Gate', 'MVP Colony Main Market', 'Beach Road Promenade', 'Gajuwaka Junction'].map(
              (lm) => (
                <button
                  key={lm}
                  type="button"
                  onClick={() => setLocation(lm)}
                  className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 rounded-md border border-slate-200 transition-colors"
                >
                  {lm}
                </button>
              )
            )}
          </div>
        </div>

        {/* Step 4: AI Analysis Block */}
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                4. AI Sanitation Assessment (Gemini 3.8 Flash)
              </h3>
              <p className="text-xs text-emerald-800/80 mt-0.5">
                Automatically scans your photo and description to determine category and priority.
              </p>
            </div>
            <button
              type="button"
              onClick={() => runAIAnalysis()}
              disabled={aiAnalyzing}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${aiAnalyzing ? 'animate-spin' : ''}`} />
              {aiAnalyzing ? 'Analyzing Image...' : 'Run AI Analysis'}
            </button>
          </div>

          {aiError && (
            <p className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
              {aiError}
            </p>
          )}

          {aiResult && (
            <div className="bg-white rounded-xl p-4 border border-emerald-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Suggested Category:</span>
                  <span className="font-bold text-xs text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                    {aiResult.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Priority Level:</span>
                  <span
                    className={`font-bold text-xs px-2.5 py-0.5 rounded-md ${
                      aiResult.priority === 'High'
                        ? 'bg-rose-100 text-rose-800'
                        : aiResult.priority === 'Medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {aiResult.priority}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    ({(aiResult.confidence * 100).toFixed(0)}% confidence)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="font-semibold text-slate-600 block text-[11px]">AI Reasoning:</span>
                  <p className="text-slate-800 mt-0.5 leading-relaxed">{aiResult.reason}</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-600 block text-[11px]">
                    Recommended Action:
                  </span>
                  <p className="text-emerald-900 font-medium mt-0.5 leading-relaxed">
                    {aiResult.recommendedAction}
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-emerald-800/80 bg-emerald-50 p-2 rounded-lg flex items-start gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Advisory notice:</strong> AI priority is only an automated recommendation
                  to assist municipal teams, not an official government determination.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Submit Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <div className="text-xs text-slate-500">
            Complaints are publicly trackable and sent directly to sanitation dispatch.
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? 'Submitting to Database...' : 'Submit Sanitation Complaint'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
