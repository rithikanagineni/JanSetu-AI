import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  BarChart2,
  Calendar,
  Layers,
} from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { ImpactMetric } from '../types';

export const ImpactTracking: React.FC = () => {
  const [metrics, setMetrics] = useState<ImpactMetric[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<ImpactMetric | null>(null);

  useEffect(() => {
    async function loadImpact() {
      try {
        const data = await apiClient.getImpactMetrics();
        setMetrics(data);
        if (data.length > 0) {
          setSelectedMetric(data[0]);
        }
      } catch (err) {
        console.error('Failed to load impact metrics:', err);
      }
    }
    loadImpact();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            Post-Intervention Civic Measurement
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Intervention Impact & Outcome Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Demonstrating how JanSetu AI tracks whether capital public works successfully alleviate citizen grievances.
          </p>
        </div>

        <div className="text-xs bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Synthetic demonstration metrics — field surveys required for official governance validation</span>
        </div>
      </div>

      {/* Main Focus: Before vs After Showcase Card (The Primary Hackathon Scenario) */}
      {selectedMetric && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  {selectedMetric.sector}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {selectedMetric.district}, {selectedMetric.state}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                {selectedMetric.project_name}
              </h2>
              <span className="text-xs text-slate-400">
                Evaluation Window: {selectedMetric.implementation_period} • Status:{' '}
                <strong className="text-emerald-700">{selectedMetric.status}</strong>
              </span>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-right">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                Citizen Satisfaction
              </span>
              <span className="text-2xl font-black text-emerald-800 font-mono">
                {selectedMetric.satisfaction_pct}%
              </span>
            </div>
          </div>

          {/* 3-Column Comparative Visual Grid: Before | Intervention | After */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. BEFORE Metric Card */}
            <div className="bg-rose-50/40 border-2 border-rose-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-rose-200/60">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
                  Before Intervention
                </span>
                <span className="text-[10px] font-semibold text-rose-600 bg-rose-100 px-2 py-0.5 rounded">
                  Baseline (2024)
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Logged Citizen Requests</span>
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    {selectedMetric.pre_requests_count.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-rose-700 font-medium">
                    Heavy concentrated distress
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">Average Travel Distance</span>
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    {selectedMetric.pre_avg_travel_km} km
                  </div>
                  <span className="text-[11px] text-rose-700 font-medium">
                    Excessive commute barrier
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">Accessibility Index</span>
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    {selectedMetric.pre_accessibility_score}/100
                  </div>
                  <span className="text-[11px] text-rose-700 font-medium">
                    Severely underserved rating
                  </span>
                </div>
              </div>
            </div>

            {/* 2. THE INTERVENTION Card */}
            <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-md">
              <div>
                <div className="flex items-center gap-1.5 text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  Government Intervention
                </div>
                <h3 className="text-base font-bold text-white leading-snug">
                  {selectedMetric.project_name}
                </h3>
                <p className="text-xs text-blue-200 mt-2 leading-relaxed">
                  Upgraded rural health post, equipped 24/7 emergency stabilization ward, and
                  deployed scheduled mobile clinics across 14 peripheral villages.
                </p>
              </div>

              <div className="pt-3 border-t border-blue-800 text-[11px] text-blue-300 space-y-1">
                <div>• Sector: {selectedMetric.sector}</div>
                <div>• Location: {selectedMetric.district} Mandal cluster</div>
                <div>• Verification: Bi-annual citizen grievance polling</div>
              </div>
            </div>

            {/* 3. AFTER Metric Card */}
            <div className="bg-emerald-50/50 border-2 border-emerald-300 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  After Intervention
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Measured (2025)
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Logged Citizen Requests</span>
                  <div className="text-2xl font-black text-emerald-900 font-mono flex items-center gap-2">
                    <span>{selectedMetric.post_requests_count.toLocaleString()}</span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded flex items-center">
                      <ArrowDownRight className="w-3 h-3" />
                      50% Drop
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium">
                    Major reduction in complaints
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">Average Travel Distance</span>
                  <div className="text-2xl font-black text-emerald-900 font-mono flex items-center gap-2">
                    <span>{selectedMetric.post_avg_travel_km} km</span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded flex items-center">
                      <ArrowDownRight className="w-3 h-3" />
                      -60%
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium">
                    Travel distance cut down to 8 km
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">Accessibility Index</span>
                  <div className="text-2xl font-black text-emerald-900 font-mono flex items-center gap-2">
                    <span>{selectedMetric.post_accessibility_score}/100</span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded flex items-center">
                      <ArrowUpRight className="w-3 h-3" />
                      +36 pts
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium">
                    Marked quality & coverage gain
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other Completed & Monitored Interventions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          All Monitored Interventions & Outcome Trackers
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {metrics.map(m => (
            <div
              key={m.intervention_id}
              onClick={() => setSelectedMetric(m)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedMetric?.intervention_id === m.intervention_id
                  ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-blue-700 uppercase">
                    {m.sector} • {m.district}, {m.state}
                  </span>
                  <h4 className="font-bold text-slate-900 mt-0.5">{m.project_name}</h4>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {m.satisfaction_pct}% Satisfaction
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Requests</span>
                  <span className="font-mono font-bold text-slate-800">
                    {m.pre_requests_count} → {m.post_requests_count}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Travel Distance</span>
                  <span className="font-mono font-bold text-slate-800">
                    {m.pre_avg_travel_km}km → {m.post_avg_travel_km}km
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Access Index</span>
                  <span className="font-mono font-bold text-slate-800">
                    {m.pre_accessibility_score} → {m.post_accessibility_score}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
