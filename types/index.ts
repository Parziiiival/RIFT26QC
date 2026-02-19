export interface GraphNode {
  id: string
  label: string
  data: {
    account_id: string
    transaction_count?: number
    total_amount?: number
  }
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  weight?: number
  amount?: number
  timestamp?: number
  risk_level?: number
}

export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
  timestamps?: number[]
}

export interface SuspiciousAccount {
  account_id: string
  suspicion_score: number
  detected_patterns: string[]
  ring_id?: string | string[]
  incoming_count: number
  outgoing_count: number
  total_amount?: number
  is_whitelisted?: boolean
}

export interface FraudRing {
  ring_id: string
  pattern_type: string
  members: string[]
  risk_score: number
  confidence: number
  transaction_hashes?: string[]
  total_amount?: number
}

export interface AnalysisSummary {
  total_accounts: number
  suspicious_count: number
  fraud_rings_count: number
  average_suspicion_score: number
  processing_time_seconds: number
  timestamp: string
}

export interface AnalysisResult {
  graph_data: GraphData
  suspicious_accounts: SuspiciousAccount[]
  fraud_rings: FraudRing[]
  summary: AnalysisSummary
}

export interface ValidationError {
  row?: number
  column?: string
  message: string
}

export interface CSVValidationResult {
  valid: boolean
  errors: ValidationError[]
  healthScore: number
  rowCount: number
  columnCount: number
  missingColumns: string[]
  anomalies: string[]
}

export interface DataHealthMetrics {
  completeness: number
  validity: number
  consistency: number
  overall: number
}

export interface UIState {
  selectedNode: string | null
  selectedRing: string | null
  mode: "analyst" | "investigator"
  isLoading: boolean
  error: string | null
}

export interface FilterState {
  timeRange: [number, number] | null
  amountRange: [number, number] | null
  patternTypes: string[]
  riskScoreMin: number
}

export interface WhitelistEntry {
  accountId: string
  reason?: string
  markedAt: number
}
