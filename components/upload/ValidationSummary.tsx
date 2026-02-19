"use client"

import { CSVValidationResult } from "@/types"
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ValidationSummaryProps {
  validation: CSVValidationResult
}

export function ValidationSummary({ validation }: ValidationSummaryProps) {
  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "success"
    if (score >= 60) return "warning"
    return "danger"
  }

  const getHealthScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-success/20"
    if (score >= 60) return "bg-warning/20"
    return "bg-danger/20"
  }

  return (
    <div className="space-y-4">
      {/* Health Score Card */}
      <div className="card-base">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Data Health Score</h3>
          <div
            className={cn(
              "text-3xl font-bold",
              getHealthScoreColor(validation.healthScore)
            )}
          >
            {validation.healthScore}%
          </div>
        </div>

        <div className="w-full bg-card-hover rounded-full h-3 overflow-hidden">
          <div
            className={cn(
              "h-full transition-all",
              getHealthScoreBgColor(validation.healthScore)
            )}
            style={{ width: `${validation.healthScore}%` }}
          />
        </div>
      </div>

      {/* Dataset Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card-base">
          <p className="text-sm text-muted mb-1">Total Rows</p>
          <p className="text-2xl font-bold">{validation.rowCount}</p>
        </div>
        <div className="card-base">
          <p className="text-sm text-muted mb-1">Columns</p>
          <p className="text-2xl font-bold">{validation.columnCount}</p>
        </div>
        <div className="card-base">
          <p className="text-sm text-muted mb-1">Valid Rows</p>
          <p className="text-2xl font-bold text-success">
            {validation.rowCount - validation.errors.filter((e) => e.row).length}
          </p>
        </div>
        <div className="card-base">
          <p className="text-sm text-muted mb-1">Issues</p>
          <p className="text-2xl font-bold text-danger">
            {validation.errors.length}
          </p>
        </div>
      </div>

      {/* Validation Errors */}
      {!validation.valid && validation.errors.length > 0 && (
        <div className="card-base border-danger/30 bg-danger/5">
          <div className="flex items-start gap-3 mb-3">
            <AlertCircle className="w-5 h-5 text-danger mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-danger">Validation Errors</h4>
              <p className="text-sm text-muted">Fix these issues before analysis</p>
            </div>
          </div>
          <ul className="space-y-2">
            {validation.errors.slice(0, 5).map((error, idx) => (
              <li key={idx} className="text-sm text-foreground flex gap-2">
                <span className="text-danger">•</span>
                <span>
                  {error.row && `Row ${error.row}: `}
                  {error.message}
                </span>
              </li>
            ))}
            {validation.errors.length > 5 && (
              <li className="text-sm text-muted italic">
                ... and {validation.errors.length - 5} more issues
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Anomalies */}
      {validation.anomalies.length > 0 && (
        <div className="card-base border-warning/30 bg-warning/5">
          <div className="flex items-start gap-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-warning">Data Anomalies Detected</h4>
              <p className="text-sm text-muted">
                These patterns may indicate data quality issues
              </p>
            </div>
          </div>
          <ul className="space-y-2">
            {validation.anomalies.slice(0, 3).map((anomaly, idx) => (
              <li key={idx} className="text-sm text-foreground flex gap-2">
                <span className="text-warning">•</span>
                <span>{anomaly}</span>
              </li>
            ))}
            {validation.anomalies.length > 3 && (
              <li className="text-sm text-muted italic">
                ... and {validation.anomalies.length - 3} more anomalies
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Success State */}
      {validation.valid && (
        <div className="card-base border-success/30 bg-success/5">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-success">Data Validation Passed</h4>
              <p className="text-sm text-muted">
                Ready to proceed with analysis
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
