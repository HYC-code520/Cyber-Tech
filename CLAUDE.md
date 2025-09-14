# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Identity Sentinel is an AI-powered incident response tool for account compromise investigations. It provides step-by-step decision guidance through a 5-step wizard flow (Trigger → Confirm → Classify → Contain → Recover) with smart recommendations based on MITRE ATT&CK framework.

## Development Commands

### Core Commands
```bash
# Start development server
npm run dev

# Database operations (always run after schema changes)
npx prisma generate
npx prisma db push

# Build and lint
npm run build
npm run lint
```

### Testing & Demo
```bash
# Load demo scenarios into database
curl http://localhost:3000/api/simulate

# Create incident from demo case
curl -X POST -H "Content-Type: application/json" \
  -d '{"caseId": "demo-ps-001"}' \
  http://localhost:3000/api/simulate

# Execute mock action on incident
curl -X POST -H "Content-Type: application/json" \
  -d '{"actionType": "reset_all_passwords"}' \
  http://localhost:3000/api/incidents/{id}/actions
```

## Architecture & Key Systems

### Database Schema (Prisma + SQLite)
- **Incident**: Core entity with state machine flow (triggered → confirmed → classified → contained → recovered)
- **Indicator**: Attack indicators with confidence scores for rule engine classification
- **Action**: Mock security actions with execution status and JSON results
- **StateTransition**: Audit trail of incident state changes
- **Recommendation**: MITRE ATT&CK and CISA-based suggestions with priority ranking

### Rule Engine (`lib/rules/`)
- **Classifications** (`classifications.ts`): Attack pattern definitions with confidence thresholds
- **Engine** (`engine.ts`): Pattern matching logic that processes indicators and returns classifications
- **Recommendations** (`recommendations.ts`): MITRE ATT&CK mapped actions for each incident type
- **Types** (`types.ts`): TypeScript interfaces for all rule engine components

### State Machine (`lib/state-machine/incident-flow.ts`)
- Enforces valid transitions between incident states
- Maps states to wizard steps for UI flow
- Validates required data for each transition

### Mock Action System (`lib/mock-actions/executors.ts`)
- 15+ simulated security actions with realistic delays (0.5-3 seconds)
- Returns detailed JSON responses with affected counts and timestamps
- Used for demo and training purposes

### Demo Data System (`data/demo-cases.json`)
- 5 realistic incident scenarios with detailed indicator sets
- Each case includes confidence scores and attack progression timelines
- Loaded via `/api/simulate` endpoint

## Critical Implementation Details

### Next.js 15 Parameter Handling
All API routes in `app/api/` use async parameter destructuring for Next.js 15 compatibility:
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  // Use id safely
}
```

### Route Structure
- `/` - Dashboard with recent incidents and metrics
- `/simulate` - Demo case selection and incident creation
- `/incident/[id]` - 5-step wizard with live recommendations pane
- `/reports` - Incident report generation and export

### Component Organization
- `components/ui/` - shadcn/ui base components
- `components/wizard/` - Step-by-step incident response wizard
- `components/recommendations/` - Live recommendation pane with MITRE citations
- `components/reports/` - PDF and export functionality

## Adding New Attack Types

1. **Add Classification Rule** in `lib/rules/classifications.ts`:
```typescript
{
  name: 'new_attack_type',
  displayName: 'New Attack Type',
  indicators: {
    indicator_type: (val: number) => val > threshold
  },
  confidenceThreshold: 0.75,
  severity: 'high',
  mitreId: 'T1234.567'
}
```

2. **Add Recommendations** in `lib/rules/recommendations.ts`:
```typescript
new_attack_type: [
  {
    action: "Immediate containment action",
    reason: "Why this action is needed",
    citation: "MITRE ATT&CK T1234.567",
    priority: 1
  }
]
```

3. **Create Demo Case** in `data/demo-cases.json` with realistic indicators and timeline

The wizard UI will automatically adapt to new attack types without code changes.

## Database Operations

Always regenerate Prisma client after schema changes:
```bash
npx prisma generate
npx prisma db push
```

The SQLite database file is created automatically in `prisma/dev.db`. For production, update `DATABASE_URL` in `.env`.

## Important Notes

- Server runs on port 3000 by default
- SQLite database is perfect for MVP/demo but should be migrated to PostgreSQL for production
- All security actions are mocked for safety - real integrations would connect to actual identity providers and SIEM systems
- MITRE ATT&CK techniques are embedded throughout for educational and professional accuracy