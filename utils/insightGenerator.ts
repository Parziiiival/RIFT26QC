import { FraudRing, SuspiciousAccount, AnalysisSummary } from "@/types"

export interface Insight {
  id: string
  title: string
  description: string
  severity: "info" | "warning" | "critical"
  icon: string
  relatedRingIds?: string[]
  relatedAccountIds?: string[]
}

export function generateInsights(
  fraudRings: FraudRing[],
  suspiciousAccounts: SuspiciousAccount[],
  summary: AnalysisSummary
): Insight[] {
  const insights: Insight[] = []
  let id = 0

  // Check for cycles
  const cycleRings = fraudRings.filter((r) => r.pattern_type === "cycle")
  if (cycleRings.length > 0) {
    const totalCycleMembers = new Set(cycleRings.flatMap((r) => r.members))
    insights.push({
      id: `insight-${id++}`,
      title: "Circular Money Loops Detected",
      description: `Found ${cycleRings.length} circular transaction pattern(s) involving ${totalCycleMembers.size} account(s). These patterns indicate possible money laundering through circular transfers.`,
      severity: "critical",
      icon: "⚠️",
      relatedRingIds: cycleRings.map((r) => r.ring_id),
    })
  }

  // Check for high-risk smurfing (fan-out)
  const smurfRings = fraudRings.filter((r) => r.pattern_type === "smurfing")
  if (smurfRings.length > 0) {
    const maxMembers = Math.max(...smurfRings.map((r) => r.members.length))
    if (maxMembers > 5) {
      insights.push({
        id: `insight-${id++}`,
        title: `High-Risk Fan-Out Pattern`,
        description: `Detected smurfing pattern with ${maxMembers} accounts. One account distributing to many destinations indicates possible structuring or value transfer.`,
        severity: "critical",
        icon: "🚨",
        relatedRingIds: smurfRings
          .filter((r) => r.members.length === maxMembers)
          .map((r) => r.ring_id),
      })
    } else {
      insights.push({
        id: `insight-${id++}`,
        title: "Smurfing Pattern Detected",
        description: `Found ${smurfRings.length} smurfing pattern(s) with potential structuring behavior.`,
        severity: "warning",
        icon: "⚠️",
        relatedRingIds: smurfRings.map((r) => r.ring_id),
      })
    }
  }

  // Check for shell chains
  const shellRings = fraudRings.filter((r) => r.pattern_type === "shell")
  if (shellRings.length > 0) {
    const avgChainLength = Math.round(
      shellRings.reduce((sum, r) => sum + r.members.length, 0) / shellRings.length
    )
    insights.push({
      id: `insight-${id++}`,
      title: "Shell Chain / Layering Detected",
      description: `Identified ${shellRings.length} shell chain pattern(s) with average ${avgChainLength} accounts per chain. Multiple intermediaries suggest asset layering.`,
      severity: "warning",
      icon: "📉",
      relatedRingIds: shellRings.map((r) => r.ring_id),
    })
  }

  // Check for ultra-high-risk accounts
  const ultraHighRisk = suspiciousAccounts.filter((a) => a.suspicion_score >= 85)
  if (ultraHighRisk.length > 0) {
    const topRisk = ultraHighRisk[0]
    insights.push({
      id: `insight-${id++}`,
      title: "Critical Risk Account",
      description: `Account ${topRisk.account_id} has suspicion score of ${topRisk.suspicion_score}/100. Immediate investigation recommended.`,
      severity: "critical",
      icon: "🔴",
      relatedAccountIds: [topRisk.account_id],
    })
  }

  // Check for velocity anomalies
  const velocityAccounts = suspiciousAccounts.filter(
    (a) => a.detected_patterns.includes("high_velocity") && a.suspicion_score >= 70
  )
  if (velocityAccounts.length > 0) {
    insights.push({
      id: `insight-${id++}`,
      title: "High-Velocity Transactions",
      description: `${velocityAccounts.length} account(s) showing rapid transaction velocity with suspicious patterns.`,
      severity: "warning",
      icon: "⚡",
      relatedAccountIds: velocityAccounts.map((a) => a.account_id),
    })
  }

  // Risk distribution summary
  const lowRisk = suspiciousAccounts.filter((a) => a.suspicion_score < 40).length
  const mediumRisk = suspiciousAccounts.filter(
    (a) => a.suspicion_score >= 40 && a.suspicion_score < 70
  ).length
  const highRisk = suspiciousAccounts.filter((a) => a.suspicion_score >= 70)
    .length

  if (highRisk > 0) {
    insights.push({
      id: `insight-${id++}`,
      title: "Risk Distribution Summary",
      description: `${lowRisk} low-risk, ${mediumRisk} medium-risk, and ${highRisk} high-risk accounts detected across ${summary.total_accounts} total accounts.`,
      severity: "info",
      icon: "📊",
    })
  }

  return insights
}

export function generateAccountReason(account: SuspiciousAccount): string[] {
  const reasons: string[] = []

  if (account.suspicion_score >= 80) {
    reasons.push("Extreme suspicion score detected")
  } else if (account.suspicion_score >= 60) {
    reasons.push("High suspicion score")
  }

  if (account.detected_patterns.includes("cycle")) {
    reasons.push("Part of circular transaction pattern")
  }

  if (account.detected_patterns.includes("smurfing")) {
    reasons.push("Matches smurfing/structuring behavior")
  }

  if (account.detected_patterns.includes("shell_chain")) {
    reasons.push("Involved in shell chain/layering")
  }

  if (account.detected_patterns.includes("high_velocity")) {
    const transactionCount = account.incoming_count + account.outgoing_count
    reasons.push(`High activity: ${transactionCount} transactions`)
  }

  if (account.ring_id) {
    const ringIds = Array.isArray(account.ring_id)
      ? account.ring_id
      : [account.ring_id]
    reasons.push(`Associated with fraud ring(s): ${ringIds.join(", ")}`)
  }

  if (reasons.length === 0) {
    reasons.push("Suspicious patterns detected")
  }

  return reasons
}
