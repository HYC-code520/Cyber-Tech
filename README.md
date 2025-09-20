
# Identity Sentinel - Account Compromise Decision Coach

A **dark purple themed** AI-powered incident response tool for account compromise investigations. Features step-by-step wizards, smart recommendations, and comprehensive security monitoring dashboard.

![Identity Sentinel Dashboard](https://img.shields.io/badge/Status-MVP%20Complete-green)
![Tech Stack](https://img.shields.io/badge/Tech-Next.js%20%2B%20TypeScript%20%2B%20SQLite-blue)

## 🚀 Quick Start

### **1. Installation**
```bash
# Clone the repository
git clone <repository-url>
cd Cyber-Tech

# Install dependencies
npm install
```

### **2. Database Setup** ⚠️ **REQUIRED**
```bash
# Generate Prisma client
npx prisma generate

# Create database tables (CRITICAL STEP)
npx prisma db push
```

### **3. Environment Setup**
Create a `.env` file in the root directory:
```bash
echo 'DATABASE_URL="file:./dev.db"' > .env
```

### **4. Start Development Server**
```bash
npm run dev
```

### **5. Open Browser**
Navigate to [http://localhost:3000](http://localhost:3000)

**Note**: If port 3000 is busy, the app will automatically use port 3001.

## 🎯 Core Features

### ✅ **Dark Purple Security Dashboard**
- **Professional security monitoring interface** inspired by enterprise SIEM tools
- **Dark purple theme (#461A54)** for reduced eye strain during long security operations
- **Real-time metrics** showing signals, IPs, logs, and response times
- **Color-coded severity levels** (INFOs, LOWs, MEDIUMs, HIGHs, CRITICALs)

### ✅ **5-Step Decision Wizard**
- **Structured Flow**: Trigger → Confirm → Classify → Contain → Recover
- **Visual Progress Indicator** shows current position in incident response lifecycle
- **Calm UI Design** minimizes cognitive load during high-stress incidents

### ✅ **Smart Attack Classification**
- **Rule Engine**: Pattern matching for attack classification
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

## 🎮 Demo Flow

### **Option A: Load Demo Data (Recommended)**
```bash
# Go to the simulate page
# Visit: http://localhost:3000/simulate

# Create incidents by clicking "Simulate Attack" on any scenario:
# - Password Spray Attack
# - MFA Fatigue Attack
# - False Positive (Travel)
# - Credential Stuffing
# - Suspicious Travel
```

### **Option B: Bulk Load 1600+ Incidents**
```bash
# Create bulk load script
cat > bulk_load.sh << 'EOF'
#!/bin/bash
echo "Loading 1600 demo incidents..."

CASES=("demo-ps-001" "demo-mf-001" "demo-cs-001" "demo-st-001" "demo-fp-001")

for case in "${CASES[@]}"; do
  echo "Loading 320 incidents for case: $case"
  for i in {1..320}; do
    curl -s -X POST -H "Content-Type: application/json" \
      -d "{\"caseId\": \"$case\"}" \
      http://localhost:3000/api/simulate > /dev/null
    if [ $((i % 50)) -eq 0 ]; then
      echo "  Loaded $i incidents for $case"
    fi
  done
done

echo "Finished loading 1600 incidents!"
EOF

# Make executable and run
chmod +x bulk_load.sh
./bulk_load.sh
```

### **Option C: API Testing**
```bash
# Create single incident
curl -X POST -H "Content-Type: application/json" \
  -d '{"caseId": "demo-ps-001"}' \
  http://localhost:3000/api/simulate

# Execute containment action on incident
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

