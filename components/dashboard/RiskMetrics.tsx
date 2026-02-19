"use client"

import { useEffect, useState } from "react"
import { AnalysisSummary, SuspiciousAccount, FraudRing } from "@/types"
import { formatNumber } from "@/lib/utils"
import { TrendingUp, AlertTriangle } from "lucide-react"

interface RiskMetricsProps {
  summary: AnalysisSummary
  suspiciousAccounts: SuspiciousAccount[]
  fraudRings: FraudRing[]
}

interface AnimatedNumber {
  value: number
  display: number
}

export function RiskMetrics({
  summary,
  suspiciousAccounts,
  fraudRings,
}: RiskMetricsProps) {
  const [displayValues, setDisplayValues] = useState({
    suspicious: 0,
    rings: 0,
    avgScore: 0,
    critical: 0,
  })

  // Animate counter values
  useEffect(() => {
    const critical = suspiciousAccounts.filter(
      (a) => a.suspicion_score >= 80
    ).length
    const avgScore = Math.round(
      suspiciousAccounts.length > 0
        ? suspiciousAccounts.reduce((sum, a) => sum + a.suspicion_score, 0) /
            suspiciousAccounts.length
        : 0
    )

    const duration = 800
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      setDisplayValues({
        suspicious: Math.round(suspiciousAccounts.length * progress),
        rings: Math.round(fraudRings.length * progress),
        avgScore: Math.round(avgScore * progress),
        critical: Math.round(critical * progress),
      })

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    animate()
  }, [suspiciousAccounts, fraudRings])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-danger"
    if (score >= 60) return "text-warning"
    if (score >= 40) return "text-accent"
    return "text-success"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Suspicious Accounts */}
      <div className="card-base">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm text-muted mb-1">Suspicious Accounts</p>
            <p className={`text-3xl font-bold count-up`}>
              {displayValues.suspicious}
            </p>
          </div>
          <AlertTriangle className="w-8 h-8 text-accent" />
        </div>
        <p className="text-xs text-muted">
          {Math.round(
            (suspiciousAccounts.length / Math.max(summary.total_accounts, 1)) *
              100
          )}
          % of {summary.total_accounts} accounts
        </p>
      </div>

      {/* Fraud Rings */}
      <div className="card-base">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm text-muted mb-1">Fraud Rings Detected</p>
            <p className="text-3xl font-bold count-up">
              {displayValues.rings}
            </p>
          </div>
          <TrendingUp className="w-8 h-8 text-danger" />
        </div>
        <p className="text-xs text-muted">
          {fraudRings.length > 0
            ? `Patterns: ${fraudRings.map((r) => r.pattern_type).join(", ")}`
            : "No patterns detected"}
        </p>
      </div>

      {/* Average Risk Score */}
      <div className="card-base">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm text-muted mb-1">Average Risk Score</p>
            <p className={`text-3xl font-bold count-up ${getScoreColor(displayValues.avgScore)}`}>
              {displayValues.avgScore}
            </p>
          </div>
          <div className="text-2xl">/100</div>
        </div>
        <div className="w-full bg-card-hover rounded-full h-2">
          <div
            className="h-full bg-gradient-to-r from-success to-danger rounded-full transition-all"
            style={{ width: `${displayValues.avgScore}%` }}
          />
        </div>
      </div>

      {/* Critical Risk Accounts */}
      <div className="card-base">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm text-muted mb-1">Critical Risk (80+)</p>
            <p className="text-3xl font-bold count-up text-danger">
              {displayValues.critical}
            </p>
          </div>
          <span className="badge badge-danger">High</span>
        </div>
        <p className="text-xs text-muted">
          {suspiciousAccounts.filter((a) => a.suspicion_score >= 80).length} accounts
          need immediate review
        </p>
      </div>
    </div>
  )
}
