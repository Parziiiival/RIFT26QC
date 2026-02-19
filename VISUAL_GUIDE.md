# Visual Guide - Fraud Detection System

## User Interface Layout

### Home Page (/page.tsx)
```
┌─────────────────────────────────────────────────────────┐
│  Fraud Detection System                                  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [CSV Upload Area / Drag & Drop]                       │
│  ┌───────────────────────────────┐                     │
│  │  Drop file here or click      │                     │
│  │  [Browse] [Download Sample]   │                     │
│  └───────────────────────────────┘                     │
│                                                          │
│  Format Guide:                                          │
│  • Required: sender_id, receiver_id, amount            │
│  • Optional: timestamp                                  │
│  • Max 500k rows recommended                           │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Investigation Page (/investigation/page.tsx)

#### Main Navigation Header
```
┌─────────────────────────────────────────────────────────┐
│ [← Back] | Fraud Detection Investigation | [Maximize]  │
├─────────────────────────────────────────────────────────┤
│ [Overview] [Graph] [Rings] [Accounts] [Insights] [Adv.] │
└─────────────────────────────────────────────────────────┘
```

#### Overview Tab Layout
```
┌──────────────────────────────────────────────┐
│ Risk Dashboard                               │
├──────────────────────────────────────────────┤
│ ┌──────────┬──────────┬──────────┐           │
│ │ Accounts │ Txns     │ Avg Risk │           │
│ │ 50       │ 500      │ 42.5     │           │
│ └──────────┴──────────┴──────────┘           │
│                                              │
│ Top 5 Dangerous Fraud Rings:                │
│ ┌────────────────────────────────────────┐  │
│ │ 1. Cycle (ACC1→2→3→1) - Risk: 88.2%   │  │
│ │ 2. Fan-Out (ACC4→5,6,7) - Risk: 76.5% │  │
│ │ 3. Layering (4-hop chain) - Risk: 71.3%│  │
│ │ ...                                     │  │
│ └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

#### Graph Tab Layout
```
┌────────────────────────────────────────────────────────┐
│ Transaction Network Visualization       [Timeline ▼]   │
├────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────┐  ┌──────────────┐ │
│  │                                 │  │ Filters:     │ │
│  │  ○ Account A                    │  │              │ │
│  │    ↓ ($5k)                     │  │ Mode: ⊙ Susp │ │
│  │  ○ Account B                    │  │              │ │
│  │    ↓ ($4.5k)                   │  │ Risk: [___●_] │ │
│  │  ○ Account C                    │  │ 0        100 │ │
│  │    ↓ ($4k)                     │  │              │ │
│  │  ○ Account A (glow)             │  │ Amount: [__] │ │
│  │                                 │  │ $0k    $100k │ │
│  │ [Zoom +] [Zoom -] [Fit]         │  │              │ │
│  │                                 │  │ Pattern:     │ │
│  └─────────────────────────────────┘  │ All          │ │
│                                        │ [Reset]      │ │
│ Timeline:                              └──────────────┘ │
│ [▶] [⏸] [⏮] Progress: [========○] 42% │                │
│ 2024-01-15 → 2024-02-15              │                │
└────────────────────────────────────────────────────────┘
```

#### Fraud Rings Tab Layout
```
┌─────────────────────────────────────────────────────────┐
│ Fraud Rings Analysis                                    │
├──────┬──────────┬────────┬────────┬──────────┬──────────┤
│ Type │ Members  │ Risk   │ Volume │ Txns     │ Actions  │
├──────┼──────────┼────────┼────────┼──────────┼──────────┤
│ Cycle│ 3        │ 88.2%  │ $450k  │ 12       │ [View]   │
│ F-Out│ 5        │ 76.5%  │ $320k  │ 8        │ [View]   │
│ Layer│ 4        │ 71.3%  │ $280k  │ 10       │ [View]   │
│ Cycle│ 2        │ 65.0%  │ $150k  │ 5        │ [View]   │
│ ...  │ ...      │ ...    │ ...    │ ...      │ ...      │
└──────┴──────────┴────────┴────────┴──────────┴──────────┘

Ring Details (Expanded):
┌─────────────────────────────────────────────────────────┐
│ ACC001 → ACC002 ($ 5,000)                              │
│ ACC002 → ACC003 ($ 4,500)                              │
│ ACC003 → ACC001 ($ 4,000)  [Completes cycle]           │
└─────────────────────────────────────────────────────────┘
```

#### Accounts Tab Layout
```
┌────────┬──────┬──────┬────────────┬──────────┬────────────┐
│Account │Risk  │Txns  │Total Out   │Patterns  │Action      │
├────────┼──────┼──────┼────────────┼──────────┼────────────┤
│ACC001  │85.5% │ 25   │ $148,500   │Cycle     │[View]      │
│ACC002  │78.2% │ 18   │ $95,000    │F-Out     │[View]      │
│ACC003  │72.1% │ 20   │ $110,000   │Cycle     │[View]      │
│ACC004  │68.5% │ 15   │ $75,000    │Layer     │[View]      │
│ACC005  │45.3% │ 8    │ $25,000    │None      │[View]      │
│...     │...   │ ...  │ ...        │ ...      │ ...        │
└────────┴──────┴──────┴────────────┴──────────┴────────────┘
```

#### Insights Tab Layout
```
┌──────────────────────────────────────────────────────────┐
│ Alerts & Insights                                        │
├──────────────────────────────────────────────────────────┤
│ 🔴 CRITICAL (2)                                         │
│ ┌────────────────────────────────────────────────────┐  │
│ │ Circular Money Loop Detected                       │  │
│ │ ACC001 ↔ ACC002 ↔ ACC003 ↔ ACC001                │  │
│ │ Recommendation: Investigate immediately            │  │
│ │ Confidence: 92%                                    │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ 🟠 HIGH (4)                                             │
│ ┌────────────────────────────────────────────────────┐  │
│ │ Fan-Out Pattern: ACC004 → [5 accounts]           │  │
│ │ Possible smurfing/structuring                      │  │
│ │ Confidence: 78%                                    │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ 🟡 MEDIUM (4)                                           │
│ ⋮                                                        │
└──────────────────────────────────────────────────────────┘
```

#### Advanced Tab Layout
```
┌──────────────────────────────────────────────────────────┐
│ Advanced Analysis & Metadata                            │
├──────────────────────────────────────────────────────────┤
│ [Processing: 245ms] [Date: 2024-01-20 14:30:00Z]       │
│                                                          │
│ Graph Statistics:                                       │
│ Nodes: 50    Edges: 150    Fraud Rings: 5             │
│                                                          │
│ Raw Analysis Data:                                      │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ {                                                   │ │
│ │   "totalAccounts": 50,                             │ │
│ │   "totalTransactions": 500,                        │ │
│ │   "suspiciousCount": 15,                           │ │
│ │   "fraudRingsCount": 5,                            │ │
│ │   "averageRiskScore": "52.3"                       │ │
│ │ }                                                   │ │
│ │ [Copy] [Download] [Collapse]                       │ │
│ └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### Account Investigation Panel (Slide-Out)
```
When a node is clicked on the graph:

┌───────────────────────────────────┐
│ Account Details           [✕]     │
├───────────────────────────────────┤
│ ID: ACC001                        │
│ Risk Score: 85.5 [████████░░]     │
│                                   │
│ Summary:                          │
│ • Total Transactions: 25          │
│ • Incoming: $150k (12 txns)       │
│ • Outgoing: $148.5k (13 txns)     │
│                                   │
│ Detected Patterns:                │
│ 🔴 Cycle [Cycle with ACC002→003] │
│                                   │
│ Why Flagged?                      │
│ ✗ High transaction frequency      │
│ ✗ Part of fraud ring              │
│ ✗ Suspicious in/out ratio         │
│                                   │
│ Recent Transactions:              │
│ → ACC002: $5,000 [2024-01-15]     │
│ ← ACC003: $4,000 [2024-01-15]     │
│ → ACC004: $3,000 [2024-01-14]     │
│                                   │
│ [Mark as Legitimate] [Close]      │
└───────────────────────────────────┘
```

## Color Scheme

### Risk Score Colors
```
🟢 Green:   0-24   (Low Risk)
🟡 Yellow: 25-49   (Medium Risk)
🟠 Orange: 50-74   (High Risk)
🔴 Red:    75-100  (Critical Risk)
```

### UI Theme
```
Background:  #0f0f0f (Dark Navy)
Foreground:  #fafafa (Off-white)
Primary:     #3b82f6 (Blue)
Accent:      #f97316 (Orange)
Border:      #1e293b (Dark Gray)
Muted:       #475569 (Medium Gray)
```

### Graph Node States
```
Normal Node:        ○ Blue circle
Suspicious Node:    ● Orange/Red circle
Selected Node:      ○ Blue with glow
Fraud Ring Member:  ○ With colored glow
```

### Graph Edge Colors
```
Low Amount:         Light gray
Medium Amount:      Blue
High Amount:        Orange/Red
Very High Amount:   Bright Red
```

## Interaction Flows

### Upload & Analysis Flow
```
1. User lands on home page
   ↓
2. Uploads CSV or clicks "Download Sample"
   ↓
3. System validates data
   ├─ If invalid: Shows error, suggests fixes
   └─ If valid: Shows data health score
   ↓
4. User clicks "Analyze"
   ↓
5. System processes transactions
   ├─ Detects fraud patterns
   ├─ Calculates risk scores
   └─ Generates insights
   ↓
6. Auto-redirect to /investigation page
   ↓
7. Investigation tabs available:
   ├─ Overview
   ├─ Graph
   ├─ Rings
   ├─ Accounts
   ├─ Insights
   └─ Advanced
```

### Account Investigation Flow
```
1. User views graph on Graph tab
   ↓
2. Clicks on account node
   ↓
3. Side panel slides in with details
   ├─ Transaction history
   ├─ Detected patterns
   ├─ Risk reasoning
   └─ Fraud ring membership
   ↓
4. User can:
   ├─ Mark as legitimate (whitelist)
   ├─ View linked accounts
   └─ Export account data
   ↓
5. Close panel to return to graph
```

### Fraud Ring Investigation Flow
```
1. User goes to "Fraud Rings" tab
   ↓
2. Views table of all detected rings
   ├─ Sorted by risk score
   ├─ Grouped by pattern type
   └─ Shows members and volume
   ↓
3. Clicks "View" on a ring
   ↓
4. Sees transaction path:
   ACC001 → ACC002 → ACC003 → ACC001
   ↓
5. Can click member IDs to investigate accounts
   ↓
6. Returns to full ring view with context
```

## Data Flow Diagram

```
CSV File
    ↓
[Upload Component]
    ↓
[CSV Parser] → Validation
    ↓
[API /upload]
    ├─ Validate format
    ├─ Check columns
    └─ Calculate health score
    ↓
Dataset stored in-memory
    ↓
[User clicks "Analyze"]
    ↓
[API /analyze]
    ├─ GraphAnalyzer
    │  ├─ Cycle Detection
    │  ├─ Fan-Out Detection
    │  ├─ Layering Detection
    │  └─ Risk Scoring
    ├─ AlertGenerator
    └─ GraphBuilder
    ↓
Analysis Result Object
    ├─ Accounts with risk scores
    ├─ Fraud rings with patterns
    ├─ Insights & alerts
    ├─ Graph data (nodes/edges)
    └─ Processing metadata
    ↓
[Investigation Page Tabs]
    ├─ Overview (RiskDashboard)
    ├─ Graph (GraphVisualization)
    ├─ Rings (FraudRingsTable)
    ├─ Accounts (AccountsTable)
    ├─ Insights (AlertEngine)
    └─ Advanced (JSONViewer)
    ↓
[User Interface Display]
```

## Responsive Design Breakpoints

```
Mobile (<640px):
- Single column layout
- Full-width tables (horizontal scroll)
- Simplified graph controls
- Stacked cards

Tablet (640px - 1024px):
- 2-column grid where applicable
- Sidebar may collapse
- Tables remain scrollable
- Side panel becomes overlay

Desktop (>1024px):
- Full 3-4 column layouts
- Sidebar always visible
- Tables side-by-side
- Side panel slides in from right
```

## Performance Visualization

```
For 100k transactions:

CSV Upload:        ████░░░░░░ (300ms)
Data Validation:   ██░░░░░░░░ (100ms)
Graph Analysis:    █████░░░░░ (200ms)
Rendering:         ███░░░░░░░ (150ms)
                   ────────────────
Total:             ███████░░░░ (750ms)

Graph Complexity:
Nodes:    50      ○ Small circle
Edges:    150     - Thin line
Rings:    5       ⊕ With glow
```

---

This visual guide helps understand the UI layout and interaction patterns throughout the application.
