# Quick Start Guide - Fraud Detection System

Get up and running with the fraud detection platform in 5 minutes.

## Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun package manager
- A modern web browser (Chrome, Firefox, Safari, Edge)

## Installation

### 1. Clone or Download the Project

```bash
git clone <repository-url>
cd fraud-detection-system
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
# or
bun install
```

### 3. Run Development Server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
# or
bun dev
```

The application will be available at: **http://localhost:3000**

## First Steps

### 1. Get Sample Data (Quick Demo)

On the home page, click **"Download Sample CSV"** to generate realistic fraud data with:
- 150 transactions
- 20% fraud rate
- Mixed fraud patterns (cycles, fan-out, layering)
- 50 unique accounts

### 2. Upload the CSV

1. Click the upload area or drag-and-drop the CSV file
2. The system automatically validates the data
3. Check the **Data Quality Score** (target: >85%)
4. Click **"Analyze"** to start processing

### 3. Explore the Investigation Page

The system automatically redirects to `/investigation` with 6 tabs:

#### **Overview Tab**
- Key metrics: Total accounts, transactions, suspicious count
- Top 5 dangerous fraud rings
- Risk score distribution

#### **Interactive Graph Tab**
- Visual network of all transactions
- Click nodes to view account details
- Use sidebar filters to focus on specific patterns
- Timeline playback to see fraud evolution

#### **Fraud Rings Tab**
- Complete list of detected fraud networks
- Sorted by risk score and ring type
- View member lists and transaction paths
- Statistics for each ring

#### **Accounts Tab**
- Sortable table of suspicious accounts
- Risk scores, transaction counts, total amounts
- Detected fraud patterns for each account
- Click to view full account investigation panel

#### **Insights Tab**
- Auto-generated alerts by severity
- Critical: Immediate investigation needed
- High: High-probability fraud
- Medium: Review recommended
- Low: Monitor

#### **Advanced Tab**
- Raw analysis data in JSON format
- System statistics and metadata
- Processing time metrics
- Download analysis results

## CSV Format

Your transaction data should have these columns:

### Required Columns (flexible naming)
- **sender/from/source/sender_id** - Account initiating transaction
- **receiver/to/destination/receiver_id** - Account receiving transaction
- **amount/value/volume** - Transaction amount

### Optional
- **timestamp/date/time** - When transaction occurred (ISO 8601 format)

### Example CSV
```csv
sender_id,receiver_id,amount,timestamp
ACC001,ACC002,5000,2024-01-15T10:30:00Z
ACC002,ACC003,4500,2024-01-15T10:45:00Z
ACC003,ACC001,4000,2024-01-15T11:00:00Z
ACC001,ACC004,3000,2024-01-15T11:15:00Z
```

## Understanding the Analysis

### Risk Scoring (0-100)
- **75-100**: Critical risk - Immediate investigation
- **50-74**: High risk - Suspicious activity
- **25-49**: Medium risk - Review recommended
- **0-24**: Low risk - Normal activity

### Fraud Patterns Detected

1. **Cycle (Circular Money Loops)**
   - Accounts sending money in circles
   - Indicates coordinated fraud rings
   - Common in money laundering

2. **Fan-In/Fan-Out (Smurfing)**
   - One account to many (fan-out) or many to one (fan-in)
   - Indicates structuring/smurfing schemes
   - Often used to avoid thresholds

3. **Layering (Money Laundering Chains)**
   - Long chains of transfers
   - Used to obscure money origin
   - Complex transaction paths

## Interactive Features

### Graph Visualization
- **Zoom**: Scroll to zoom in/out
- **Pan**: Click and drag to move around
- **Select Node**: Click account node to view details
- **Node Size**: Represents transaction volume
- **Node Color**: 
  - Green: Low risk (0-24)
  - Yellow: Medium risk (25-49)
  - Orange: High risk (50-74)
  - Red: Critical risk (75-100)

### Filter Controls (Right Sidebar)
- **Suspicious Only**: Toggle to hide/show all accounts
- **Minimum Risk Score**: Slider (0-100)
- **Max Transaction Amount**: Filter large transfers
- **Pattern Type**: Focus on specific fraud types

### Timeline Playback
- **Play**: Animate transactions chronologically
- **Pause**: Stop animation
- **Reset**: Return to start
- **Slider**: Jump to specific date

### Account Investigation Panel
- Click any account node to open side panel
- View all incoming/outgoing transactions
- See detected patterns and fraud ring membership
- Check "Why Flagged?" for reasoning
- Option to mark as legitimate (whitelisting)

## Common Workflows

### Investigate a Fraud Ring

1. Go to **Fraud Rings tab**
2. Click a ring to see member details
3. Review transaction paths
4. Click member account IDs to view individual accounts
5. Check **Insights tab** for recommended actions

### Track Suspicious Account Activity

1. Go to **Accounts tab**
2. Sort by Risk Score (highest first)
3. Click account row to open investigation panel
4. Review all transactions (incoming/outgoing)
5. Check which fraud rings the account belongs to
6. Mark as legitimate if falsely flagged

### Find Critical Alerts

1. Go to **Insights tab**
2. Filter by "critical" severity
3. Review each alert for affected accounts
4. Click account IDs to investigate
5. Take recommended actions

### Analyze Fraud Evolution Over Time

1. Go to **Graph tab**
2. Open **Timeline Playback** section
3. Click **Play** button
4. Watch transactions flow chronologically
5. Pause to examine specific time periods
6. Use filters to focus on pattern types

## Troubleshooting

### CSV Upload Fails
- **Issue**: "Invalid CSV format"
- **Solution**: Check that CSV has required columns (sender_id, receiver_id, amount)
- **Check**: Are column names spelled correctly?

### Data Quality Score Low (<70%)
- **Issue**: Data quality warnings
- **Solution**: Review the warnings shown in validation
- Common causes: Missing values, duplicate records, invalid amounts
- Typically safe to proceed with analysis

### Graph Won't Load
- **Issue**: "No nodes to display"
- **Solution**: 
  - Check that CSV has valid data
  - Try reducing filter thresholds
  - Toggle "Suspicious Only" filter

### Analysis Takes Too Long
- **Issue**: Processing >5 seconds
- **Solution**: This is normal for large datasets (10k+ transactions)
- Try uploading a smaller sample first

## Keyboard Shortcuts

- **Click node**: Select account
- **Ctrl/Cmd + Z**: Undo (if available)
- **Escape**: Close account panel
- **Space**: Focus graph view

## Performance Tips

1. **Large Datasets**: Start with <10k transactions for initial testing
2. **Filtering**: Use risk score filter to focus on suspicious activity
3. **Pattern Types**: Filter by specific pattern to reduce noise
4. **Timeline**: Use playback for ~5-100k transaction datasets

## Next Steps

1. **Experiment with Sample Data**: Try the default sample CSV
2. **Upload Real Data**: Use your own transaction dataset
3. **Export Results**: Download analysis JSON from Advanced tab
4. **Read Full Docs**: See README.md for comprehensive documentation
5. **Check API Docs**: See API_DOCUMENTATION.md for integration

## Deployment

### Deploy to Vercel (Recommended)

```bash
vercel deploy
```

### Deploy to Other Platforms

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Support & Resources

- **Documentation**: See README.md for detailed features
- **API Reference**: See API_DOCUMENTATION.md for endpoints
- **Issues**: Check browser console (F12) for error details
- **GitHub**: Submit issues at repository

## Tips for Best Results

1. Ensure CSV has at least 50+ transactions for reliable pattern detection
2. Include timestamps for timeline analysis
3. Use account IDs that are consistent and unique
4. Transaction amounts should be numeric values
5. For fraud analysis, mix legitimate and suspicious activity

---

**Ready to detect fraud?** Upload your first dataset now!

Questions? Check the README.md or API_DOCUMENTATION.md files.
