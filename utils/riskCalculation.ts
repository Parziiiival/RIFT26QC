import { SuspiciousAccount, FraudRing, AnalysisSummary } from "@/types"

export interface RiskMetrics {
  totalAccounts: number
  suspiciousCount: number
  criticalCount: number
  averageRiskScore: number
  flaggedPercentage: number
  fraudRingsCount: number
  highestRiskScore: number
  lowestRiskScore: number
}

export function calculateRiskMetrics(
  accounts: SuspiciousAccount[],
  fraudRings: FraudRing[],
  totalAccounts: number
): RiskMetrics {
  const suspiciousCount = accounts.length
  const criticalCount = accounts.filter((a) => a.suspicion_score >= 80).length
  const averageRiskScore =
    suspiciousCount > 0
      ? Math.round(
          accounts.reduce((sum, a) => sum + a.suspicion_score, 0) /
            suspiciousCount
        )
      : 0

  return {
    totalAccounts,
    suspiciousCount,
    criticalCount,
    averageRiskScore,
    flaggedPercentage: totalAccounts > 0 ? 
      Math.round((suspiciousCount / totalAccounts) * 100) : 0,
    fraudRingsCount: fraudRings.length,
    highestRiskScore:
      suspiciousCount > 0
        ? Math.max(...accounts.map((a) => a.suspicion_score))
        : 0,
    lowestRiskScore:
      suspiciousCount > 0
        ? Math.min(...accounts.map((a) => a.suspicion_score))
        : 0,
  }
}

export function getRiskLevel(score: number): "low" | "medium" | "high" | "critical" {
  if (score >= 80) return "critical"
  if (score >= 60) return "high"
  if (score >= 40) return "medium"
  return "low"
}

export function getRiskLevelColor(
  score: number
): "success" | "accent" | "warning" | "danger" {
  const level = getRiskLevel(score)
  switch (level) {
    case "critical":
      return "danger"
    case "high":
      return "warning"
    case "medium":
      return "accent"
    case "low":
      return "success"
  }
}

export function formatRiskScore(score: number): string {
  return `${Math.round(score)}/100`
}

export function getRiskTrend(
  currentScore: number,
  previousScore: number
): "up" | "down" | "stable" {
  const diff = currentScore - previousScore
  if (Math.abs(diff) <= 2) return "stable"
  return diff > 0 ? "up" : "down"
}

export function calculateRingRiskScore(ring: FraudRing): number {
  let score = ring.risk_score * 0.7 // Base risk score weight

  // Add member count factor
  const memberFactor = Math.min(ring.members.length * 5, 30)
  score += memberFactor

  // Add confidence factor
  score += ring.confidence

  return Math.min(Math.round(score), 100)
}

export function rankFraudRings(fraudRings: FraudRing[]): FraudRing[] {
  return [...fraudRings].sort((a, b) => {
    const aScore = calculateRingRiskScore(a)
    const bScore = calculateRingRiskScore(b)
    return bScore - aScore // Descending order
  })
}

export function categorizePatterns(
  patterns: string[]
): Record<string, number> {
  const categories: Record<string, number> = {
    cycle: 0,
    smurfing: 0,
    shell_chain: 0,
    high_velocity: 0,
    other: 0,
  }

  patterns.forEach((pattern) => {
    if (pattern in categories) {
      categories[pattern]++
    } else {
      categories.other++
    }
  })

  return categories
}

export function calculateDatasetHealthScore(
  suspiciousCount: number,
  totalAccounts: number,
  processingTimeSeconds: number
): number {
  let score = 100

  // Reduce score based on suspicious accounts
  const suspiciousRatio = suspiciousCount / Math.max(totalAccounts, 1)
  if (suspiciousRatio > 0.5) {
    score -= 30
  } else if (suspiciousRatio > 0.2) {
    score -= 15
  } else if (suspiciousRatio > 0.1) {
    score -= 5
  }

  // Adjust based on processing time (longer = potentially more complex data)
  if (processingTimeSeconds > 60) {
    score -= 10
  } else if (processingTimeSeconds > 30) {
    score -= 5
  }

  return Math.max(score, 0)
}
