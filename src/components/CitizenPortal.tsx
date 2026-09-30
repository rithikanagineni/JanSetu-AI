import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Building,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Volume2,
  FileText,
  HelpCircle,
  Compass,
} from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { CitizenRequest, RequestCluster, GapIndicatorBreakdown, UserAccount } from '../types';

interface CitizenPortalProps {
  language: string;
  setLanguage: (lang: string) => void;
  onNavigateToTrack: (requestId?: string) => void;
  currentUser?: UserAccount | null;
}

export const CitizenPortal: React.FC<CitizenPortalProps> = ({
  language,
  setLanguage,
  onNavigateToTrack,
  currentUser,
}) => {
  const [complaintText, setComplaintText] = useState('');
  const [locationText, setLocationText] = useState('');
  const [district, setDistrict] = useState('Mahabubnagar');
  const [state, setState] = useState('Telangana');
  const [category, setCategory] = useState('Healthcare');

  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Result state after submission
  const [submissionResult, setSubmissionResult] = useState<{
    request: CitizenRequest;
    ai_analysis: Record<string, unknown>;
    similarity: {
      similar_requests_count: number;
      matched_cluster: RequestCluster | null;
      top_similar_requests: Array<{
        request_id: string;
        issue: string;
        location: string;
        similarity_score: number;
        original_text: string;
      }>;
    };
    gap_analysis: GapIndicatorBreakdown;
  } | null>(null);

  // Pre-populate location and language from logged-in citizen
  useEffect(() => {
    if (currentUser) {
      if (currentUser.villageOrCity && !locationText) {
        setLocationText(currentUser.villageOrCity);
      }
      if (currentUser.district) {
        setDistrict(currentUser.district);
      }
      if (currentUser.state) {
        setState(currentUser.state);
      }
      if (currentUser.preferredLanguage) {
        setLanguage(currentUser.preferredLanguage);
      }
    }
  }, [currentUser]);

  // Quick demonstration presets directly matching the hackathon prompt
  const demoScenarios = [
    {
      title: 'Telugu — Hospital Access (Hackathon Scenario)',
      lang: 'Telugu',
      cat: 'Healthcare',
      district: 'Mahabubnagar',
      state: 'Telangana',
      location: 'Bhoothpur Rural',
      text: 'మా గ్రామంలో సరైన ఆసుపత్రి లేదు. చికిత్స కోసం 20 కిలోమీటర్లు ప్రయాణించాలి.',
      badge: 'Hackathon Test Case',
    },
    {
      title: 'English — 20km Hospital Commute',
      lang: 'English',
      cat: 'Healthcare',
      district: 'Mahabubnagar',
      state: 'Telangana',
      location: 'Midjil Mandal',
      text: 'Our village does not have a proper hospital. We have to travel 20 km for treatment.',
      badge: 'Primary Benchmark',
    },
    {
      title: 'Hindi — Sonbhadra PHC Deficit',
      lang: 'Hindi',
      cat: 'Healthcare',
      district: 'Sonbhadra',
      state: 'Uttar Pradesh',
      location: 'Dudhi Habitation',
      text: 'हमारे गांव में प्राथमिक स्वास्थ्य केंद्र नहीं है। इलाज के लिए 25 किलोमीटर दूर जाना पड़ता है।',
      badge: 'Multilingual Test',
    },
    {
      title: 'Telugu — Drinking Water Pipeline Failure',
      lang: 'Telugu',
      cat: 'Water',
      district: 'Mahabubnagar',
      state: 'Telangana',
      location: 'Koilkonda',
      text: 'మా గ్రామంలో తాగునీటి సరఫరా సరిగ్గా లేదు, ప్రతిరోజూ నీటికోసం దూరంగా వెళ్లాల్సి వస్తోంది.',
      badge: 'Water Sector',
    },
    {
      title: 'English — Rural Road Bridge Cutoff',
      lang: 'English',
      cat: 'Roads',
      district: 'Gadchiroli',
      state: 'Maharashtra',
      location: 'Bhamragad Block',
      text: 'Main approach road washed away during monsoon, buses cannot reach the village school.',
      badge: 'Roads Sector',
    },
  ];

  // Speech Recognition (Web Speech API with graceful fallback to transcription API)
  const handleToggleVoice = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    // Try Web Speech API in browser
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang =
          language === 'Telugu' ? 'te-IN' : language === 'Hindi' ? 'hi-IN' : 'en-IN';
        recognition.continuous = false;
        recognition.interimResults = false;

        setIsRecording(true);

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setComplaintText(transcript);
          setIsRecording(false);
        };

        recognition.onerror = () => {
          // If browser speech fails or is not permitted, load the demo transcript for the active language
          loadDemoVoicePreset();
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.start();
        return;
      } catch (err) {
        console.warn('Web Speech API initialization failed, using demo fallback:', err);
      }
    }

    // Fallback: load demo voice preset
    loadDemoVoicePreset();
  };

  const loadDemoVoicePreset = async () => {
    setIsRecording(true);
    setTimeout(async () => {
      try {
        const preset =
          language === 'Telugu'
            ? 'telugu-hospital'
            : language === 'Hindi'
            ? 'hindi-hospital'
            : 'english-hospital';

        const result = await apiClient.transcribeAudio({ preset });
        setComplaintText(result.text);
      } catch (err) {
        setComplaintText('మా గ్రామంలో సరైన ఆసుపత్రి లేదు. చికిత్స కోసం 20 కిలోమీటర్లు ప్రయాణించాలి.');
      } finally {
        setIsRecording(false);
      }
    }, 900);
  };

  const handleSelectScenario = (scenario: typeof demoScenarios[0]) => {
    setLanguage(scenario.lang);
    setCategory(scenario.cat);
    setDistrict(scenario.district);
    setState(scenario.state);
    setLocationText(scenario.location);
    setComplaintText(scenario.text);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintText.trim()) {
      setErrorMsg('Please enter or speak your civic complaint text.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const response = await apiClient.submitRequest({
        text: complaintText.trim(),
        language,
        location: locationText.trim() || undefined,
        district,
        state,
        category,
        submission_channel: isRecording ? 'Voice' : 'Web Portal',
        citizen_id: currentUser?.id,
      });

      setSubmissionResult(response);
    } catch (err: unknown) {
      console.error('Submission failed:', err);
      setErrorMsg('Failed to process complaint with AI. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmissionResult(null);
    setComplaintText('');
    setLocationText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Platform Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-6 sm:p-10 shadow-xl border border-blue-900/40 relative overflow-hidden mb-8">
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-4 border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            Citizen Voice & Needs Ingestion Layer
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            JanSetu AI
          </h1>
          <p className="text-lg text-blue-200 font-semibold mt-1">
            “Your voice. Your needs. Better-informed decisions.”
          </p>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            An AI-powered civic intelligence platform that transforms multilingual citizen feedback
            into structured insights, demand clusters, and explainable evidence for public decision-makers.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={() => {
                document.getElementById('complaint-form-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-md hover:shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Submit a Request
            </button>
            <button
              onClick={() => onNavigateToTrack()}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Clock className="w-4 h-4" />
              Track My Request
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Form / Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="complaint-form-section">
        {/* Left Column: Input Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-600" />
                  Submit Civic Request or Grievance
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Voice or text input in English, Telugu (తెలుగు), or Hindi (हिंदी)
                </p>
              </div>

              {/* Language Selector in Card */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                {(['English', 'Telugu', 'Hindi'] as const).map(lang => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                      language === lang
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {lang === 'Telugu' ? 'తెలుగు' : lang === 'Hindi' ? 'हिंदी' : 'English'}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Demo Scenarios Selector */}
            <div className="mb-6 bg-slate-50 border border-slate-200/80 rounded-lg p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Quick Hackathon Scenarios (Click to auto-populate)
                </span>
                <span className="text-[11px] text-slate-400">1-Click Evaluation</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {demoScenarios.slice(0, 4).map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectScenario(s)}
                    className="text-left p-2 rounded-md bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all group"
                  >
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-800">
                      <span className="truncate pr-1 group-hover:text-blue-600">{s.title}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 font-mono">
                        {s.district}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-1 italic">
                      "{s.text}"
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Complaint Text Area */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Citizen Statement (Voice or Text)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleToggleVoice}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        isRecording
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                      }`}
                    >
                      {isRecording ? (
                        <>
                          <MicOff className="w-3.5 h-3.5" />
                          <span>Listening...</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-3.5 h-3.5 text-blue-600" />
                          <span>Voice Input</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    rows={4}
                    value={complaintText}
                    onChange={e => setComplaintText(e.target.value)}
                    placeholder={
                      language === 'Telugu'
                        ? 'ఉదాహరణ: మా గ్రామంలో సరైన ఆసుపత్రి లేదు. చికిత్స కోసం 20 కిలోమీటర్లు ప్రయాణించాలి.'
                        : language === 'Hindi'
                        ? 'उदाहरण: हमारे गांव में प्राथमिक स्वास्थ्य केंद्र नहीं है। इलाज के लिए 25 किलोमीटर दूर जाना पड़ता है।'
                        : 'Example: Our village does not have a proper hospital. We have to travel 20 km for treatment.'
                    }
                    className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                  />
                  <div className="absolute right-3 bottom-3 text-[11px] text-slate-400">
                    {complaintText.length} chars
                  </div>
                </div>
              </div>

              {/* Geographic & Sector Context */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Specific Habitation / Village
                  </label>
                  <input
                    type="text"
                    value={locationText}
                    onChange={e => setLocationText(e.target.value)}
                    placeholder="e.g. Bhoothpur Rural"
                    className="w-full text-xs rounded-md border border-slate-300 p-2 focus:border-blue-600 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    District
                  </label>
                  <select
                    value={district}
                    onChange={e => {
                      setDistrict(e.target.value);
                      if (e.target.value === 'Sonbhadra') setState('Uttar Pradesh');
                      else if (e.target.value === 'Gadchiroli') setState('Maharashtra');
                      else if (e.target.value === 'Kurnool') setState('Andhra Pradesh');
                      else setState('Telangana');
                    }}
                    className="w-full text-xs rounded-md border border-slate-300 p-2 focus:border-blue-600 focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="Mahabubnagar">Mahabubnagar (Telangana)</option>
                    <option value="Warangal">Warangal (Telangana)</option>
                    <option value="Nalgonda">Nalgonda (Telangana)</option>
                    <option value="Kurnool">Kurnool (Andhra Pradesh)</option>
                    <option value="Gadchiroli">Gadchiroli (Maharashtra)</option>
                    <option value="Sonbhadra">Sonbhadra (Uttar Pradesh)</option>
                    <option value="Raichur">Raichur (Karnataka)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sector (Optional Hint)
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full text-xs rounded-md border border-slate-300 p-2 focus:border-blue-600 focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="Healthcare">Healthcare</option>
                    <option value="Water">Water</option>
                    <option value="Roads">Roads & Bridges</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Education">Education</option>
                    <option value="Public Transport">Public Transport</option>
                    <option value="Sanitation">Sanitation</option>
                  </select>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Gemini API normalizes vernacular text to civic ontology
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Analyzing with Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit & Analyze</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: AI Analysis & Confirmation Card (5 cols) */}
        <div className="lg:col-span-5">
          {submissionResult ? (
            <div className="bg-white rounded-xl shadow-md border-2 border-blue-600/40 p-6 sm:p-7 space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Header: Request ID & Verification */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      Request Recorded
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      {submissionResult.request.request_id}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1.5">
                    Gemini AI Structured Analysis
                  </h3>
                </div>
                <button
                  onClick={resetForm}
                  className="text-xs text-slate-400 hover:text-slate-600 font-medium underline"
                >
                  New Request
                </button>
              </div>

              {/* Extracted Structured Metadata Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Detected Language
                  </span>
                  <span className="font-semibold text-slate-800">
                    {submissionResult.request.language}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Civic Category
                  </span>
                  <span className="font-semibold text-blue-700">
                    {submissionResult.request.category}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Urgency Tier
                  </span>
                  <span
                    className={`font-bold inline-block px-1.5 py-0.2 rounded text-[11px] ${
                      submissionResult.request.urgency === 'High'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {submissionResult.request.urgency} Urgency
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Reported Distance
                  </span>
                  <span className="font-semibold text-slate-800">
                    {submissionResult.request.travel_distance_km !== null
                      ? `${submissionResult.request.travel_distance_km} km travel`
                      : 'Not stated'}
                  </span>
                </div>
              </div>

              {/* Extracted Core Issue */}
              <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100">
                <span className="text-[10px] uppercase font-bold text-blue-600 block mb-1">
                  Identified Core Need
                </span>
                <p className="text-xs font-semibold text-slate-900">
                  {submissionResult.request.issue}
                </p>
                <p className="text-[11px] text-slate-600 mt-1">
                  Requested Service:{' '}
                  <strong className="text-blue-900">
                    {submissionResult.request.requested_service}
                  </strong>
                </p>
              </div>

              {/* AI Summary */}
              <div>
                <span className="text-[11px] font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  Gemini Lived-Experience Summary
                </span>
                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-md border border-slate-100 italic">
                  "{submissionResult.request.summary}"
                </p>
              </div>

              {/* Similarity & Demand Cluster Context */}
              <div className="p-3.5 rounded-lg bg-slate-900 text-white space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Aggregated Demand Cluster</span>
                  <span className="font-bold text-amber-400">
                    {submissionResult.similarity.similar_requests_count.toLocaleString()} Similar Requests
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-100">
                  {submissionResult.similarity.matched_cluster?.cluster_name ||
                    'Rural Healthcare Access - District Cluster'}
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-slate-800">
                  <span>Prototype Gap Indicator:</span>
                  <span className="font-bold text-rose-400">
                    {submissionResult.gap_analysis.gap_score}/100 ({submissionResult.gap_analysis.gap_level})
                  </span>
                </div>
              </div>

              {/* Action Buttons: Track Request or Submit Another Request */}
              <div className="space-y-2">
                <button
                  onClick={() =>
                    onNavigateToTrack(submissionResult.request.request_id)
                  }
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Track Request Progress ({submissionResult.request.request_id})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={resetForm}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5 text-slate-500" />
                  <span>Submit Another Civic Request</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-xl border border-dashed border-slate-300 p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  AI Real-Time Processing Preview
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Submit any citizen feedback on the left to watch Gemini extract structured entities,
                  cluster with identical requests, and calculate the prototype infrastructure gap.
                </p>
              </div>

              <div className="pt-2 text-left bg-white p-3 rounded-lg border border-slate-200 text-[11px] space-y-1.5 text-slate-600">
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  <span>Multilingual normalization (Telugu/Hindi/English)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  <span>Automated distance & urgency detection</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  <span>Direct association with district clusters</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
