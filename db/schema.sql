-- ============================================================================
-- JanSetu AI: Civic Intelligence Platform Database Schema (PostgreSQL)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Citizens (anonymized profiles to safeguard privacy)
CREATE TABLE IF NOT EXISTS citizens (
    citizen_id VARCHAR(64) PRIMARY KEY,
    anonymized_hash VARCHAR(128) NOT NULL,
    preferred_language VARCHAR(32) DEFAULT 'English',
    district VARCHAR(64),
    state VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Request Clusters (Aggregated Demand Hotspots)
CREATE TABLE IF NOT EXISTS request_clusters (
    cluster_id VARCHAR(64) PRIMARY KEY,
    cluster_name VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    district VARCHAR(64) NOT NULL,
    state VARCHAR(64) NOT NULL,
    total_requests INT DEFAULT 0,
    main_concern TEXT,
    avg_reported_travel_km NUMERIC(5, 2) DEFAULT 0.0,
    urgency VARCHAR(32) DEFAULT 'Medium',
    demand_concentration VARCHAR(32) DEFAULT 'Medium',
    prototype_gap_indicator NUMERIC(5, 2) DEFAULT 0.0,
    gap_level VARCHAR(32) DEFAULT 'Moderate',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Citizen Requests (Multilingual Complaints & Development Requests)
CREATE TABLE IF NOT EXISTS citizen_requests (
    request_id VARCHAR(64) PRIMARY KEY,
    citizen_id VARCHAR(64) REFERENCES citizens(citizen_id) ON DELETE SET NULL,
    language VARCHAR(32) NOT NULL,
    category VARCHAR(64) NOT NULL,
    original_text TEXT NOT NULL,
    normalized_text TEXT,
    issue VARCHAR(255) NOT NULL,
    location VARCHAR(128),
    district VARCHAR(64) NOT NULL,
    state VARCHAR(64) NOT NULL,
    urgency VARCHAR(32) DEFAULT 'Medium',
    requested_service VARCHAR(128),
    travel_distance_km NUMERIC(5, 2),
    summary TEXT,
    keywords JSONB DEFAULT '[]'::jsonb,
    submission_channel VARCHAR(32) DEFAULT 'Web Portal',
    cluster_id VARCHAR(64) REFERENCES request_clusters(cluster_id) ON DELETE SET NULL,
    status VARCHAR(32) DEFAULT 'Recorded',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Demographics (Official/Synthetic District Context)
CREATE TABLE IF NOT EXISTS demographics (
    district_id VARCHAR(64) PRIMARY KEY,
    state VARCHAR(64) NOT NULL,
    district VARCHAR(64) NOT NULL,
    population INT NOT NULL,
    rural_population INT NOT NULL,
    urban_population INT NOT NULL,
    literacy_rate NUMERIC(4, 1),
    area_sq_km NUMERIC(8, 2),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Infrastructure Facilities
CREATE TABLE IF NOT EXISTS infrastructure (
    facility_id VARCHAR(64) PRIMARY KEY,
    facility_name VARCHAR(255) NOT NULL,
    facility_type VARCHAR(64) NOT NULL,
    state VARCHAR(64) NOT NULL,
    district VARCHAR(64) NOT NULL,
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    capacity INT DEFAULT 0,
    population_served INT DEFAULT 0,
    accessibility_score NUMERIC(5, 2) DEFAULT 50.0,
    condition_rating VARCHAR(32) DEFAULT 'Fair',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Public Investments
CREATE TABLE IF NOT EXISTS investments (
    project_id VARCHAR(64) PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    state VARCHAR(64) NOT NULL,
    district VARCHAR(64) NOT NULL,
    sector VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL,
    investment_amount_lakhs NUMERIC(10, 2) NOT NULL,
    year INT NOT NULL,
    implementing_agency VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Priority Projects (Policymaker Decision Support Pipeline)
CREATE TABLE IF NOT EXISTS priority_projects (
    priority_id VARCHAR(64) PRIMARY KEY,
    cluster_id VARCHAR(64) REFERENCES request_clusters(cluster_id) ON DELETE CASCADE,
    recommended_intervention VARCHAR(255) NOT NULL,
    urgency_tier VARCHAR(32) NOT NULL,
    estimated_impact_population INT,
    evidence_summary TEXT,
    human_status VARCHAR(64) DEFAULT 'Under Review by Public Authority',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Impact Metrics (Before vs After Interventions)
CREATE TABLE IF NOT EXISTS impact_metrics (
    intervention_id VARCHAR(64) PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    sector VARCHAR(64) NOT NULL,
    district VARCHAR(64) NOT NULL,
    state VARCHAR(64) NOT NULL,
    implementation_period VARCHAR(64),
    pre_requests_count INT NOT NULL,
    post_requests_count INT NOT NULL,
    pre_avg_travel_km NUMERIC(5, 2) NOT NULL,
    post_avg_travel_km NUMERIC(5, 2) NOT NULL,
    pre_accessibility_score NUMERIC(5, 2) NOT NULL,
    post_accessibility_score NUMERIC(5, 2) NOT NULL,
    satisfaction_pct NUMERIC(4, 1),
    status VARCHAR(64) DEFAULT 'Completed & Monitored'
);

-- 9. AI Analysis Logs (Auditing, Explainability & Verification)
CREATE TABLE IF NOT EXISTS ai_analysis_logs (
    log_id VARCHAR(64) PRIMARY KEY,
    request_id VARCHAR(64) REFERENCES citizen_requests(request_id) ON DELETE CASCADE,
    model_version VARCHAR(64) NOT NULL,
    prompt_type VARCHAR(64) NOT NULL,
    raw_input TEXT NOT NULL,
    raw_output JSONB NOT NULL,
    latency_ms INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_requests_district ON citizen_requests(district);
CREATE INDEX IF NOT EXISTS idx_requests_category ON citizen_requests(category);
CREATE INDEX IF NOT EXISTS idx_requests_cluster ON citizen_requests(cluster_id);
CREATE INDEX IF NOT EXISTS idx_infra_district ON infrastructure(district);
