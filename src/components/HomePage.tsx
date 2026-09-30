import React from 'react';
import {
  Building2,
  UserCheck,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  MapPin,
  BarChart3,
  TrendingUp,
  Mic,
  Languages,
  CheckCircle2,
  FileText,
  Lock,
  ExternalLink,
  ChevronRight,
  Cpu,
} from 'lucide-react';

import { UserAccount } from '../types';

interface HomePageProps {
  onOpenAuth: (defaultPortal?: 'citizen' | 'governance') => void;
  currentUser?: UserAccount | null;
  onLogout?: () => void;
  onEnterPortal?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenAuth,
  currentUser,
  onLogout,
  onEnterPortal,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white text-xs py-2 px-4 border-b border-indigo-800/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-blue-500 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider">
              Google Cloud Hackathon
            </span>
            <span className="text-slate-300 hidden sm:inline">
              Build with AI: Code for Communities • Innovation Theme
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-300">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-blue-400" />
              Powered by Google Gemini 3.8 Flash
            </span>
          </div>
        </div>
      </div>

      {/* Public Home Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  JanSetu AI
                </span>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                  CIVIC INTELLIGENCE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                From Citizen Voice → Local Needs → National Priorities → Measurable Impact
              </p>
            </div>
          </div>

          {/* Quick nav links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#about" className="hover:text-blue-600 transition-colors">
              About Platform
            </a>
            <a href="#portals" className="hover:text-blue-600 transition-colors">
              Two Portals
            </a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">
              How It Works
            </a>
            <a href="#architecture" className="hover:text-blue-600 transition-colors">
              AI & Architecture
            </a>
          </nav>

          {/* Top Right Sign In / Sign Up / Logged In Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentUser ? (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] text-white ${
                      currentUser.role === 'citizen' ? 'bg-emerald-600' : 'bg-blue-600'
                    }`}
                  >
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="font-bold text-slate-800">{currentUser.name}</span>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                      currentUser.role === 'citizen'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {currentUser.role === 'citizen' ? 'Citizen' : 'Officer'}
                  </span>
                </div>
                <button
                  onClick={onEnterPortal}
                  className={`px-3.5 py-2 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer ${
                    currentUser.role === 'citizen'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <span>Enter {currentUser.role === 'citizen' ? 'Citizen' : 'Governance'} Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="px-3 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    title="Log Out"
                  >
                    <span>Log Out</span>
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth('citizen')}
                  className="hidden sm:inline-flex px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Citizen Login
                </button>
                <button
                  onClick={() => onOpenAuth('citizen')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Sign In / Sign Up</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100 pt-16 pb-20 border-b border-slate-200">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI-Powered Civic Decision-Support Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            From Citizen Voice to{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 bg-clip-text text-transparent">
              Actionable Infrastructure Intelligence
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed">
            JanSetu AI bridges the gap between grassroots community needs and public policy.
            Multilingual citizen feedback in Telugu, Hindi, and English is analyzed by Google Gemini,
            clustered with census demographics, and cross-referenced with public facilities to provide
            transparent, evidence-based decision support for governance authorities.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {currentUser ? (
              <>
                <button
                  onClick={onEnterPortal}
                  className={`w-full sm:w-auto px-8 py-3.5 text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                    currentUser.role === 'citizen'
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25'
                      : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/25'
                  }`}
                >
                  <span>Enter {currentUser.role === 'citizen' ? 'Citizen Civic Portal' : 'Governance Portal'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onOpenAuth()}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-sm font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4 text-slate-500" />
                  <span>Switch Account / Sign In</span>
                </button>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="w-full sm:w-auto px-6 py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Log Out</span>
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth('citizen')}
                  className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onOpenAuth('governance')}
                  className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <span>Enter Governance Portal</span>
                </button>
              </>
            )}
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 text-left">
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Citizen Requests
              </span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">12,842+</span>
              <span className="text-[11px] text-slate-500">Ingested across 6 Indian states</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Multilingual Speech
              </span>
              <span className="text-2xl font-black text-blue-600 mt-1 block">3 Languages</span>
              <span className="text-[11px] text-slate-500">Telugu (తెలుగు), Hindi (हिंदी), English</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Demand Clusters
              </span>
              <span className="text-2xl font-black text-indigo-600 mt-1 block">126 Active</span>
              <span className="text-[11px] text-slate-500">Geo-concentrated civic hotspots</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                AI Decision Support
              </span>
              <span className="text-2xl font-black text-emerald-600 mt-1 block">100% Explainable</span>
              <span className="text-[11px] text-slate-500">Human-in-the-loop governance</span>
            </div>
          </div>
        </div>
      </section>

      {/* Two Portals Section */}
      <section id="portals" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Two Connected Portals
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Dedicated Experiences for Citizens and Policymakers
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Citizens articulate local problems without bureaucratic friction; public decision-makers
              access aggregate evidence, infrastructure ratios, and spatial heatmaps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Portal 1: Citizen Civic Portal */}
            <div className="bg-gradient-to-b from-emerald-50/50 to-white rounded-2xl border-2 border-emerald-500/30 p-8 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                    Portal 1: Citizens
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900">
                  Citizen Civic Portal
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Designed for community members to communicate village, town, and neighbourhood needs in their native mother tongue.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-700 pt-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Multilingual Voice & Text:</strong> Voice input in Telugu, Hindi, and English with Google Speech-to-Text.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Gemini Entity Extraction:</strong> Auto-extracts category, urgency, location, and travel distance in km.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Private Request Tracking:</strong> 5-stage progress lifecycle for your personal grievances with complete confidentiality.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Strict Citizen Privacy:</strong> Citizen accounts only see their own submitted requests; no cross-citizen data leakage.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-emerald-100">
                <button
                  onClick={() => onOpenAuth('citizen')}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Enter Citizen Portal →</span>
                </button>
              </div>
            </div>

            {/* Portal 2: Governance & Policymaker Portal */}
            <div className="bg-gradient-to-b from-blue-50/50 to-white rounded-2xl border-2 border-blue-500/30 p-8 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    Portal 2: Policymakers
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900">
                  Governance Intelligence Portal
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  A high-level governance decision-support system for district collectors, ministry planners, and state departments.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-700 pt-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Aggregated Demand Clusters:</strong> Merges thousands of citizen requests into district-level civic demand hotspots.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Prototype Infrastructure Gap Indicator:</strong> 6-factor composite index calculating deficits vs population.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Gemini Explainable Memos:</strong> Objective evidence synthesis without hallucinating or making unilateral decisions.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>GIS Spatial Hotspot Maps & Impact:</strong> Interactive district heatmaps and longitudinal before/after tracking.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-blue-100">
                <button
                  onClick={() => onOpenAuth('governance')}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Enter Governance Portal →</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Transformation Pipeline */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-200/80 px-3 py-1 rounded-full">
              End-to-End Pipeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              The 6-Stage Civic Transformation Engine
            </h2>
            <p className="text-sm text-slate-600">
              How raw citizen feedback is methodically converted into structured evidence for public leadership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-extrabold text-xs flex items-center justify-center">
                1
              </span>
              <h4 className="text-sm font-bold text-slate-900">Citizen Voice</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Vernacular speech or text input in Telugu, Hindi, or English from rural or urban citizens.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-extrabold text-xs flex items-center justify-center">
                2
              </span>
              <h4 className="text-sm font-bold text-slate-900">AI Understanding</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Gemini 3.8 Flash extracts sector, travel distance, urgency, and normalized intent.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 font-extrabold text-xs flex items-center justify-center">
                3
              </span>
              <h4 className="text-sm font-bold text-slate-900">Demand Patterns</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Similar requests are grouped into district demand clusters with similarity embeddings.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <span className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 font-extrabold text-xs flex items-center justify-center">
                4
              </span>
              <h4 className="text-sm font-bold text-slate-900">Infrastructure Gaps</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Aggregated demand is cross-checked against census demographics and public asset capacity.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 font-extrabold text-xs flex items-center justify-center">
                5
              </span>
              <h4 className="text-sm font-bold text-slate-900">Evidence Insights</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Gemini synthesizes structured, explainable policy memos and potential intervention options.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 font-extrabold text-xs flex items-center justify-center">
                6
              </span>
              <h4 className="text-sm font-bold text-slate-900">Impact Tracking</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Before vs After intervention verification tracking request reduction and travel ease.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Human-in-the-Loop Governance Notice */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span>Responsible AI & Decision-Support Principle</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            AI Assists Public Authorities — It Does Not Replace Them
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            JanSetu AI is engineered as an evidence-based decision-support system.
            AI models do not sanction funds, approve civil contracts, or adjudicate administrative priorities.
            Every potential intervention and gap indicator is presented as analytical evidence for review by authorized human policymakers.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 text-xs mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="font-extrabold text-white text-sm">JanSetu AI</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">Google Cloud Hackathon Project</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Built with AI: Code for Communities • Innovation Theme
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <button
              onClick={() => onOpenAuth('citizen')}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Citizen Portal
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => onOpenAuth('governance')}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Governance Portal
            </button>
            <span className="text-slate-700">|</span>
            {currentUser && onLogout ? (
              <button
                onClick={onLogout}
                className="px-3.5 py-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                Log Out ({currentUser.name})
              </button>
            ) : (
              <button
                onClick={() => onOpenAuth('citizen')}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};
