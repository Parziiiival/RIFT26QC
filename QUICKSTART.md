# Quick Start Guide - Fraud Detection Platform

Get up and running with the Fraud Detection Platform in 5 minutes!

## Prerequisites

- Node.js 18 or later
- npm, yarn, or pnpm
- A modern web browser
- Sample transaction data (CSV) or use generated sample data

## Installation (2 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open http://localhost:3000
```

Done! The platform is now running locally.

## First Run (3 minutes)

### Option A: Use Sample Data

1. **Go to the home page** - You should see the upload interface
2. **Click "Download Sample"** button to download sample transaction data
3. **Upload the file** - Drag and drop or click to select the downloaded CSV
4. **Wait for analysis** - System automatically analyzes the data
5. **Explore results** - Check out the dashboard, graph, and fraud rings

### Option B: Upload Your Own Data

1. **Prepare CSV file** with columns:
   - `sender_id` (required)
   - `receiver_id` (required)
   - `amount` (required)
   - `timestamp` (optional)

2. **Upload file** - Drag onto upload zone or click to select

3. **View analysis** - System processes and displays results

## Understanding the Dashboard

### Overview Tab
- **Key Metrics**: Suspicious account count, fraud rings detected, average risk
- **Summary Stats**: Total transactions, accounts, and volume
- **Top 5 Rings**: Most dangerous detected fraud patterns

### Graph Tab
- **Interactive Network**: Click nodes to investigate accounts
- **Risk Colors**: Green (safe) → Red (critical)
- **Controls**: Zoom, pan, toggle suspicious-only view

### Fraud Rings Tab
- **Ring List**: All detected fraud patterns ranked by risk
- **Expand Rows**: See members, transaction paths, details
- **Pattern Types**: Cycles, Fan patterns, Layering chains

### Accounts Tab
- **Suspicious Accounts**: Full list with risk scores
- **Patterns**: Detected fraud patterns per account
- **Volume Data**: Incoming/outgoing transaction amounts

### Insights Tab
- **Auto-Generated Alerts**: Grouped by severity
- **Actionable Insights**: Key findings from analysis
- **Affected Accounts**: Which accounts involved in each alert

### Architecture Tab
- **System Overview**: Data flow pipeline
- **Algorithms**: Explanation of detection methods
- **Performance**: Scaling and optimization details

## Investigation Workflow

### 1. Find Suspicious Accounts
- Look at "Suspicious Accounts" count in Overview
- Or browse the Accounts tab table

### 2. Click on Graph Node
- Go to Graph tab
- Click any node to open side panel
- View account details in right sidebar

### 3. Review Risk Explanation
- Click "Why Flagged?" in account panel
- See breakdown of risk factors
- Understand detection reasoning

### 4. Investigate Connections
- View incoming/outgoing transactions
- Check pattern membership
- Note whitelisted status

### 5. Mark as Legitimate (Optional)
- If false positive, click "Mark as Legitimate"
- Account excluded from future flagging
- Risk scores automatically recalculated

## Switching Modes

**In Dashboard Header:**
- **Analyst Mode** (default): Clean overview, high-level metrics
- **Investigator Mode**: Advanced tools including:
  - Timeline tab - Temporal analysis
  - Raw Data tab - JSON export

### Enable Investigator Mode
```
Click "Analyst" button in top right → changes to "Investigator"
New tabs appear (Timeline, Raw Data)
```

## Analyzing Fraud Patterns

### Cycle Detection
What: Circular money loops
Example: Account A → B → C → A
Risk: High - Indicates coordination
Action: Review all members

### Fan-In/Out
What: One account with many connections
Example: A → B, C, D, E (fan-out)
Risk: Medium-High - May indicate smurfing
Action: Check if legitimate business

### Layering
What: Long sequential chains
Example: A → B → C → D → E
Risk: Critical - Money laundering pattern
Action: Immediate investigation

## Tips & Tricks

### Export Analysis
1. Go to Investigator Mode (switch toggle)
2. Click "Raw Data" tab
3. Click "Download" to save JSON
4. Or "Copy" to clipboard

### Time Travel Analysis
1. Switch to Investigator Mode
2. Click "Timeline" tab
3. Use slider to move through time
4. Watch fraud network evolve
5. Click Play to animate

### Filter Suspicious Accounts
1. In Graph tab
2. Toggle "Showing Suspicious" button
3. Shows only risky accounts (score ≥25)

### Get Account Details
1. Click any node in graph
2. Side panel opens with:
   - Risk score
   - Detected patterns
   - Transaction history
   - Whitelisting option

## Common Issues

### "Data Health Score Too Low"
- CSV has too many missing values
- Check data quality before upload
- Ensure all required columns present

### Analysis Takes Too Long
- Large dataset (5000+ transactions)
- Try with smaller sample first
- System is still analyzing in background

### Graph Not Showing Nodes
- Click "Show All" button if in suspicious-only mode
- Refresh page if still not visible
- Check browser console for errors

### Can't Find Fraud Ring
- Look in Fraud Rings tab (sorted by risk)
- Check Insights tab for descriptions
- Use graph to visualize relationships

## What Each Color Means

- **Green**: Low risk (0-24) - Normal activity
- **Yellow**: Medium risk (25-49) - Warrants review
- **Orange**: High risk (50-74) - Suspicious behavior
- **Red**: Critical (75-100) - Requires investigation

## Next Steps

### To Deploy
See `DEPLOYMENT.md` for production deployment instructions.

### For Development
- Modify `lib/graph-analyzer.ts` for custom algorithms
- Edit `lib/types.ts` for new data structures
- Add components in `components/` directory

### To Integrate Database
See `README.md` for PostgreSQL integration steps.

## Need Help?

1. **Check README.md** - Full documentation
2. **See FEATURES.md** - Detailed feature list
3. **Review DEPLOYMENT.md** - Hosting guide
4. **Check browser console** - Error messages (F12)

## Key Files

| File | Purpose |
|------|---------|
| `app/page.tsx` | Home/upload page |
| `app/dashboard/page.tsx` | Main analysis dashboard |
| `lib/graph-analyzer.ts` | Fraud detection algorithms |
| `components/` | UI components |
| `app/api/` | Backend API routes |

## Sample Data Format

```csv
sender_id,receiver_id,amount,timestamp
ACC001,ACC002,10000,2024-01-15T10:30:00Z
ACC002,ACC003,9500,2024-01-15T10:45:00Z
ACC003,ACC001,9000,2024-01-15T11:00:00Z
```

---

**You're ready to go!** Start by uploading data and exploring the fraud detection results. Happy investigating!
