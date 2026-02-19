"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { analyzeDataset, getAccountDetails } from "@/lib/api-client";
import { AnalysisResult, Account } from "@/lib/types";
import { GraphVisualization } from "@/components/graph/GraphVisualization";
import { GraphControls, GraphFilters } from "@/components/graph/GraphControls";
import { TimelinePlayback } from "@/components/graph/TimelinePlayback";
import { AccountDeepDive } from "@/components/account-panel/AccountDeepDive";
import { RiskDashboard } from "@/components/dashboard/RiskDashboard";
import { FraudRingsTable } from "@/components/fraud-rings/FraudRingsTable";
import { AlertEngine } from "@/components/insights/AlertEngine";
import { ArrowLeft, Loader } from "lucide-react";

export default function InvestigationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const datasetId = searchParams.get("datasetId");

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [selectedAccountData, setSelectedAccountData] = useState<Account | null>(
    null
  );
  const [graphFilters, setGraphFilters] = useState<GraphFilters>({
    suspiciousOnly: true,
    minRiskScore: 25,
    maxAmount: 100000,
    patternType: "all",
  });
  const [timeRange, setTimeRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  useEffect(() => {
    const loadAnalysis = async () => {
      if (!datasetId) {
        setError("No dataset ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await analyzeDataset(datasetId);

        if (response.success && response.analysis) {
          setAnalysis(response.analysis);
        } else {
          setError(response.error || "Analysis failed");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    loadAnalysis();
  }, [datasetId]);

  const handleNodeSelect = useCallback(async (nodeId: string) => {
    if (!nodeId || !datasetId) {
      setSelectedAccount(null);
      setSelectedAccountData(null);
      return;
    }

    setSelectedAccount(nodeId);

    try {
      const response = await getAccountDetails(datasetId, nodeId);
      if (response.data) {
        setSelectedAccountData(response.data);
      }
    } catch (error) {
      console.error("Failed to load account details:", error);
    }
  }, [datasetId]);

  const handleClosePanel = () => {
    setSelectedAccount(null);
    setSelectedAccountData(null);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">
          Analyzing transactions and building graph...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background">
        <header className="border-b border-border bg-secondary/50 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="border-red-500/50 bg-red-500/10">
            <CardHeader>
              <CardTitle className="text-red-500">Analysis Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-500/80">{error}</p>
              <Button onClick={() => router.push("/")} className="mt-4">
                Start Over
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-secondary/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Upload
            </Button>
            <h1 className="text-xl font-bold text-foreground">
              Fraud Detection Investigation
            </h1>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-secondary/50">
            <TabsTrigger value="dashboard">Overview</TabsTrigger>
            <TabsTrigger value="graph">Interactive Graph</TabsTrigger>
            <TabsTrigger value="rings">Fraud Rings</TabsTrigger>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <RiskDashboard analysis={analysis} />
          </TabsContent>

          {/* Graph Tab */}
          <TabsContent value="graph" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Graph */}
              <div className="lg:col-span-3 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction Network Visualization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analysis.graphData && (
                      <GraphVisualization
                        graphData={analysis.graphData}
                        onNodeSelect={handleNodeSelect}
                        selectedNode={selectedAccount}
                      />
                    )}
                  </CardContent>
                </Card>

                {/* Timeline */}
                {analysis.graphData && (
                  <TimelinePlayback
                    transactions={[]}
                    onTimeRangeChange={(start, end) =>
                      setTimeRange({ start, end })
                    }
                  />
                )}
              </div>

              {/* Controls */}
              <div className="lg:col-span-1 space-y-6">
                <GraphControls
                  onFilterChange={setGraphFilters}
                  totalNodes={analysis.graphData?.nodes.length || 0}
                  totalEdges={analysis.graphData?.edges.length || 0}
                />

                {/* Selected Account Panel */}
                {selectedAccountData && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">
                        Selected Account
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="font-mono text-xs bg-secondary/50 p-2 rounded break-all border border-border">
                        {selectedAccountData.id}
                      </div>
                      <div className="text-2xl font-bold text-foreground">
                        {selectedAccountData.riskScore.toFixed(1)}
                      </div>
                      <Button
                        onClick={handleClosePanel}
                        variant="outline"
                        className="w-full"
                      >
                        Close Panel
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Fraud Rings Tab */}
          <TabsContent value="rings" className="space-y-6">
            <FraudRingsTable rings={analysis.fraudRings} />
          </TabsContent>

          {/* Accounts Tab */}
          <TabsContent value="accounts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Suspicious Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="data-table border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted">
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Account ID
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Risk Score
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold">
                          Transactions
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold">
                          Total Outgoing
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Patterns
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-semibold">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.suspiciousAccounts.map((account) => (
                        <tr
                          key={account.id}
                          className="border-t border-border hover:bg-muted/50 cursor-pointer"
                          onClick={() => handleNodeSelect(account.id)}
                        >
                          <td className="px-4 py-3 text-sm font-mono">
                            {account.id}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`font-bold ${
                                account.riskScore >= 75
                                  ? "text-red-500"
                                  : account.riskScore >= 50
                                  ? "text-orange-500"
                                  : account.riskScore >= 25
                                  ? "text-yellow-500"
                                  : "text-green-500"
                              }`}
                            >
                              {account.riskScore.toFixed(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            {account.transactionCount}
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            ${(account.totalOutgoing / 1000).toFixed(1)}k
                          </td>
                          <td className="px-4 py-3 text-xs">
                            <div className="flex gap-1 flex-wrap">
                              {account.patterns.map((p) => (
                                <span
                                  key={p.name}
                                  className="bg-primary/20 text-primary px-2 py-1 rounded"
                                >
                                  {p.name}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNodeSelect(account.id);
                              }}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <AlertEngine insights={analysis.insights} />
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Analysis & Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                      Processing Time
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {analysis.processingTime}ms
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                      Analysis Timestamp
                    </p>
                    <p className="text-sm font-mono text-foreground">
                      {new Date(analysis.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <p className="text-sm font-semibold text-foreground mb-3">
                    Graph Statistics
                  </p>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Nodes</p>
                      <p className="font-bold text-foreground">
                        {analysis.graphData?.nodes.length || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Edges</p>
                      <p className="font-bold text-foreground">
                        {analysis.graphData?.edges.length || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Fraud Rings</p>
                      <p className="font-bold text-foreground">
                        {analysis.fraudRings.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <p className="text-sm font-semibold text-foreground mb-3">
                    Raw Analysis Data
                  </p>
                  <pre className="text-xs bg-background p-3 rounded border border-border overflow-auto max-h-96 text-muted-foreground">
                    {JSON.stringify(
                      {
                        totalAccounts: analysis.totalAccounts,
                        totalTransactions: analysis.totalTransactions,
                        suspiciousCount: analysis.suspiciousAccounts.length,
                        fraudRingsCount: analysis.fraudRings.length,
                        averageRiskScore: (
                          analysis.suspiciousAccounts.reduce((sum, a) => sum + a.riskScore, 0) /
                          analysis.suspiciousAccounts.length
                        ).toFixed(2),
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Account Deep Dive Panel */}
      {selectedAccountData && selectedAccount && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClosePanel}
          />
          <div className="relative ml-auto w-full max-w-md bg-background border-l border-border max-h-screen overflow-y-auto shadow-xl">
            <AccountDeepDive
              account={selectedAccountData}
              datasetId={datasetId || ""}
              onClose={handleClosePanel}
            />
          </div>
        </div>
      )}
    </main>
  );
}
