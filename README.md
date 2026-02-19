# Fraud Detection Platform

A sophisticated, interactive fraud detection and investigation system with real-time graph analysis, pattern recognition, and explainable AI insights.

## Features

### Core Features
- **CSV Upload & Validation**: Drag-and-drop CSV file upload with real-time validation and data health scoring
- **Graph Analysis Engine**: Detect fraud patterns including cycles, fan-in/fan-out, and money laundering chains
- **Interactive Graph Visualization**: Cytoscape.js-powered visualization with real-time filtering and zoom controls
- **Account Investigation Panel**: Deep-dive into suspicious accounts with pattern analysis and transaction history
- **Fraud Rings Detection**: Identify and analyze connected fraud networks with risk scoring
- **Real-Time Dashboard**: Live metrics showing suspicious accounts, fraud rings, and risk statistics
- **Alert Engine**: Auto-generated insights with severity classification and pattern descriptions
- **False Positive Control**: Whitelist accounts to refine analysis and reduce false positives

### Advanced Features
- **Pattern Recognition**: Automatically detects three types of fraud patterns:
  - **Cycles**: Circular money loops indicating coordinated fraud
  - **Fan-In/Fan-Out**: Smurfing patterns with suspicious account behavior
  - **Layering**: Money laundering chains with transaction hops
- **Risk Scoring**: Multi-factor risk assessment based on activity, volume, and patterns
- **Visual Theme**: Dark cybersecurity-themed design optimized for fraud investigation
- **Responsive Design**: Works seamlessly on desktop and tablet devices
- **Tabbed Investigation Interface**: 
  - **Overview**: Dashboard with key metrics
  - **Interactive Graph**: Cytoscape visualization with filters and timeline
  - **Fraud Rings**: Comprehensive ring analysis table
  - **Accounts**: Sortable suspicious accounts list
  - **Insights**: Auto-generated alerts by severity
  - **Advanced**: Raw data, JSON export, system metadata
- **Deep Account Investigation**: Side panel with full account history, pattern membership, and risk breakdown
- **Graph Controls**: Real-time filtering by risk score, amount, and pattern type
- **Timeline Playback**: Animate transactions chronologically to understand fraud evolution

## Tech Stack

### Frontend
- **Framework**: Next.js 16 with TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **Graph Visualization**: Cytoscape.js
- **State Management**: React Context + Zustand
- **Data Parsing**: Papa Parse
- **HTTP Client**: Fetch API with custom API client

### Backend
- **Server**: Next.js API Routes
- **Storage**: In-memory (easily adaptable to PostgreSQL)
- **Analysis**: Graph analysis library with pattern detection
- **Architecture**: RESTful API design

## Project Structure

```
app/
├── api/
│   ├── upload/              # CSV upload endpoint
│   ├── analyze/             # Analysis computation
│   ├── fraud-rings/         # Fraud ring queries
│   ├── accounts/            # Account detail endpoints
│   ├── insights/            # Alert generation
│   └── whitelist/           # Account whitelisting
├── investigation/           # Main investigation & analysis page
├── dashboard/               # Legacy dashboard (redirects)
├── page.tsx                 # Landing/upload page
└── layout.tsx               # Root layout

components/
├── csv-upload/
│   └── UploadZone.tsx       # File upload interface
├── graph/
│   └── GraphVisualization.tsx  # Cytoscape integration
├── dashboard/
│   └── RiskDashboard.tsx    # Metrics and summary
├── fraud-rings/
│   └── FraudRingsTable.tsx  # Fraud ring display
├── insights/
│   └── AlertEngine.tsx      # Alert generation UI
├── account-panel/
│   └── AccountDeepDive.tsx  # Account investigation
└── ui/                      # shadcn/ui components

lib/
├── types.ts                 # TypeScript definitions
├── utils.ts                 # Utility functions
├── api-client.ts            # API communication
├── csv-parser.ts            # CSV parsing logic
├── graph-analyzer.ts        # Pattern detection
└── sample-data.ts           # Demo data generation
```

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
# or
pnpm install
# or
yarn install
```

2. Run the development server:
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Using Sample Data

1. Click "Download Sample" on the home page
2. Upload the generated CSV file
3. System validates data and shows quality score
4. Click "Analyze" to process transactions
5. Automatic redirect to investigation page
6. Explore six tabs: Overview, Graph, Rings, Accounts, Insights, Advanced

### CSV Format

Your transaction data should be in CSV format with these columns:

**Required:**
- `sender_id` (or: from, source, sender) - Account sending money
- `receiver_id` (or: to, destination, receiver) - Account receiving money
- `amount` (or: value, volume) - Transaction amount

**Optional:**
- `timestamp` (or: date, time) - When the transaction occurred

**Example:**
```csv
sender_id,receiver_id,amount,timestamp
ACC001,ACC002,10000,2024-01-15T10:30:00
ACC002,ACC003,9500,2024-01-15T10:45:00
ACC003,ACC001,9000,2024-01-15T11:00:00
```

## Key Algorithms

### Fraud Pattern Detection

1. **Cycle Detection**: Depth-first search to find circular money flows
   - Identifies coordinated fraud rings
   - Complexity: O(V + E) where V = accounts, E = transactions

2. **Fan-In/Fan-Out Analysis**: Degree analysis for suspicious connection patterns
   - Detects smurfing and structuring
   - Threshold: 3+ connections

3. **Layering Detection**: Chain analysis for money laundering
   - Finds long transaction paths
   - Minimum chain length: 4 hops

### Risk Scoring

Risk scores (0-100) are calculated based on:
- Transaction count and volume
- Participation in fraud patterns
- Unusual in/out balance ratios
- Pattern severity

**Risk Levels:**
- Critical: 75-100 (requires immediate investigation)
- High: 50-74 (suspicious activity)
- Medium: 25-49 (warrants review)
- Low: 0-24 (standard activity)

## API Endpoints

### POST /api/upload
Upload and validate transaction data

**Request:**
```json
{
  "transactions": [
    { "sender_id": "ACC001", "receiver_id": "ACC002", "amount": 1000 }
  ],
  "fileName": "transactions.csv"
}
```

**Response:**
```json
{
  "success": true,
  "datasetId": "uuid",
  "validation": {
    "isValid": true,
    "dataHealthScore": 95,
    "rowCount": 100
  }
}
```

### POST /api/analyze
Perform fraud analysis on uploaded dataset

**Request:**
```json
{
  "datasetId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "totalAccounts": 50,
    "totalTransactions": 500,
    "suspiciousAccounts": [...],
    "fraudRings": [...],
    "insights": [...],
    "processingTime": 245
  }
}
```

### GET /api/fraud-rings?datasetId=uuid
Get detected fraud rings

### GET /api/accounts/{accountId}?datasetId=uuid
Get account details and transaction history

### GET /api/insights?datasetId=uuid
Get generated insights and alerts

### POST /api/whitelist
Whitelist an account to exclude from flagging

## Data Persistence

Currently uses in-memory storage. To enable database persistence:

1. Set up PostgreSQL database
2. Run migrations:
```bash
psql -U user -d database -f scripts/init-db.sql
```

3. Update API routes to use database queries instead of in-memory maps

## Performance Characteristics

- **CSV Upload**: <1s for 10,000 transactions
- **Analysis**: <500ms for datasets with 50+ accounts
- **Graph Rendering**: Smooth performance with 500+ nodes
- **Pattern Detection**: O(V²) worst-case, typically much faster

## Design System

### Color Palette
- **Background**: #0f0f0f (dark)
- **Foreground**: #fafafa (light)
- **Primary**: #3b82f6 (blue)
- **Accent**: #f97316 (orange)
- **Risk Colors**:
  - Critical: #ef4444 (red)
  - High: #f97316 (orange)
  - Medium: #eab308 (yellow)
  - Low: #22c55e (green)

### Typography
- **Sans-serif**: System font stack (Segoe UI, Roboto, etc.)
- **Mono**: For account IDs and data values

## Future Enhancements

- Real-time streaming transaction analysis
- Machine learning-based pattern detection
- Multi-user collaboration features
- Historical trend analysis
- Custom alert rule configuration
- Export reports to PDF/CSV
- Integration with banking APIs
- Anomaly detection using statistical methods

## Troubleshooting

### CSV Upload Fails
- Ensure CSV format is correct with required columns
- Check for special characters that need escaping
- Verify file encoding is UTF-8

### Analysis Takes Too Long
- Large datasets (10,000+ transactions) may take longer
- Check browser console for errors
- Try with a smaller sample first

### Graph Not Displaying
- Ensure JavaScript is enabled
- Try refreshing the page
- Check browser console for Cytoscape errors

## Support

For issues or questions, please check:
1. Console for error messages
2. This README for common solutions
3. API responses for detailed error information

## License

This project is open source and available under the MIT License.
