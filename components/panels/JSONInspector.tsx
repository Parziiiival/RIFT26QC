"use client"

import { AnalysisResult } from "@/types"
import { Copy, Download, ChevronDown } from "lucide-react"
import { useState } from "react"

interface JSONInspectorProps {
  data: AnalysisResult | null
  onDownload?: () => void
}

interface TreeNodeProps {
  label: string
  value: any
  level?: number
}

function JSONTreeNode({ label, value, level = 0 }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(level < 2)

  const isObject = typeof value === "object" && value !== null
  const isArray = Array.isArray(value)
  const isEmpty = isArray ? value.length === 0 : Object.keys(value).length === 0

  if (!isObject) {
    return (
      <div className="ml-4 font-mono text-sm">
        <span className="text-accent">{label}:</span>{" "}
        <span className={typeof value === "string" ? "text-success" : "text-warning"}>
          {typeof value === "string" ? `"${value}"` : String(value)}
        </span>
      </div>
    )
  }

  return (
    <div className="ml-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm font-mono text-accent hover:text-accent/80 transition-colors"
      >
        <ChevronDown
          className={`w-4 h-4 transition-transform ${expanded ? "" : "-rotate-90"}`}
        />
        {label}{" "}
        <span className="text-muted">
          {isArray ? `[${value.length}]` : `{...}`}
        </span>
      </button>

      {expanded && !isEmpty && (
        <div className="ml-4 border-l border-card-hover pl-2 mt-2 space-y-1">
          {isArray
            ? value.slice(0, 5).map((item, idx) => (
                <JSONTreeNode
                  key={idx}
                  label={`[${idx}]`}
                  value={item}
                  level={level + 1}
                />
              ))
            : Object.entries(value)
                .slice(0, 10)
                .map(([key, val]) => (
                  <JSONTreeNode
                    key={key}
                    label={key}
                    value={val}
                    level={level + 1}
                  />
                ))}
          {(isArray ? value.length > 5 : Object.keys(value).length > 10) && (
            <p className="text-xs text-muted ml-4">... and more</p>
          )}
        </div>
      )}
    </div>
  )
}

export function JSONInspector({ data, onDownload }: JSONInspectorProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    if (data) {
      navigator.clipboard.writeText(JSON.stringify(data, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!data) {
    return (
      <div className="card-base text-center text-muted">
        <p>No analysis data available</p>
      </div>
    )
  }

  return (
    <div className="card-base max-h-[80vh] overflow-y-auto space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">JSON Output</h3>
        <div className="flex gap-2">
          <button
            onClick={copyToClipboard}
            className="btn-secondary flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            {copied ? "Copied!" : "Copy"}
          </button>
          {onDownload && (
            <button onClick={onDownload} className="btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download
            </button>
          )}
        </div>
      </div>

      <div className="bg-background rounded-lg p-4 font-mono text-sm space-y-2">
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-card-hover">
          <span className="badge badge-danger">
            {data.suspicious_accounts.length}
          </span>
          <p className="text-muted">Suspicious Accounts</p>
          <span className="badge badge-warning ml-4">
            {data.fraud_rings.length}
          </span>
          <p className="text-muted">Fraud Rings</p>
        </div>

        {/* Summary */}
        <JSONTreeNode label="summary" value={data.summary} level={1} />

        {/* Graph Data */}
        <JSONTreeNode label="graph_data" value={data.graph_data} level={1} />

        {/* Suspicious Accounts */}
        <JSONTreeNode
          label="suspicious_accounts"
          value={data.suspicious_accounts}
          level={1}
        />

        {/* Fraud Rings */}
        <JSONTreeNode label="fraud_rings" value={data.fraud_rings} level={1} />
      </div>

      <p className="text-xs text-muted text-center">
        Full JSON structure displayed. Use the copy button to export the complete data.
      </p>
    </div>
  )
}
