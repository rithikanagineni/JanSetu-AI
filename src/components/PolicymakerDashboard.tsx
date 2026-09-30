import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  MapPin,
  AlertTriangle,
  Layers,
  Sparkles,
  Users,
  Compass,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  ExternalLink,
  Info,
  Clock,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { apiClient } from '../services/apiClient';
import {
  DashboardOverview,
  RequestCluster,
  HotspotItem,
  GapIndicatorBreakdown,
  InfrastructureFacility,
} from '../types';

interface PolicymakerDashboardProps {
  initialClusterId?: string | null;
  onNavigateToHotspots: () => void;
  onNavigateToImpact: () => void;
}

export const PolicymakerDashboard: React.FC<PolicymakerDashboardProps> = ({
  initialClusterId,
  onNavigateToHotspots,
  onNavigateToImpact,
}) => {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [clusters, setClusters] = useState<RequestCluster[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<RequestCluster | null>(null);
  const [gapBreakdown, setGapBreakdown] = useState<GapIndicatorBreakdown | null>(null);
  const [facilities, setFacilities] = useState<InfrastructureFacility[]>([]);

  // Filters
  const [selectedState, setSelectedState] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedUrgency, setSelectedUrgency] = useState('All');

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingClusterDetail, setIsLoadingClusterDetail] = useState(false);

  // Load Dashboard Data
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [dashData, clustersData] = await Promise.all([
          apiClient.getDashboardOverview(),
          apiClient.getClusters(),
        ]);
        setOverview(dashData);
        setClusters(clustersData);

        // Auto-select initial or highest gap cluster
        const target = initialClusterId
          ? clustersData.find(c => c.cluster_id === initialClusterId) || clustersData[0]
          : clustersData[0];

        if (target) {
          selectCluster(target.cluster_id);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [initialClusterId]);

  const selectCluster = async (clusterId: string) => {
    setIsLoadingClusterDetail(true);
    try {
      const detail = await apiClient.getClusterDetail(clusterId);
      setSelectedCluster(detail.cluster);
      setGapBreakdown(detail.gap_breakdown);
      setFacilities(detail.nearby_facilities);
    } catch (err) {
      console.error('Failed to load cluster details:', err);
    } finally {
      setIsLoadingClusterDetail(false);
    }
  };

  // Filter clusters
  const filteredClusters = clusters.filter(c => {
    if (selectedState !== 'All' && c.state !== selectedState) return false;
    if (selectedDistrict !== 'All' && c.district !== selectedDistrict) return false;
    if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
    if (selectedUrgency !== 'All' && c.urgency !== selectedUrgency) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <Compass className="w-3.5 h-3.5" />
            Decision-Support & Evidence Synthesis
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Policymaker Infrastructure Intelligence Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Cross-referencing citizen demand concentrations with demographic data and existing facility capacities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onNavigateToHotspots}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            Full GIS Hotspots Map
          </button>
          <button
            onClick={onNavigateToImpact}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Impact Tracking
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-500 block">
            Total Citizen Requests
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {overview ? overview.total_requests.toLocaleString() : '14,242'}
          </div>
          <span className="text-[10px] text-blue-600 font-semibold mt-1 inline-block">
            Across 7 civic domains
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-500 block">
            Active Demand Clusters
          </span>
          <div className="text-2xl font-black text-indigo-600 mt-1">
            {overview ? overview.active_clusters : '8'}
          </div>
          <span className="text-[10px] text-slate-500 font-medium mt-1 inline-block">
            Aggregated by district
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-200/80 bg-rose-50/20 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-rose-700 block">
            Critical Gap Areas
          </span>
          <div className="text-2xl font-black text-rose-700 mt-1">
            {overview ? overview.critical_gap_areas : '3'}
          </div>
          <span className="text-[10px] text-rose-600 font-semibold mt-1 inline-block">
            Gap Indicator ≥ 75
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-500 block">
            States Represented
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {overview ? overview.states_represented : '6'}
          </div>
          <span className="text-[10px] text-slate-500 font-medium mt-1 inline-block">
            TS, AP, MH, UP, KA, TN
          </span>
        </div>

        <div className="col-span-2 md:col-span-1 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-500 block">
            Population Monitored
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {overview ? `${(overview.population_impacted / 1000000).toFixed(1)}M` : '12.8M'}
          </div>
          <span className="text-[10px] text-slate-500 font-medium mt-1 inline-block">
            Rural habitations priority
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Filters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* State */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">State:</span>
            <select
              value={selectedState}
              onChange={e => {
                setSelectedState(e.target.value);
                setSelectedDistrict('All');
              }}
              className="text-xs bg-slate-50 border border-slate-300 rounded-md p-1.5 font-medium text-slate-800"
            >
              <option value="All">All States</option>
              <option value="Telangana">Telangana</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Karnataka">Karnataka</option>
            </select>
          </div>

          {/* District */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">District:</span>
            <select
              value={selectedDistrict}
              onChange={e => setSelectedDistrict(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-md p-1.5 font-medium text-slate-800"
            >
              <option value="All">All Districts</option>
              {selectedState === 'All' || selectedState === 'Telangana' ? (
                <>
                  <option value="Mahabubnagar">Mahabubnagar</option>
                  <option value="Warangal">Warangal</option>
                </>
              ) : null}
              {selectedState === 'All' || selectedState === 'Andhra Pradesh' ? (
                <option value="Kurnool">Kurnool</option>
              ) : null}
              {selectedState === 'All' || selectedState === 'Maharashtra' ? (
                <option value="Gadchiroli">Gadchiroli</option>
              ) : null}
              {selectedState === 'All' || selectedState === 'Uttar Pradesh' ? (
                <option value="Sonbhadra">Sonbhadra</option>
              ) : null}
              {selectedState === 'All' || selectedState === 'Karnataka' ? (
                <option value="Raichur">Raichur</option>
              ) : null}
            </select>
          </div>

          {/* Category */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Category:</span>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-md p-1.5 font-medium text-slate-800"
            >
              <option value="All">All Sectors</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Water">Water</option>
              <option value="Roads">Roads & Bridges</option>
              <option value="Electricity">Electricity</option>
              <option value="Education">Education</option>
              <option value="Public Transport">Public Transport</option>
            </select>
          </div>

          {/* Urgency */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Urgency:</span>
            <select
              value={selectedUrgency}
              onChange={e => setSelectedUrgency(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-md p-1.5 font-medium text-slate-800"
            >
              <option value="All">All Tiers</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Left Clusters (5 cols) & Right Deep Gap & AI Memo (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Aggregated Demand Clusters List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              Prioritized Demand Clusters ({filteredClusters.length})
            </h2>
            <span className="text-xs text-slate-500">Sorted by Gap Score</span>
          </div>

          <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
            {filteredClusters.map(cluster => {
              const isSelected = selectedCluster?.cluster_id === cluster.cluster_id;
              return (
                <div
                  key={cluster.cluster_id}
                  onClick={() => selectCluster(cluster.cluster_id)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/60 border-blue-600 shadow-sm ring-1 ring-blue-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 leading-snug">
                      {cluster.cluster_name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        cluster.gap_level === 'Critical'
                          ? 'bg-rose-100 text-rose-800'
                          : cluster.gap_level === 'High'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {cluster.gap_level}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                    {cluster.main_concern}
                  </p>

                  <div className="flex items-center justify-between text-[11px] pt-3 mt-2 border-t border-slate-100 text-slate-500">
                    <div className="flex items-center gap-3">
                      <span>
                        <strong className="text-slate-800">
                          {cluster.total_requests.toLocaleString()}
                        </strong>{' '}
                        requests
                      </span>
                      <span>
                        Avg travel:{' '}
                        <strong className="text-slate-800">{cluster.avg_reported_travel_km} km</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-1 font-mono font-bold text-slate-800">
                      <span>Gap:</span>
                      <span
                        className={
                          cluster.prototype_gap_indicator >= 75
                            ? 'text-rose-600'
                            : cluster.prototype_gap_indicator >= 60
                            ? 'text-amber-600'
                            : 'text-blue-600'
                        }
                      >
                        {cluster.prototype_gap_indicator}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredClusters.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
                No clusters match the selected filters.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed Gap Analysis & Gemini Policy Memo (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {selectedCluster && gapBreakdown ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-7 space-y-6">
              {/* Selected Cluster Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {selectedCluster.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {selectedCluster.district}, {selectedCluster.state}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    {selectedCluster.cluster_name}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Prototype Infrastructure Gap Indicator
                  </span>
                  <div className="flex items-baseline gap-1 sm:justify-end">
                    <span className="text-3xl font-black text-rose-600">
                      {gapBreakdown.gap_score}
                    </span>
                    <span className="text-xs font-bold text-slate-400">/ 100</span>
                    <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded ml-1">
                      {gapBreakdown.gap_level}
                    </span>
                  </div>
                </div>
              </div>

              {/* Prototype Indicator 6 Component Bars */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Infrastructure Gap Component Breakdown
                  </h4>
                  <span className="text-[11px] text-slate-400">Objective Data Factors</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* 1. Demand */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-800">Citizen Demand</span>
                      <span className="font-bold text-slate-900">
                        {gapBreakdown.components.citizen_demand.score}% ({gapBreakdown.components.citizen_demand.rating})
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${gapBreakdown.components.citizen_demand.score}%` }}
                      ></div>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1.5">
                      {gapBreakdown.components.citizen_demand.evidence}
                    </p>
                  </div>

                  {/* 2. Population */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-800">Population Pressure</span>
                      <span className="font-bold text-slate-900">
                        {gapBreakdown.components.population_affected.score}% ({gapBreakdown.components.population_affected.rating})
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${gapBreakdown.components.population_affected.score}%` }}
                      ></div>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1.5">
                      {gapBreakdown.components.population_affected.evidence}
                    </p>
                  </div>

                  {/* 3. Facility Coverage Deficit */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-800">Facility Deficit</span>
                      <span className="font-bold text-rose-700">
                        {gapBreakdown.components.facility_coverage.score}% ({gapBreakdown.components.facility_coverage.rating})
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-600 rounded-full"
                        style={{ width: `${gapBreakdown.components.facility_coverage.score}%` }}
                      ></div>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1.5">
                      {gapBreakdown.components.facility_coverage.evidence}
                    </p>
                  </div>

                  {/* 4. Accessibility Barrier */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-800">Transit Barrier</span>
                      <span className="font-bold text-amber-700">
                        {gapBreakdown.components.accessibility.score}% ({gapBreakdown.components.accessibility.rating})
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-600 rounded-full"
                        style={{ width: `${gapBreakdown.components.accessibility.score}%` }}
                      ></div>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1.5">
                      {gapBreakdown.components.accessibility.evidence}
                    </p>
                  </div>
                </div>
              </div>

              {/* Gemini Explainable Policy Memo Box */}
              {gapBreakdown.policy_insight && (
                <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-5 rounded-xl border border-blue-800/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      Gemini Explainable Policy Briefing
                    </span>
                    <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded font-mono">
                      Model: gemini-3.8-flash
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed text-slate-100 font-medium">
                    {gapBreakdown.policy_insight.executive_summary}
                  </p>

                  {/* Supporting Evidence Breakdown */}
                  <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700 text-xs space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-blue-300 block">
                      Why This Area Is Highlighted (Supporting Evidence)
                    </span>
                    <p className="text-slate-300 text-[11px]">
                      • <strong>Citizen Demand:</strong> {gapBreakdown.policy_insight.why_this_area_is_highlighted.citizen_demand_summary}
                    </p>
                    <p className="text-slate-300 text-[11px]">
                      • <strong>Demographic Pressure:</strong> {gapBreakdown.policy_insight.why_this_area_is_highlighted.demographic_pressure}
                    </p>
                    <p className="text-slate-300 text-[11px]">
                      • <strong>Facility Coverage:</strong> {gapBreakdown.policy_insight.why_this_area_is_highlighted.facility_deficit_evidence}
                    </p>
                  </div>

                  {/* Potential Interventions */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-blue-300 block mb-2">
                      Potential Intervention Options
                    </span>
                    <div className="space-y-2">
                      {gapBreakdown.policy_insight.potential_interventions.map((option, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/60 text-xs"
                        >
                          <div className="flex items-center justify-between font-semibold text-slate-200">
                            <span>{option.title}</span>
                            <span className="text-[10px] text-blue-300 font-normal">
                              {option.feasibility_horizon}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">
                            {option.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mandatory Human Decision Disclaimer */}
                  <div className="pt-2 border-t border-slate-800 flex items-start gap-2 text-[11px] text-amber-300">
                    <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Human Authority Policy Requirement:</strong> {gapBreakdown.policy_insight.policymaker_guidance_notes}
                    </span>
                  </div>
                </div>
              )}

              {/* Recorded Infrastructure in District */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Existing Recorded Facilities in {selectedCluster.district} ({facilities.length})
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden text-xs">
                  {facilities.map(fac => (
                    <div
                      key={fac.facility_id}
                      className="p-3 flex items-center justify-between bg-white hover:bg-slate-50"
                    >
                      <div>
                        <span className="font-semibold text-slate-900">{fac.facility_name}</span>
                        <div className="text-[11px] text-slate-500">
                          {fac.facility_type} • Capacity: {fac.capacity} beds • Pop Served:{' '}
                          {fac.population_served.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-blue-700">
                          {fac.accessibility_score}/100 Access
                        </span>
                        <span className="block text-[10px] text-slate-400">
                          Condition: {fac.condition_rating}
                        </span>
                      </div>
                    </div>
                  ))}
                  {facilities.length === 0 && (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No facility records found for this district.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
              <span className="text-sm text-slate-500">
                Select a demand cluster on the left to inspect its gap breakdown and Gemini policy briefing.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
