"use client"

import { FraudRing } from "@/types"
import { calculateRingRiskScore, rankFraudRings } from "@/utils/riskCalculation"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

interface FraudRingTableProps {
  fraudRings: FraudRing[]
  selectedRingId?: string | null
  onSelectRing?: (ringId: string | null) => void
}

export function FraudRingTable({
  fraudRings,
  selectedRingId,
  onSelectRing,
}: FraudRingTableProps) {
  const [expandedRings, setExpandedRings] = useState<Set<string>>(new Set())

  const rankedRings = rankFraudRings(fraudRings)
  const topRings = rankedRings.slice(0, 5)

  const toggleExpanded = (ringId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedRings((prev) => {
      const next = new Set(prev)
      next.has(ringId) ? next.delete(ringId) : next.add(ringId)
      return next
    })
  }

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-danger"
    if (score >= 60) return "text-warning"
    if (score >= 40) return "text-accent"
    return "text-success"
  }

  return (
    <div className="card-base">
      <h3 className="text-lg font-semibold mb-4">
        Top 5 Fraud Rings ({fraudRings.length} total)
      </h3>

      <div className="space-y-2">
        {topRings.length === 0 ? (
          <p className="text-sm text-muted text-center py-8">
            No fraud rings detected
          </p>
        ) : (
          topRings.map((ring) => {
            const isExpanded = expandedRings.has(ring.ring_id)
            const riskScore = calculateRingRiskScore(ring)

            return (
              <div key={ring.ring_id}>
                <button
                  onClick={() => onSelectRing?.(ring.ring_id)}
                  className={`w-full card-interactive p-3 ${
                    selectedRingId === ring.ring_id
                      ? "bg-accent/10 border-accent"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={(e) => toggleExpanded(ring.ring_id, e)}
                        className="p-1 hover:bg-card-hover rounded transition-colors"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <div className="text-left">
                        <p className="text-sm font-mono text-foreground">
                          {ring.ring_id}
                        </p>
                        <p className="text-xs text-muted capitalize">
                          {ring.pattern_type.replace("_", " ")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className={`text-lg font-bold ${getRiskColor(riskScore)}`}>
                          {riskScore}
                        </p>
                        <p className="text-xs text-muted">
                          {ring.members.length} members
                        </p>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Expanded Row */}
                {isExpanded && (
                  <div className="bg-card p-3 border-l-2 border-accent space-y-3">
                    <div>
                      <p className="text-xs text-muted mb-2">Members</p>
                      <div className="flex flex-wrap gap-2">
                        {ring.members.slice(0, 6).map((member) => (
                          <span
                            key={member}
                            className="badge badge-info text-xs font-mono"
                          >
                            {member.substring(0, 8)}...
                          </span>
                        ))}
                        {ring.members.length > 6 && (
                          <span className="badge badge-info text-xs">
                            +{ring.members.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <p className="text-muted mb-1">Risk Score</p>
                        <p className={`font-bold ${getRiskColor(ring.risk_score)}`}>
                          {ring.risk_score}/100
                        </p>
                      </div>
                      <div>
                        <p className="text-muted mb-1">Confidence</p>
                        <p className="font-bold text-foreground">
                          {Math.round(ring.confidence)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-muted mb-1">Total Amount</p>
                        <p className="font-bold text-foreground">
                          ${(ring.total_amount || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
