import React, { useState, useEffect } from 'react';
import {
  Layers,
  Building2,
  Filter,
  Search,
  CheckCircle,
  AlertTriangle,
  MapPin,
  TrendingDown,
  Info,
} from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { InfrastructureFacility } from '../types';

export const InfrastructureExplorer: React.FC = () => {
  const [facilities, setFacilities] = useState<InfrastructureFacility[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await apiClient.getInfrastructure();
        setFacilities(data);
      } catch (err) {
        console.error('Failed to load facilities:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredFacilities = facilities.filter(fac => {
    if (districtFilter !== 'All' && fac.district !== districtFilter) return false;
    if (typeFilter !== 'All' && fac.facility_type !== typeFilter) return false;
    if (searchTerm.trim() !== '') {
      const match =
        fac.facility_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fac.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fac.facility_type.toLowerCase().includes(searchTerm.toLowerCase());
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <Layers className="w-3.5 h-3.5" />
            Infrastructure Asset Catalog & Capacity Ratios
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Recorded Public Infrastructure
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Auditing existing facility capacities against rural population pressure to identify structural deficits.
          </p>
        </div>

        <div className="text-xs bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Demo Mode — Synthetic demonstration data (Replace with Open City / NITI Aayog open data)</span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search facility name, district, or type..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">District:</span>
            <select
              value={districtFilter}
              onChange={e => setDistrictFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-md p-1.5 text-slate-800"
            >
              <option value="All">All Districts</option>
              <option value="Mahabubnagar">Mahabubnagar</option>
              <option value="Warangal">Warangal</option>
              <option value="Kurnool">Kurnool</option>
              <option value="Gadchiroli">Gadchiroli</option>
              <option value="Sonbhadra">Sonbhadra</option>
              <option value="Raichur">Raichur</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Type:</span>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-md p-1.5 text-slate-800"
            >
              <option value="All">All Facility Types</option>
              <option value="District Hospital">District Hospital</option>
              <option value="Tertiary Hospital">Tertiary Hospital</option>
              <option value="Area Hospital">Area Hospital</option>
              <option value="CHC">CHC (Community Health Centre)</option>
              <option value="PHC">PHC (Primary Health Centre)</option>
              <option value="Sub-Centre">Sub-Centre</option>
              <option value="Taluk Hospital">Taluk Hospital</option>
            </select>
          </div>
        </div>
      </div>

      {/* Facilities Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3">Facility Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3 text-right">Inpatient Capacity</th>
                <th className="px-4 py-3 text-right">Population Served</th>
                <th className="px-4 py-3 text-right">Accessibility Index</th>
                <th className="px-4 py-3">Operational Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredFacilities.map(f => (
                <tr key={f.facility_id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{f.facility_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                      {f.facility_type}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 font-medium">
                    {f.district}, {f.state}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-800">
                    {f.capacity} beds
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-slate-600">
                    {f.population_served.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span
                      className={`font-mono font-bold ${
                        f.accessibility_score >= 70
                          ? 'text-emerald-600'
                          : f.accessibility_score >= 45
                          ? 'text-amber-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {f.accessibility_score}/100
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        f.condition_rating === 'Good'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : f.condition_rating === 'Fair'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {f.condition_rating}
                    </span>
                  </td>
                </tr>
              ))}

              {filteredFacilities.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No infrastructure assets matched your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
