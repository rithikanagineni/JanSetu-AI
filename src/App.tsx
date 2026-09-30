/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import {
  Navbar,
  GovernanceTab,
  CitizenTab,
} from './components/Navbar';
import { HomePage } from './components/HomePage';
import { AuthPage } from './components/AuthPage';
import { CitizenPortal } from './components/CitizenPortal';
import { PolicymakerDashboard } from './components/PolicymakerDashboard';
import { HotspotsMap } from './components/HotspotsMap';
import { InfrastructureExplorer } from './components/InfrastructureExplorer';
import { ImpactTracking } from './components/ImpactTracking';
import { TrackRequests } from './components/TrackRequests';
import { apiClient } from './services/apiClient';
import { authService } from './services/authService';
import { UserAccount } from './types';

export default function App() {
  // Navigation mode: ALWAYS starts at 'home' (Public Landing) on every new visit / link load
  const [viewMode, setViewMode] = useState<'home' | 'auth' | 'portal'>('home');
  const [initialAuthPortal, setInitialAuthPortal] = useState<'citizen' | 'governance'>('citizen');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  // Sub-tabs for each portal
  const [governanceTab, setGovernanceTab] = useState<GovernanceTab>('dashboard');
  const [citizenTab, setCitizenTab] = useState<CitizenTab>('submit');

  const [language, setLanguage] = useState<string>('English');
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [resetStatus, setResetStatus] = useState<string | null>(null);

  // On mount, restore session info if present, but NEVER redirect away from home page
  useEffect(() => {
    const existing = authService.getCurrentUser();
    if (existing) {
      setCurrentUser(existing);
      // NOTE: We intentionally keep viewMode as 'home' so the user always sees the Home Page first!
    }
  }, []);

  const handleOpenAuth = (defaultPortal?: 'citizen' | 'governance') => {
    setInitialAuthPortal(defaultPortal || 'citizen');
    setViewMode('auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    if (user.role === 'citizen') {
      setCitizenTab('submit');
    } else {
      setGovernanceTab('dashboard');
    }
    setViewMode('portal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setViewMode('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToTrack = (requestId?: string) => {
    if (requestId) {
      setSelectedRequestId(requestId);
    }
    setCitizenTab('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToHotspots = () => {
    setGovernanceTab('hotspots');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToImpact = () => {
    setGovernanceTab('impact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetDemo = async () => {
    try {
      await apiClient.resetDemo();
      setResetStatus('Benchmark seed data restored.');
      setTimeout(() => setResetStatus(null), 3500);
      setSelectedClusterId('cluster-ts-health-01');
    } catch (err) {
      console.error('Reset failed:', err);
    }
  };

  // 1. PUBLIC HOME PAGE (Always first page when anyone opens the deployed link)
  if (viewMode === 'home') {
    return (
      <HomePage
        onOpenAuth={handleOpenAuth}
        currentUser={currentUser}
        onLogout={handleLogout}
        onEnterPortal={() => {
          if (currentUser?.role === 'citizen') {
            setCitizenTab('submit');
          } else {
            setGovernanceTab('dashboard');
          }
          setViewMode('portal');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  // 2. SIGN IN / SIGN UP PAGE (Showing 2 Portals)
  if (viewMode === 'auth') {
    return (
      <AuthPage
        initialPortal={initialAuthPortal}
        onBackToHome={() => setViewMode('home')}
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  // 3. AUTHENTICATED PORTAL (Either Citizen or Governance)
  const isCitizen = currentUser?.role === 'citizen';
  const isGovernance = currentUser?.role === 'governance';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Portal Header */}
      <Navbar
        portalRole={isCitizen ? 'citizen' : 'governance'}
        currentUser={currentUser}
        governanceTab={governanceTab}
        setGovernanceTab={setGovernanceTab}
        citizenTab={citizenTab}
        setCitizenTab={setCitizenTab}
        language={language}
        setLanguage={setLanguage}
        onResetDemo={handleResetDemo}
        onLogout={handleLogout}
      />

      {/* Floating alert when seed data is reset */}
      {resetStatus && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{resetStatus}</span>
        </div>
      )}

      {/* Portal Main Body */}
      <main className="flex-1">
        {/* ========================================================================= */}
        {/* PORTAL 1: CITIZEN CIVIC PORTAL                                           */}
        {/* Strictly Citizen Features (Submit & Track My Request)                    */}
        {/* Strictly No Governance Switch Links                                      */}
        {/* ========================================================================= */}
        {isCitizen && (
          <div className="animate-in fade-in duration-200">
            {citizenTab === 'submit' && (
              <CitizenPortal
                language={language}
                setLanguage={setLanguage}
                onNavigateToTrack={handleNavigateToTrack}
                currentUser={currentUser}
              />
            )}

            {citizenTab === 'track' && (
              <TrackRequests
                highlightedRequestId={selectedRequestId}
                onNavigateToSubmit={() => setCitizenTab('submit')}
                currentUser={currentUser}
              />
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* PORTAL 2: POLICYMAKER & GOVERNANCE DASHBOARD                             */}
        {/* Strictly Governance Features (Overview, Hotspots, Infra, Impact)          */}
        {/* Strictly No Citizen Switch Links                                         */}
        {/* ========================================================================= */}
        {isGovernance && (
          <div className="animate-in fade-in duration-200">
            {governanceTab === 'dashboard' && (
              <PolicymakerDashboard
                initialClusterId={selectedClusterId}
                onNavigateToHotspots={handleNavigateToHotspots}
                onNavigateToImpact={handleNavigateToImpact}
              />
            )}

            {governanceTab === 'hotspots' && (
              <HotspotsMap
                onSelectCluster={(clusterId) => {
                  setSelectedClusterId(clusterId);
                  setGovernanceTab('dashboard');
                }}
              />
            )}

            {governanceTab === 'infrastructure' && (
              <InfrastructureExplorer />
            )}

            {governanceTab === 'impact' && (
              <ImpactTracking />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-8 px-4 sm:px-6 lg:px-8 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-sm">JanSetu AI</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">
                {isCitizen
                  ? 'Citizen Civic Intake & Personal Tracking Portal'
                  : 'Policymaker Governance Intelligence System'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              From Citizen Voice → Local Needs → National Priorities → Measurable Impact
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-slate-400">
              Authenticated: <strong className="text-slate-200">{currentUser?.name}</strong> ({isCitizen ? 'Citizen' : 'Governance Officer'})
            </span>
            <span className="text-slate-600">|</span>
            <button
              onClick={handleLogout}
              className="px-2.5 py-1 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 hover:text-white rounded font-bold transition-all cursor-pointer flex items-center gap-1.5"
              title="Log out and return to Home Page"
            >
              <LogOut className="w-3 h-3 text-rose-400" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
