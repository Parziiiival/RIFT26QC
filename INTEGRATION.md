# Frontend-Backend Integration Guide

## Prerequisites

- Frontend running: `http://localhost:3000`
- Backend API running: `http://localhost:8000`
- Sample CSV data ready for testing

## Configuration

### Frontend Setup

1. Create `.env.local`:
```bash
BACKEND_URL=http://localhost:8000
```

2. Start frontend:
```bash
npm run dev
```

3. Verify running:
```bash
curl http://localhost:3000
# Should return HTML
```

### Backend Setup

Ensure backend is running and accessible:

```bash
# Test backend health
curl http://localhost:8000/docs
# Should show Swagger UI
```

## Integration Flow

### Step 1: Test Backend Endpoints

Verify the backend has required endpoints:

```bash
# Check /analyze endpoint
curl -X POST http://localhost:8000/analyze \
  -F "file=@sample_data.csv"

# Check /download-json endpoint
curl http://localhost:8000/download-json
```

Expected `/analyze` response:
```json
{
  "graph_data": { "nodes": [...], "edges": [...] },
  "suspicious_accounts": [...],
  "fraud_rings": [...],
  "summary": {...}
}
```

### Step 2: Upload CSV via Frontend

1. Navigate to `http://localhost:3000`
2. Click upload area or drag CSV file
3. Wait for analysis (5-30 seconds)
4. Check browser console for errors

### Step 3: Verify Data Flow

Monitor API calls in browser DevTools:

1. Open DevTools (F12)
2. Go to Network tab
3. Upload CSV file
4. Look for POST request to `/api/analyze`
5. Verify response has all required fields

### Step 4: Test All Features

After successful upload, test:

- ✅ Risk metrics display (KPI cards)
- ✅ Graph visualization renders
- ✅ Click nodes to show account details
- ✅ Click fraud ring rows to highlight
- ✅ Toggle Analyst/Investigator mode
- ✅ Apply filters (pattern types, risk score)
- ✅ View JSON inspector
- ✅ Download JSON file
- ✅ Mark accounts as legitimate

## API Contract

### POST /analyze

**Request**:
- Content-Type: multipart/form-data
- Body: CSV file with columns:
  - sender_account
  - receiver_account
  - amount
  - timestamp

**Response**:
```typescript
{
  graph_data: {
    nodes: Array<{
      id: string
      label: string
      data: {
        account_id: string
        transaction_count?: number
        total_amount?: number
      }
    }>
    edges: Array<{
      id: string
      source: string
      target: string
      weight?: number
      amount?: number
      timestamp?: number
      risk_level?: number
    }>
    timestamps?: number[]
  }
  suspicious_accounts: Array<{
    account_id: string
    suspicion_score: number           // 0-100
    detected_patterns: string[]       // ['cycle', 'smurfing', etc]
    ring_id?: string | string[]
    incoming_count: number
    outgoing_count: number
    total_amount?: number
  }>
  fraud_rings: Array<{
    ring_id: string
    pattern_type: string              // 'cycle', 'smurfing', 'shell_chain'
    members: string[]
    risk_score: number                // 0-100
    confidence: number                // 0-100
    transaction_hashes?: string[]
    total_amount?: number
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

### GET /download-json

**Response**:
- Same structure as `/analyze` response
- Content-Type: application/json
- Content-Disposition: attachment

## Common Issues & Solutions

### Issue: Backend Connection Refused

**Symptoms**:
- "Failed to analyze CSV" error
- Network tab shows no request

**Solutions**:
1. Check backend is running:
   ```bash
   curl http://localhost:8000/docs
   ```
2. Verify `BACKEND_URL` in `.env.local`
3. Check firewall settings
4. Try different port if 8000 is taken

### Issue: CORS Error

**Symptoms**:
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solutions**:
1. Ensure backend has CORS enabled
2. Verify proxy route is working:
   ```bash
   curl http://localhost:3000/api/analyze
   ```
3. Check browser console for specific error

### Issue: Empty Results

**Symptoms**:
- Analysis completes but no data shows
- Graph is empty

**Solutions**:
1. Check CSV has required columns
2. Verify CSV has at least 2 rows (1 header + data)
3. Check backend response in Network tab
4. Verify data types match expectations

### Issue: Graph Not Rendering

**Symptoms**:
- Upload completes but graph shows spinner

**Solutions**:
1. Check browser console for JS errors
2. Try with smaller dataset (< 100 nodes)
3. Clear browser cache and reload
4. Check if node/edge data is valid

### Issue: Slow Performance

**Symptoms**:
- Analysis takes > 60 seconds
- Browser becomes unresponsive

**Solutions**:
1. Try with smaller CSV file
2. Check backend logs for performance issues
3. Monitor browser CPU/memory usage
4. Consider filtering by pattern type after upload

## Data Validation

### CSV Format Requirements

```csv
sender_account,receiver_account,amount,timestamp
ACC001,ACC002,1000,1613430000
ACC002,ACC003,2000,1613430001
...
```

**Validation Rules**:
- ✅ All 4 columns required
- ✅ sender_account: non-empty string
- ✅ receiver_account: non-empty string
- ✅ amount: positive number
- ✅ timestamp: positive integer (Unix epoch)
- ✅ No duplicate rows
- ✅ Data consistency (coherent time ranges)

### Response Format Validation

Frontend validates response has:
- ✅ graph_data with nodes and edges
- ✅ suspicious_accounts array
- ✅ fraud_rings array
- ✅ summary object
- ✅ All required fields present

## Testing Checklist

### Pre-Launch Testing

- [ ] Backend endpoint responds correctly
- [ ] CSV upload works with sample data
- [ ] Graph renders with 50+ nodes
- [ ] Account details panel shows on click
- [ ] Fraud ring table displays correctly
- [ ] Filters work (pattern types, risk score)
- [ ] JSON export downloads without errors
- [ ] Mode toggle switches between Analyst/Investigator
- [ ] Whitelist functionality works
- [ ] Alerts/insights generate correctly
- [ ] Responsive design works on mobile
- [ ] Dark theme is applied correctly

### Performance Testing

- [ ] Analysis completes in < 60 seconds (for 10K rows)
- [ ] Graph renders smoothly (60 FPS)
- [ ] No memory leaks on page refresh
- [ ] Large dataset doesn't crash browser

### Edge Case Testing

- [ ] Empty CSV file shows error
- [ ] CSV with missing columns shows error
- [ ] Invalid data types handled gracefully
- [ ] Network disconnection shows error
- [ ] Backend error responses handled correctly

## Monitoring & Debugging

### Browser Console

Check for errors:
```javascript
// Should be clean or only warnings
console.error
console.warn
```

### Network Tab

Monitor requests:
1. Look for POST to `/api/analyze`
2. Check response status (200 = success)
3. Verify response has all fields
4. Monitor size and timing

### React DevTools

Inspect component state:
1. Install React DevTools extension
2. Inspect `<Home>` component
3. Check `uiState`, `analysisResult`, `filterState`

### Backend Logs

Check for API issues:
```bash
# Watch backend logs while uploading
# Should see processing messages and completion
```

## Performance Optimization

### If Upload is Slow

1. **Backend Issue**:
   - Check backend processing time in response
   - Profile backend analysis pipeline
   - Optimize cycle detection or scoring

2. **Frontend Issue**:
   - Check graph rendering time
   - Reduce node count with filters
   - Try using Investigator mode filters

### If Graph Rendering is Slow

1. **Too Many Nodes**:
   - Filter by pattern type first
   - Apply risk score filter
   - Use time range filter

2. **Layout Algorithm**:
   - Backend may need optimization
   - Cytoscape layout takes time for large graphs
   - Consider hierarchical or force-directed layout

3. **Browser Performance**:
   - Check CPU usage
   - Close other browser tabs
   - Try different browser

## Deployment Integration

### Development
```bash
BACKEND_URL=http://localhost:8000
```

### Staging
```bash
BACKEND_URL=https://staging-api.example.com
```

### Production
```bash
BACKEND_URL=https://api.example.com
```

Set via environment variable or `.env.production.local`

## Troubleshooting Workflow

1. **Check Backend Health**
   ```bash
   curl http://localhost:8000/docs
   ```

2. **Test Upload Directly**
   ```bash
   curl -X POST http://localhost:8000/analyze -F "file=@sample.csv"
   ```

3. **Check Frontend Connection**
   - Open DevTools Network tab
   - Try uploading CSV via UI
   - Monitor request/response

4. **Inspect Error Details**
   - Check browser console (F12)
   - Look for specific error messages
   - Check response body in Network tab

5. **Test with Different Data**
   - Try smaller CSV file
   - Try with known good data
   - Verify data format matches expectations

## Support Resources

- **Backend Issues**: Check backend README/documentation
- **Frontend Issues**: Check console errors and Network tab
- **Integration Issues**: Check this document
- **Data Format Issues**: Review API contract above

---

**Last Updated**: February 19, 2026  
**Status**: Ready for Integration Testing
