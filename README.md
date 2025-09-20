
# Identity Sentinel - Account Compromise Decision Coach

AI-powered incident response tool for account compromise investigations with analyst overload demonstration.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database & Demo Data
```bash
# Setup database and load 1,810+ demo incidents
npm run setup:demo
```

### 3. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the analyst overload demonstration.

## Demo Data

The application includes a comprehensive demo dataset with **1,810+ security incidents** across 15 different attack types:

- **Password spray attacks** (316 incidents)
- **Credential stuffing** (172 incidents)
- **Data exfiltration** (311 incidents)
- **Account takeover** (198 incidents)
- **Privilege escalation** (349 incidents)
- **MFA fatigue attacks** (337 incidents)
- **Geo-based anomalies** (198 incidents)
- **Device anomalies** (185 incidents)
- **Unusual time logins** (162 incidents)
- **Session hijacking** (176 incidents)
- **API abuse** (157 incidents)
- **Insider threats** (172 incidents)
- **Supply chain attacks** (159 incidents)
- **Suspicious travel** (148 incidents)
- **False positive travel** (150 incidents)

### Attack Scenarios

The demo includes multiple realistic attack scenarios:

- **Flash Flood** (200 incidents) - Rapid burst of attacks in short timeframe
- **Multi-Vector** (300 incidents) - Coordinated attacks across multiple vectors
- **Wave Attack** (800 incidents) - Sustained campaign over extended period
- **Noise Campaign** (510 incidents) - Background noise to hide real attacks

## Database Commands

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Load demo data only (after database setup)
npm run seed:demo

# Reset and reload everything
npm run setup:demo
```

## Architecture

### Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **Database**: SQLite with Prisma ORM
- **UI**: shadcn/ui components with Tailwind CSS
- **Security Framework**: MITRE ATT&CK integration

### Key Features
- 5-step incident response wizard (Trigger → Confirm → Classify → Contain → Recover)
- AI-powered recommendations based on MITRE ATT&CK framework
- Real-time incident classification with confidence scoring
- Bulk incident generation for training scenarios
- Comprehensive reporting and analytics

### State Machine
Incidents flow through a structured state machine:
```
triggered → confirmed → classified → contained → recovered → closed
```

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed:demo` - Load demo incidents
- `npm run setup:demo` - Full database setup with demo data

### Project Structure
```
├── app/                    # Next.js app router pages
├── components/            # React components
│   ├── ui/               # shadcn/ui base components
│   ├── wizard/           # Incident response wizard
│   └── recommendations/  # MITRE recommendation engine
├── lib/                  # Core business logic
│   ├── rules/           # Attack classification rules
│   ├── state-machine/   # Incident flow state machine
│   └── mock-actions/    # Simulated security actions
├── prisma/              # Database schema and migrations
├── data/                # Demo case definitions
└── scripts/             # Utility scripts
```

## Demo Usage

### For Security Training
1. Run `npm run setup:demo` to load realistic incident data
2. Navigate through the dashboard to see analyst overload
3. Use the incident wizard to practice response procedures
4. Generate reports to analyze attack patterns

### For Development
1. Use the `/simulate` endpoint to create custom scenarios
2. Modify attack patterns in `lib/rules/classifications.ts`
3. Add new recommendations in `lib/rules/recommendations.ts`
4. Extend the state machine for custom workflows

## Security Note

This application is designed for **training and demonstration purposes**. All security actions are mocked and do not perform real integrations with identity providers or SIEM systems.

---

# Original MVP Design Document

## Repo Structure
.
├─ api/                      # FastAPI service (classification, actions, summaries)
│  ├─ app/
│  │  ├─ main.py
│  │  ├─ routes/            # /classify, /actions/*, /decision-log, /summaries
│  │  ├─ models/            # Pydantic schemas
│  │  ├─ db/                # SQL models & migrations
│  │  ├─ services/          # branching, summaries, security
│  │  └─ utils/
│  ├─ tests/
│  └─ requirements.txt
├─ web/                      # Next.js (React + TypeScript + Tailwind)
│  ├─ app/                   # Trigger, Confirm, Classify, Contain, Recover, Scorecard
│  ├─ components/            # RoleTabs, DecisionLog, ActionButtons, ConfidenceMeter
│  ├─ lib/                   # api client, design tokens
│  └─ package.json
├─ config/
│  ├─ branching.yaml         # tiny, auditable rule file for smart branching
│  └─ templates/             # role summary templates (analyst/manager/client)
├─ scripts/
│  ├─ seed_mock_data.py      # loads scenarios A/B/C
│  └─ smoke.sh               # health + basic API checks
├─ .env.example
└─ README.md


Quickstart
Prereqs
Node 18+, Python 3.11+


Postgres (local or managed), optional Redis (rate limit)


pnpm (or npm/yarn), pip (or uv/poetry)


1) API (FastAPI)
cd api
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Environment
cp ../.env.example ../.env
# Edit .env with your DB URL, JWT secret, CORS origin (see "Environment" below)

# DB migrate
python -m app.db.migrate

# Run
uvicorn app.main:app --reload --port 8000

2) Web (Next.js)
cd web
pnpm install
cp ../.env.example .env.local
pnpm dev   # runs on http://localhost:3000

The web app expects the API at http://localhost:8000.
 Open http://localhost:3000 → you’ll see the 5-step wizard.

Environment
.env.example
# API
API_PORT=8000
API_JWT_SECRET=change-me
API_ALLOWED_ORIGINS=http://localhost:3000

# DB
DATABASE_URL=postgresql+psycopg://user:pass@localhost:5432/identity_sentinel

# Optional
RATE_LIMIT_PER_MIN=120
LOG_LEVEL=INFO


Design System (uniform, modern)
Font: Inter (regular/medium/semibold)


8-pt grid; sizes 14/16/18/22/30; line height 1.4


Tokens


Surface: #0f1420 / #131a2a


Text: #d7def5 (primary), #6f84b8 (muted)


Accent: Action #4e7cff, Caution #ffd166, Danger #ff6b6b, Success #3ad29f


Components: Progress bar (wizard), ConfidenceMeter, RoleTabs, ActionButtons with result pills, DecisionLog.


Motion: 150–200ms ease; no bounce.


Keyboard: N=Next, L=Add log note, ?=Help.



Data Model (API)
Tables (Postgres):
incidents(id, user_email, status, confidence, created_at, updated_at)


signals(incident_id, type, payload_json, observed_at)


decision_log(incident_id, actor, step, choice, why, source, ts)


actions(incident_id, name, status, result_json, ts)


summaries(incident_id, role, body_text, ts)


users(id, email, role)



Branching (smart, auditable)
config/branching.yaml
signals:
  high_confidence:
    all:
      - mfa_fatigue_burst: true
      - new_device_10m: true
      - geo_impossible_10m: true
  token_theft_suspected:
    any:
      - oauth_tokens_present: true
      - suspicious_scope_change: true

routes:
  - if: high_confidence
    then: contain_now
    why: "Multiple strong identity signals indicate active account takeover."
    source: "Account Takeover Playbook §Classification"
  - elif: token_theft_suspected
    then: token_purge_route
    why: "OAuth scopes/tokens risky; purge + review minimizes ongoing access."
    source: "SaaS/OAuth Abuse Playbook §Containment"
  - else:
    then: preventive_actions
    why: "Insufficient evidence of compromise—reduce noise and harden MFA."
    source: "Account Takeover Playbook §Tuning"


API Endpoints (MVP)
POST   /signals/mock                         # seed scripted signals (A/B/C)
POST   /classify                             # returns {confidence, route, why, source}
POST   /decision-log                         # append decision line
POST   /actions/revoke-sessions              # returns {status: OK|FAIL, detail}
POST   /actions/password-reset               # returns {status, detail}
POST   /actions/mfa-step-up                  # returns {status, detail}
POST   /actions/token-purge                  # returns {status: STUB, detail}
GET    /summaries/{incidentId}?role=analyst|manager|client
GET    /health

Sample /classify response
{
  "confidence": "High",
  "recommended_path": "contain_now",
  "why": "MFA fatigue + new device + geo-impossible pattern indicate likely ATO.",
  "source": "Account Takeover Playbook §Classification"
}

Decision log line (saved by API)
[2025-09-14T10:22:13Z] classify • High • MFA fatigue + new device + geo-impossible • Account Takeover Playbook §Classification


Role Summaries (templates)
config/templates/manager.txt
Summary: Likely account takeover for {{user}}. Sessions revoked, password reset, MFA stepped-up at {{ts}}.
Blast radius: {{apps_scopes}}. Residual risk: {{residual}}. ETA to safe: {{eta}}. Next: {{next_step}}.

config/templates/client.txt
We secured your account and blocked suspicious access. Your work should continue normally.
We’ll keep monitoring for 24 hours and let you know if anything changes.

config/templates/analyst.txt
Incident {{id}} for {{user}}. Confidence: {{confidence}}. Signals: {{signals_short}}.
Actions: {{actions_list}}. Indicators: {{ioc_short}}. Next: {{next_step}}. TS: {{ts}}.


Screen Flow (what the user sees)
Trigger — Display signals (failed MFA burst, new device, geo jump).


Ask one question to proceed.


Show default recommendation + “Why & citation”.


Confirm — Checkboxes: new device, inbox rules, token scopes.


Ask for the most impactful missing check.


Update rationale + log line.


Classify — Set confidence (Low/Med/High).


Return recommended_path: contain_now / token_purge_route / preventive_actions.


Contain — One-click actions: Revoke, Reset, MFA step-up, Token purge (stub).


Each action shows result pill and logs with “why & source”.


Recover — Checklist: remove inbox rules, review delegated access, notify user, monitor 24h.


Button: Generate Summaries (Analyst/Manager/Client) from the same case record.


Scorecard (separate view): confidence, times (open→classify, open→contain), actions taken, residual risk.

Mock Scenarios (seed & test)
scripts/seed_mock_data.py loads A/B/C:
A (Contain now): failed_mfa_burst=5, new_device_10m=true, geo_impossible_10m=true, tokens=[]


B (Token route): scope_change=true, oauth_tokens_present=["Email"]


C (Preventive): no strong signals; everything false/none


Run:
python scripts/seed_mock_data.py


Security (MVP baseline)
AuthN/Z: JWT (15-min TTL) with roles: analyst, manager, admin


Transport & headers: HTTPS only, HSTS, strict CSP (default-src 'self'), CORS allowlist, secure/HttpOnly cookies


Least privilege: Mock adapters only; production write scopes disabled


Abuse controls: per-IP & per-user rate limits, request size limits, JSON schema validation


Audit: NTP-synced timestamps; request IDs; append-only decision_log


Privacy: Client summary redacts PII by default



Observability
Logs: JSON to stdout/file with request ID & user


Metrics: /metrics counters (requests, errors, action latency)


Smoke test: scripts/smoke.sh → checks health, classify, action stub, summaries



Definition of Done (MVP)
A/B/C scenarios run end-to-end in the wizard


Each step returns a recommendation and writes a log line


Role summaries render without manual edits


Time-to-confidence (Scenario A) ≤ 5 min; first containment ≤ 8 min


All API routes behind auth; CSP & rate limits on; client summary redacts PII



Roadmap (after MVP)
Real IdP integrations (Okta/AzureAD/Google) read-only → gradual enable write scopes


OAuth token purge real action; mailbox rule inventory via provider APIs


Reporting packs (SEC/GDPR/NIS2) & Insurance “Carrier Pack” export


Multi-tenant RBAC, SSO, secrets manager



License / Notices
Internal prototype. Do not distribute outside <Your Company> without approval.


Playbook references are placeholders—replace with your official policy names/sections.



Contributing
Create an issue for each screen or endpoint; link to acceptance criteria above.


PRs require passing smoke test + lint + at least one scenario A/B/C run.



FAQ
Q: Why not ML for classification?
 A: MVP uses auditable rules. You get speed, clarity, and trust during audits. ML can augment later.
Q: How do citations work?
 A: Each recommendation includes a named playbook section (e.g., “Account Takeover Playbook §Containment”). Link these to your internal docs.
Q: Can non-analysts use it?
 A: Yes—Manager and Client views are plain English and generated from the same record to avoid drift.

If you want, I can also supply a starter requirements.txt, package.json, and skeleton files to drop straight into /api and /web.

