# Fraud Detection System - API Documentation

## Base URL
All endpoints are relative to the application root (e.g., `http://localhost:3000/api/`)

## Authentication
Currently no authentication required. In production, implement JWT or similar.

---

## Endpoints

### 1. Upload CSV Data
**POST** `/api/upload`

Upload and validate transaction data from CSV.

**Request Body:**
```json
{
  "transactions": [
    {
      "sender_id": "ACC001",
      "receiver_id": "ACC002",
      "amount": 5000,
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ],
  "fileName": "transactions.csv"
}
```

**Response (Success):**
```json
{
  "success": true,
  "datasetId": "uuid-string",
  "validation": {
    "isValid": true,
    "dataHealthScore": 92,
    "rowCount": 150,
    "columnInfo": [
      {
        "name": "sender_id",
        "type": "string",
        "missing": 0
      },
      {
        "name": "receiver_id",
        "type": "string",
        "missing": 0
      },
      {
        "name": "amount",
        "type": "number",
        "missing": 2
      }
    ],
    "errors": [],
    "warnings": [
      "2 rows have missing amount values"
    ]
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Invalid CSV format",
  "validation": {
    "isValid": false,
    "dataHealthScore": 0,
    "rowCount": 0,
    "errors": ["Missing required columns: sender_id, receiver_id, amount"],
    "warnings": []
  }
}
```

**Status Codes:**
- `200`: Upload successful
- `400`: Invalid CSV format
- `413`: File too large (>100MB)

---

### 2. Analyze Dataset
**POST** `/api/analyze`

Perform fraud analysis on uploaded dataset.

**Request Body:**
```json
{
  "datasetId": "uuid-string"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "totalAccounts": 50,
    "totalTransactions": 150,
    "suspiciousAccounts": [
      {
        "id": "ACC001",
        "riskScore": 85.5,
        "transactionCount": 25,
        "totalIncoming": 150000,
        "totalOutgoing": 148500,
        "patterns": [
          {
            "name": "Cycle",
            "severity": "high",
            "description": "Circular money loop detected"
          }
        ]
      }
    ],
    "fraudRings": [
      {
        "id": "ring-001",
        "type": "cycle",
        "members": ["ACC001", "ACC002", "ACC003"],
        "riskScore": 88.2,
        "totalVolume": 450000,
        "transactionCount": 12,
        "memberCount": 3
      }
    ],
    "insights": [
      {
        "id": "alert-001",
        "type": "cycle",
        "severity": "critical",
        "title": "Circular Money Loop Detected",
        "description": "Account ACC001 is part of a circular transaction pattern",
        "affectedAccounts": ["ACC001", "ACC002", "ACC003"],
        "confidence": 0.92
      }
    ],
    "graphData": {
      "nodes": [
        {
          "id": "ACC001",
          "label": "ACC001",
          "riskScore": 85.5,
          "transactionCount": 25,
          "isFraudRing": true
        }
      ],
      "edges": [
        {
          "id": "ACC001-ACC002",
          "source": "ACC001",
          "target": "ACC002",
          "amount": 5000,
          "transactionCount": 3
        }
      ]
    },
    "processingTime": 245,
    "timestamp": "2024-01-20T14:30:00Z"
  }
}
```

**Status Codes:**
- `200`: Analysis successful
- `404`: Dataset not found
- `500`: Analysis error

---

### 3. Get Fraud Rings
**GET** `/api/fraud-rings?datasetId=uuid`

Retrieve all detected fraud rings for a dataset.

**Query Parameters:**
- `datasetId` (required): UUID of the dataset
- `type` (optional): Filter by type (cycle, fan-in-out, layering, all)
- `minRiskScore` (optional): Filter by minimum risk score (0-100)

**Response:**
```json
{
  "success": true,
  "fraudRings": [
    {
      "id": "ring-001",
      "type": "cycle",
      "members": ["ACC001", "ACC002", "ACC003"],
      "riskScore": 88.2,
      "totalVolume": 450000,
      "transactionCount": 12,
      "memberCount": 3,
      "transactionPath": [
        {
          "from": "ACC001",
          "to": "ACC002",
          "amount": 5000
        },
        {
          "from": "ACC002",
          "to": "ACC003",
          "amount": 4500
        },
        {
          "from": "ACC003",
          "to": "ACC001",
          "amount": 4000
        }
      ]
    }
  ],
  "totalCount": 5
}
```

**Status Codes:**
- `200`: Success
- `404`: Dataset not found

---

### 4. Get Account Details
**GET** `/api/accounts/{accountId}?datasetId=uuid`

Get detailed information about a specific account.

**Path Parameters:**
- `accountId`: The account ID (e.g., ACC001)

**Query Parameters:**
- `datasetId` (required): UUID of the dataset

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "ACC001",
    "riskScore": 85.5,
    "transactionCount": 25,
    "totalIncoming": 150000,
    "totalOutgoing": 148500,
    "incomingTransactions": [
      {
        "from": "ACC002",
        "to": "ACC001",
        "amount": 5000,
        "timestamp": "2024-01-15T10:30:00Z"
      }
    ],
    "outgoingTransactions": [
      {
        "from": "ACC001",
        "to": "ACC002",
        "amount": 5000,
        "timestamp": "2024-01-15T10:15:00Z"
      }
    ],
    "patterns": [
      {
        "name": "Cycle",
        "severity": "high",
        "description": "Part of circular money loop with ACC002, ACC003"
      }
    ],
    "fraudRings": ["ring-001"],
    "isLegitimate": false,
    "flaggedReasons": [
      "High transaction volume",
      "Part of fraud ring",
      "Suspicious pattern detected"
    ]
  }
}
```

**Status Codes:**
- `200`: Success
- `404`: Account or dataset not found

---

### 5. Get Insights & Alerts
**GET** `/api/insights?datasetId=uuid`

Get auto-generated insights and alerts.

**Query Parameters:**
- `datasetId` (required): UUID of the dataset
- `severity` (optional): Filter by severity (critical, high, medium, low)
- `type` (optional): Filter by type (cycle, fan-in-out, layering, risk-account)

**Response:**
```json
{
  "success": true,
  "insights": [
    {
      "id": "alert-001",
      "type": "cycle",
      "severity": "critical",
      "title": "Circular Money Loop Detected",
      "description": "A circular transaction pattern has been detected involving 3 accounts",
      "affectedAccounts": ["ACC001", "ACC002", "ACC003"],
      "recommendedAction": "Investigate accounts for coordinated fraud",
      "confidence": 0.92,
      "timestamp": "2024-01-20T14:30:00Z"
    }
  ],
  "summary": {
    "total": 12,
    "critical": 2,
    "high": 4,
    "medium": 4,
    "low": 2
  }
}
```

**Status Codes:**
- `200`: Success
- `404`: Dataset not found

---

### 6. Whitelist Account
**POST** `/api/whitelist`

Mark an account as legitimate to exclude it from fraud flagging.

**Request Body:**
```json
{
  "datasetId": "uuid-string",
  "accountId": "ACC001",
  "reason": "Account verified as legitimate"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account whitelisted successfully",
  "datasetId": "uuid-string",
  "accountId": "ACC001",
  "riskRecalculated": true
}
```

**Status Codes:**
- `200`: Success
- `404`: Account or dataset not found
- `400`: Invalid request

---

### 7. Get Dataset Status
**GET** `/api/datasets/{datasetId}`

Get metadata and status of a dataset.

**Path Parameters:**
- `datasetId`: UUID of the dataset

**Response:**
```json
{
  "success": true,
  "dataset": {
    "id": "uuid-string",
    "fileName": "transactions.csv",
    "uploadDate": "2024-01-20T14:25:00Z",
    "rowCount": 150,
    "accountCount": 50,
    "status": "analyzed",
    "processingTime": 245,
    "dataHealthScore": 92
  }
}
```

**Status Codes:**
- `200`: Success
- `404`: Dataset not found

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common Error Codes
- `INVALID_CSV`: CSV format is invalid
- `MISSING_COLUMNS`: Required columns are missing
- `FILE_TOO_LARGE`: File exceeds size limit
- `DATASET_NOT_FOUND`: Dataset ID not found
- `ANALYSIS_FAILED`: Analysis engine error
- `INVALID_REQUEST`: Request body or parameters are invalid

---

## Rate Limiting

Currently no rate limiting. In production:
- Implement rate limiting (e.g., 100 requests/minute)
- Use IP-based or API key-based throttling
- Return `429 Too Many Requests` on limit exceeded

---

## Pagination

Large result sets support pagination:

```
GET /api/fraud-rings?datasetId=uuid&page=1&limit=20
```

Response includes:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

---

## Data Types

### Account
```typescript
{
  id: string;
  riskScore: number; // 0-100
  transactionCount: number;
  totalIncoming: number;
  totalOutgoing: number;
  patterns: Pattern[];
  fraudRings: string[];
  isLegitimate: boolean;
  flaggedReasons: string[];
}
```

### FraudRing
```typescript
{
  id: string;
  type: "cycle" | "fan-in-out" | "layering";
  members: string[];
  riskScore: number;
  totalVolume: number;
  transactionCount: number;
  memberCount: number;
  transactionPath?: Transaction[];
}
```

### Insight
```typescript
{
  id: string;
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  affectedAccounts: string[];
  recommendedAction: string;
  confidence: number; // 0-1
  timestamp: string;
}
```

---

## Best Practices

1. **Always validate input**: Check CSV format before uploading
2. **Handle errors gracefully**: Implement retry logic for failed analyses
3. **Cache results**: Store analysis results client-side for performance
4. **Paginate large datasets**: Use pagination for fraud rings and accounts
5. **Monitor processing time**: Alert users if analysis takes >30 seconds
6. **Use appropriate filtering**: Reduce graph complexity with risk score filters

---

## Examples

### Complete Fraud Investigation Flow

```bash
# 1. Upload CSV
curl -X POST http://localhost:3000/api/upload \
  -H "Content-Type: application/json" \
  -d @upload-request.json

# Response: { datasetId: "uuid-123" }

# 2. Analyze dataset
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{ "datasetId": "uuid-123" }'

# 3. Get fraud rings
curl "http://localhost:3000/api/fraud-rings?datasetId=uuid-123&type=cycle"

# 4. Get account details
curl "http://localhost:3000/api/accounts/ACC001?datasetId=uuid-123"

# 5. Get insights
curl "http://localhost:3000/api/insights?datasetId=uuid-123&severity=critical"

# 6. Whitelist account if legitimate
curl -X POST http://localhost:3000/api/whitelist \
  -H "Content-Type: application/json" \
  -d '{ "datasetId": "uuid-123", "accountId": "ACC001", "reason": "Verified legitimate" }'
```

---

## Webhook Events (Future)

Future versions will support webhooks for:
- `analysis.completed`
- `alert.triggered`
- `ring.detected`
- `account.flagged`

---

## Performance Metrics

Typical response times:
- **Upload**: <100ms
- **Analyze**: 200-500ms (100k transactions)
- **Get Fraud Rings**: <50ms
- **Get Account Details**: <30ms
- **Get Insights**: <50ms

---

## Support & Issues

For API issues:
1. Check error response code and message
2. Validate request format against examples
3. Review server logs for details
4. Contact support with dataset ID and request details
