# JanSetu AI (जनसेతు)

> **From Citizen Voice → Local Needs → National Priorities → Measurable Impact**  
> An AI-powered multilingual civic intelligence platform that transforms citizen complaints and development requests into structured insights, demand hotspots, infrastructure-gap analysis, and explainable evidence for policymakers.

[![Build with AI: Code for Communities](https://img.shields.io/badge/Google%20Cloud%20Hackathon-Innovation%20Track-blue.svg)](https://ai.google.dev/)
[![Gemini API](https://img.shields.io/badge/Gemini%20API-gemini--3.8--flash-orange.svg)](https://ai.google.dev/)
[![Speech-to-Text](https://img.shields.io/badge/Speech%20to%20Text-gemini--3.5--transcribe-purple.svg)](https://cloud.google.com/speech-to-text)
[![Google Cloud Run](https://img.shields.io/badge/Deployment-Cloud%20Run-4285F4.svg)](https://cloud.google.com/run)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-green.svg)](https://opensource.org/licenses/Apache-2.0)

---

## 1. Problem Statement

Governments across India receive massive volumes of citizen feedback regarding urgent infrastructure and public service needs. However, this feedback is fragmented across disconnected channels:
- Multilingual voice recordings and vernacular text (Telugu, Hindi, English, etc.)
- Unstructured, conversational citizen descriptions
- Duplicate or isolated complaints lacking spatial aggregation
- No automated reconciliation with district demographics or existing public facility capacities

At the same time, district magistrates, state department heads, and infrastructure planners need to balance:
- Total population and rural dependency ratios
- Existing facility coverage and accessibility deficits
- Travel distance barriers (e.g. 20+ km for emergency primary healthcare)
- Geographic concentration of public demand

---

## 2. The JanSetu AI Solution

JanSetu AI connects citizen voices directly to evidence-based infrastructure planning:
1. **Multilingual Ingestion:** Citizens submit voice or text in Telugu, Hindi, or English.
2. **Gemini Entity Extraction:** Converts vernacular unstructured statements into normalized civic ontology JSON.
3. **Semantic Similarity & Clustering:** Groups individual complaints into district-level demand clusters.
4. **Data Fusion:** Cross-references citizen demand with census demographics and recorded facility capacities.
5. **Prototype Infrastructure Gap Indicator:** Computes a transparent 0–100 deficit score.
6. **Explainable AI Policy Briefings:** Gemini synthesizes objective memos with supporting evidence and potential intervention options.
7. **Post-Intervention Impact Tracking:** Measures how capital projects resolve baseline grievances over time.

> **CRITICAL GOVERNANCE PRINCIPLE:**  
> JanSetu AI is an **evidence and decision-support platform**. The AI does **NOT** autonomously allocate government budgets or approve projects. It provides evidence, demand patterns, infrastructure gaps, and potential intervention options. Final decisions remain exclusively with authorized human public officers.

---

## 3. Key Features

- **Multilingual Citizen Portal:**
  - Full support for English, Telugu (తెలుగు), and Hindi (हिंदी).
  - Web Speech API and Gemini audio transcription support.
  - 1-click test scenarios for hackathon evaluation.
  - Instant AI Analysis view displaying extracted category, urgency, location, travel km, and unique Request ID (`JS-2026-000124`).
- **Policymaker Intelligence Dashboard:**
  - Executive KPI cards: Total Requests, Active Clusters, Gap Hotspots, States Represented.
  - Multi-dimensional filters (State, District, Sector, Urgency).
  - Detailed 6-component Prototype Infrastructure Gap Indicator breakdown.
  - Gemini Explainable Policy Memo with ground evidence corroboration.
  - Potential intervention options with feasibility horizons and public authority disclaimers.
- **GIS Demand Hotspots Map:**
  - Interactive spatial visualizer mapping citizen demand density rings, critical gap hotspots, and facility pins.
  - Integrated district drill-down inspector.
- **Infrastructure Asset Explorer:**
  - Filterable catalog of hospitals, CHCs, PHCs, sub-centres, roads, and water works with capacity vs population ratios.
- **Post-Intervention Impact Tracking:**
  - Before vs After comparison measuring complaint drops (-50%), travel distance reductions (20 km → 8 km), and accessibility score improvements (+36 pts).
- **Prompt & Dataset Inspector:**
  - Live inspection of all 5 prompt templates and downloadable demonstration datasets.

---

## 4. Google Technologies Integration

In strict adherence to hackathon rules, only genuinely implemented Google Cloud technologies are integrated:

### 1. Gemini API (`@google/genai`)
- **Model:** `gemini-3.8-flash`
- **User-Agent:** Telemetry header `'aistudio-build'` configured on all server-side calls.
- **Functions:**
  - Unstructured vernacular complaint analysis & JSON extraction
  - Semantic similarity & regional demand clustering
  - Demographic & facility gap reasoning
  - Explainable policy memo generation grounded strictly in provided data

### 2. Google Cloud Speech-to-Text / Gemini Audio
- **Model:** `gemini-3.5-transcribe`
- **Functions:** Native vernacular speech recognition for spoken audio grievances in Telugu, Hindi, and English.

### 3. Google Maps Platform
- **Functions:** Spatial visualization of demand clusters and facility pins. Ships with an interactive Cartesian SVG fallback projection mapping stored district coordinates when an external API key is absent.

### 4. Google Cloud Run
- **Functions:** Unified containerized full-stack deployment via multi-stage Dockerfile hosting Express and Vite on port 3000.

---

## 5. System Architecture

```mermaid
graph TD
  A[Citizen: Multilingual Voice / Text] -->|Speech Audio| B[Google Cloud Speech / Gemini 3.5 Transcribe]
  A -->|Raw Text| C[Gemini 3.8 Flash Analysis Service]
  B -->|Transcribed Text| C
  C -->|Structured JSON: Category, Urgency, Distance, Entities| D[Citizen Requests Database]
  D --> E[Semantic Similarity & Demand Clustering]
  E --> F[Aggregated Regional Demand Hotspot]
  G[Census Demographics Database] --> H[Data Fusion & Deficit Engine]
  I[Infrastructure Facilities Catalog] --> H
  J[Public Investment Records] --> H
  F --> H
  H --> K[Prototype Infrastructure Gap Indicator 0-100]
  K --> L[Gemini Explainable Policy Briefing Generator]
  L --> M[Policymaker Dashboard & GIS Map]
  M --> N[Human Public Authority Evaluation]
  N -->|Capital Works Approval| O[Post-Intervention Impact Tracking]
```

Detailed architectural diagrams and pipeline specifications are available in [`/docs/architecture.md`](./docs/architecture.md).

---

## 6. AI Workflow & Stored Prompts

All prompt configurations are stored in the repository under [`/ai/prompts/`](./ai/prompts/) and dynamically loaded by the server:
- `complaint_analysis.txt`: Vernacular entity extraction into rigid JSON schema.
- `similarity_analysis.txt`: Spatial and semantic clustering of civic complaints.
- `infrastructure_analysis.txt`: Multi-factor gap reasoning.
- `policy_insight.txt`: Objective evidence synthesis with human governance boundaries.
- `impact_analysis.txt`: Post-intervention outcome analysis.

---

## 7. Demonstration Datasets

Stored under [`/data/`](./data/):
- `citizen_requests.csv`: Multilingual citizen submissions.
- `demographics.csv`: Census population indicators across 6 Indian states.
- `infrastructure.csv`: Public health and municipal assets with bed capacities.
- `investments.csv`: Sanctioned civil projects and implementing departments.
- `impact_metrics.csv`: Longitudinal grievance resolution benchmarks.

*Notice: Clearly labeled as **Synthetic demonstration data**; formatted for seamless replacement with official government open datasets (e.g. data.gov.in).*

---

## 8. Demo Scenario (Step-by-Step Test Walkthrough)

To verify the primary hackathon scenario:
1. Open the **Citizen Portal** tab.
2. Select **Telugu** or click the quick hackathon scenario:
   > *"మా గ్రామంలో సరైన ఆసుపత్రి లేదు. చికిత్స కోసం 20 కిలోమీటర్లు ప్రయాణించాలి."*  
   *(Or in English: "Our village does not have a proper hospital. We have to travel 20 km for treatment.")*
3. Click **Submit & Analyze**.
4. Observe the Gemini AI Analysis card:
   - **Language:** Telugu
   - **Category:** Healthcare
   - **Issue:** Lack of accessible nearby healthcare facility
   - **District:** Mahabubnagar, Telangana
   - **Urgency:** High
   - **Reported Travel:** 20 km
   - **Request ID:** Generated unique code (e.g. `JS-2026-000125`)
   - **Linked Cluster:** *Rural Primary Healthcare Access - Mahabubnagar* (3,842 requests)
5. Click **Inspect Policymaker Hotspot & Gap Evidence →**.
6. Review the **Prototype Infrastructure Gap Indicator** (85/100, Critical) and read the **Gemini Explainable Policy Briefing**.
7. Navigate to **Impact Tracking** to view how upgrading the local community health centre reduced average travel from 20 km to 8 km.

---

## 9. Environment Variables Configuration

Create a `.env` file in the root directory (see [`.env.example`](./.env.example)):

```bash
# GEMINI_API_KEY: Required for live Gemini API calls.
GEMINI_API_KEY="your_gemini_api_key_here"

# APP_URL: Development/Production URL
APP_URL="http://localhost:3000"

# DATABASE_URL: Optional PostgreSQL connection string.
# (If omitted, JanSetu AI automatically uses its in-memory relational store)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/jansetu_ai"

# GOOGLE_MAPS_API_KEY: Optional Google Maps Platform key.
GOOGLE_MAPS_API_KEY=""

# DEMO_MODE: Enable synthetic demonstration dataset mode (Default: true)
DEMO_MODE="true"
```

---

## 10. Local Setup & Execution

### Prerequisites
- Node.js 20 or higher
- npm 10 or higher

### Installation

```bash
# 1. Clone repository
git clone https://github.com/example/jansetu-ai.git
cd jansetu-ai

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env

# 4. Start Full-Stack Application (Express Server + Vite Dev on Port 3000)
npm run dev
```

Visit **http://localhost:3000** in your browser.

---

## 11. Database Setup (PostgreSQL)

If using external PostgreSQL:
```bash
# Execute schema migration
psql -U postgres -d jansetu_ai -f ./db/schema.sql

# Seed demonstration data
psql -U postgres -d jansetu_ai -f ./db/seed.sql
```

*Note: If PostgreSQL is not running locally, JanSetu AI operates out-of-the-box on its integrated relational store.*

---

## 12. Google Cloud Run Deployment

JanSetu AI is containerized for deployment on Google Cloud Run:

```bash
# 1. Build and submit container image
gcloud builds submit --tag gcr.io/$GOOGLE_CLOUD_PROJECT/jansetu-ai:v1

# 2. Deploy to Cloud Run
gcloud run deploy jansetu-ai \
  --image gcr.io/$GOOGLE_CLOUD_PROJECT/jansetu-ai:v1 \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --port 3000 \
  --set-env-vars GEMINI_API_KEY=$GEMINI_API_KEY,DEMO_MODE=true
```

---

## 13. Scalability & Broader Applicability

JanSetu AI is architected for geographic and jurisdictional hierarchy:
$$\text{Habitation / Ward} \longrightarrow \text{Mandal / Taluk} \longrightarrow \text{District} \longrightarrow \text{State} \longrightarrow \text{National (India)} \longrightarrow \text{BRICS / Global South}$$

The platform avoids hardcoded regional logic, decoupling schemas so that state open datasets or international civic indicators can be swapped in without code changes.

---

## 14. Privacy & Governance Principles

- **Privacy by Design:** Citizen identifiers are anonymized using irreversible cryptographic hashes (`CIT-TS-001`). No personally identifiable information (PII) is stored.
- **Evidence-Based Transparency:** Every AI insight displays the exact source data (requests, rural population counts, facility counts, and travel distances).
- **Human Authority Boundary:** AI does not approve projects or disburse funds.

---

## 15. Contributors & Acknowledgements

Built for the **Google Cloud Hackathon: Build with AI — Code for Communities** under the **Innovation** track.  
Powered by **Google Gemini API** & **Google Cloud Platform**.
