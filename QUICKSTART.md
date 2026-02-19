# RIFT Dashboard - Quick Start Guide

## 1-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
# or pnpm install
```

### Step 2: Configure Backend
Edit `.env.local`:
```bash
BACKEND_URL=http://localhost:8000
```

### Step 3: Start Frontend
```bash
npm run dev
```

### Step 4: Open Dashboard
```
http://localhost:3000
```

---

## Using the Dashboard

### Upload Transaction Data

1. Click the upload area or drag-drop a CSV file
2. Ensure CSV has columns: `sender_account`, `receiver_account`, `amount`, `timestamp`
3. Wait for analysis (typically 5-30 seconds depending on data size)

### Understand the Results

**Risk Metrics Panel** (Top)
- Shows key statistics: suspicious accounts, fraud rings, average risk score
- Green = healthy, Red = critical

**Alerts & Insights** (Below metrics)
- Auto-generated findings about detected patterns
- Click to dismiss or investigate further

**Analysis View** (Main area)
- **Analyst Mode**: Summary tables and statistics
- **Investigator Mode**: Interactive graph with detailed controls

### Analyst Mode (Default)

Best for stakeholders and managers.

**What you see:**
- Summary list of fraud rings by risk
- Risk breakdown and pattern distribution
- Transaction statistics

**What to do:**
- Click on a ring to highlight it
- Check the JSON inspector for raw data
- Use "Download" to export results

### Investigator Mode (Advanced)

Best for fraud analysts and investigators.

**What you see:**
- Interactive network graph of accounts
- Graph controls on the right panel
- Account detail panels on selection

**How to investigate:**
1. Switch to "Investigator" mode (top right)
2. Click nodes in the graph to select accounts
3. View detailed information in right panel:
   - Account ID
   - Suspicion score (0-100)
   - Why it was flagged
   - Associated fraud rings
4. Mark false positives as "Legitimate" to refine results
5. Use filters to show specific patterns

**Graph Controls:**
- **Pattern Types**: Filter by cycle, smurfing, shell chain, velocity
- **Risk Score Slider**: Show only high-risk accounts (80+)
- **Clear Filters**: Reset all active filters

---

## Understanding Fraud Patterns

### Cycles (Circular Transfers)
- Money loops back through accounts
- Indicator of money laundering
- Example: A → B → C → A

### Smurfing (Structuring)
- Many small transactions instead of one large
- One account sends to many destinations
- Common in money laundering

### Shell Chains (Layering)
- Long sequence of transfers through intermediaries
- Obscures money origin
- Multiple hops = higher risk

### High Velocity
- Unusual number of transactions in short time
- May indicate automated fraud or testing

---

## Risk Score Interpretation

| Score | Risk Level | Action |
|-------|-----------|--------|
| 80-100 | Critical | Immediate investigation needed |
| 60-79 | High | Thorough review recommended |
| 40-59 | Medium | Monitor for patterns |
| 0-39 | Low | Routine monitoring |

---

## Tips & Tricks

### Faster Analysis
- Start with smaller CSV files (< 10,000 rows)
- Filter by pattern type to focus investigation
- Use time range filters to narrow scope

### Better Results
- Ensure clean data before upload
- Check data health score before analysis
- Review anomalies in validation summary

### Exporting Data
- Use "Copy" to copy JSON to clipboard
- Use "Download" to save full analysis
- Open in text editor for manual review

---

## Keyboard Shortcuts

Coming soon! For now:
- **Click node** = Select account details
- **Click ring row** = Highlight fraud ring
- **ESC** = Close detail panels
- **Click X** = Close alerts

---

## Troubleshooting

### Page won't load?
1. Check browser console (F12)
2. Verify backend is running: `http://localhost:8000/docs`
3. Ensure `.env.local` has correct `BACKEND_URL`

### Upload fails?
1. Check CSV format (must have 4 required columns)
2. Verify file size (max 50MB)
3. Check browser console for detailed error

### Graph doesn't show?
1. Reload page (hard refresh: Ctrl+Shift+R)
2. Clear browser cache
3. Try with a smaller dataset

### Account details won't show?
1. Make sure you clicked on a node (not the background)
2. Check console for errors
3. Try selecting a different account

---

## What's Next?

- Explore different fraud rings
- Mark false positives as legitimate
- Export results for your team
- Integrate with your compliance workflow
- Share findings with stakeholders

---

## Need Help?

1. Check `README.md` for detailed documentation
2. Review backend logs for API errors
3. Open an issue on GitHub
4. Contact support team

Happy investigating!
