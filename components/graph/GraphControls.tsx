"use client"

import { FilterState } from "@/types"
import { X, Filter } from "lucide-react"
import { useState } from "react"

interface GraphControlsProps {
  filters: FilterState
  onFilterChange: (filters: Partial<FilterState>) => void
  patternTypes?: string[]
}

const PATTERN_TYPES = ["cycle", "smurfing", "shell_chain", "high_velocity"]

export function GraphControls({
  filters,
  onFilterChange,
  patternTypes = PATTERN_TYPES,
}: GraphControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const togglePattern = (pattern: string) => {
    const newPatterns = filters.patternTypes.includes(pattern)
      ? filters.patternTypes.filter((p) => p !== pattern)
      : [...filters.patternTypes, pattern]
    onFilterChange({ patternTypes: newPatterns })
  }

  const hasActiveFilters =
    filters.timeRange || filters.amountRange || filters.patternTypes.length > 0

  return (
    <div className="card-base space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-accent" />
          <h3 className="font-semibold">Graph Controls</h3>
          {hasActiveFilters && (
            <span className="badge badge-info text-xs">
              {(filters.patternTypes.length || 0) +
                (filters.timeRange ? 1 : 0) +
                (filters.amountRange ? 1 : 0)}{" "}
              active
            </span>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-muted hover:text-foreground transition-colors"
        >
          <span className="text-sm">{isExpanded ? "Hide" : "Show"}</span>
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4 border-t border-card-hover pt-4">
          {/* Pattern Type Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Pattern Types
            </label>
            <div className="space-y-2">
              {patternTypes.map((pattern) => (
                <label
                  key={pattern}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.patternTypes.includes(pattern)}
                    onChange={() => togglePattern(pattern)}
                    className="w-4 h-4 rounded border-card-hover"
                  />
                  <span className="text-sm capitalize">
                    {pattern.replace("_", " ")}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Risk Score Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Minimum Risk Score
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={filters.riskScoreMin}
                onChange={(e) =>
                  onFilterChange({ riskScoreMin: parseInt(e.target.value) })
                }
                className="flex-1 h-2 bg-card-hover rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm font-medium w-12 text-right">
                {filters.riskScoreMin}
              </span>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={() => {
                onFilterChange({
                  timeRange: null,
                  amountRange: null,
                  patternTypes: [],
                  riskScoreMin: 0,
                })
              }}
              className="w-full py-2 px-3 rounded-lg border border-card-hover hover:bg-card-hover transition-colors text-sm flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}
