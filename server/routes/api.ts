/**
 * JanSetu AI - REST API Controller
 * Implements civic intelligence endpoints for citizen submissions,
 * similarity clustering, infrastructure gap indicator calculations,
 * and policymaker decision support.
 */

import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { analysisService } from '../services/analysisService.js';
import { speechService } from '../services/speechService.js';
import { isGeminiConfigured } from '../ai/gemini.js';

export const apiRouter = Router();

/**
 * 1. POST /api/requests
 * Citizen submits a complaint (text or voice-transcribed).
 * Runs Gemini analysis, finds similar requests, associates with cluster,
 * computes gap indicators, and stores the request.
 */
apiRouter.post('/requests', async (req: Request, res: Response) => {
  try {
    const { text, language, location, district, state, category, submission_channel, citizen_id } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      res.status(400).json({ error: 'Citizen complaint text is required.' });
      return;
    }

    const result = await analysisService.processCitizenSubmission({
      text: text.trim(),
      language,
      location,
      district,
      state,
      category,
      submission_channel: submission_channel || 'Web Portal',
      citizen_id,
    });

    res.status(201).json({
      success: true,
      data: result,
      meta: {
        demo_mode: !isGeminiConfigured(),
        data_disclaimer: 'Synthetic demonstration data — official verification required.',
      },
    });
  } catch (error) {
    console.error('[JanSetu AI] Error handling /api/requests:', error);
    res.status(500).json({ error: 'Failed to process citizen request.' });
  }
});

/**
 * 2. GET /api/requests
 * List citizen requests with optional filtering.
 */
apiRouter.get('/requests', (req: Request, res: Response) => {
  try {
    const { category, district, state, urgency, language, cluster_id, citizen_id, limit } = req.query;

    const requests = db.getRequests({
      category: category as string,
      district: district as string,
      state: state as string,
      urgency: urgency as string,
      language: language as string,
      cluster_id: cluster_id as string,
      citizen_id: citizen_id as string,
      limit: limit ? parseInt(limit as string, 10) : undefined,
    });

    res.json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error('[JanSetu AI] Error in GET /api/requests:', error);
    res.status(500).json({ error: 'Failed to fetch citizen requests.' });
  }
});

/**
 * 3. GET /api/requests/:id
 * Retrieve a specific citizen request and its linked AI analysis log.
 */
apiRouter.get('/requests/:id', (req: Request, res: Response) => {
  try {
    const request = db.getRequestById(req.params.id);
    if (!request) {
      res.status(404).json({ error: 'Citizen request not found.' });
      return;
    }

    const logs = db.getAILogs(request.request_id);
    const cluster = request.cluster_id ? db.getClusterById(request.cluster_id) : null;

    res.json({
      success: true,
      data: {
        ...request,
        linked_cluster: cluster,
        ai_audit_log: logs[0] || null,
      },
    });
  } catch (error) {
    console.error('[JanSetu AI] Error in GET /api/requests/:id:', error);
    res.status(500).json({ error: 'Failed to fetch request detail.' });
  }
});

/**
 * 4. POST /api/analyze
 * Standalone complaint analysis endpoint without immediate saving.
 */
apiRouter.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { text, location, district, state, category } = req.body;
    if (!text) {
      res.status(400).json({ error: 'Text prompt is required.' });
      return;
    }

    const { analyzeComplaintWithGemini } = await import('../ai/gemini.js');
    const result = await analyzeComplaintWithGemini(text, {
      location,
      district,
      state,
      category,
    });

    res.json({
      success: true,
      data: result,
      meta: {
        model: 'gemini-3.8-flash',
        mode: isGeminiConfigured() ? 'Live Gemini Reasoning' : 'Demo Mode Engine',
      },
    });
  } catch (error) {
    console.error('[JanSetu AI] Error in POST /api/analyze:', error);
    res.status(500).json({ error: 'Failed to analyze text with Gemini.' });
  }
});

/**
 * 5. GET /api/clusters
 * List all aggregated demand clusters.
 */
apiRouter.get('/clusters', (req: Request, res: Response) => {
  try {
    const { category, district, state } = req.query;
    const clusters = db.getClusters({
      category: category as string,
      district: district as string,
      state: state as string,
    });

    res.json({
      success: true,
      count: clusters.length,
      data: clusters,
    });
  } catch (error) {
    console.error('[JanSetu AI] Error in GET /api/clusters:', error);
    res.status(500).json({ error: 'Failed to fetch demand clusters.' });
  }
});

/**
 * 6. GET /api/clusters/:id
 * Retrieve a specific cluster along with detailed gap indicator breakdown.
 */
apiRouter.get('/clusters/:id', async (req: Request, res: Response) => {
  try {
    const cluster = db.getClusterById(req.params.id);
    if (!cluster) {
      res.status(404).json({ error: 'Cluster not found.' });
      return;
    }

    const gapBreakdown = await analysisService.calculateInfrastructureGap(cluster.cluster_id);
    const linkedRequests = db.getRequests({ cluster_id: cluster.cluster_id });
    const facilities = db.getInfrastructure(cluster.district);
    const investments = db.getInvestments(cluster.district, cluster.category);

    res.json({
      success: true,
      data: {
        cluster,
        gap_breakdown: gapBreakdown,
        linked_requests: linkedRequests,
        nearby_facilities: facilities,
        relevant_investments: investments,
      },
    });
  } catch (error) {
    console.error('[JanSetu AI] Error in GET /api/clusters/:id:', error);
    res.status(500).json({ error: 'Failed to fetch cluster detail.' });
  }
});

/**
 * 7. GET /api/infrastructure
 * List public facilities with filters.
 */
apiRouter.get('/infrastructure', (req: Request, res: Response) => {
  try {
    const { district, state, sector } = req.query;
    const facilities = db.getInfrastructure(district as string, state as string, sector as string);

    res.json({
      success: true,
      count: facilities.length,
      data: facilities,
    });
  } catch (error) {
    console.error('[JanSetu AI] Error in GET /api/infrastructure:', error);
    res.status(500).json({ error: 'Failed to fetch infrastructure.' });
  }
});

/**
 * 8. GET /api/hotspots
 * Returns geographic hotspot markers for map visualization.
 */
apiRouter.get('/hotspots', (req: Request, res: Response) => {
  try {
    const { district, category } = req.query;
    const hotspots = analysisService.getHotspots(district as string, category as string);

    res.json({
      success: true,
      count: hotspots.length,
      data: hotspots,
    });
  } catch (error) {
    console.error('[JanSetu AI] Error in GET /api/hotspots:', error);
    res.status(500).json({ error: 'Failed to fetch hotspots.' });
  }
});

/**
 * 9. GET /api/dashboard
 * Aggregated dashboard overview metrics.
 */
apiRouter.get('/dashboard', (req: Request, res: Response) => {
  try {
    const overview = db.getDashboardOverview();
    res.json({
      success: true,
      data: overview,
    });
  } catch (error) {
    console.error('[JanSetu AI] Error in GET /api/dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard metrics.' });
  }
});

/**
 * 10. GET /api/impact
 * Before and after intervention measurements and tracking data.
 */
apiRouter.get('/impact', (req: Request, res: Response) => {
  try {
    const metrics = db.getImpactMetrics();
    res.json({
      success: true,
      data: metrics,
      meta: {
        disclaimer: 'Synthetic demonstration metrics — actual impact requires post-implementation field surveys.',
      },
    });
  } catch (error) {
    console.error('[JanSetu AI] Error in GET /api/impact:', error);
    res.status(500).json({ error: 'Failed to fetch impact metrics.' });
  }
});

/**
 * 11. POST /api/policy-insight
 * Generate on-demand policy memo for a cluster or district.
 */
apiRouter.post('/policy-insight', async (req: Request, res: Response) => {
  try {
    const { cluster_id } = req.body;
    const targetClusterId = cluster_id || 'cluster-ts-health-01';
    const gapAnalysis = await analysisService.calculateInfrastructureGap(targetClusterId);

    res.json({
      success: true,
      data: gapAnalysis.policy_insight,
      breakdown: gapAnalysis.components,
      gap_score: gapAnalysis.gap_score,
      gap_level: gapAnalysis.gap_level,
    });
  } catch (error) {
    console.error('[JanSetu AI] Error in POST /api/policy-insight:', error);
    res.status(500).json({ error: 'Failed to synthesize policy insight.' });
  }
});

/**
 * 12. POST /api/transcribe
 * Voice speech-to-text endpoint.
 */
apiRouter.post('/transcribe', async (req: Request, res: Response) => {
  try {
    const { audio_base64, mime_type, preset } = req.body;
    const result = await speechService.transcribeAudio(audio_base64, mime_type, preset);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[JanSetu AI] Error in POST /api/transcribe:', error);
    res.status(500).json({ error: 'Failed to transcribe audio.' });
  }
});

/**
 * 13. GET /api/health
 * Health check and configuration status.
 */
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    app: 'JanSetu AI',
    version: '1.0.0-mvp',
    environment: process.env.NODE_ENV || 'development',
    gemini_configured: isGeminiConfigured(),
    gemini_model: 'gemini-3.8-flash',
    speech_model: 'gemini-3.5-transcribe',
    demo_mode: !isGeminiConfigured() || process.env.DEMO_MODE === 'true',
    timestamp: new Date().toISOString(),
  });
});

/**
 * 14. POST /api/reset-demo
 * Restores original seed data.
 */
apiRouter.post('/reset-demo', (_req: Request, res: Response) => {
  db.resetDemoData();
  res.json({
    success: true,
    message: 'Demo dataset reset successfully to initial state.',
  });
});
