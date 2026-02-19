"use client"

import { useState, useCallback } from "react"
import { AnalysisResult } from "@/types"

export function useGraphData() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<AnalysisResult | null>(null)

  const analyzeCSV = useCallback(async (file: File) => {
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to analyze CSV")
      }

      const result: AnalysisResult = await response.json()
      setData(result)
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error"
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const downloadJSON = useCallback(async () => {
    if (!data) return

    try {
      const response = await fetch("/api/download-json")
      if (!response.ok) throw new Error("Failed to download JSON")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "analysis-result.json"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to download"
      setError(message)
    }
  }, [data])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
  }, [])

  return {
    data,
    isLoading,
    error,
    analyzeCSV,
    downloadJSON,
    reset,
  }
}
