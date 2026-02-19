"use client"

import { Insight } from "@/utils/insightGenerator"
import { AlertCircle, AlertTriangle, Info, X } from "lucide-react"
import { useState } from "react"

interface AlertBannerProps {
  insights: Insight[]
}

export function AlertBanner({ insights }: AlertBannerProps) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())

  const visibleInsights = insights.filter((i) => !dismissedIds.has(i.id))

  if (visibleInsights.length === 0) {
    return null
  }

  const dismiss = (id: string) => {
    setDismissedIds((prev) => new Set([...prev, id]))
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="w-5 h-5 text-danger" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-warning" />
      case "info":
        return <Info className="w-5 h-5 text-accent" />
      default:
        return <Info className="w-5 h-5" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-danger/30 bg-danger/5"
      case "warning":
        return "border-warning/30 bg-warning/5"
      case "info":
        return "border-accent/30 bg-accent/5"
      default:
        return "border-card-hover"
    }
  }

  return (
    <div className="space-y-3">
      {visibleInsights.map((insight) => (
        <div
          key={insight.id}
          className={`card-base border ${getSeverityColor(insight.severity)} flex items-start gap-3 slide-in-up`}
        >
          <div className="mt-0.5 flex-shrink-0">
            {getSeverityIcon(insight.severity)}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-foreground">{insight.title}</h4>
            <p className="text-sm text-muted mt-1">{insight.description}</p>
          </div>
          <button
            onClick={() => dismiss(insight.id)}
            className="flex-shrink-0 p-1 hover:bg-card-hover rounded transition-colors"
          >
            <X className="w-4 h-4 text-muted" />
          </button>
        </div>
      ))}
    </div>
  )
}
