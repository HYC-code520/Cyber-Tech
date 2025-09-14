# Identity Sentinel - Account Compromise Decision Coach

A **20-hour MVP** for an AI-powered incident response tool that guides security analysts through account compromise investigations with step-by-step wizards, smart recommendations, and role-based views.

![Identity Sentinel Dashboard](https://img.shields.io/badge/Status-MVP%20Complete-green)
![Tech Stack](https://img.shields.io/badge/Tech-Next.js%20%2B%20TypeScript%20%2B%20SQLite-blue)

## 🎯 Core Features

### ✅ **Step-by-Step Decision GPS Wizard**
- **5-Step Flow**: Trigger → Confirm → Classify → Contain → Recover
- **Visual Progress Indicator**: Shows current position in incident response lifecycle
- **Calm UI Design**: Minimizes cognitive load during high-stress incidents

### ✅ **Smart Branching & Auto-Classification**
- **Rule Engine**: YAML-based pattern matching for attack classification
- **5 Attack Types Supported**:
  - Password Spray (MITRE T1110.003)
  - MFA Fatigue (MITRE T1621)
  - Credential Stuffing (MITRE T1110.004)
  - Suspicious Travel (MITRE T1078)
  - False Positive Detection

### ✅ **Live Recommendations with Citations**
- **Split-Screen Layout**: Main wizard + recommendations pane
- **MITRE ATT&CK Integration**: Each recommendation includes tactical citations
- **CISA Guidelines**: References to official incident response frameworks
- **Priority-Based Actions**: Immediate, follow-up, and optional recommendations

### ✅ **Role-Based Views**
- **Analyst View**: Detailed technical information and full action capabilities
- **Manager View**: Executive summary with high-level progress and impact metrics

### ✅ **Mock Action Execution**
- **15+ Simulated Actions**: Password resets, token revocation, IP blocking, etc.
- **Realistic Delays**: 0.5-3 second execution times with progress indicators
- **Detailed Results**: JSON responses with affected user counts and timestamps

## 🚀 Quick Start

### **1. Installation**
```bash
git clone <repository-url>
cd identity-sentinel
npm install
```

### **2. Database Setup**
```bash
npx prisma generate
npx prisma db push
```

### **3. Start Development Server**
```bash
npm run dev
```

### **4. Open Browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 Demo Flow

### **Option A: Guided Demo**
1. **Visit Dashboard** → Click "Try Demo"
2. **Select Scenario** → Choose "Password Spray Attack"
3. **Follow Wizard** → Progress through 5 steps
4. **Execute Actions** → Click recommendations to simulate containment
5. **Switch Views** → Toggle Analyst ↔ Manager perspective

### **Option B: API Testing**
```bash
# Load demo cases
curl http://localhost:3000/api/simulate

# Create incident from demo
curl -X POST -H "Content-Type: application/json" \
  -d '{"caseId": "demo-ps-001"}' \
  http://localhost:3000/api/simulate

# Execute containment action
curl -X POST -H "Content-Type: application/json" \
  -d '{"actionType": "reset_all_passwords"}' \
  http://localhost:3000/api/incidents/{id}/actions
```

## 📊 Demo Scenarios

| Scenario | Type | Severity | Key Features |
|----------|------|----------|--------------|
| **Password Spray** | Attack | High | 47 failed logins, 15 users, 20min window |
| **MFA Fatigue** | Attack | High | 23 push notifications, single user target |
| **False Positive** | Benign | Low | VPN travel, user confirmation |
| **Credential Stuffing** | Attack | Critical | 1,247 attempts, 89 IPs, botnet |
| **Suspicious Travel** | Investigation | Medium | Impossible travel, no VPN |

## 🏗️ Architecture

### **Technology Stack**
```
Frontend:  Next.js 14 + TypeScript + React + Tailwind CSS + shadcn/ui
Backend:   Next.js API Routes + Prisma ORM
Database:  SQLite (perfect for MVP/demo)
State:     Zustand + React Query (client-side state management)
UI:        shadcn/ui components with accessibility built-in
```

## 🔮 Extensibility & Future Enhancements

### **Adding New Attack Types** (< 5 minutes)
1. **Add Classification Rule** → `lib/rules/classifications.ts`
2. **Add Recommendations** → `lib/rules/recommendations.ts` 
3. **Create Demo Case** → `data/demo-cases.json`
4. **No UI Changes Required** → Wizard adapts automatically

### **Real Integration Points**
- **Identity Providers**: Azure AD, Okta, Auth0 APIs
- **SIEM Systems**: Splunk, Sentinel, Chronicle connectors
- **Threat Intelligence**: VirusTotal, AlienVault, MISP feeds
- **Communication**: Slack, Teams, PagerDuty notifications

---

**Built with ❤️ in 20 hours using Next.js 14, TypeScript, SQLite, and shadcn/ui**

*Ready to transform incident response from reactive chaos into proactive, guided decision-making.*
