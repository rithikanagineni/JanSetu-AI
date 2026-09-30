import {
  CitizenRequest,
  RequestCluster,
  HotspotItem,
  InfrastructureFacility,
  ImpactMetric,
  GapIndicatorBreakdown,
  DashboardOverview,
} from '../types';

export const apiClient = {
  // Submit new citizen complaint
  async submitRequest(payload: {
    text: string;
    language?: string;
    location?: string;
    district?: string;
    state?: string;
    category?: string;
    submission_channel?: string;
    citizen_id?: string;
  }): Promise<{
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
  }> {
    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to submit request`);
    const json = await res.json();
    return json.data;
  },

  // Fetch requests list
  async getRequests(filters?: Record<string, string>): Promise<CitizenRequest[]> {
    const params = new URLSearchParams(filters || {}).toString();
    const res = await fetch(`/api/requests?${params}`);
    if (!res.ok) throw new Error('Failed to fetch requests');
    const json = await res.json();
    return json.data;
  },

  // Fetch clusters list
  async getClusters(filters?: Record<string, string>): Promise<RequestCluster[]> {
    const params = new URLSearchParams(filters || {}).toString();
    const res = await fetch(`/api/clusters?${params}`);
    if (!res.ok) throw new Error('Failed to fetch clusters');
    const json = await res.json();
    return json.data;
  },

  // Fetch cluster detail with gap indicator breakdown
  async getClusterDetail(clusterId: string): Promise<{
    cluster: RequestCluster;
    gap_breakdown: GapIndicatorBreakdown;
    linked_requests: CitizenRequest[];
    nearby_facilities: InfrastructureFacility[];
  }> {
    const res = await fetch(`/api/clusters/${clusterId}`);
    if (!res.ok) throw new Error('Failed to fetch cluster detail');
    const json = await res.json();
    return json.data;
  },

  // Fetch hotspots for map
  async getHotspots(district?: string, category?: string): Promise<HotspotItem[]> {
    const params = new URLSearchParams({
      ...(district && district !== 'All' ? { district } : {}),
      ...(category && category !== 'All' ? { category } : {}),
    }).toString();
    const res = await fetch(`/api/hotspots?${params}`);
    if (!res.ok) throw new Error('Failed to fetch hotspots');
    const json = await res.json();
    return json.data;
  },

  // Fetch dashboard overview
  async getDashboardOverview(): Promise<DashboardOverview> {
    const res = await fetch('/api/dashboard');
    if (!res.ok) throw new Error('Failed to fetch dashboard metrics');
    const json = await res.json();
    return json.data;
  },

  // Fetch infrastructure facilities
  async getInfrastructure(district?: string): Promise<InfrastructureFacility[]> {
    const params = new URLSearchParams(district && district !== 'All' ? { district } : {}).toString();
    const res = await fetch(`/api/infrastructure?${params}`);
    if (!res.ok) throw new Error('Failed to fetch infrastructure facilities');
    const json = await res.json();
    return json.data;
  },

  // Fetch impact metrics
  async getImpactMetrics(): Promise<ImpactMetric[]> {
    const res = await fetch('/api/impact');
    if (!res.ok) throw new Error('Failed to fetch impact metrics');
    const json = await res.json();
    return json.data;
  },

  // Transcribe voice or preset
  async transcribeAudio(payload: {
    audio_base64?: string;
    preset?: string;
  }): Promise<{ text: string; confidence: number; source: string }> {
    const res = await fetch('/api/transcribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Audio transcription failed');
    const json = await res.json();
    return json.data;
  },

  // Fetch system health
  async getHealth(): Promise<{
    status: string;
    gemini_configured: boolean;
    demo_mode: boolean;
    gemini_model: string;
  }> {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Failed to fetch health');
    return await res.json();
  },

  // Reset demo seed data
  async resetDemo(): Promise<void> {
    await fetch('/api/reset-demo', { method: 'POST' });
  },
};
