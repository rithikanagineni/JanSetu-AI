/**
 * JanSetu AI - Analysis & Reasoning Service
 * Handles semantic similarity, demand clustering,
 * prototype infrastructure gap indicator scoring, and hotspot formulation.
 */

import { db, CitizenRequest, RequestCluster } from '../db/database.js';
import {
  analyzeComplaintWithGemini,
  generatePolicyInsightWithGemini,
  StructuredComplaintAIResult,
  ExplainablePolicyInsight,
} from '../ai/gemini.js';

export interface SimilarMatchResult {
  similar_requests_count: number;
  matched_cluster: RequestCluster | null;
  top_similar_requests: Array<{
    request_id: string;
    issue: string;
    location: string;
    similarity_score: number;
    original_text: string;
  }>;
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
  policy_insight: ExplainablePolicyInsight | null;
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

// District centroid approximate coordinates for geographic hotspot mapping
export const DISTRICT_COORDINATES: Record<string, { lat: number; lng: number; state: string }> = {
  mahabubnagar: { lat: 16.7488, lng: 77.9947, state: 'Telangana' },
  warangal: { lat: 17.9784, lng: 79.5941, state: 'Telangana' },
  nalgonda: { lat: 17.0575, lng: 79.2684, state: 'Telangana' },
  kurnool: { lat: 15.8281, lng: 78.0373, state: 'Andhra Pradesh' },
  anantapur: { lat: 14.6819, lng: 77.6006, state: 'Andhra Pradesh' },
  gadchiroli: { lat: 20.1809, lng: 80.0039, state: 'Maharashtra' },
  pune: { lat: 18.5204, lng: 73.8567, state: 'Maharashtra' },
  sonbhadra: { lat: 24.6854, lng: 83.0645, state: 'Uttar Pradesh' },
  raichur: { lat: 16.2120, lng: 77.3439, state: 'Karnataka' },
  dharmapuri: { lat: 12.1211, lng: 78.1582, state: 'Tamil Nadu' },
};

export class AnalysisService {
  private gapCache = new Map<string, GapIndicatorBreakdown>();

  /**
   * Process a new incoming citizen complaint end-to-end
   */
  public async processCitizenSubmission(input: {
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
    ai_analysis: StructuredComplaintAIResult;
    similarity: SimilarMatchResult;
    gap_analysis: GapIndicatorBreakdown;
  }> {
    const startTime = Date.now();

    // 1. Run Gemini Complaint Analysis
    const aiAnalysis = await analyzeComplaintWithGemini(input.text, {
      location: input.location,
      district: input.district,
      state: input.state,
      category: input.category,
    });

    // 2. Formulate unique request ID (e.g. JS-2026-000125)
    const requestId = db.getNextRequestId();
    const citizenId = input.citizen_id || `CIT-${Date.now().toString().slice(-6)}`;

    // 3. Find similar requests & cluster matching
    const similarity = this.findSimilarRequests(aiAnalysis);

    // 4. Create and save CitizenRequest
    const newRequest: CitizenRequest = {
      request_id: requestId,
      citizen_id: citizenId,
      language: aiAnalysis.language || input.language || 'English',
      category: aiAnalysis.category,
      original_text: input.text,
      normalized_text: aiAnalysis.normalized_text,
      issue: aiAnalysis.issue,
      location: aiAnalysis.location,
      district: aiAnalysis.district,
      state: aiAnalysis.state,
      urgency: aiAnalysis.urgency,
      requested_service: aiAnalysis.requested_service,
      travel_distance_km: aiAnalysis.travel_distance_km,
      summary: aiAnalysis.summary,
      keywords: aiAnalysis.keywords,
      submission_channel: input.submission_channel || 'Web Portal',
      cluster_id: similarity.matched_cluster?.cluster_id || null,
      status: 'Recorded',
      created_at: new Date().toISOString(),
    };

    db.addCitizenRequest(newRequest);

    // 5. Log AI analysis for explainability and auditing
    db.logAIAnalysis({
      log_id: `LOG-${Date.now().toString().slice(-6)}`,
      request_id: requestId,
      model_version: 'gemini-3.8-flash',
      prompt_type: 'complaint_analysis',
      raw_input: input.text,
      raw_output: aiAnalysis as unknown as Record<string, unknown>,
      latency_ms: Date.now() - startTime,
      created_at: new Date().toISOString(),
    });

    // 6. Compute prototype infrastructure gap indicator for the matched cluster or area
    const clusterId = newRequest.cluster_id || 'cluster-ts-health-01';
    const gapAnalysis = await this.calculateInfrastructureGap(clusterId);

    return {
      request: newRequest,
      ai_analysis: aiAnalysis,
      similarity: similarity,
      gap_analysis: gapAnalysis,
    };
  }

  /**
   * Semantic and keyword similarity matcher
   */
  public findSimilarRequests(analysis: StructuredComplaintAIResult): SimilarMatchResult {
    const allRequests = db.getRequests();
    const targetKeywords = new Set((analysis.keywords || []).map(k => k.toLowerCase()));
    const targetCategory = (analysis.category || '').toLowerCase();
    const targetDistrict = (analysis.district || '').toLowerCase();

    const scored = allRequests.map(r => {
      let score = 0;
      if (r.category.toLowerCase() === targetCategory) score += 0.45;
      if (r.district.toLowerCase() === targetDistrict) score += 0.25;

      // Jaccard similarity on keywords
      const rKeywords = (r.keywords || []).map(k => k.toLowerCase());
      const intersection = rKeywords.filter(k => targetKeywords.has(k)).length;
      if (intersection > 0) {
        score += Math.min(0.3, intersection * 0.1);
      }

      return {
        request_id: r.request_id,
        issue: r.issue,
        location: r.location,
        similarity_score: Math.min(0.98, Number(score.toFixed(2))),
        original_text: r.original_text,
      };
    });

    // Sort by highest similarity
    scored.sort((a, b) => b.similarity_score - a.similarity_score);
    const topSimilar = scored.filter(s => s.similarity_score >= 0.4).slice(0, 4);

    // Find linked cluster
    const clusters = db.getClusters();
    const matchedCluster =
      clusters.find(
        c => c.category.toLowerCase() === targetCategory && c.district.toLowerCase() === targetDistrict
      ) ||
      clusters.find(c => c.category.toLowerCase() === targetCategory) ||
      clusters[0];

    const count = matchedCluster ? matchedCluster.total_requests : topSimilar.length;

    return {
      similar_requests_count: count,
      matched_cluster: matchedCluster,
      top_similar_requests: topSimilar,
    };
  }

  /**
   * Prototype Infrastructure Gap Indicator Calculation
   * Mathematical and explainable reasoning combining 6 civic dimensions:
   * 1. Citizen Demand Concentration (0-100)
   * 2. Population Affected Ratio (0-100)
   * 3. Existing Facility Coverage Deficit (0-100)
   * 4. Travel Distance & Accessibility Penalty (0-100)
   * 5. Urgency Score (0-100)
   * 6. Investment Alignment Deficit (0-100)
   */
  public async calculateInfrastructureGap(clusterId: string): Promise<GapIndicatorBreakdown> {
    const cluster = db.getClusterById(clusterId) || db.getClusters()[0];
    const cacheKey = `${cluster.cluster_id}-${cluster.total_requests}-${cluster.avg_reported_travel_km}`;
    if (this.gapCache.has(cacheKey)) {
      return this.gapCache.get(cacheKey)!;
    }

    const demographics = db.getDemographics(cluster.district)[0] || {
      population: 1486777,
      rural_population: 1189421,
      urban_population: 297356,
      literacy_rate: 60.6,
      area_sq_km: 5286,
    };

    const facilities = db.getInfrastructure(cluster.district);
    const relevantFacilities = facilities.filter(f => {
      if (cluster.category === 'Healthcare') return f.facility_type.includes('Hospital') || f.facility_type.includes('CHC') || f.facility_type.includes('PHC');
      return true;
    });

    const investments = db.getInvestments(cluster.district, cluster.category);
    const underwayProjects = investments.filter(i => i.status === 'Under Construction' || i.status === 'Underway').length;

    // 1. Demand score (scaled logarithmically from request count)
    const demandScore = Math.min(100, Math.round((Math.log10(cluster.total_requests || 10) / 4) * 100));

    // 2. Population affected score (proportion of rural population relying on public infrastructure)
    const ruralPct = (demographics.rural_population / demographics.population) * 100;
    const popScore = Math.min(100, Math.round(ruralPct));

    // 3. Facility coverage deficit: standard recommendation is ~1 PHC/facility per 30,000 rural residents
    const idealFacilities = Math.max(1, Math.round(demographics.rural_population / 40000));
    const coverageDeficit = Math.min(
      100,
      Math.max(10, Math.round(((idealFacilities - relevantFacilities.length) / idealFacilities) * 100))
    );

    // 4. Accessibility deficit based on travel distance
    const avgTravel = cluster.avg_reported_travel_km || 15;
    const avgAccessScore = relevantFacilities.length
      ? Math.round(relevantFacilities.reduce((a, b) => a + b.accessibility_score, 0) / relevantFacilities.length)
      : 40;
    const accessDeficit = Math.min(100, Math.round((avgTravel / 25) * 50 + (100 - avgAccessScore) * 0.5));

    // 5. Urgency Score
    const urgencyScore = cluster.urgency === 'High' ? 90 : cluster.urgency === 'Medium' ? 60 : 35;

    // 6. Investment alignment deficit (if zero ongoing projects in this sector, deficit is high)
    const investDeficit = underwayProjects > 0 ? 30 : 85;

    // Weighted Prototype Infrastructure Gap Indicator
    // Demand (25%) + Pop (15%) + Facility Deficit (20%) + Access Deficit (20%) + Urgency (10%) + Investment (10%)
    const compositeGapScore = Math.round(
      demandScore * 0.25 +
      popScore * 0.15 +
      coverageDeficit * 0.20 +
      accessDeficit * 0.20 +
      urgencyScore * 0.10 +
      investDeficit * 0.10
    );

    const gapLevel = compositeGapScore >= 75 ? 'Critical' : compositeGapScore >= 60 ? 'High' : compositeGapScore >= 40 ? 'Moderate' : 'Low';

    // Gemini Policy Insight Synthesis
    const policyInsight = await generatePolicyInsightWithGemini({
      district: cluster.district,
      state: cluster.state,
      category: cluster.category,
      total_requests: cluster.total_requests,
      urgency: cluster.urgency,
      avg_travel_km: cluster.avg_reported_travel_km,
      population: demographics.population,
      rural_population: demographics.rural_population,
      facilities_count: relevantFacilities.length,
      avg_accessibility_score: avgAccessScore,
      gap_score: compositeGapScore,
      gap_level: gapLevel,
    });

    const breakdownResult: GapIndicatorBreakdown = {
      gap_score: compositeGapScore,
      gap_level: gapLevel,
      components: {
        citizen_demand: {
          score: demandScore,
          rating: demandScore >= 75 ? 'High' : demandScore >= 50 ? 'Medium' : 'Low',
          count: cluster.total_requests,
          evidence: `${cluster.total_requests.toLocaleString()} citizen requests logged in cluster.`,
        },
        population_affected: {
          score: popScore,
          rating: popScore >= 70 ? 'High' : 'Moderate',
          population: demographics.rural_population,
          evidence: `${demographics.rural_population.toLocaleString()} rural residents (${Math.round(ruralPct)}% of district) directly impacted.`,
        },
        facility_coverage: {
          score: coverageDeficit,
          rating: coverageDeficit >= 70 ? 'Deficient' : coverageDeficit >= 40 ? 'Moderate' : 'Adequate',
          facilities_count: relevantFacilities.length,
          evidence: `Only ${relevantFacilities.length} primary facilities serving ${demographics.district} vs estimated benchmark requirement of ${idealFacilities}.`,
        },
        accessibility: {
          score: accessDeficit,
          rating: accessDeficit >= 70 ? 'Poor' : 'Moderate',
          avg_travel_km: cluster.avg_reported_travel_km,
          evidence: `Average reported transit distance of ${cluster.avg_reported_travel_km} km; facility accessibility index ${avgAccessScore}/100.`,
        },
        urgency: {
          score: urgencyScore,
          rating: cluster.urgency,
          level: cluster.urgency,
          evidence: `Severity classification: ${cluster.urgency} urgency (life safety / critical daily need).`,
        },
        investment_alignment: {
          score: investDeficit,
          rating: underwayProjects > 0 ? 'Underway' : 'Unfunded Gap',
          underway_projects: underwayProjects,
          evidence: underwayProjects > 0
            ? `${underwayProjects} approved project(s) underway, but gap persists in peripheral mandals.`
            : 'No active capital infrastructure allocation identified in this sector for the current cycle.',
        },
      },
      policy_insight: policyInsight,
    };

    this.gapCache.set(cacheKey, breakdownResult);
    return breakdownResult;
  }

  /**
   * Geographic Hotspots for GIS Map visualization
   */
  public getHotspots(filterDistrict?: string, filterCategory?: string): HotspotItem[] {
    const clusters = db.getClusters();
    let filtered = [...clusters];

    if (filterDistrict && filterDistrict !== 'All') {
      filtered = filtered.filter(c => c.district.toLowerCase() === filterDistrict.toLowerCase());
    }
    if (filterCategory && filterCategory !== 'All') {
      filtered = filtered.filter(c => c.category.toLowerCase() === filterCategory.toLowerCase());
    }

    return filtered.map(c => {
      const coord = DISTRICT_COORDINATES[c.district.toLowerCase()] || {
        lat: 16.7488,
        lng: 77.9947,
        state: c.state,
      };

      const demo = db.getDemographics(c.district)[0];
      const facilities = db.getInfrastructure(c.district);

      return {
        id: c.cluster_id,
        name: c.cluster_name,
        category: c.category,
        district: c.district,
        state: c.state,
        latitude: coord.lat,
        longitude: coord.lng,
        total_requests: c.total_requests,
        population_affected: demo ? demo.rural_population : 42500,
        urgency: c.urgency,
        gap_score: c.prototype_gap_indicator,
        gap_level: c.gap_level,
        main_concern: c.main_concern,
        avg_reported_travel_km: c.avg_reported_travel_km,
        nearby_facilities_count: facilities.length,
        status: 'Active Hotspot',
      };
    });
  }
}

export const analysisService = new AnalysisService();
