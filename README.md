# RIFT - Fraud Detection Dashboard

A comprehensive, multi-feature fraud detection frontend that integrates with the FastAPI backend to detect and visualize fraudulent transaction patterns including cycle detection, smurfing, and shell chains.

## Features

### Core Analysis Features

1. **Smart CSV Ingestion** - Drag-drop file upload with real-time validation, data health scoring, and anomaly detection
2. **Interactive Graph Intelligence** - Cytoscape.js-powered visualization with multi-layer controls and pattern highlighting
3. **Account Deep-Dive Panel** - Detailed account profiles with suspicion scores, detected patterns, and fraud ring membership
4. **Time Travel/Playback Mode** - Scrub through transaction history with animated graph evolution
5. **Fraud Ring Command Center** - Interactive table showing top rings by risk, expandable with member details
6. **JSON Output Inspector** - Pretty JSON viewer with syntax highlighting and export functionality
7. **Real-Time Risk Dashboard** - Animated KPI cards showing suspicious accounts, fraud rings, and risk metrics
8. **Alert & Insight Engine** - Auto-generated human-readable alerts based on detected patterns
9. **Investigator vs Analyst Modes** - Toggle between summary view and full-featured investigative interface
10. **False Positive Control** - Whitelist suspicious accounts to refine results
11. **UX Polish** - Dark theme cybersecurity aesthetic with smooth animations and responsive design
12. **Architecture View** - Insights into backend pipeline, algorithms, and performance metrics

## Tech Stack

- **Frontend Framework**: Next.js 15 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom dark theme
- **UI Components**: shadcn/ui (Radix UI)
- **Graph Visualization**: Cytoscape.js
- **Charts**: Recharts
- **State Management**: React Hooks + Context
- **HTTP Client**: SWR for data fetching
- **Utilities**: date-fns, PapaParse for CSV

## Project Structure

```
├── app/
│   ├── api/                    # Backend proxy routes
│   │   ├── analyze/            # CSV analysis endpoint
│   │   └── download-json/      # JSON export endpoint
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main dashboard
│   └── globals.css             # Global styles & theme
├── components/
│   ├── upload/                 # File upload & validation
│   ├── graph/                  # Graph visualization & controls
│   ├── panels/                 # Detail panels & tables
│   ├── dashboard/              # Metrics & alerts
│   └── modes/                  # Mode toggle
├── hooks/
│   ├── useAnalysisState.ts     # Global state management
│   ├── useTimelineState.ts     # Timeline playback state
│   └── useGraphData.ts         # Backend data fetching
├── utils/
│   ├── csvValidator.ts         # CSV validation logic
│   ├── graphTransform.ts       # Backend data transformation
│   ├── insightGenerator.ts     # Alert generation
│   └── riskCalculation.ts      # Risk scoring & metrics
├── types/
│   └── index.ts                # TypeScript interfaces
└── lib/
    └── utils.ts                # Utility functions
```

## Setup & Installation

### Prerequisites

- Node.js 18+ and npm/pnpm
- Backend API running (FastAPI, default: `http://localhost:8000`)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Parziiiival/RIFT26QC.git
   cd RIFT26QC
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and set BACKEND_URL if needed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## Configuration

### Environment Variables

- `BACKEND_URL` - Backend API URL (default: `http://localhost:8000`)
- `NEXT_PUBLIC_APP_NAME` - Application display name
- `NEXT_PUBLIC_APP_VERSION` - Application version

### Theme Customization

Colors can be customized in `tailwind.config.ts`:

```typescript
colors: {
  background: "#0a0e27",      // Deep blue-black
  foreground: "#e0e7ff",      // Light blue-gray
  card: "#1a1f3a",            // Card backgrounds
  accent: "#00d9ff",          // Cyan accent
  danger: "#ff4444",          // Red danger
  success: "#44ff44",         // Green success
  warning: "#ffaa00",         // Orange warning
}
```

## Usage

### 1. Upload CSV Data

- Click or drag-drop a CSV file
- Supports required columns: `sender_account`, `receiver_account`, `amount`, `timestamp`
- System validates schema and data quality in real-time

### 2. View Analysis Results

Once analysis completes, you'll see:

- **Risk Metrics Dashboard** - KPI cards showing key statistics
- **Alerts & Insights** - Auto-generated warnings about detected patterns
- **Fraud Rings Table** - Top 5 rings by risk score
- **Graph Visualization** - Interactive network graph of transactions

### 3. Explore Patterns

**Analyst Mode**:
- Summary view of fraud rings
- High-level statistics
- Simplified interface for stakeholders

**Investigator Mode**:
- Full graph visualization with node/edge interactions
- Advanced filtering by pattern type, risk score, time range
- Account deep-dive panels with detailed reasoning
- Whitelist functionality to mark false positives

### 4. Export Results

- **JSON Download** - Export full analysis result
- **Copy to Clipboard** - Quick JSON export
- View structured data with interactive tree viewer

## API Integration

### Backend Endpoints

The frontend communicates with your FastAPI backend via:

1. **POST `/api/analyze`**
   - Accepts CSV file upload
   - Returns: `AnalysisResult` with graph, suspicious accounts, fraud rings, summary

2. **GET `/api/download-json`**
   - Returns latest analysis result as JSON

### Response Format

```typescript
interface AnalysisResult {
  graph_data: {
    nodes: Array<{ id, label, data }>
    edges: Array<{ id, source, target, weight, amount, timestamp, risk_level }>
  }
  suspicious_accounts: Array<{
    account_id: string
    suspicion_score: number      // 0-100
    detected_patterns: string[]  // ['cycle', 'smurfing', etc]
    ring_id: string | string[]
    incoming_count: number
    outgoing_count: number
  }>
  fraud_rings: Array<{
    ring_id: string
    pattern_type: string  // 'cycle', 'smurfing', 'shell_chain'
    members: string[]
    risk_score: number
    confidence: number
  }>
  summary: {
    total_accounts: number
    suspicious_count: number
    fraud_rings_count: number
    average_suspicion_score: number
    processing_time_seconds: number
    timestamp: string
  }
}
```

## Performance Considerations

- **Graph Rendering**: Optimized for ~500-1000 nodes; larger graphs may need filtering
- **CSV Parsing**: Client-side validation happens immediately; backend processes in parallel
- **State Management**: Uses React hooks to minimize re-renders
- **Network**: API proxy routes allow CORS-free backend communication

## Development

### Running Tests

```bash
npm run lint
```

### Building for Production

```bash
npm run build
npm start
```

### Code Structure

- **Components**: Modular, self-contained UI blocks
- **Hooks**: Custom hooks for state and data management
- **Utils**: Pure functions for business logic
- **Types**: Centralized TypeScript interfaces

## Troubleshooting

### "Backend connection refused"

- Ensure FastAPI backend is running: `python -m uvicorn backend.main:app --reload`
- Check `BACKEND_URL` in `.env.local`
- Verify backend port (default: 8000)

### "CSV validation failed"

- Ensure all required columns are present: `sender_account`, `receiver_account`, `amount`, `timestamp`
- Check for special characters in account IDs
- Verify timestamp format (Unix timestamps or ISO strings)

### "Graph not rendering"

- Check browser console for errors
- Try with fewer nodes (< 500)
- Clear browser cache and reload

### "Whitelisted accounts not persisting"

- Currently stored in browser memory; reload clears whitelist
- Future: Add localStorage/database persistence

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes following code style
3. Commit: `git commit -m 'Add feature'`
4. Push: `git push origin feature/your-feature`
5. Open Pull Request

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:

1. Check the Troubleshooting section
2. Review backend logs for API errors
3. Open an issue on GitHub
4. Contact the development team

## Roadmap

- [ ] Real-time analysis updates
- [ ] User authentication & roles
- [ ] Result persistence & history
- [ ] Advanced filtering & saved searches
- [ ] Export reports (PDF, Excel)
- [ ] Collaborative annotations
- [ ] Mobile app version
- [ ] Machine learning model integration
