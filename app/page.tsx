"use client"

import { useState, useMemo } from "react"
import { FileUploader } from "@/components/upload/FileUploader"
import { ValidationSummary } from "@/components/upload/ValidationSummary"
import { RiskMetrics } from "@/components/dashboard/RiskMetrics"
import { AlertBanner } from "@/components/dashboard/AlertBanner"
import { GraphVisualization } from "@/components/graph/GraphVisualization"
import { GraphControls } from "@/components/graph/GraphControls"
import { AccountDeepDive } from "@/components/panels/AccountDeepDive"
import { FraudRingTable } from "@/components/panels/FraudRingTable"
import { JSONInspector } from "@/components/panels/JSONInspector"
import { ModeToggle } from "@/components/modes/ModeToggle"
import { useAnalysisState } from "@/hooks/useAnalysisState"
import { useGraphData } from "@/hooks/useGraphData"
import { validateCSV } from "@/utils/csvValidator"
import { generateInsights } from "@/utils/insightGenerator"
import { Loader, AlertTriangle, CheckCircle } from "lucide-react"

export default function Home() {
  const [csvValidation, setCSVValidation] = useState<any>(null)
  const analysis = useGraphData()
  const state = useAnalysisState()

  // Analyze CSV on upload
  const handleFileUpload = async (file: File) => {
    state.setLoading(true)
    state.setError(null)

    try {
      // First validate locally
      const text = await file.text()
      const validation = validateCSV(text)
      setCSVValidation(validation)

      if (!validation.valid) {
        state.setError("CSV validation failed")
        state.setLoading(false)
        return
      }

      // Send to backend
      const result = await analysis.analyzeCSV(file)
      state.updateAnalysisResult(result)
      state.setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Analysis failed"
      state.setError(message)
    } finally {
      state.setLoading(false)
    }
  }

  // Generate insights
  const insights = useMemo(() => {
    if (!state.analysisResult) return []
    return generateInsights(
      state.analysisResult.fraud_rings,
      state.getFilteredAccounts(),
      state.analysisResult.summary
    )
  }, [state.analysisResult, state.getFilteredAccounts])

  // Get selected account data
  const selectedAccount = useMemo(() => {
    if (!state.uiState.selectedNode || !state.analysisResult) return null
    return state.analysisResult.suspicious_accounts.find(
      (acc) => acc.account_id === state.uiState.selectedNode
    )
  }, [state.uiState.selectedNode, state.analysisResult])

  const isInitial = !state.analysisResult && !csvValidation

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-card-hover bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">RIFT Dashboard</h1>
              <p className="text-sm text-muted">Fraud Detection & Analysis</p>
            </div>
            {state.analysisResult && (
              <ModeToggle mode={state.uiState.mode} onModeChange={state.setMode} />
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Initial Upload State */}
        {isInitial && (
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-bold text-foreground">
                Upload Transaction Data
              </h2>
              <p className="text-muted">
                Import CSV files with transaction records to detect fraud patterns
              </p>
            </div>
            <FileUploader
              onFileSelect={handleFileUpload}
              isLoading={state.uiState.isLoading}
            />
          </div>
        )}

        {/* Error State */}
        {state.uiState.error && (
          <div className="card-base border-danger/30 bg-danger/5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-danger mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-danger">Error</h3>
                <p className="text-sm text-foreground mt-1">
                  {state.uiState.error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Validation Summary */}
        {csvValidation && !state.analysisResult && (
          <div className="space-y-4">
            <ValidationSummary validation={csvValidation} />
            {csvValidation.valid && state.uiState.isLoading && (
              <div className="card-base flex items-center justify-center gap-3">
                <Loader className="w-5 h-5 text-accent animate-spin" />
                <p className="text-muted">Analyzing data...</p>
              </div>
            )}
          </div>
        )}

        {/* Analysis Results */}
        {state.analysisResult && (
          <>
            {/* Success Banner */}
            <div className="card-base border-success/30 bg-success/5 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-success">Analysis Complete</h3>
                <p className="text-sm text-muted">
                  Processed {state.analysisResult.summary.total_accounts} accounts in{" "}
                  {state.analysisResult.summary.processing_time_seconds.toFixed(2)}s
                </p>
              </div>
            </div>

            {/* Risk Metrics */}
            <RiskMetrics
              summary={state.analysisResult.summary}
              suspiciousAccounts={state.getFilteredAccounts()}
              fraudRings={state.analysisResult.fraud_rings}
            />

            {/* Alerts & Insights */}
            {insights.length > 0 && <AlertBanner insights={insights} />}

            {/* Main Analysis View */}
            {state.uiState.mode === "analyst" ? (
              // Analyst Mode: Summary View
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="card-base">
                    <h3 className="text-lg font-semibold mb-4">Fraud Pattern Overview</h3>
                    <div className="space-y-3">
                      {state.analysisResult.fraud_rings.map((ring) => (
                        <button
                          key={ring.ring_id}
                          onClick={() => state.selectRing(ring.ring_id)}
                          className={`w-full text-left p-3 rounded-lg border transition-all ${
                            state.uiState.selectedRing === ring.ring_id
                              ? "bg-accent/10 border-accent"
                              : "bg-card border-card-hover hover:border-accent"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-mono text-sm">{ring.ring_id}</p>
                              <p className="text-xs text-muted capitalize">
                                {ring.pattern_type.replace("_", " ")}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{ring.risk_score}/100</p>
                              <p className="text-xs text-muted">
                                {ring.members.length} members
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <FraudRingTable
                    fraudRings={state.analysisResult.fraud_rings}
                    selectedRingId={state.uiState.selectedRing}
                    onSelectRing={state.selectRing}
                  />
                </div>
              </div>
            ) : (
              // Investigator Mode: Full Interactive View
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[600px]">
                {/* Graph */}
                <div className="lg:col-span-3 card-base">
                  <GraphVisualization
                    graphData={state.analysisResult.graph_data}
                    suspiciousAccounts={state.getFilteredAccounts()}
                    fraudRings={state.analysisResult.fraud_rings}
                    selectedNodeId={state.uiState.selectedNode}
                    onNodeSelect={state.selectNode}
                    selectedRingId={state.uiState.selectedRing}
                    filterByRing={!!state.uiState.selectedRing}
                  />
                </div>

                {/* Right Panel */}
                <div className="lg:col-span-1 space-y-4">
                  {/* Account Details */}
                  {selectedAccount ? (
                    <AccountDeepDive
                      account={selectedAccount}
                      fraudRings={state.analysisResult.fraud_rings}
                      onClose={() => state.selectNode(null)}
                      isWhitelisted={state.isWhitelisted(selectedAccount.account_id)}
                      onToggleWhitelist={() =>
                        state.toggleWhitelist(selectedAccount.account_id)
                      }
                    />
                  ) : (
                    <GraphControls
                      filters={state.filterState}
                      onFilterChange={state.updateFilters}
                    />
                  )}

                  {/* Fraud Ring Table */}
                  <FraudRingTable
                    fraudRings={state.analysisResult.fraud_rings}
                    selectedRingId={state.uiState.selectedRing}
                    onSelectRing={state.selectRing}
                  />
                </div>
              </div>
            )}

            {/* JSON Inspector */}
            <div className="card-base">
              <JSONInspector
                data={state.analysisResult}
                onDownload={() => analysis.downloadJSON()}
              />
            </div>
          </>
        )}
      </div>
    </main>
  )
}
