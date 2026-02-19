# Development Guide

## Architecture Overview

### Project Organization

```
Frontend (Next.js)
    ↓ (API Proxy Routes)
Backend API (FastAPI)
    ↓ (Data Processing)
Analysis Engine (Cycle Detection, Scoring)
    ↓
Database / Results
```

### Data Flow

1. **User uploads CSV** → FileUploader component
2. **Local validation** → csvValidator.ts (schema, format, health score)
3. **POST to backend** → /api/analyze (proxy route)
4. **Backend processes** → Graph building, pattern detection, scoring
5. **Results transform** → graphTransform.ts (nodes/edges for Cytoscape)
6. **Display** → Graph visualization + tables + metrics
7. **User interactions** → Update state, highlight, filter

### State Management

Uses React hooks pattern (no Redux needed for current complexity):

- **Global State**: `useAnalysisState()` - analysis result, UI state, filters, whitelist
- **Timeline State**: `useTimelineState()` - playback position, speed
- **Data Fetching**: `useGraphData()` - API calls, loading, errors
- **Component State**: Local useState for UI interactions

## File Structure Deep Dive

### `/components`

- **upload/** - CSV file handling and validation UI
- **graph/** - Cytoscape visualization and controls
- **panels/** - Detail views (account, rings, JSON)
- **dashboard/** - Metrics cards and alerts
- **modes/** - UI mode toggle

### `/hooks`

Custom React hooks for state and data:

```typescript
useAnalysisState()
├── analysisResult - Current analysis data
├── uiState - Selected nodes/rings, mode, loading
├── filterState - Applied filters
├── whitelist - Marked legitimate accounts
└── Methods - selectNode, selectRing, setMode, etc.

useGraphData()
├── data - Current AnalysisResult
├── isLoading - Fetch status
├── error - Error message
└── Methods - analyzeCSV, downloadJSON, reset

useTimelineState(timestamps)
├── currentTime - Playback position
├── isPlaying - Animation state
├── playbackSpeed - Playback multiplier
└── Methods - play, pause, reset, seek
```

### `/utils`

Pure functions for business logic:

- `csvValidator.ts` - CSV schema/format validation
- `graphTransform.ts` - Backend JSON → Cytoscape format
- `insightGenerator.ts` - Pattern → human-readable alerts
- `riskCalculation.ts` - Risk scoring and metrics

### `/types`

Centralized TypeScript interfaces for all data structures:

```typescript
GraphNode, GraphEdge, GraphData
SuspiciousAccount, FraudRing, AnalysisSummary, AnalysisResult
CSVValidationResult, ValidationError
UIState, FilterState, WhitelistEntry
```

## Adding New Features

### Example: Add Time Range Filtering

1. **Update Type** (`types/index.ts`):
```typescript
interface FilterState {
  timeRange: [number, number] | null  // Add this
  // ... existing
}
```

2. **Update Hook** (`hooks/useAnalysisState.ts`):
```typescript
const updateFilters = (newFilters: Partial<FilterState>) => {
  // Already exists, handles timeRange
}
```

3. **Update Utility** (`utils/graphTransform.ts`):
```typescript
export function filterGraphByTimeRange(
  graphData: GraphData,
  minTime: number,
  maxTime: number
): GraphData {
  // Filter edges and nodes by timestamp
}
```

4. **Add Component** (`components/graph/TimeRangeFilter.tsx`):
```typescript
export function TimeRangeFilter({ 
  filters, 
  onFilterChange 
}) {
  return (
    <div className="card-base">
      <label>Time Range</label>
      <input type="date" onChange={...} />
    </div>
  )
}
```

5. **Integrate** (`components/graph/GraphControls.tsx`):
```typescript
<TimeRangeFilter 
  filters={filters} 
  onFilterChange={onFilterChange} 
/>
```

## Performance Optimization

### Current Optimizations

- **Cytoscape**: Uses layout algorithm caching, only re-renders on data change
- **React**: useMemo for expensive computations (insights, filtered accounts)
- **API**: Single backend call per analysis, results cached in state
- **CSS**: Tailwind purging removes unused styles

### Potential Improvements

1. **Virtualization** - For large tables, use react-window
2. **Lazy Loading** - Load detailed account data on demand
3. **Graph Clustering** - Group nodes for large datasets
4. **Web Workers** - Offload CSV parsing to worker thread
5. **Pagination** - Paginate fraud rings table

## Testing Strategy

### Current Setup

No tests configured yet. Recommended approach:

```bash
npm install --save-dev jest @testing-library/react
```

### Test Structure

```
__tests__/
├── utils/
│   ├── csvValidator.test.ts
│   ├── graphTransform.test.ts
│   └── insightGenerator.test.ts
├── hooks/
│   ├── useAnalysisState.test.ts
│   └── useGraphData.test.ts
└── components/
    ├── FileUploader.test.tsx
    └── GraphVisualization.test.tsx
```

### Example Test

```typescript
describe('csvValidator', () => {
  it('should validate CSV headers correctly', () => {
    const { valid, missing } = validateCSVHeaders([
      'sender_account',
      'receiver_account',
      'amount',
      'timestamp'
    ])
    expect(valid).toBe(true)
    expect(missing).toHaveLength(0)
  })
})
```

## Backend Integration

### Expected Response Format

```typescript
{
  "graph_data": {
    "nodes": [
      { "id": "acc1", "label": "Account 1", "data": {...} }
    ],
    "edges": [
      { "id": "e1", "source": "acc1", "target": "acc2", "weight": 100 }
    ]
  },
  "suspicious_accounts": [
    { "account_id": "acc1", "suspicion_score": 85, "detected_patterns": [...] }
  ],
  "fraud_rings": [
    { "ring_id": "ring1", "pattern_type": "cycle", "members": [...] }
  ],
  "summary": {
    "total_accounts": 1000,
    "suspicious_count": 50,
    "average_suspicion_score": 72.5,
    "processing_time_seconds": 2.3
  }
}
```

### Handling Breaking Changes

If backend response format changes:

1. Update `/types/index.ts` interfaces
2. Update `utils/graphTransform.ts` transformation logic
3. Test with `app/api/analyze/route.ts` proxy
4. Update backend integration docs

## Debugging

### Console Logging

Use `[v0]` prefix for v0 debug statements:

```typescript
console.log("[v0] Analyzing CSV:", file.name)
console.log("[v0] API Response:", response)
console.log("[v0] Selected node:", nodeId)
```

### Browser DevTools

1. **Network tab**: Monitor API calls to backend
2. **React DevTools**: Inspect component state and props
3. **Console**: Check for errors and warnings
4. **Performance**: Profile rendering performance

### Common Issues

**Graph not rendering:**
- Check Cytoscape initialization in GraphVisualization.tsx
- Verify node/edge data structure matches expected format
- Look for layout algorithm errors in console

**API calls failing:**
- Verify backend is running (http://localhost:8000/docs)
- Check BACKEND_URL in .env.local
- Monitor CORS errors in browser console

**Styles not applying:**
- Ensure Tailwind is purging correctly
- Check custom CSS in globals.css
- Verify color tokens in tailwind.config.ts

## Deployment

### Build Process

```bash
npm run build
# Generates .next/ folder with optimized output
```

### Environment Variables

For production, set:
- `BACKEND_URL` = Production backend API URL
- `NODE_ENV` = 'production'

### Hosting Options

- **Vercel** (Recommended): `vercel deploy`
- **Docker**: Create Dockerfile with Node.js base
- **Traditional Server**: Copy `.next/` and run `npm start`

## Code Style & Best Practices

### Component Guidelines

- Use functional components with hooks
- Keep components focused and small
- Lift state up when needed
- Use TypeScript for type safety
- Add comments for complex logic

### Naming Conventions

- Components: PascalCase (FileUploader.tsx)
- Hooks: camelCase with 'use' prefix (useAnalysisState.ts)
- Utils: camelCase (csvValidator.ts)
- Types: PascalCase (AnalysisResult)
- Constants: UPPER_SNAKE_CASE

### File Organization

```typescript
// Imports (external, then internal)
import React from 'react'
import { SomeType } from '@/types'

// Types/Interfaces
interface ComponentProps { ... }

// Component
export function MyComponent(props: ComponentProps) {
  // Hooks first
  const [state, setState] = useState()
  
  // Callbacks
  const handleClick = () => {}
  
  // JSX
  return <div>...</div>
}
```

## Resources

- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org
- **Tailwind CSS**: https://tailwindcss.com
- **Cytoscape.js**: https://js.cytoscape.org
- **Radix UI**: https://radix-ui.com

## Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes following guidelines above
3. Test thoroughly before committing
4. Write clear commit messages
5. Push and create pull request
6. Request review from team

## Common Tasks

### Add a New API Endpoint

1. Create route in `app/api/[name]/route.ts`
2. Add proxy logic to communicate with backend
3. Update type definitions if needed
4. Use in hook or component

### Add a New Utility Function

1. Create in appropriate utils file
2. Add TypeScript types
3. Add JSDoc comments
4. Export from file
5. Use in components

### Add a New Component

1. Create component file in appropriate folder
2. Use TypeScript with proper interfaces
3. Make it reusable and self-contained
4. Add meaningful comments
5. Import and use in parent component

---

For questions or issues, check the README.md or open an issue on GitHub.
