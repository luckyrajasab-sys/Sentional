# Sentinel — Social Media Intelligence & SOC Operations Dashboard
**Smart India Hackathon • Problem ID: SIH26152**  
*Category: Blockchain & Cybersecurity • Social Media Analytics*

Sentinel is an AI-driven Security Operations Center (SOC) dashboard that transforms unstructured public social media signals into actionable cybersecurity intelligence. It detects coordinated inauthentic behavior (CIB), automated bot manipulation, phishing, and disinformation swarms, providing explainable AI risk scoring and anchoring forensic evidence hashes on an immutable distributed ledger (Polygon testnet simulation).

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Build for production
npm run build
```

---

## 🧭 Navigation & Section Architecture

The sidebar is categorized into 4 operational divisions with active-state highlighting:

### 1. Overview
- **Dashboard (`/dashboard`)**: Top 4 operational KPI cards (Active Threats, High-Risk Accounts, Sentiment Index, Verified Evidence), real-time incident ticker with instant drill-down, interactive sentiment & platform charts, and rapid triage preview.

### 2. Analyze
- **Sentiment (`/sentiment`)**: Real-time cross-platform opinion polarity, emotion valence spectrum, and monitored discourse samples.
- **Trends (`/trends`)**: Emerging narrative velocity radar, hashtag acceleration, and correlated NLP keyword extraction.
- **Network Graph (`/network`)**: Interactive coordinated campaign detection graph mapping synchronized bot clusters with sub-second timing deltas and text cosine similarity.
- **Geo Map (`/map`)**: Regional threat dispersion across major Indian states and metropolitan zones.

### 3. Investigate
- **Threats & Triage Queue (`/threats`)**: Status tabs (`New`, `Investigating`, `Resolved`, `Escalated`), assignee delegation, priority escalation, and direct linkage to Case files.
- **Accounts & Bots (`/accounts`)**: Bot probability classification and **Explainable Risk Score Breakdowns** displaying contributing mathematical weights (Velocity Anomaly 35%, Network Synchrony 25%, Account Age Ratio 20%, Semantic Repetition 20%).
- **Case Management (`/cases`)**: Incident dossiers bundling linked threats, suspect accounts, and blockchain hashes. Includes analyst working notes and **PDF Evidence Report Export** for law enforcement / CERT-In submission.
- **Content Verification (`/verification`)**: Public verification portal allowing judges to paste any SHA-256 hash or social text to test cryptographic match/mismatch proofs, plus an interactive on-chain evidence anchoring engine.

### 4. Trust & Audit
- **Blockchain Ledger (`/blockchain`)**: Visual block stream and verifiable transaction ledger showcasing Polygon block numbers, gas fees, timestamps, and Merkle proofs.
- **Immutable Audit Trail (`/audit`)**: Cryptographically hashed SOC operator logs recording who viewed, changed, escalated, or exported forensic data.
- **Reports (`/reports`)**: Multi-section intelligence package builder with automated signing.

---

## 🎯 Key Judge Features & Keyboard Shortcuts

- **Ctrl + K / Cmd + K**: Global Command Palette to jump to any page, flagged threat (e.g. `THR-2041`), or suspect account (e.g. `@newsflash_0912`).
- **5-Step First-Run Guided Tour**: Automatically launches for new users; can be re-triggered anytime via the **Guided Tour** button in the sidebar.
- **Role-Based Access Control (RBAC)**: Switch between **Analyst** (triage & investigation), **Admin** (policy & audit compliance), and **Viewer** (read-only observer) using the top-right user menu.
- **Shareable URL Query Parameters**: Filter state (platform, risk level, time range, search query, active tab) is synchronized with URL search params for instant bookmarking and sharing.
- **Technical Tooltips**: Hover over terms like *Explainable Risk Score*, *Coordinated Inauthentic Behavior*, and *Blockchain Hash Anchoring* for definitions.

---

## 🎨 Consistent SOC Severity System

Consistent color tokens applied across all badges, tables, charts, and graph nodes:
- **Critical**: `bg-red-500/10 text-red-400 border-red-500/30` (`#ef4444`)
- **High**: `bg-amber-500/10 text-amber-400 border-amber-500/30` (`#f97316`)
- **Medium**: `bg-cyan-500/10 text-cyan-400 border-cyan-500/30` (`#06b6d4`)
- **Low**: `bg-slate-500/10 text-slate-300 border-slate-700` (`#94a3b8`)
- **Verified / Valid**: `bg-emerald-500/10 text-emerald-400 border-emerald-500/30` (`#10b981`)

---

## 🔌 Swapping Mock Data for Real APIs

All mock datasets are centralized in `/src/data/index.js` and wrapped in `/src/services/api.js`.

To connect to live backend microservices:

1. **Threats & Accounts Ingestion**:
   In `src/services/api.js`:
   ```javascript
   export const getThreats = async (params) => {
     const res = await fetch(`/api/v1/threats?${new URLSearchParams(params)}`);
     return res.json();
   };

   export const getAccounts = async () => {
     const res = await fetch('/api/v1/accounts');
     return res.json();
   };
   ```

2. **Blockchain Smart Contract Anchoring**:
   Replace the browser SHA-256 simulation in `src/context/AppContext.jsx` with an `ethers.js` or `viem` contract call:
   ```javascript
   import { ethers } from 'ethers';
   import SentinelABI from './SentinelEvidenceStore.json';

   const provider = new ethers.BrowserProvider(window.ethereum);
   const signer = await provider.getSigner();
   const contract = new ethers.Contract('0x71b...882e', SentinelABI, signer);

   export const anchorEvidenceOnChain = async (hashBytes32, metadataURI) => {
     const tx = await contract.anchorEvidence(hashBytes32, metadataURI);
     await tx.wait();
     return tx.hash;
   };
   ```

3. **Live Streaming Incidents**:
   Connect `IncidentTicker.jsx` to a WebSocket (`ws://api.sentinel.internal/stream`) or Server-Sent Events (SSE) feed.

---

## 📁 Clean Codebase Directory Structure

```
sentinel/
├── src/
│   ├── components/
│   │   ├── dashboard/          # IncidentTicker, etc.
│   │   ├── navigation/         # Breadcrumbs, CommandPalette, GuidedTour, UserMenu
│   │   └── ui/                 # StatCard, SeverityBadge, DataTable, FilterBar,
│   │                           # EmptyState, Tooltip, SkeletonLoader, Drawer
│   ├── context/
│   │   └── AppContext.jsx      # RBAC Role, Threats, Cases, Blockchain & Audit state
│   ├── data/
│   │   └── index.js            # Unified realistic SIH26152 intelligence mock data
│   ├── layouts/
│   │   └── AppLayout.jsx       # Categorized sidebar, topbar, mobile drawer
│   ├── pages/
│   │   ├── Accounts.jsx        # Explainable Risk Score & Bot Intelligence
│   │   ├── AuditTrail.jsx      # Immutable SOC Event Ledger
│   │   ├── Auth.jsx            # Sign in / Register demo
│   │   ├── Blockchain.jsx      # Polygon Block & Transaction Ledger
│   │   ├── Cases.jsx           # Case Management & Printable PDF Dossier
│   │   ├── Dashboard.jsx       # Top 4 KPIs, Live Ticker, Clickable Charts
│   │   ├── Landing.jsx         # Public Landing page
│   │   ├── Modules.jsx         # Sentiment, Trends, GeoMap, Reports, About
│   │   ├── Network.jsx         # Coordinated Campaign Detection (CIB Graph)
│   │   ├── Threats.jsx         # Alert Triage Queue (New/Investigating/Resolved)
│   │   └── Verification.jsx    # Public SHA-256 Hash Match/Mismatch Verifier
│   ├── services/
│   │   └── api.js              # API connector adapter
│   ├── App.jsx                 # Route definitions (all routes preserved)
│   ├── index.css               # SOC styling, scrollbars, glassmorphism
│   └── main.jsx                # AppProvider & React root
├── tailwind.config.js          # SOC colors, glow shadows, animations
├── vite.config.js
└── package.json
```
