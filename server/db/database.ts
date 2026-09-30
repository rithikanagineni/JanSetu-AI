/**
 * JanSetu AI - Relational Database Management Layer
 * Provides relational storage, query filters, demo seed data,
 * and gap indicator calculation.
 */

export interface Citizen {
  citizen_id: string;
  anonymized_hash: string;
  preferred_language: string;
  district: string;
  state: string;
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

export interface Demographics {
  district_id: string;
  state: string;
  district: string;
  population: number;
  rural_population: number;
  urban_population: number;
  literacy_rate: number;
  area_sq_km: number;
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

export interface InvestmentRecord {
  project_id: string;
  project_name: string;
  state: string;
  district: string;
  sector: string;
  status: string;
  investment_amount_lakhs: number;
  year: number;
  implementing_agency: string;
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

export interface AIAnalysisLog {
  log_id: string;
  request_id: string;
  model_version: string;
  prompt_type: string;
  raw_input: string;
  raw_output: Record<string, unknown>;
  latency_ms: number;
  created_at: string;
}

// Initial In-Memory Seed Storage
class DatabaseService {
  private citizens: Citizen[] = [];
  private clusters: RequestCluster[] = [];
  private requests: CitizenRequest[] = [];
  private demographics: Demographics[] = [];
  private infrastructure: InfrastructureFacility[] = [];
  private investments: InvestmentRecord[] = [];
  private impactMetrics: ImpactMetric[] = [];
  private aiLogs: AIAnalysisLog[] = [];
  private requestCounter = 124;

  constructor() {
    this.seedDatabase();
  }

  public resetDemoData() {
    this.seedDatabase();
  }

  private seedDatabase() {
    this.citizens = [
      {
        citizen_id: 'CIT-TS-001',
        anonymized_hash: 'a1b2c3d4e5f67890123456789abcdef0',
        preferred_language: 'Telugu',
        district: 'Mahabubnagar',
        state: 'Telangana',
        created_at: new Date('2026-09-20T08:00:00Z').toISOString(),
      },
      {
        citizen_id: 'CIT-TS-002',
        anonymized_hash: 'b2c3d4e5f67890123456789abcdef01a',
        preferred_language: 'English',
        district: 'Mahabubnagar',
        state: 'Telangana',
        created_at: new Date('2026-09-21T09:00:00Z').toISOString(),
      },
      {
        citizen_id: 'CIT-UP-003',
        anonymized_hash: 'c3d4e5f67890123456789abcdef01a2b',
        preferred_language: 'Hindi',
        district: 'Sonbhadra',
        state: 'Uttar Pradesh',
        created_at: new Date('2026-09-22T10:00:00Z').toISOString(),
      },
      {
        citizen_id: 'CIT-MH-004',
        anonymized_hash: 'd4e5f67890123456789abcdef01a2b3c',
        preferred_language: 'English',
        district: 'Gadchiroli',
        state: 'Maharashtra',
        created_at: new Date('2026-09-23T11:00:00Z').toISOString(),
      },
      {
        citizen_id: 'CIT-AP-005',
        anonymized_hash: 'e5f67890123456789abcdef01a2b3c4d',
        preferred_language: 'Telugu',
        district: 'Kurnool',
        state: 'Andhra Pradesh',
        created_at: new Date('2026-09-24T12:00:00Z').toISOString(),
      },
    ];

    this.clusters = [
      {
        cluster_id: 'cluster-ts-health-01',
        cluster_name: 'Rural Primary Healthcare Access - Mahabubnagar',
        category: 'Healthcare',
        district: 'Mahabubnagar',
        state: 'Telangana',
        total_requests: 3842,
        main_concern: 'Lack of accessible 24/7 emergency and primary healthcare facility within 15 km',
        avg_reported_travel_km: 18.7,
        urgency: 'High',
        demand_concentration: 'High',
        prototype_gap_indicator: 84.5,
        gap_level: 'Critical',
        created_at: '2026-09-15T00:00:00Z',
        updated_at: '2026-09-28T09:00:00Z',
      },
      {
        cluster_id: 'cluster-up-health-01',
        cluster_name: 'Remote Primary Health Infrastructure - Sonbhadra',
        category: 'Healthcare',
        district: 'Sonbhadra',
        state: 'Uttar Pradesh',
        total_requests: 2190,
        main_concern: 'Excessive travel distance to nearest CHC and non-functional sub-centres',
        avg_reported_travel_km: 24.2,
        urgency: 'High',
        demand_concentration: 'High',
        prototype_gap_indicator: 81.0,
        gap_level: 'Critical',
        created_at: '2026-09-16T00:00:00Z',
        updated_at: '2026-09-28T09:00:00Z',
      },
      {
        cluster_id: 'cluster-mh-road-01',
        cluster_name: 'All-Weather Road Connectivity - Gadchiroli',
        category: 'Roads',
        district: 'Gadchiroli',
        state: 'Maharashtra',
        total_requests: 2340,
        main_concern: 'Bridge cutoffs during monsoon preventing ambulance and school bus transit',
        avg_reported_travel_km: 14.5,
        urgency: 'High',
        demand_concentration: 'High',
        prototype_gap_indicator: 78.5,
        gap_level: 'Critical',
        created_at: '2026-09-17T00:00:00Z',
        updated_at: '2026-09-28T09:00:00Z',
      },
      {
        cluster_id: 'cluster-ts-water-01',
        cluster_name: 'Drinking Water & Groundwater Salinity - Mahabubnagar',
        category: 'Water',
        district: 'Mahabubnagar',
        state: 'Telangana',
        total_requests: 1420,
        main_concern: 'Irregular piped supply and pipeline leakages during summer peak',
        avg_reported_travel_km: 3.8,
        urgency: 'Medium',
        demand_concentration: 'Medium',
        prototype_gap_indicator: 62.0,
        gap_level: 'Moderate',
        created_at: '2026-09-18T00:00:00Z',
        updated_at: '2026-09-28T09:00:00Z',
      },
      {
        cluster_id: 'cluster-up-power-01',
        cluster_name: 'Agricultural Power Quality & Transformer Stability - Sonbhadra',
        category: 'Electricity',
        district: 'Sonbhadra',
        state: 'Uttar Pradesh',
        total_requests: 1650,
        main_concern: 'Low voltage and frequent transformer burnouts damaging tubewell irrigation',
        avg_reported_travel_km: 0.0,
        urgency: 'High',
        demand_concentration: 'High',
        prototype_gap_indicator: 72.0,
        gap_level: 'High',
        created_at: '2026-09-19T00:00:00Z',
        updated_at: '2026-09-28T09:00:00Z',
      },
      {
        cluster_id: 'cluster-ap-transit-01',
        cluster_name: 'RTC Bus Frequency for Students & Commuters - Kurnool',
        category: 'Public Transport',
        district: 'Kurnool',
        state: 'Andhra Pradesh',
        total_requests: 980,
        main_concern: 'Low bus schedule frequency forcing reliance on private auto-rickshaws',
        avg_reported_travel_km: 16.0,
        urgency: 'Medium',
        demand_concentration: 'Medium',
        prototype_gap_indicator: 54.0,
        gap_level: 'Moderate',
        created_at: '2026-09-20T00:00:00Z',
        updated_at: '2026-09-28T09:00:00Z',
      },
      {
        cluster_id: 'cluster-ts-edu-01',
        cluster_name: 'Rural High School Labs & Teacher Strength - Warangal',
        category: 'Education',
        district: 'Warangal',
        state: 'Telangana',
        total_requests: 760,
        main_concern: 'Teacher vacancies and absent STEM laboratory infrastructure in Mandal schools',
        avg_reported_travel_km: 0.0,
        urgency: 'Medium',
        demand_concentration: 'Medium',
        prototype_gap_indicator: 48.0,
        gap_level: 'Moderate',
        created_at: '2026-09-21T00:00:00Z',
        updated_at: '2026-09-28T09:00:00Z',
      },
      {
        cluster_id: 'cluster-ka-water-01',
        cluster_name: 'Fluoride Filtration & Piped Drinking Water - Raichur',
        category: 'Water',
        district: 'Raichur',
        state: 'Karnataka',
        total_requests: 1210,
        main_concern: 'High fluoride levels in groundwater and dry borewells in summer',
        avg_reported_travel_km: 4.5,
        urgency: 'High',
        demand_concentration: 'High',
        prototype_gap_indicator: 69.0,
        gap_level: 'High',
        created_at: '2026-09-22T00:00:00Z',
        updated_at: '2026-09-28T09:00:00Z',
      },
    ];

    this.requests = [
      {
        request_id: 'JS-2026-000101',
        citizen_id: 'CIT-TS-001',
        language: 'Telugu',
        category: 'Healthcare',
        original_text: 'మా గ్రామంలో సరైన ఆసుపత్రి లేదు. చికిత్స కోసం 20 కిలోమీటర్లు ప్రయాణించాలి.',
        normalized_text: 'Our village does not have a proper hospital. We have to travel 20 km for treatment.',
        issue: 'Lack of nearby healthcare facility',
        location: 'Bhoothpur Rural',
        district: 'Mahabubnagar',
        state: 'Telangana',
        urgency: 'High',
        requested_service: 'Primary Health Centre',
        travel_distance_km: 20.0,
        summary: 'Residents need to travel approximately 20 km for essential medical treatment.',
        keywords: ['hospital', 'healthcare', 'distance', 'treatment'],
        submission_channel: 'Voice',
        cluster_id: 'cluster-ts-health-01',
        status: 'Recorded',
        created_at: '2026-09-21T08:15:00Z',
      },
      {
        request_id: 'JS-2026-000102',
        citizen_id: 'CIT-TS-002',
        language: 'English',
        category: 'Healthcare',
        original_text: 'Our village does not have a proper hospital. We have to travel 20 km for treatment.',
        normalized_text: 'Our village does not have a proper hospital. We have to travel 20 km for treatment.',
        issue: 'Lack of nearby healthcare facility',
        location: 'Midjil Mandal',
        district: 'Mahabubnagar',
        state: 'Telangana',
        urgency: 'High',
        requested_service: 'Healthcare facility',
        travel_distance_km: 20.0,
        summary: 'Citizen reports traveling 20 km to access nearest hospital for general illnesses and emergency care.',
        keywords: ['hospital', 'healthcare', 'distance', 'rural'],
        submission_channel: 'Web Portal',
        cluster_id: 'cluster-ts-health-01',
        status: 'Recorded',
        created_at: '2026-09-21T09:30:00Z',
      },
      {
        request_id: 'JS-2026-000103',
        citizen_id: 'CIT-TS-001',
        language: 'Telugu',
        category: 'Healthcare',
        original_text: 'ఎమర్జెన్సీ సమయంలో అంబులెన్స్ రావడానికి గంట సమయం పడుతుంది, దగ్గరలో దవాఖానా లేదు.',
        normalized_text: 'During emergencies an ambulance takes over an hour to arrive, there is no nearby dispensary or hospital.',
        issue: 'Emergency ambulance delay and absence of clinic',
        location: 'Jadcherla Outskirts',
        district: 'Mahabubnagar',
        state: 'Telangana',
        urgency: 'High',
        requested_service: 'Emergency First-Aid Clinic',
        travel_distance_km: 18.5,
        summary: 'Lack of local emergency health point causes critical delays in ambulance response times.',
        keywords: ['ambulance', 'emergency', 'clinic', 'first-aid'],
        submission_channel: 'Mobile App',
        cluster_id: 'cluster-ts-health-01',
        status: 'Recorded',
        created_at: '2026-09-22T11:45:00Z',
      },
      {
        request_id: 'JS-2026-000104',
        citizen_id: 'CIT-UP-003',
        language: 'Hindi',
        category: 'Healthcare',
        original_text: 'हमारे गांव में प्राथमिक स्वास्थ्य केंद्र नहीं है। इलाज के लिए 25 किलोमीटर दूर जाना पड़ता है।',
        normalized_text: 'There is no primary health centre in our village. We have to travel 25 kilometers for medical care.',
        issue: 'No primary health centre in village',
        location: 'Dudhi Sector',
        district: 'Sonbhadra',
        state: 'Uttar Pradesh',
        urgency: 'High',
        requested_service: 'Primary Health Centre',
        travel_distance_km: 25.0,
        summary: 'Villagers face a 25 km commute to reach functional medical clinics.',
        keywords: ['hospital', 'phc', 'distance', 'clinic'],
        submission_channel: 'Voice',
        cluster_id: 'cluster-up-health-01',
        status: 'Recorded',
        created_at: '2026-09-22T14:10:00Z',
      },
      {
        request_id: 'JS-2026-000105',
        citizen_id: 'CIT-TS-001',
        language: 'Telugu',
        category: 'Water',
        original_text: 'మా గ్రామంలో తాగునీటి సరఫరా సరిగ్గా లేదు, ప్రతిరోజూ నీటికోసం దూరంగా వెళ్లాల్సి వస్తోంది.',
        normalized_text: 'Drinking water supply in our village is very irregular, women and children walk several km every day.',
        issue: 'Irregular drinking water supply',
        location: 'Koilkonda',
        district: 'Mahabubnagar',
        state: 'Telangana',
        urgency: 'Medium',
        requested_service: 'Piped Water Connection',
        travel_distance_km: 3.5,
        summary: 'Inconsistent piped supply forces residents to fetch groundwater from distant borewells.',
        keywords: ['water', 'drinking water', 'pipeline', 'scarcity'],
        submission_channel: 'Web Portal',
        cluster_id: 'cluster-ts-water-01',
        status: 'Recorded',
        created_at: '2026-09-23T10:05:00Z',
      },
      {
        request_id: 'JS-2026-000106',
        citizen_id: 'CIT-MH-004',
        language: 'English',
        category: 'Roads',
        original_text: 'Main approach road washed away during monsoon, buses cannot reach the village school.',
        normalized_text: 'Main approach road washed away during monsoon, buses cannot reach the village school.',
        issue: 'Damaged rural road preventing bus transport',
        location: 'Bhamragad',
        district: 'Gadchiroli',
        state: 'Maharashtra',
        urgency: 'High',
        requested_service: 'All-weather Pucca Road',
        travel_distance_km: 12.0,
        summary: 'Cutoff road isolates rural hamlets from educational institutions and emergency vehicles.',
        keywords: ['road', 'monsoon', 'bridge', 'connectivity'],
        submission_channel: 'Web Portal',
        cluster_id: 'cluster-mh-road-01',
        status: 'Recorded',
        created_at: '2026-09-23T16:20:00Z',
      },
      {
        request_id: 'JS-2026-000107',
        citizen_id: 'CIT-TS-002',
        language: 'Telugu',
        category: 'Education',
        original_text: 'హైస్కూల్‌లో సైన్స్ ల్యాబ్ మరియు తగినంత మంది ఉపాధ్యాయులు లేరు.',
        normalized_text: 'High school lacks science laboratories and specialized teachers for higher grades.',
        issue: 'Inadequate high school teachers and science lab',
        location: 'Parkal',
        district: 'Warangal',
        state: 'Telangana',
        urgency: 'Medium',
        requested_service: 'High School Upgrade',
        travel_distance_km: null,
        summary: 'Students request modernization of school lab equipment and science faculty.',
        keywords: ['school', 'teachers', 'science', 'education'],
        submission_channel: 'Web Portal',
        cluster_id: 'cluster-ts-edu-01',
        status: 'Recorded',
        created_at: '2026-09-24T09:00:00Z',
      },
      {
        request_id: 'JS-2026-000108',
        citizen_id: 'CIT-AP-005',
        language: 'English',
        category: 'Public Transport',
        original_text: 'RTC bus arrives only once a day at 6 AM, students and daily wage workers stranded.',
        normalized_text: 'RTC bus arrives only once a day at 6 AM, students and daily wage workers stranded.',
        issue: 'Infrequent public bus schedule',
        location: 'Pattikonda',
        district: 'Kurnool',
        state: 'Andhra Pradesh',
        urgency: 'Medium',
        requested_service: 'Scheduled RTC Bus Frequency',
        travel_distance_km: 16.0,
        summary: 'Lack of midday and evening bus trips impedes education and livelihood commutes.',
        keywords: ['bus', 'transport', 'schedule', 'commute'],
        submission_channel: 'Voice',
        cluster_id: 'cluster-ap-transit-01',
        status: 'Recorded',
        created_at: '2026-09-24T13:40:00Z',
      },
      {
        request_id: 'JS-2026-000109',
        citizen_id: 'CIT-UP-003',
        language: 'Hindi',
        category: 'Electricity',
        original_text: 'खेती के लिए केवल 3 घंटे बिजली मिलती है, वो भी रात में ट्रांसफार्मर जल जाता है।',
        normalized_text: 'Electricity for agricultural pumps is available for only 3 hours, and transformers frequently burn out.',
        issue: 'Erratic farming electricity and frequent transformer burnout',
        location: 'Ghorawal',
        district: 'Sonbhadra',
        state: 'Uttar Pradesh',
        urgency: 'High',
        requested_service: 'Dedicated Agrifeeder & Transformer',
        travel_distance_km: null,
        summary: 'Farmers require reliable power supply and upgraded transformer capacity to prevent crop loss.',
        keywords: ['power', 'electricity', 'transformer', 'irrigation'],
        submission_channel: 'Voice',
        cluster_id: 'cluster-up-power-01',
        status: 'Recorded',
        created_at: '2026-09-25T07:30:00Z',
      },
      {
        request_id: 'JS-2026-000110',
        citizen_id: 'CIT-TS-001',
        language: 'Telugu',
        category: 'Healthcare',
        original_text: 'గర్భిణీ స్త్రీలకు డెలివరీ కోసం జిల్లా ఆసుపత్రికి వెళ్లడం చాలా కష్టంగా ఉంది.',
        normalized_text: 'It is extremely difficult for pregnant women to travel to the district hospital for delivery.',
        issue: 'Maternal delivery care facility absent',
        location: 'Bhoothpur',
        district: 'Mahabubnagar',
        state: 'Telangana',
        urgency: 'High',
        requested_service: 'Maternity & Child Health Centre',
        travel_distance_km: 22.0,
        summary: 'Expectant mothers face high medical risk due to over 20 km travel to reach institutional delivery facilities.',
        keywords: ['maternity', 'hospital', 'delivery', 'women'],
        submission_channel: 'Web Portal',
        cluster_id: 'cluster-ts-health-01',
        status: 'Recorded',
        created_at: '2026-09-25T15:20:00Z',
      },
    ];

    this.demographics = [
      {
        district_id: 'DEMO-TS-MBNR',
        state: 'Telangana',
        district: 'Mahabubnagar',
        population: 1486777,
        rural_population: 1189421,
        urban_population: 297356,
        literacy_rate: 60.6,
        area_sq_km: 5286,
      },
      {
        district_id: 'DEMO-TS-WRGL',
        state: 'Telangana',
        district: 'Warangal',
        population: 1135708,
        rural_population: 794995,
        urban_population: 340713,
        literacy_rate: 75.9,
        area_sq_km: 1766,
      },
      {
        district_id: 'DEMO-TS-NLGD',
        state: 'Telangana',
        district: 'Nalgonda',
        population: 1618416,
        rural_population: 1391837,
        urban_population: 226579,
        literacy_rate: 63.7,
        area_sq_km: 7122,
      },
      {
        district_id: 'DEMO-AP-KRNL',
        state: 'Andhra Pradesh',
        district: 'Kurnool',
        population: 2271686,
        rural_population: 1703764,
        urban_population: 567922,
        literacy_rate: 60.0,
        area_sq_km: 7980,
      },
      {
        district_id: 'DEMO-MH-GDCH',
        state: 'Maharashtra',
        district: 'Gadchiroli',
        population: 1072942,
        rural_population: 954918,
        urban_population: 118024,
        literacy_rate: 74.4,
        area_sq_km: 14412,
      },
      {
        district_id: 'DEMO-UP-SNBD',
        state: 'Uttar Pradesh',
        district: 'Sonbhadra',
        population: 1862559,
        rural_population: 1545923,
        urban_population: 316636,
        literacy_rate: 64.0,
        area_sq_km: 6788,
      },
      {
        district_id: 'DEMO-KA-RCHR',
        state: 'Karnataka',
        district: 'Raichur',
        population: 1928812,
        rural_population: 1427320,
        urban_population: 501492,
        literacy_rate: 59.6,
        area_sq_km: 8386,
      },
      {
        district_id: 'DEMO-TN-DHRM',
        state: 'Tamil Nadu',
        district: 'Dharmapuri',
        population: 1506843,
        rural_population: 1249760,
        urban_population: 257083,
        literacy_rate: 68.5,
        area_sq_km: 4497,
      },
    ];

    this.infrastructure = [
      {
        facility_id: 'FAC-TS-01',
        facility_name: 'Mahabubnagar District Hospital',
        facility_type: 'District Hospital',
        state: 'Telangana',
        district: 'Mahabubnagar',
        latitude: 16.7488,
        longitude: 77.9947,
        capacity: 350,
        population_served: 180000,
        accessibility_score: 74,
        condition_rating: 'Good',
      },
      {
        facility_id: 'FAC-TS-02',
        facility_name: 'Jadcherla Community Health Centre',
        facility_type: 'CHC',
        state: 'Telangana',
        district: 'Mahabubnagar',
        latitude: 16.7724,
        longitude: 78.1368,
        capacity: 50,
        population_served: 45000,
        accessibility_score: 58,
        condition_rating: 'Fair',
      },
      {
        facility_id: 'FAC-TS-03',
        facility_name: 'Bhoothpur Primary Health Centre',
        facility_type: 'PHC',
        state: 'Telangana',
        district: 'Mahabubnagar',
        latitude: 16.6987,
        longitude: 77.9712,
        capacity: 12,
        population_served: 18500,
        accessibility_score: 42,
        condition_rating: 'Needs Upgrade',
      },
      {
        facility_id: 'FAC-TS-04',
        facility_name: 'Midjil Sub-Centre',
        facility_type: 'Sub-Centre',
        state: 'Telangana',
        district: 'Mahabubnagar',
        latitude: 16.6541,
        longitude: 78.2134,
        capacity: 4,
        population_served: 8200,
        accessibility_score: 31,
        condition_rating: 'Dilapidated',
      },
      {
        facility_id: 'FAC-TS-05',
        facility_name: 'Warangal MGM Hospital',
        facility_type: 'Tertiary Hospital',
        state: 'Telangana',
        district: 'Warangal',
        latitude: 17.9784,
        longitude: 79.5941,
        capacity: 600,
        population_served: 320000,
        accessibility_score: 82,
        condition_rating: 'Good',
      },
      {
        facility_id: 'FAC-TS-06',
        facility_name: 'Parkal Community Health Centre',
        facility_type: 'CHC',
        state: 'Telangana',
        district: 'Warangal',
        latitude: 18.2012,
        longitude: 79.7123,
        capacity: 40,
        population_served: 38000,
        accessibility_score: 61,
        condition_rating: 'Fair',
      },
      {
        facility_id: 'FAC-AP-01',
        facility_name: 'Kurnool Government General Hospital',
        facility_type: 'Tertiary Hospital',
        state: 'Andhra Pradesh',
        district: 'Kurnool',
        latitude: 15.8281,
        longitude: 78.0373,
        capacity: 550,
        population_served: 290000,
        accessibility_score: 78,
        condition_rating: 'Good',
      },
      {
        facility_id: 'FAC-AP-02',
        facility_name: 'Adoni Area Hospital',
        facility_type: 'Area Hospital',
        state: 'Andhra Pradesh',
        district: 'Kurnool',
        latitude: 15.6322,
        longitude: 77.2728,
        capacity: 100,
        population_served: 85000,
        accessibility_score: 52,
        condition_rating: 'Fair',
      },
      {
        facility_id: 'FAC-AP-03',
        facility_name: 'Pattikonda Primary Health Centre',
        facility_type: 'PHC',
        state: 'Andhra Pradesh',
        district: 'Kurnool',
        latitude: 15.4011,
        longitude: 77.5123,
        capacity: 10,
        population_served: 22000,
        accessibility_score: 35,
        condition_rating: 'Needs Upgrade',
      },
      {
        facility_id: 'FAC-MH-01',
        facility_name: 'Aheri Sub-District Hospital',
        facility_type: 'Sub-District Hospital',
        state: 'Maharashtra',
        district: 'Gadchiroli',
        latitude: 19.4123,
        longitude: 80.0123,
        capacity: 75,
        population_served: 42000,
        accessibility_score: 45,
        condition_rating: 'Fair',
      },
      {
        facility_id: 'FAC-MH-02',
        facility_name: 'Bhamragad Rural Hospital',
        facility_type: 'Rural Hospital',
        state: 'Maharashtra',
        district: 'Gadchiroli',
        latitude: 19.2412,
        longitude: 80.4512,
        capacity: 20,
        population_served: 16000,
        accessibility_score: 28,
        condition_rating: 'Poor',
      },
      {
        facility_id: 'FAC-UP-01',
        facility_name: 'Dudhi Community Health Centre',
        facility_type: 'CHC',
        state: 'Uttar Pradesh',
        district: 'Sonbhadra',
        latitude: 24.2145,
        longitude: 83.2512,
        capacity: 30,
        population_served: 34000,
        accessibility_score: 38,
        condition_rating: 'Needs Upgrade',
      },
      {
        facility_id: 'FAC-UP-02',
        facility_name: 'Ghorawal Primary Health Centre',
        facility_type: 'PHC',
        state: 'Uttar Pradesh',
        district: 'Sonbhadra',
        latitude: 24.7123,
        longitude: 82.7812,
        capacity: 10,
        population_served: 19000,
        accessibility_score: 32,
        condition_rating: 'Poor',
      },
      {
        facility_id: 'FAC-KA-01',
        facility_name: 'Manvi Taluk Hospital',
        facility_type: 'Taluk Hospital',
        state: 'Karnataka',
        district: 'Raichur',
        latitude: 15.9876,
        longitude: 77.0543,
        capacity: 60,
        population_served: 52000,
        accessibility_score: 49,
        condition_rating: 'Fair',
      },
      {
        facility_id: 'FAC-KA-02',
        facility_name: 'Sindhanur CHC',
        facility_type: 'CHC',
        state: 'Karnataka',
        district: 'Raichur',
        latitude: 15.7667,
        longitude: 76.7667,
        capacity: 45,
        population_served: 41000,
        accessibility_score: 54,
        condition_rating: 'Fair',
      },
    ];

    this.investments = [
      {
        project_id: 'INV-TS-2024-01',
        project_name: 'Upgradation of Jadcherla CHC to 100-bed Area Hospital',
        state: 'Telangana',
        district: 'Mahabubnagar',
        sector: 'Healthcare',
        status: 'Under Construction',
        investment_amount_lakhs: 850,
        year: 2024,
        implementing_agency: 'Telangana Medical Infrastructure Corp',
      },
      {
        project_id: 'INV-TS-2023-04',
        project_name: 'Rural Road All-Weather Connectivity Phase II',
        state: 'Telangana',
        district: 'Mahabubnagar',
        sector: 'Roads',
        status: 'Completed',
        investment_amount_lakhs: 420,
        year: 2023,
        implementing_agency: 'Panchayat Raj Dept',
      },
      {
        project_id: 'INV-TS-2025-02',
        project_name: 'Mission Bhagiratha Water Pipeline Extension',
        state: 'Telangana',
        district: 'Mahabubnagar',
        sector: 'Water',
        status: 'In Planning',
        investment_amount_lakhs: 310,
        year: 2025,
        implementing_agency: 'Rural Water Supply Dept',
      },
      {
        project_id: 'INV-TS-2024-08',
        project_name: 'Primary School Digitization and Solar Microgrids',
        state: 'Telangana',
        district: 'Warangal',
        sector: 'Education',
        status: 'Completed',
        investment_amount_lakhs: 190,
        year: 2024,
        implementing_agency: 'Samagra Shiksha',
      },
      {
        project_id: 'INV-AP-2024-03',
        project_name: 'Pattikonda Mobile Medical Unit Launch',
        state: 'Andhra Pradesh',
        district: 'Kurnool',
        sector: 'Healthcare',
        status: 'Underway',
        investment_amount_lakhs: 120,
        year: 2024,
        implementing_agency: 'Dept of Health & Family Welfare',
      },
      {
        project_id: 'INV-MH-2023-11',
        project_name: 'Tribal Belt Road Connectivity Bhamragad',
        state: 'Maharashtra',
        district: 'Gadchiroli',
        sector: 'Roads',
        status: 'Delayed',
        investment_amount_lakhs: 650,
        year: 2023,
        implementing_agency: 'PWD Maharashtra',
      },
    ];

    this.impactMetrics = [
      {
        intervention_id: 'IMP-2025-01',
        project_name: 'Upgradation of Jadcherla Community Health Centre & Mobile Clinic',
        sector: 'Healthcare',
        district: 'Mahabubnagar',
        state: 'Telangana',
        implementation_period: '2024-2025',
        pre_requests_count: 3842,
        post_requests_count: 1920,
        pre_avg_travel_km: 20.0,
        post_avg_travel_km: 8.0,
        pre_accessibility_score: 42,
        post_accessibility_score: 78,
        satisfaction_pct: 82.4,
        status: 'Completed & Monitored',
      },
      {
        intervention_id: 'IMP-2024-02',
        project_name: 'Mission Bhagiratha Habitation Feeder Water Network',
        sector: 'Water',
        district: 'Mahabubnagar',
        state: 'Telangana',
        implementation_period: '2023-2024',
        pre_requests_count: 2410,
        post_requests_count: 610,
        pre_avg_travel_km: 4.2,
        post_avg_travel_km: 0.8,
        pre_accessibility_score: 48,
        post_accessibility_score: 88,
        satisfaction_pct: 89.1,
        status: 'Completed & Monitored',
      },
      {
        intervention_id: 'IMP-2024-03',
        project_name: 'All-Weather Bitumen Road Bhamragad-Allapalli Sector',
        sector: 'Roads',
        district: 'Gadchiroli',
        state: 'Maharashtra',
        implementation_period: '2023-2024',
        pre_requests_count: 1850,
        post_requests_count: 520,
        pre_avg_travel_km: 16.5,
        post_avg_travel_km: 4.0,
        pre_accessibility_score: 29,
        post_accessibility_score: 72,
        satisfaction_pct: 79.5,
        status: 'Completed & Monitored',
      },
      {
        intervention_id: 'IMP-2025-04',
        project_name: 'Pattikonda Taluk Primary Sub-Centre & Telemedicine Kiosk',
        sector: 'Healthcare',
        district: 'Kurnool',
        state: 'Andhra Pradesh',
        implementation_period: '2024-2025',
        pre_requests_count: 1980,
        post_requests_count: 840,
        pre_avg_travel_km: 18.0,
        post_avg_travel_km: 6.5,
        pre_accessibility_score: 36,
        post_accessibility_score: 74,
        satisfaction_pct: 80.2,
        status: 'Completed & Monitored',
      },
    ];
  }

  // --- CRUD & Queries ---

  public getNextRequestId(): string {
    this.requestCounter += 1;
    return `JS-2026-${String(this.requestCounter).padStart(6, '0')}`;
  }

  public addCitizenRequest(req: CitizenRequest): CitizenRequest {
    this.requests.unshift(req);
    // Update or link cluster
    this.updateClusterOnNewRequest(req);
    return req;
  }

  public getRequests(filters?: {
    category?: string;
    district?: string;
    state?: string;
    urgency?: string;
    language?: string;
    cluster_id?: string;
    citizen_id?: string;
    limit?: number;
  }): CitizenRequest[] {
    let result = [...this.requests];
    if (filters) {
      if (filters.citizen_id) {
        result = result.filter(r => r.citizen_id === filters.citizen_id);
      }
      if (filters.category && filters.category !== 'All') {
        result = result.filter(r => r.category.toLowerCase() === filters.category!.toLowerCase());
      }
      if (filters.district && filters.district !== 'All') {
        result = result.filter(r => r.district.toLowerCase() === filters.district!.toLowerCase());
      }
      if (filters.state && filters.state !== 'All') {
        result = result.filter(r => r.state.toLowerCase() === filters.state!.toLowerCase());
      }
      if (filters.urgency && filters.urgency !== 'All') {
        result = result.filter(r => r.urgency.toLowerCase() === filters.urgency!.toLowerCase());
      }
      if (filters.language && filters.language !== 'All') {
        result = result.filter(r => r.language.toLowerCase() === filters.language!.toLowerCase());
      }
      if (filters.cluster_id) {
        result = result.filter(r => r.cluster_id === filters.cluster_id);
      }
      if (filters.limit) {
        result = result.slice(0, filters.limit);
      }
    }
    return result;
  }

  public getRequestById(id: string): CitizenRequest | undefined {
    return this.requests.find(r => r.request_id === id);
  }

  public getClusters(filters?: { category?: string; district?: string; state?: string }): RequestCluster[] {
    let res = [...this.clusters];
    if (filters) {
      if (filters.category && filters.category !== 'All') {
        res = res.filter(c => c.category.toLowerCase() === filters.category!.toLowerCase());
      }
      if (filters.district && filters.district !== 'All') {
        res = res.filter(c => c.district.toLowerCase() === filters.district!.toLowerCase());
      }
      if (filters.state && filters.state !== 'All') {
        res = res.filter(c => c.state.toLowerCase() === filters.state!.toLowerCase());
      }
    }
    // Sort descending by prototype gap indicator
    return res.sort((a, b) => b.prototype_gap_indicator - a.prototype_gap_indicator);
  }

  public getClusterById(id: string): RequestCluster | undefined {
    return this.clusters.find(c => c.cluster_id === id);
  }

  public getDemographics(district?: string, state?: string): Demographics[] {
    let res = [...this.demographics];
    if (district && district !== 'All') {
      res = res.filter(d => d.district.toLowerCase() === district.toLowerCase());
    }
    if (state && state !== 'All') {
      res = res.filter(d => d.state.toLowerCase() === state.toLowerCase());
    }
    return res;
  }

  public getInfrastructure(district?: string, state?: string, sector?: string): InfrastructureFacility[] {
    let res = [...this.infrastructure];
    if (district && district !== 'All') {
      res = res.filter(i => i.district.toLowerCase() === district.toLowerCase());
    }
    if (state && state !== 'All') {
      res = res.filter(i => i.state.toLowerCase() === state.toLowerCase());
    }
    return res;
  }

  public getInvestments(district?: string, sector?: string): InvestmentRecord[] {
    let res = [...this.investments];
    if (district && district !== 'All') {
      res = res.filter(inv => inv.district.toLowerCase() === district.toLowerCase());
    }
    if (sector && sector !== 'All') {
      res = res.filter(inv => inv.sector.toLowerCase() === sector.toLowerCase());
    }
    return res;
  }

  public getImpactMetrics(): ImpactMetric[] {
    return [...this.impactMetrics];
  }

  public logAIAnalysis(log: AIAnalysisLog) {
    this.aiLogs.unshift(log);
  }

  public getAILogs(requestId?: string): AIAnalysisLog[] {
    if (requestId) {
      return this.aiLogs.filter(l => l.request_id === requestId);
    }
    return this.aiLogs.slice(0, 50);
  }

  // --- Dynamic Clustering and Gap Recalculation ---

  private updateClusterOnNewRequest(req: CitizenRequest) {
    if (req.cluster_id) {
      const existing = this.clusters.find(c => c.cluster_id === req.cluster_id);
      if (existing) {
        existing.total_requests += 1;
        if (req.travel_distance_km) {
          existing.avg_reported_travel_km = Number(
            ((existing.avg_reported_travel_km * 0.9) + (req.travel_distance_km * 0.1)).toFixed(1)
          );
        }
        existing.updated_at = new Date().toISOString();
        return;
      }
    }

    // Try finding matching cluster by category and district
    const match = this.clusters.find(
      c => c.category.toLowerCase() === req.category.toLowerCase() &&
           c.district.toLowerCase() === req.district.toLowerCase()
    );

    if (match) {
      match.total_requests += 1;
      req.cluster_id = match.cluster_id;
      if (req.travel_distance_km) {
        match.avg_reported_travel_km = Number(
          ((match.avg_reported_travel_km * 0.9) + (req.travel_distance_km * 0.1)).toFixed(1)
        );
      }
      match.updated_at = new Date().toISOString();
    } else {
      // Create new cluster
      const newClusterId = `cluster-${req.district.toLowerCase().slice(0, 3)}-${req.category.toLowerCase().slice(0, 4)}-${Date.now().toString().slice(-4)}`;
      const newCluster: RequestCluster = {
        cluster_id: newClusterId,
        cluster_name: `${req.category} Need - ${req.location || req.district}`,
        category: req.category,
        district: req.district,
        state: req.state,
        total_requests: 1,
        main_concern: req.issue,
        avg_reported_travel_km: req.travel_distance_km || 10,
        urgency: req.urgency,
        demand_concentration: 'Medium',
        prototype_gap_indicator: 65.0,
        gap_level: 'Moderate',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.clusters.push(newCluster);
      req.cluster_id = newClusterId;
    }
  }

  // Dashboard Aggregates
  public getDashboardOverview() {
    const totalRequests = this.clusters.reduce((acc, c) => acc + c.total_requests, 0) + this.requests.length;
    const activeClusters = this.clusters.length;
    const gapAreas = this.clusters.filter(c => c.prototype_gap_indicator >= 70).length;
    const states = Array.from(new Set(this.clusters.map(c => c.state)));
    const categories = Array.from(new Set(this.clusters.map(c => c.category)));

    // Calculate total affected population from matching districts
    const totalPopulation = this.demographics.reduce((acc, d) => acc + d.population, 0);

    return {
      total_requests: totalRequests,
      active_clusters: activeClusters,
      critical_gap_areas: gapAreas,
      states_represented: states.length,
      states_list: states,
      categories_list: categories,
      population_impacted: totalPopulation,
      recent_requests: this.requests.slice(0, 5),
    };
  }
}

export const db = new DatabaseService();
