-- ============================================================================
-- JanSetu AI: Seed Data (Demo Mode — Synthetic Demonstration Data)
-- ============================================================================

-- 1. Citizens
INSERT INTO citizens (citizen_id, anonymized_hash, preferred_language, district, state) VALUES
('CIT-001', 'a1b2c3d4e5f67890123456789abcdef0', 'Telugu', 'Mahabubnagar', 'Telangana'),
('CIT-002', 'b2c3d4e5f67890123456789abcdef01a', 'English', 'Mahabubnagar', 'Telangana'),
('CIT-003', 'c3d4e5f67890123456789abcdef01a2b', 'Hindi', 'Sonbhadra', 'Uttar Pradesh'),
('CIT-004', 'd4e5f67890123456789abcdef01a2b3c', 'Telugu', 'Mahabubnagar', 'Telangana'),
('CIT-005', 'e5f67890123456789abcdef01a2b3c4d', 'English', 'Gadchiroli', 'Maharashtra')
ON CONFLICT (citizen_id) DO NOTHING;

-- 2. Request Clusters
INSERT INTO request_clusters (cluster_id, cluster_name, category, district, state, total_requests, main_concern, avg_reported_travel_km, urgency, demand_concentration, prototype_gap_indicator, gap_level) VALUES
('cluster-ts-health-01', 'Rural Primary Healthcare Access - Mahabubnagar', 'Healthcare', 'Mahabubnagar', 'Telangana', 3842, 'Lack of accessible 24/7 emergency and inpatient healthcare facility within 15 km', 18.7, 'High', 'High', 84.5, 'Critical'),
('cluster-up-health-01', 'Remote Primary Health Infrastructure - Sonbhadra', 'Healthcare', 'Sonbhadra', 'Uttar Pradesh', 2190, 'Excessive travel distance to nearest CHC and non-functional sub-centres', 24.2, 'High', 'High', 81.0, 'Critical'),
('cluster-ts-water-01', 'Drinking Water & Groundwater Salinity - Mahabubnagar', 'Water', 'Mahabubnagar', 'Telangana', 1420, 'Irregular piped supply and pipeline leakages during summer peak', 3.8, 'Medium', 'Medium', 62.0, 'Moderate'),
('cluster-mh-road-01', 'All-Weather Road Connectivity - Gadchiroli', 'Roads', 'Gadchiroli', 'Maharashtra', 2340, 'Bridge cutoffs during monsoon preventing ambulance and school bus transit', 14.5, 'High', 'High', 78.5, 'Critical'),
('cluster-ap-transit-01', 'RTC Bus Frequency for Students & Commuters - Kurnool', 'Public Transport', 'Kurnool', 'Andhra Pradesh', 980, 'Low bus schedule frequency forcing reliance on private auto-rickshaws', 16.0, 'Medium', 'Medium', 54.0, 'Moderate'),
('cluster-ts-edu-01', 'Rural High School Labs & Teacher Strength - Warangal', 'Education', 'Warangal', 'Telangana', 760, 'Teacher vacancies and absent STEM laboratory infrastructure in Mandal schools', 0.0, 'Medium', 'Medium', 48.0, 'Moderate'),
('cluster-up-power-01', 'Agricultural Power Quality & Transformer Stability - Sonbhadra', 'Electricity', 'Sonbhadra', 'Uttar Pradesh', 1650, 'Low voltage and frequent transformer burnouts damaging tubewell motors', 0.0, 'High', 'High', 72.0, 'High')
ON CONFLICT (cluster_id) DO NOTHING;

-- 3. Demographics
INSERT INTO demographics (district_id, state, district, population, rural_population, urban_population, literacy_rate, area_sq_km) VALUES
('DEMO-TS-MBNR', 'Telangana', 'Mahabubnagar', 1486777, 1189421, 297356, 60.6, 5286),
('DEMO-TS-WRGL', 'Telangana', 'Warangal', 1135708, 794995, 340713, 75.9, 1766),
('DEMO-TS-NLGD', 'Telangana', 'Nalgonda', 1618416, 1391837, 226579, 63.7, 7122),
('DEMO-AP-KRNL', 'Andhra Pradesh', 'Kurnool', 2271686, 1703764, 567922, 60.0, 7980),
('DEMO-MH-GDCH', 'Maharashtra', 'Gadchiroli', 1072942, 954918, 118024, 74.4, 14412),
('DEMO-UP-SNBD', 'Uttar Pradesh', 'Sonbhadra', 1862559, 1545923, 316636, 64.0, 6788),
('DEMO-KA-RCHR', 'Karnataka', 'Raichur', 1928812, 1427320, 501492, 59.6, 8386),
('DEMO-TN-DHRM', 'Tamil Nadu', 'Dharmapuri', 1506843, 1249760, 257083, 68.5, 4497)
ON CONFLICT (district_id) DO NOTHING;

-- 4. Infrastructure Facilities
INSERT INTO infrastructure (facility_id, facility_name, facility_type, state, district, latitude, longitude, capacity, population_served, accessibility_score, condition_rating) VALUES
('FAC-TS-01', 'Mahabubnagar District Hospital', 'District Hospital', 'Telangana', 'Mahabubnagar', 16.7488, 77.9947, 350, 180000, 74.0, 'Good'),
('FAC-TS-02', 'Jadcherla Community Health Centre', 'CHC', 'Telangana', 'Mahabubnagar', 16.7724, 78.1368, 50, 45000, 58.0, 'Fair'),
('FAC-TS-03', 'Bhoothpur Primary Health Centre', 'PHC', 'Telangana', 'Mahabubnagar', 16.6987, 77.9712, 12, 18500, 42.0, 'Needs Upgrade'),
('FAC-TS-04', 'Midjil Sub-Centre', 'Sub-Centre', 'Telangana', 'Mahabubnagar', 16.6541, 78.2134, 4, 8200, 31.0, 'Dilapidated'),
('FAC-TS-05', 'Warangal MGM Hospital', 'Tertiary Hospital', 'Telangana', 'Warangal', 17.9784, 79.5941, 600, 320000, 82.0, 'Good'),
('FAC-AP-01', 'Kurnool Government General Hospital', 'Tertiary Hospital', 'Andhra Pradesh', 'Kurnool', 15.8281, 78.0373, 550, 290000, 78.0, 'Good'),
('FAC-MH-01', 'Aheri Sub-District Hospital', 'Sub-District Hospital', 'Maharashtra', 'Gadchiroli', 19.4123, 80.0123, 75, 42000, 45.0, 'Fair'),
('FAC-UP-01', 'Dudhi Community Health Centre', 'CHC', 'Uttar Pradesh', 'Sonbhadra', 24.2145, 83.2512, 30, 34000, 38.0, 'Needs Upgrade')
ON CONFLICT (facility_id) DO NOTHING;

-- 5. Citizen Requests
INSERT INTO citizen_requests (request_id, citizen_id, language, category, original_text, normalized_text, issue, location, district, state, urgency, requested_service, travel_distance_km, summary, keywords, submission_channel, cluster_id, status) VALUES
('JS-2026-000101', 'CIT-001', 'Telugu', 'Healthcare', 'మా గ్రామంలో సరైన ఆసుపత్రి లేదు. చికిత్స కోసం 20 కిలోమీటర్లు ప్రయాణించాలి.', 'Our village does not have a proper hospital. We have to travel 20 km for treatment.', 'Lack of nearby healthcare facility', 'Bhoothpur Rural', 'Mahabubnagar', 'Telangana', 'High', 'Primary Health Centre', 20.0, 'Residents need to travel approximately 20 km for essential medical treatment.', '["hospital", "healthcare", "distance", "treatment"]'::jsonb, 'Voice', 'cluster-ts-health-01', 'Recorded'),
('JS-2026-000102', 'CIT-002', 'English', 'Healthcare', 'Our village does not have a proper hospital. We have to travel 20 km for treatment.', 'Our village does not have a proper hospital. We have to travel 20 km for treatment.', 'Lack of nearby healthcare facility', 'Midjil Mandal', 'Mahabubnagar', 'Telangana', 'High', 'Healthcare facility', 20.0, 'Citizen reports traveling 20 km to access nearest hospital for general illnesses and emergency care.', '["hospital", "healthcare", "distance", "rural"]'::jsonb, 'Web Portal', 'cluster-ts-health-01', 'Recorded'),
('JS-2026-000104', 'CIT-003', 'Hindi', 'Healthcare', 'हमारे गांव में प्राथमिक स्वास्थ्य केंद्र नहीं है। इलाज के लिए 25 किलोमीटर दूर जाना पड़ता है।', 'There is no primary health centre in our village. We have to travel 25 kilometers for medical care.', 'No primary health centre in village', 'Dudhi Sector', 'Sonbhadra', 'Uttar Pradesh', 'High', 'Primary Health Centre', 25.0, 'Villagers face a 25 km commute to reach functional medical clinics.', '["hospital", "phc", "distance", "clinic"]'::jsonb, 'Voice', 'cluster-up-health-01', 'Recorded')
ON CONFLICT (request_id) DO NOTHING;

-- 6. Investments
INSERT INTO investments (project_id, project_name, state, district, sector, status, investment_amount_lakhs, year, implementing_agency) VALUES
('INV-TS-2024-01', 'Upgradation of Jadcherla CHC to 100-bed Area Hospital', 'Telangana', 'Mahabubnagar', 'Healthcare', 'Under Construction', 850.00, 2024, 'Telangana Medical Infrastructure Corp'),
('INV-TS-2023-04', 'Rural Road All-Weather Connectivity Phase II', 'Telangana', 'Mahabubnagar', 'Roads', 'Completed', 420.00, 2023, 'Panchayat Raj Dept'),
('INV-TS-2025-02', 'Mission Bhagiratha Water Pipeline Extension', 'Telangana', 'Mahabubnagar', 'Water', 'In Planning', 310.00, 2025, 'Rural Water Supply Dept')
ON CONFLICT (project_id) DO NOTHING;

-- 7. Impact Metrics
INSERT INTO impact_metrics (intervention_id, project_name, sector, district, state, implementation_period, pre_requests_count, post_requests_count, pre_avg_travel_km, post_avg_travel_km, pre_accessibility_score, post_accessibility_score, satisfaction_pct, status) VALUES
('IMP-2025-01', 'Upgradation of Jadcherla Community Health Centre & Mobile Clinic', 'Healthcare', 'Mahabubnagar', 'Telangana', '2024-2025', 3842, 1920, 20.0, 8.0, 42.0, 78.0, 82.4, 'Completed & Monitored'),
('IMP-2024-02', 'Mission Bhagiratha Habitation Feeder Water Network', 'Water', 'Mahabubnagar', 'Telangana', '2023-2024', 2410, 610, 4.2, 0.8, 48.0, 88.0, 89.1, 'Completed & Monitored')
ON CONFLICT (intervention_id) DO NOTHING;
