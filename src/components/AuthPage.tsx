import React, { useState } from 'react';
import {
  Building2,
  UserCheck,
  ArrowLeft,
  Lock,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  User,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Compass,
} from 'lucide-react';
import { UserAccount } from '../types';
import { authService, DEMO_CITIZENS, DEMO_OFFICERS } from '../services/authService';

interface AuthPageProps {
  initialPortal?: 'citizen' | 'governance';
  onBackToHome: () => void;
  onAuthSuccess: (user: UserAccount) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialPortal = 'citizen',
  onBackToHome,
  onAuthSuccess,
}) => {
  const [selectedPortal, setSelectedPortal] = useState<'citizen' | 'governance'>(initialPortal);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Citizen Form State
  const [citizenIdentifier, setCitizenIdentifier] = useState('9848022334'); // Ramesh default
  const [citizenPassword, setCitizenPassword] = useState('password123');
  const [citizenName, setCitizenName] = useState('');
  const [citizenVillage, setCitizenVillage] = useState('');
  const [citizenDistrict, setCitizenDistrict] = useState('Mahabubnagar');
  const [citizenState, setCitizenState] = useState('Telangana');
  const [citizenLanguage, setCitizenLanguage] = useState('Telugu');

  // Governance Form State
  const [officerEmail, setOfficerEmail] = useState('v.rao@telangana.gov.in'); // Dr Rao default
  const [officerPassword, setOfficerPassword] = useState('admin123');
  const [officerName, setOfficerName] = useState('');
  const [officerDept, setOfficerDept] = useState('District Administration & Planning');
  const [officerDesignation, setOfficerDesignation] = useState('District Magistrate & Collector');
  const [officerJurisdiction, setOfficerJurisdiction] = useState('Mahabubnagar District');
  const [officerDistrict, setOfficerDistrict] = useState('Mahabubnagar');
  const [officerState, setOfficerState] = useState('Telangana');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quick 1-Click Demo Citizen Login
  const handleQuickCitizenLogin = (citizen: UserAccount) => {
    authService.setCurrentUser(citizen);
    onAuthSuccess(citizen);
  };

  // Quick 1-Click Demo Officer Login
  const handleQuickOfficerLogin = (officer: UserAccount) => {
    authService.setCurrentUser(officer);
    onAuthSuccess(officer);
  };

  // Citizen Submit
  const handleCitizenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (authMode === 'signin') {
      if (!citizenIdentifier.trim()) {
        setErrorMsg('Please enter your mobile number or email address.');
        return;
      }
      const user = authService.loginCitizen(citizenIdentifier.trim());
      onAuthSuccess(user);
    } else {
      if (!citizenName.trim() || !citizenIdentifier.trim()) {
        setErrorMsg('Please enter your name and mobile number or email.');
        return;
      }
      const user = authService.registerCitizen({
        name: citizenName.trim(),
        emailOrPhone: citizenIdentifier.trim(),
        villageOrCity: citizenVillage.trim() || 'Local Ward',
        district: citizenDistrict,
        state: citizenState,
        preferredLanguage: citizenLanguage,
      });
      onAuthSuccess(user);
    }
  };

  // Governance Submit
  const handleOfficerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (authMode === 'signin') {
      if (!officerEmail.trim()) {
        setErrorMsg('Please enter your official email or officer ID.');
        return;
      }
      const user = authService.loginOfficer(officerEmail.trim());
      onAuthSuccess(user);
    } else {
      if (!officerName.trim() || !officerEmail.trim()) {
        setErrorMsg('Please enter officer name and government email address.');
        return;
      }
      const user = authService.registerOfficer({
        name: officerName.trim(),
        emailOrPhone: officerEmail.trim(),
        department: officerDept,
        designation: officerDesignation,
        jurisdiction: officerJurisdiction,
        district: officerDistrict,
        state: officerState,
      });
      onAuthSuccess(user);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Header & Back Button */}
      <div className="max-w-4xl mx-auto w-full mb-6 flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-200/60 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Secure JanSetu Authentication</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign In or Sign Up to JanSetu AI
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Choose whether you are accessing the <strong>Citizen Civic Portal</strong> to submit and track needs,
            or the <strong>Governance Portal</strong> for public decision support.
          </p>
        </div>

        {/* 1. Master Portal Chooser Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card A: Citizen Portal Selection */}
          <div
            onClick={() => {
              setSelectedPortal('citizen');
              setErrorMsg(null);
            }}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
              selectedPortal === 'citizen'
                ? 'bg-emerald-50/80 border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                selectedPortal === 'citizen'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <UserCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                  PORTAL 1
                </span>
                {selectedPortal === 'citizen' && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                )}
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Citizen Civic Portal
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                For community members to voice local development needs, report deficits, and track submissions.
              </p>
            </div>
          </div>

          {/* Card B: Governance Portal Selection */}
          <div
            onClick={() => {
              setSelectedPortal('governance');
              setErrorMsg(null);
            }}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
              selectedPortal === 'governance'
                ? 'bg-blue-50/80 border-blue-600 shadow-md ring-2 ring-blue-500/20'
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                selectedPortal === 'governance'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Building2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700">
                  PORTAL 2
                </span>
                {selectedPortal === 'governance' && (
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                )}
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Governance Portal
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                For authorized officials, district collectors, and public planners analyzing civic demand.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Authentication Container for Selected Portal */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          {/* Mode Switcher: Sign In vs Sign Up */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                {selectedPortal === 'citizen' ? (
                  <>
                    <UserCheck className="w-5 h-5 text-emerald-600" />
                    <span>Citizen Portal Authentication</span>
                  </>
                ) : (
                  <>
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <span>Governance Official Authentication</span>
                  </>
                )}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedPortal === 'citizen'
                  ? 'Access your private citizen intake form and request history.'
                  : 'Access district intelligence, demand clusters, and policy memos.'}
              </p>
            </div>

            <div className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setAuthMode('signin')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  authMode === 'signin'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  authMode === 'signup'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Quick 1-Click Demo Profiles Strip */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              1-Click Demo Profiles (For Instant Hackathon Evaluation):
            </span>

            {selectedPortal === 'citizen' ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                {DEMO_CITIZENS.map(cit => (
                  <button
                    key={cit.id}
                    type="button"
                    onClick={() => handleQuickCitizenLogin(cit)}
                    className="p-2.5 bg-white hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 rounded-lg text-left transition-all text-xs space-y-0.5 cursor-pointer shadow-2xs group"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 group-hover:text-emerald-700">
                        {cit.name}
                      </strong>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded">
                        {cit.preferredLanguage}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {cit.villageOrCity}, {cit.district}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                {DEMO_OFFICERS.map(officer => (
                  <button
                    key={officer.id}
                    type="button"
                    onClick={() => handleQuickOfficerLogin(officer)}
                    className="p-2.5 bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 rounded-lg text-left transition-all text-xs space-y-0.5 cursor-pointer shadow-2xs group"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 group-hover:text-blue-700">
                        {officer.name}
                      </strong>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded">
                        {officer.district}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">
                      {officer.designation}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Form Error Banner */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Active Portal Form */}
          {selectedPortal === 'citizen' ? (
            /* CITIZEN FORM */
            <form onSubmit={handleCitizenSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Citizen Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={citizenName}
                      onChange={e => setCitizenName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Village / Locality *
                    </label>
                    <input
                      type="text"
                      required
                      value={citizenVillage}
                      onChange={e => setCitizenVillage(e.target.value)}
                      placeholder="e.g. Bhoothpur Village"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      District & State *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={citizenDistrict}
                        onChange={e => setCitizenDistrict(e.target.value)}
                        className="text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="Mahabubnagar">Mahabubnagar</option>
                        <option value="Warangal">Warangal</option>
                        <option value="Sonbhadra">Sonbhadra</option>
                        <option value="Gadchiroli">Gadchiroli</option>
                        <option value="Kurnool">Kurnool</option>
                        <option value="Raichur">Raichur</option>
                      </select>
                      <select
                        value={citizenState}
                        onChange={e => setCitizenState(e.target.value)}
                        className="text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="Telangana">Telangana</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Karnataka">Karnataka</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Preferred Language
                    </label>
                    <select
                      value={citizenLanguage}
                      onChange={e => setCitizenLanguage(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Telugu">Telugu (తెలుగు)</option>
                      <option value="Hindi">Hindi (हिंदी)</option>
                      <option value="English">English</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number or Email Address *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={citizenIdentifier}
                    onChange={e => setCitizenIdentifier(e.target.value)}
                    placeholder="Enter 10-digit mobile number or email"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={citizenPassword}
                    onChange={e => setCitizenPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>
                    {authMode === 'signin'
                      ? 'Sign In to Citizen Civic Portal'
                      : 'Create Citizen Account & Enter'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            /* GOVERNANCE FORM */
            <form onSubmit={handleOfficerSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Officer Full Name & Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={officerName}
                      onChange={e => setOfficerName(e.target.value)}
                      placeholder="e.g. Dr. V. Rao, IAS"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Department *
                    </label>
                    <input
                      type="text"
                      required
                      value={officerDept}
                      onChange={e => setOfficerDept(e.target.value)}
                      placeholder="e.g. Health & Family Welfare"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Designation *
                    </label>
                    <input
                      type="text"
                      required
                      value={officerDesignation}
                      onChange={e => setOfficerDesignation(e.target.value)}
                      placeholder="e.g. District Magistrate / Collector"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Jurisdiction / District *
                    </label>
                    <input
                      type="text"
                      required
                      value={officerJurisdiction}
                      onChange={e => setOfficerJurisdiction(e.target.value)}
                      placeholder="e.g. Mahabubnagar District, Telangana"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Government Email or Officer ID *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={officerEmail}
                    onChange={e => setOfficerEmail(e.target.value)}
                    placeholder="e.g. officer@telangana.gov.in"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Password *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={officerPassword}
                    onChange={e => setOfficerPassword(e.target.value)}
                    placeholder="Enter security password"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Building2 className="w-4 h-4" />
                  <span>
                    {authMode === 'signin'
                      ? 'Authenticate as Policymaker & Enter Dashboard'
                      : 'Register Official Account & Enter'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Privacy & Governance Notice */}
          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              {selectedPortal === 'citizen'
                ? 'Your citizen data is encrypted. Your submitted grievances are only visible under your personal account and anonymized when aggregated.'
                : 'Governance accounts have role-based authorization to inspect district gap indicators and AI decision-support memos.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
