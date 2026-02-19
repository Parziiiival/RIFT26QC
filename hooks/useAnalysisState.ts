"use client"

import { useState, useCallback } from "react"
import { AnalysisResult, UIState, FilterState, WhitelistEntry } from "@/types"

export function useAnalysisState() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [uiState, setUIState] = useState<UIState>({
    selectedNode: null,
    selectedRing: null,
    mode: "analyst",
    isLoading: false,
    error: null,
  })
  const [filterState, setFilterState] = useState<FilterState>({
    timeRange: null,
    amountRange: null,
    patternTypes: [],
    riskScoreMin: 0,
  })
  const [whitelist, setWhitelist] = useState<Map<string, WhitelistEntry>>(new Map())

  const updateAnalysisResult = useCallback((result: AnalysisResult) => {
    setAnalysisResult(result)
  }, [])

  const selectNode = useCallback((nodeId: string | null) => {
    setUIState((prev) => ({
      ...prev,
      selectedNode: nodeId,
    }))
  }, [])

  const selectRing = useCallback((ringId: string | null) => {
    setUIState((prev) => ({
      ...prev,
      selectedRing: ringId,
    }))
  }, [])

  const setMode = useCallback((mode: "analyst" | "investigator") => {
    setUIState((prev) => ({
      ...prev,
      mode,
    }))
  }, [])

  const setLoading = useCallback((isLoading: boolean) => {
    setUIState((prev) => ({
      ...prev,
      isLoading,
    }))
  }, [])

  const setError = useCallback((error: string | null) => {
    setUIState((prev) => ({
      ...prev,
      error,
    }))
  }, [])

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilterState((prev) => ({
      ...prev,
      ...newFilters,
    }))
  }, [])

  const toggleWhitelist = useCallback((accountId: string, reason?: string) => {
    setWhitelist((prev) => {
      const next = new Map(prev)
      if (next.has(accountId)) {
        next.delete(accountId)
      } else {
        next.set(accountId, {
          accountId,
          reason,
          markedAt: Date.now(),
        })
      }
      return next
    })
  }, [])

  const isWhitelisted = useCallback((accountId: string) => {
    return whitelist.has(accountId)
  }, [whitelist])

  const getFilteredAccounts = useCallback(() => {
    if (!analysisResult) return []

    return analysisResult.suspicious_accounts.filter((acc) => {
      if (isWhitelisted(acc.account_id)) return false
      if (acc.suspicion_score < filterState.riskScoreMin) return false
      if (
        filterState.patternTypes.length > 0 &&
        !acc.detected_patterns.some((p) =>
          filterState.patternTypes.includes(p)
        )
      ) {
        return false
      }
      return true
    })
  }, [analysisResult, filterState, isWhitelisted])

  return {
    analysisResult,
    uiState,
    filterState,
    whitelist,
    updateAnalysisResult,
    selectNode,
    selectRing,
    setMode,
    setLoading,
    setError,
    updateFilters,
    toggleWhitelist,
    isWhitelisted,
    getFilteredAccounts,
  }
}
