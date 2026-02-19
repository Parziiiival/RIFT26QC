export interface Transaction {
  sender_id: string;
  receiver_id: string;
  amount: number;
  timestamp?: string;
  [key: string]: any;
}

export interface Account {
  id: string;
  riskScore: number;
  totalOutgoing: number;
  totalIncoming: number;
  transactionCount: number;
  patterns: PatternType[];
  isWhitelisted: boolean;
}

export interface PatternType {
  name: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
}

export interface GraphNode {
  data: {
    id: string;
    label: string;
    riskScore: number;
    totalVolume: number;
    transactionCount: number;
    patterns?: string[];
    isFraudRing?: boolean;
  };
}

export interface GraphEdge {
  data: {
    id: string;
    source: string;
    target: string;
    weight: number;
    timestamp?: string;
  };
}

export interface FraudRing {
  id: string;
  members: string[];
  pattern: "cycle" | "fan-in-out" | "layering";
  riskScore: number;
  totalVolume: number;
  transactionPath: string[];
  description: string;
}

export interface AnalysisResult {
  datasetId: string;
  totalAccounts: number;
  totalTransactions: number;
  suspiciousAccounts: Account[];
  fraudRings: FraudRing[];
  insights: Insight[];
  processingTime: number;
  timestamp: string;
  transactions?: Transaction[];
  graphData?: { nodes: GraphNode[]; edges: GraphEdge[] };
}

export interface Insight {
  type: "alert" | "pattern" | "anomaly" | "network";
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  affectedAccounts?: string[];
  relatedRing?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  dataHealthScore: number;
  rowCount: number;
  columnInfo: {
    name: string;
    type: "string" | "number" | "date";
    missing: number;
  }[];
}

export interface UploadResponse {
  success: boolean;
  datasetId?: string;
  validation?: ValidationResult;
  error?: string;
}

export interface AnalysisResponse {
  success: boolean;
  analysis?: AnalysisResult;
  error?: string;
}
