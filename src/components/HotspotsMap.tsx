import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Layers,
  Building,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Filter,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { HotspotItem, InfrastructureFacility } from '../types';

interface HotspotsMapProps {
  onSelectCluster?: (clusterId: string) => void;
}

export const HotspotsMap: React.FC<HotspotsMapProps> = ({ onSelectCluster }) => {
  const [hotspots, setHotspots] = useState<HotspotItem[]>([]);
  const [facilities, setFacilities] = useState<InfrastructureFacility[]>([]);
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotItem | null>(null);

  // Layer toggles
  const [showHotspots, setShowHotspots] = useState(true);
  const [showFacilities, setShowFacilities] = useState(true);
  const [showHeatmapRings, setShowHeatmapRings] = useState(true);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [districtFilter, setDistrictFilter] = useState('All');

  useEffect(() => {
    async function loadMapData() {
      try {
        const [hotspotsData, infraData] = await Promise.all([
          apiClient.getHotspots(districtFilter, categoryFilter),
          apiClient.getInfrastructure(districtFilter),
        ]);
        setHotspots(hotspotsData);
        setFacilities(infraData);
        if (hotspotsData.length > 0 && !selectedHotspot) {
          setSelectedHotspot(hotspotsData[0]);
        }
      } catch (err) {
        console.error('Failed to load map data:', err);
      }
    }
    loadMapData();
  }, [categoryFilter, districtFilter]);

  // Coordinate projector: map Lat (12° to 28° N) and Lng (72° to 86° E) into SVG viewport (800x600)
  // Bounding box for Central/South/North-Central India
  const minLng = 73.0;
  const maxLng = 85.0;
  const minLat = 12.0;
  const maxLat = 26.0;

  const projectCoord = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 700 + 50;
    // Invert Y for screen coordinates (north is up)
    const y = 550 - ((lat - minLat) / (maxLat - minLat)) * 500;
    return { x, y };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title & Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <MapPin className="w-3.5 h-3.5" />
            GIS Demand Concentration & Facility Hotspots
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Geographic Hotspots Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Visualizing spatial demand concentration, reported travel distances, and public facility clusters.
          </p>
        </div>

        {/* Map Notice */}
        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            Interactive GIS Fallback Map (Stored Coordinates) • Ready for Google Maps Platform key
          </span>
        </div>
      </div>

      {/* Map Control Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-blue-600" />
            Active Layers:
          </span>

          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showHotspots}
              onChange={e => setShowHotspots(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="font-medium text-slate-700">Demand Hotspots</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showHeatmapRings}
              onChange={e => setShowHeatmapRings(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="font-medium text-slate-700">Demand Density Rings</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showFacilities}
              onChange={e => setShowFacilities(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span className="font-medium text-slate-700">Public Facilities</span>
          </label>
        </div>

        {/* Filter dropdowns */}
        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-md p-1.5 text-slate-800"
          >
            <option value="All">All Categories</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Water">Water</option>
            <option value="Roads">Roads</option>
            <option value="Electricity">Electricity</option>
          </select>

          <select
            value={districtFilter}
            onChange={e => setDistrictFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-md p-1.5 text-slate-800"
          >
            <option value="All">All Districts</option>
            <option value="Mahabubnagar">Mahabubnagar (Telangana)</option>
            <option value="Warangal">Warangal (Telangana)</option>
            <option value="Kurnool">Kurnool (Andhra Pradesh)</option>
            <option value="Gadchiroli">Gadchiroli (Maharashtra)</option>
            <option value="Sonbhadra">Sonbhadra (Uttar Pradesh)</option>
            <option value="Raichur">Raichur (Karnataka)</option>
          </select>
        </div>
      </div>

      {/* Main Interactive Map & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG GIS Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 rounded-2xl p-4 shadow-lg border border-slate-800 relative overflow-hidden">
          {/* Legend Overlay */}
          <div className="absolute top-6 left-6 z-10 bg-slate-950/85 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-2 shadow-md">
            <span className="font-bold text-slate-200 block text-xs">GIS Legend</span>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 shadow-xs shadow-rose-500/50"></span>
              <span>Critical Gap Hotspot (Score ≥ 75)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span>High Gap Hotspot (Score 60-74)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-emerald-400"></span>
              <span>Existing Public Facility</span>
            </div>
          </div>

          <div className="relative w-full h-[520px]">
            <svg
              viewBox="0 0 800 600"
              className="w-full h-full select-none"
              style={{ background: 'radial-gradient(ellipse at center, #1e293b 0%, #0f172a 100%)' }}
            >
              {/* Reference Grid lines */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" strokeOpacity="0.4" />
                </pattern>
                {/* Glow Filter for critical hotspots */}
                <filter id="glow-rose" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <rect width="800" height="600" fill="url(#grid)" />

              {/* State Territorial Boundaries (Illustrative stylized SVG contours for Southern/Central India) */}
              <path
                d="M 280 280 Q 360 260 460 300 T 520 420 Q 420 480 340 450 Z"
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                opacity="0.6"
              />
              <text x="380" y="360" fill="#64748b" fontSize="12" fontWeight="600" opacity="0.5">
                TELANGANA
              </text>

              <path
                d="M 330 440 Q 450 420 540 480 T 480 570 Q 380 540 330 440 Z"
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                opacity="0.6"
              />
              <text x="410" y="490" fill="#64748b" fontSize="12" fontWeight="600" opacity="0.5">
                ANDHRA PRADESH
              </text>

              <path
                d="M 120 220 Q 260 200 320 280 T 260 420 Q 150 360 120 220 Z"
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                opacity="0.6"
              />
              <text x="200" y="310" fill="#64748b" fontSize="12" fontWeight="600" opacity="0.5">
                MAHARASHTRA
              </text>

              <path
                d="M 450 80 Q 600 60 700 140 T 640 220 Q 480 180 450 80 Z"
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                opacity="0.6"
              />
              <text x="540" y="140" fill="#64748b" fontSize="12" fontWeight="600" opacity="0.5">
                UTTAR PRADESH (SOUTH)
              </text>

              {/* Heatmap Density Rings */}
              {showHeatmapRings &&
                hotspots.map(h => {
                  const pt = projectCoord(h.latitude, h.longitude);
                  const isSelected = selectedHotspot?.id === h.id;
                  const radius = Math.min(65, Math.max(30, Math.sqrt(h.total_requests) * 0.9));
                  return (
                    <g key={`ring-${h.id}`}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={radius}
                        fill={h.gap_score >= 75 ? '#f43f5e' : '#f59e0b'}
                        fillOpacity={isSelected ? 0.28 : 0.16}
                        stroke={h.gap_score >= 75 ? '#f43f5e' : '#f59e0b'}
                        strokeWidth="1.5"
                        strokeDasharray={isSelected ? 'none' : '3 3'}
                        className="transition-all duration-300"
                      />
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={radius * 1.5}
                        fill={h.gap_score >= 75 ? '#f43f5e' : '#f59e0b'}
                        fillOpacity={0.06}
                      />
                    </g>
                  );
                })}

              {/* Facilities Markers */}
              {showFacilities &&
                facilities.map(fac => {
                  const pt = projectCoord(fac.latitude, fac.longitude);
                  return (
                    <g key={fac.facility_id} className="cursor-pointer group">
                      <rect
                        x={pt.x - 4}
                        y={pt.y - 4}
                        width="8"
                        height="8"
                        rx="1"
                        fill="#34d399"
                        stroke="#065f46"
                        strokeWidth="1"
                      />
                      <title>{`${fac.facility_name} (${fac.facility_type})`}</title>
                    </g>
                  );
                })}

              {/* Hotspot Interactive Markers */}
              {showHotspots &&
                hotspots.map(h => {
                  const pt = projectCoord(h.latitude, h.longitude);
                  const isSelected = selectedHotspot?.id === h.id;
                  return (
                    <g
                      key={h.id}
                      onClick={() => {
                        setSelectedHotspot(h);
                        if (onSelectCluster) onSelectCluster(h.id);
                      }}
                      className="cursor-pointer group"
                    >
                      {/* Pulse circle */}
                      {h.gap_score >= 75 && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="18"
                          fill="none"
                          stroke="#f43f5e"
                          strokeWidth="2"
                          opacity="0.8"
                          className="animate-ping origin-center"
                        />
                      )}

                      {/* Main Marker Pin */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isSelected ? 11 : 8}
                        fill={h.gap_score >= 75 ? '#f43f5e' : '#f59e0b'}
                        stroke="#ffffff"
                        strokeWidth="2.5"
                        filter="url(#glow-rose)"
                      />

                      {/* Label Text */}
                      <text
                        x={pt.x}
                        y={pt.y - 14}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="11"
                        fontWeight="700"
                        className="drop-shadow-md select-none"
                      >
                        {h.district}
                      </text>
                      <text
                        x={pt.x}
                        y={pt.y + 22}
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="9"
                        fontWeight="500"
                      >
                        {h.total_requests.toLocaleString()} reqs
                      </text>
                    </g>
                  );
                })}
            </svg>
          </div>
        </div>

        {/* Right District Drill-Down Inspector (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {selectedHotspot ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Active Hotspot Inspector
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                    {selectedHotspot.district}, {selectedHotspot.state}
                  </h3>
                  <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded mt-1 inline-block">
                    {selectedHotspot.category} Sector
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Gap Score
                  </span>
                  <span className="text-2xl font-black text-rose-600">
                    {selectedHotspot.gap_score}
                  </span>
                  <span className="block text-[10px] font-bold text-rose-700">
                    {selectedHotspot.gap_level}
                  </span>
                </div>
              </div>

              {/* Key Indicators */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                    Logged Requests
                  </span>
                  <span className="text-base font-bold text-slate-900">
                    {selectedHotspot.total_requests.toLocaleString()}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                    Rural Population
                  </span>
                  <span className="text-base font-bold text-slate-900">
                    {(selectedHotspot.population_affected / 1000).toFixed(0)}k
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                    Avg Travel Distance
                  </span>
                  <span className="text-base font-bold text-slate-900">
                    {selectedHotspot.avg_reported_travel_km} km
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                    District Facilities
                  </span>
                  <span className="text-base font-bold text-slate-900">
                    {selectedHotspot.nearby_facilities_count} recorded
                  </span>
                </div>
              </div>

              {/* Lived Concern */}
              <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-100 text-xs">
                <span className="text-[10px] uppercase font-bold text-blue-700 block mb-1">
                  Primary Citizen Concern
                </span>
                <p className="text-slate-800 leading-relaxed font-medium">
                  {selectedHotspot.main_concern}
                </p>
              </div>

              {/* Action Button */}
              {onSelectCluster && (
                <button
                  onClick={() => onSelectCluster(selectedHotspot.id)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer"
                >
                  View Full Policy Evidence Memo →
                </button>
              )}
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-400">
              Click any hotspot marker on the GIS map to inspect localized demand concentration.
            </div>
          )}

          {/* District Quick Switcher */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h4 className="text-xs font-bold text-slate-800 mb-2">
              Direct District Hotspot Focus
            </h4>
            <div className="space-y-1.5">
              {hotspots.map(h => (
                <button
                  key={h.id}
                  onClick={() => setSelectedHotspot(h)}
                  className={`w-full p-2 text-left rounded-md text-xs font-medium flex items-center justify-between transition-colors ${
                    selectedHotspot?.id === h.id
                      ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{h.district}</span>
                  <span className="text-[10px] font-mono font-bold text-slate-500">
                    {h.total_requests} reqs
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
