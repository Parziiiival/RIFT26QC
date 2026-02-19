"use client"

import { SuspiciousAccount, FraudRing } from "@/types"
import { generateAccountReason } from "@/utils/insightGenerator"
import { getRiskColorHex, getRiskColor } from "@/lib/utils"
import { X, AlertCircle, Info } from "lucide-react"

interface AccountDeepDiveProps {
  account: SuspiciousAccount | null
  fraudRings: FraudRing[]
  onClose: () => void
  isWhitelisted?: boolean
  onToggleWhitelist?: () => void
}

export function AccountDeepDive({
  account,
  fraudRings,
  onClose,
  isWhitelisted = false,
  onToggleWhitelist,
}: AccountDeepDiveProps) {
  if (!account) return null

  const reasons = generateAccountReason(account)
  const associatedRings = fraudRings.filter((ring) => {
    const ringIds = Array.isArray(account.ring_id)
      ? account.ring_id
      : account.ring_id
      ? [account.ring_id]
      : []
    return ringIds.includes(ring.ring_id)
  })

  const getRiskBadgeColor = (score: number) => {
    if (score >= 80) return "badge-danger"
    if (score >= 60) return "badge-warning"
    if (score >= 40) return "badge-info"
    return "badge-success"
  }

  return (
    <div className="card-base border border-accent/20 max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 pb-4 border-b border-card-hover">
        <div>
          <h3 className="text-lg font-bold text-foreground">Account Details</h3>
          <p className="text-sm text-muted font-mono">{account.account_id}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-card-hover rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Risk Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted">Suspicion Score</span>
          <span className={`badge ${getRiskBadgeColor(account.suspicion_score)}`}>
            {Math.round(account.suspicion_score)}/100
          </span>
        </div>
        <div className="w-full bg-card-hover rounded-full h-3 overflow-hidden">
          <div
            className="h-full transition-all"
            style={{
              width: `${account.suspicion_score}%`,
              backgroundColor: getRiskColorHex(account.suspicion_score),
            }}
          />
        </div>
      </div>

      {/* Transaction Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-card rounded-lg p-3">
          <p className="text-xs text-muted mb-1">Outgoing</p>
          <p className="text-lg font-bold text-foreground">
            {account.outgoing_count}
          </p>
        </div>
        <div className="bg-card rounded-lg p-3">
          <p className="text-xs text-muted mb-1">Incoming</p>
          <p className="text-lg font-bold text-foreground">
            {account.incoming_count}
          </p>
        </div>
      </div>

      {/* Why Flagged */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-warning" />
          Why Flagged?
        </h4>
        <ul className="space-y-2">
          {reasons.map((reason, idx) => (
            <li key={idx} className="flex gap-2 text-sm text-foreground">
              <span className="text-accent mt-1 flex-shrink-0">→</span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Detected Patterns */}
      {account.detected_patterns.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-foreground mb-3">
            Detected Patterns
          </h4>
          <div className="flex flex-wrap gap-2">
            {account.detected_patterns.map((pattern) => (
              <span
                key={pattern}
                className="badge badge-info text-xs capitalize"
              >
                {pattern.replace("_", " ")}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Associated Rings */}
      {associatedRings.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-foreground mb-3">
            Associated Fraud Rings
          </h4>
          <div className="space-y-2">
            {associatedRings.map((ring) => (
              <div
                key={ring.ring_id}
                className="bg-card rounded-lg p-3 text-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs text-muted">
                    {ring.ring_id}
                  </span>
                  <span className="text-xs capitalize text-accent">
                    {ring.pattern_type.replace("_", " ")}
                  </span>
                </div>
                <p className="text-muted text-xs">
                  {ring.members.length} members • Risk: {ring.risk_score}/100
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Whitelist Option */}
      {onToggleWhitelist && (
        <div className="mt-6 pt-4 border-t border-card-hover">
          <button
            onClick={onToggleWhitelist}
            className={`w-full py-2 px-3 rounded-lg transition-all text-sm font-medium ${
              isWhitelisted
                ? "bg-success/20 text-success hover:bg-success/30"
                : "bg-card-hover hover:bg-card-hover/80"
            }`}
          >
            {isWhitelisted ? "✓ Marked as Legitimate" : "Mark as Legitimate"}
          </button>
        </div>
      )}

      {/* Info */}
      <div className="mt-6 pt-4 border-t border-card-hover text-xs text-muted flex gap-2">
        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <p>
          Click on the graph to select different accounts, or close this panel
          to see the full visualization.
        </p>
      </div>
    </div>
  )
}
