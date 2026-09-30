/**
 * JanSetu AI - Core System Verification Tests
 * Validates Complaint Ingestion, Gemini Entity Parsing, Similarity Clustering,
 * Prototype Infrastructure Gap Indicator Calculation, and Dashboard Aggregations.
 */

import { db } from '../server/db/database.js';
import { analysisService } from '../server/services/analysisService.js';
import { speechService } from '../server/services/speechService.js';

async function runTests() {
  console.log('--- [JanSetu AI Test Suite Starting] ---');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✓ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`✗ [FAIL] ${testName}`);
      failed++;
    }
  }

  // 1. Database Seeding & Initial State
  const initialClusters = db.getClusters();
  assert(initialClusters.length >= 7, 'Database seeds initial demand clusters across sectors');

  const initialRequests = db.getRequests();
  assert(initialRequests.length >= 8, 'Database seeds initial citizen complaints');

  const initialDemographics = db.getDemographics('Mahabubnagar');
  assert(initialDemographics.length > 0 && initialDemographics[0].population > 1000000, 'Demographics query returns valid census indicators');

  // 2. Multilingual Voice Preset Verification (Telugu Scenario)
  const voiceResult = speechService.getDemoPreset('telugu-hospital');
  assert(
    voiceResult.language === 'Telugu' && voiceResult.text.includes('ఆసుపత్రి'),
    'Speech service returns verified Telugu hospital grievance transcript'
  );

  // 3. End-to-End Submission & Gemini Complaint Analysis
  const submission = await analysisService.processCitizenSubmission({
    text: 'మా గ్రామంలో సరైన ఆసుపత్రి లేదు. చికిత్స కోసం 20 కిలోమీటర్లు ప్రయాణించాలి.',
    language: 'Telugu',
    location: 'Bhoothpur Rural',
    district: 'Mahabubnagar',
    state: 'Telangana',
    category: 'Healthcare',
  });

  assert(submission.request.request_id.startsWith('JS-2026-'), 'Generated unique Request ID matching JS-2026-XXXXXX format');
  assert(submission.ai_analysis.category === 'Healthcare', 'Gemini analysis extracted Healthcare category');
  assert(submission.ai_analysis.urgency === 'High', 'Extracted High urgency based on emergency hospital deficit');
  assert(submission.ai_analysis.travel_distance_km === 20, 'Extracted 20 km travel distance accurately');

  // 4. Similarity Matching & Clustering
  assert(submission.similarity.similar_requests_count > 1000, 'Linked complaint to district cluster with realistic count');
  assert(submission.similarity.matched_cluster !== null, 'Found matching demand cluster in Mahabubnagar');

  // 5. Prototype Infrastructure Gap Indicator Calculation
  const gap = await analysisService.calculateInfrastructureGap('cluster-ts-health-01');
  assert(gap.gap_score >= 70 && gap.gap_score <= 100, `Prototype Gap Indicator is within valid range (Score: ${gap.gap_score})`);
  assert(gap.gap_level === 'Critical' || gap.gap_level === 'High', `Gap level is evaluated as ${gap.gap_level}`);
  assert(gap.components.citizen_demand.count > 0, 'Demand concentration factor evaluates request volume');
  assert(gap.policy_insight !== null, 'Explainable policy memo generated with evidence breakdown');

  // 6. GIS Hotspot Formulation
  const hotspots = analysisService.getHotspots('Mahabubnagar');
  assert(hotspots.length > 0 && hotspots[0].latitude !== 0, 'Hotspots generated with exact geographic coordinates');

  // 7. Dashboard Overview Aggregations
  const overview = db.getDashboardOverview();
  assert(overview.total_requests > 10000, 'Dashboard overview aggregates total requests accurately');
  assert(overview.active_clusters >= 7, 'Dashboard overview aggregates active clusters');

  console.log(`--- [Test Suite Finished: ${passed} Passed, ${failed} Failed] ---`);
  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
