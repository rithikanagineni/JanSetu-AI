import React from 'react';
import {
  Building2,
  MapPin,
  BarChart3,
  Layers,
  Sparkles,
  TrendingUp,
  RotateCcw,
  Clock,
  Languages,
  UserCheck,
  Send,
  LogOut,
  User,
} from 'lucide-react';
import { UserAccount } from '../types';

export type GovernanceTab = 'dashboard' | 'hotspots' | 'infrastructure' | 'impact';
export type CitizenTab = 'submit' | 'track';

interface NavbarProps {
  portalRole: 'citizen' | 'governance';
  currentUser: UserAccount | null;
  governanceTab: GovernanceTab;
  setGovernanceTab: (tab: GovernanceTab) => void;
  citizenTab: CitizenTab;
  setCitizenTab: (tab: CitizenTab) => void;
  language: string;
  setLanguage: (lang: string) => void;
  onResetDemo: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  portalRole,
  currentUser,
  governanceTab,
  setGovernanceTab,
  citizenTab,
  setCitizenTab,
  language,
  setLanguage,
  onResetDemo,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Portal Identity */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
              if (portalRole === 'governance') setGovernanceTab('dashboard');
              else setCitizenTab('submit');
            }}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 border ${
                portalRole === 'governance'
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-700 shadow-blue-500/20 border-blue-400/30'
                  : 'bg-gradient-to-br from-emerald-600 to-teal-700 shadow-emerald-500/20 border-emerald-400/30'
              }`}
            >
              {portalRole === 'governance' ? (
                <Building2 className="w-5 h-5 text-white" />
              ) : (
                <UserCheck className="w-5 h-5 text-white" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent">
                  JanSetu AI
                </span>
                <span
                  className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border ${
                    portalRole === 'governance'
                      ? 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                  }`}
                >
                  {portalRole === 'governance'
                    ? 'GOVERNANCE PORTAL'
                    : 'CITIZEN CIVIC PORTAL'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-normal hidden sm:block">
                {portalRole === 'governance'
                  ? 'Citizen demand → Evidence → Infrastructure gaps → Actionable insights'
                  : '“Your voice. Your needs. Better-informed decisions.”'}
              </p>
            </div>
          </div>

          {/* DEDICATED PORTAL NAVIGATION TABS */}
          {portalRole === 'governance' ? (
            /* =================== GOVERNANCE PORTAL NAVIGATION =================== */
            <nav className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => setGovernanceTab('dashboard')}
                className={`px-3 py-2 rounded-md text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  governanceTab === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Intelligence Overview
              </button>
              <button
                onClick={() => setGovernanceTab('hotspots')}
                className={`px-3 py-2 rounded-md text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  governanceTab === 'hotspots'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                GIS Hotspots Map
              </button>
              <button
                onClick={() => setGovernanceTab('infrastructure')}
                className={`px-3 py-2 rounded-md text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  governanceTab === 'infrastructure'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Infrastructure Gaps
              </button>
              <button
                onClick={() => setGovernanceTab('impact')}
                className={`px-3 py-2 rounded-md text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  governanceTab === 'impact'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                Impact Tracking
              </button>
            </nav>
          ) : (
            /* =================== CITIZEN PORTAL NAVIGATION =================== */
            <nav className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => setCitizenTab('submit')}
                className={`px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  citizenTab === 'submit'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                Submit a Request
              </button>
              <button
                onClick={() => setCitizenTab('track')}
                className={`px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  citizenTab === 'track'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                Track My Request
              </button>
            </nav>
          )}

          {/* Right side controls: User Profile Pill, Language, Reset Data & Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User Profile Pill */}
            {currentUser && (
              <div
                className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${
                  portalRole === 'governance'
                    ? 'bg-blue-950/60 border-blue-800/60 text-blue-200'
                    : 'bg-emerald-950/60 border-emerald-800/60 text-emerald-200'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                    portalRole === 'governance'
                      ? 'bg-blue-600 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left line-clamp-1">
                  <div className="font-bold leading-tight">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-400">
                    {portalRole === 'governance'
                      ? currentUser.designation || currentUser.district
                      : `${currentUser.district}, ${currentUser.state}`}
                  </div>
                </div>
              </div>
            )}

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
              <Languages className="w-3.5 h-3.5 text-slate-400 ml-1 mr-1" />
              <button
                onClick={() => setLanguage('English')}
                className={`px-2 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                  language === 'English'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('Telugu')}
                className={`px-2 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                  language === 'Telugu'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="తెలుగు"
              >
                తెలుగు
              </button>
              <button
                onClick={() => setLanguage('Hindi')}
                className={`px-2 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                  language === 'Hindi'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="हिंदी"
              >
                हिंदी
              </button>
            </div>

            {/* Reset Seed Data */}
            <button
              onClick={onResetDemo}
              className="hidden sm:flex text-[11px] text-slate-400 hover:text-slate-200 items-center gap-1 transition-colors px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 cursor-pointer"
              title="Reset demonstration database to benchmark seed"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>

            {/* Log Out Button */}
            <button
              onClick={onLogout}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-rose-600/20 hover:bg-rose-600 border border-rose-500/50 hover:border-rose-600 text-rose-200 hover:text-white flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              title="Log out and return to Home Page"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Mobile Tab Scroller for Active Portal */}
        <div className="flex lg:hidden items-center overflow-x-auto py-2 gap-1.5 border-t border-slate-800 scrollbar-none text-xs">
          {portalRole === 'governance' ? (
            <>
              <button
                onClick={() => setGovernanceTab('dashboard')}
                className={`px-3 py-1.5 whitespace-nowrap rounded font-medium ${
                  governanceTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-300 bg-slate-800'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setGovernanceTab('hotspots')}
                className={`px-3 py-1.5 whitespace-nowrap rounded font-medium ${
                  governanceTab === 'hotspots' ? 'bg-blue-600 text-white' : 'text-slate-300 bg-slate-800'
                }`}
              >
                Hotspots
              </button>
              <button
                onClick={() => setGovernanceTab('infrastructure')}
                className={`px-3 py-1.5 whitespace-nowrap rounded font-medium ${
                  governanceTab === 'infrastructure' ? 'bg-blue-600 text-white' : 'text-slate-300 bg-slate-800'
                }`}
              >
                Infra Gaps
              </button>
              <button
                onClick={() => setGovernanceTab('impact')}
                className={`px-3 py-1.5 whitespace-nowrap rounded font-medium ${
                  governanceTab === 'impact' ? 'bg-blue-600 text-white' : 'text-slate-300 bg-slate-800'
                }`}
              >
                Impact
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setCitizenTab('submit')}
                className={`px-3 py-1.5 whitespace-nowrap rounded font-medium ${
                  citizenTab === 'submit' ? 'bg-emerald-600 text-white' : 'text-slate-300 bg-slate-800'
                }`}
              >
                Submit Request
              </button>
              <button
                onClick={() => setCitizenTab('track')}
                className={`px-3 py-1.5 whitespace-nowrap rounded font-medium ${
                  citizenTab === 'track' ? 'bg-emerald-600 text-white' : 'text-slate-300 bg-slate-800'
                }`}
              >
                Track My Request
              </button>
            </>
          )}

          {/* Mobile Profile & Logout */}
          <div className="ml-auto flex items-center gap-1.5 pl-2 shrink-0">
            {currentUser && (
              <span className="text-[10px] text-slate-300 font-medium truncate max-w-[80px]">
                {currentUser.name}
              </span>
            )}
            <button
              onClick={onLogout}
              className="px-2.5 py-1 rounded text-xs font-bold bg-rose-950 border border-rose-700 text-rose-300 hover:text-white flex items-center gap-1 cursor-pointer shrink-0"
              title="Log Out"
            >
              <LogOut className="w-3 h-3" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
