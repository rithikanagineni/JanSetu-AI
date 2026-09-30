export interface CitizenRequest {
  request_id: string;
  citizen_id: string;
  language: string;
  category: string;
  original_text: string;
  normalized_text: string;
  issue: string;
  location: string;
  district: string;
  state: string;
  urgency: 'High' | 'Medium' | 'Low';
  requested_service: string;
  travel_distance_km: number | null;
  summary: string;
  keywords: string[];
  submission_channel: string;
  cluster_id: string | null;
  status: string;
  created_at: string;
}

export interface RequestCluster {
  cluster_id: string;
  cluster_name: string;
  category: string;
  district: string;
  state: string;
  total_requests: number;
  main_concern: string;
  avg_reported_travel_km: number;
  urgency: 'High' | 'Medium' | 'Low';
  demand_concentration: 'High' | 'Medium' | 'Low';
  prototype_gap_indicator: number;
  gap_level: 'Critical' | 'High' | 'Moderate' | 'Low';
  created_at: string;
  updated_at: string;
}

export interface HotspotItem {
  id: string;
  name: string;
  category: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  total_requests: number;
  population_affected: number;
  urgency: 'High' | 'Medium' | 'Low';
  gap_score: number;
  gap_level: 'Critical' | 'High' | 'Moderate' | 'Low';
  main_concern: string;
  avg_reported_travel_km: number;
  nearby_facilities_count: number;
  status: string;
}

export interface InfrastructureFacility {
  facility_id: string;
  facility_name: string;
  facility_type: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  capacity: number;
  population_served: number;
  accessibility_score: number;
  condition_rating: string;
}

export interface ImpactMetric {
  intervention_id: string;
  project_name: string;
  sector: string;
  district: string;
  state: string;
  implementation_period: string;
  pre_requests_count: number;
  post_requests_count: number;
  pre_avg_travel_km: number;
  post_avg_travel_km: number;
  pre_accessibility_score: number;
  post_accessibility_score: number;
  satisfaction_pct: number;
  status: string;
}

export interface GapIndicatorBreakdown {
  gap_score: number;
  gap_level: 'Critical' | 'High' | 'Moderate' | 'Low';
  components: {
    citizen_demand: { score: number; rating: string; count: number; evidence: string };
    population_affected: { score: number; rating: string; population: number; evidence: string };
    facility_coverage: { score: number; rating: string; facilities_count: number; evidence: string };
    accessibility: { score: number; rating: string; avg_travel_km: number; evidence: string };
    urgency: { score: number; rating: string; level: string; evidence: string };
    investment_alignment: { score: number; rating: string; underway_projects: number; evidence: string };
  };
  policy_insight: {
    executive_summary: string;
    why_this_area_is_highlighted: {
      citizen_demand_summary: string;
      demographic_pressure: string;
      facility_deficit_evidence: string;
      accessibility_barrier: string;
    };
    explainable_reasoning: string;
    potential_interventions: Array<{
      title: string;
      feasibility_horizon: string;
      estimated_impact: string;
      estimated_cost_tier: string;
      description: string;
    }>;
    policymaker_guidance_notes: string;
    data_label: string;
  } | null;
}

export interface DashboardOverview {
  total_requests: number;
  active_clusters: number;
  critical_gap_areas: number;
  states_represented: number;
  states_list: string[];
  categories_list: string[];
  population_impacted: number;
  recent_requests: CitizenRequest[];
}

export interface UserAccount {
  id: string;
  name: string;
  emailOrPhone: string;
  role: 'citizen' | 'governance';
  // Citizen specific fields
  villageOrCity?: string;
  district: string;
  state: string;
  preferredLanguage?: string;
  // Governance specific fields
  department?: string;
  designation?: string;
  jurisdiction?: string;
}
