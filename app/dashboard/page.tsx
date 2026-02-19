"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { analyzeDataset, getAccountDetails } from "@/lib/api-client";
import { AnalysisResult, Account } from "@/lib/types";
import { GraphVisualization } from "@/components/graph/GraphVisualization";
import { RiskDashboard } from "@/components/dashboard/RiskDashboard";
import { FraudRingsTable } from "@/components/fraud-rings/FraudRingsTable";
import { AlertEngine } from "@/components/insights/AlertEngine";
import { AccountPanel } from "@/components/account-panel/AccountPanel";
import { JSONViewer } from "@/components/common/JSONViewer";
import { TimelinePlayback } from "@/components/common/TimelinePlayback";
import { ArchitectureView } from "@/components/common/ArchitectureView";
import { ArrowLeft, Loader, Eye, EyeOff } from "lucide-react";

export default function Dashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const datasetId = searchParams.get("datasetId");

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [selectedAccountData, setSelectedAccountData] = useState<Account | null>(null);
  const [investigatorMode, setInvestigatorMode] = useState(false);

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
    setSelectedAccount(nodeId);
    if (nodeId && datasetId && analysis) {
      try {
        const account = analysis.suspiciousAccounts.find(a => a.id === nodeId);
        if (account) {
          setSelectedAccountData(account);
        }
      } catch (err) {
        console.error("Error loading account details:", err);
      }
    }
  }, [datasetId, analysis]);

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
              Back
            </Button>
            <h1 className="text-xl font-bold text-foreground">Fraud Detection Analysis</h1>
            <Button
              variant={investigatorMode ? "default" : "outline"}
              size="sm"
              onClick={() => setInvestigatorMode(!investigatorMode)}
              className="gap-2"
            >
              {investigatorMode ? (
                <>
                  <Eye className="w-4 h-4" />
                  Investigator
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4" />
                  Analyst
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Loader className="w-8 h-8 text-primary animate-spin" />
            <p className="text-muted-foreground">Analyzing transactions and building graph...</p>
          </div>
        ) : error ? (
          <Card className="border-red-500/50 bg-red-500/10">
            <CardHeader>
              <CardTitle className="text-red-500">Analysis Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-500/80">{error}</p>
              <Button
                onClick={() => router.push("/")}
                className="mt-4"
              >
                Start Over
              </Button>
            </CardContent>
          </Card>
        ) : analysis ? (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className={`grid w-full ${investigatorMode ? "grid-cols-8" : "grid-cols-6"}`}>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="graph">Graph</TabsTrigger>
              <TabsTrigger value="rings">Fraud Rings</TabsTrigger>
              <TabsTrigger value="accounts">Accounts</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="architecture">Architecture</TabsTrigger>
              {investigatorMode && (
                <>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="raw">Raw Data</TabsTrigger>
                </>
              )}
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <RiskDashboard analysis={analysis} />
            </TabsContent>

            {/* Graph Tab */}
            <TabsContent value="graph" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction Network Graph</CardTitle>
                </CardHeader>
                <CardContent>
                  <GraphVisualization
                    graphData={analysis.graphData}
                    onNodeSelect={handleNodeSelect}
                    selectedNode={selectedAccount}
                  />
                </CardContent>
              </Card>
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
                          <th className="px-4 py-3 text-left text-sm font-semibold">Account ID</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Risk Score</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold">Transactions</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold">Total Outgoing</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Patterns</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysis.suspiciousAccounts.map((account) => (
                          <tr key={account.id} className="border-t border-border hover:bg-muted/50">
                            <td className="px-4 py-3 text-sm font-mono">{account.id}</td>
                            <td className="px-4 py-3">
                              <span className={`font-bold ${
                                account.riskScore >= 75 ? "text-red-500" :
                                account.riskScore >= 50 ? "text-orange-500" :
                                account.riskScore >= 25 ? "text-yellow-500" :
                                "text-green-500"
                              }`}>
                                {account.riskScore.toFixed(1)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-right">{account.transactionCount}</td>
                            <td className="px-4 py-3 text-sm text-right">${(account.totalOutgoing / 1000).toFixed(1)}k</td>
                            <td className="px-4 py-3 text-xs">
                              <div className="flex gap-1 flex-wrap">
                                {account.patterns.map((p) => (
                                  <span key={p.name} className="bg-primary/20 text-primary px-2 py-1 rounded">
                                    {p.name}
                                  </span>
                                ))}
                              </div>
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

            {/* Timeline Tab - Investigator Mode */}
            {investigatorMode && (
              <TabsContent value="timeline" className="space-y-6">
                {analysis.transactions && (
                  <TimelinePlayback transactions={analysis.transactions} />
                )}
              </TabsContent>
            )}

            {/* Raw Data Tab - Investigator Mode */}
            {investigatorMode && (
              <TabsContent value="raw" className="space-y-6">
                <JSONViewer data={analysis} title="Complete Analysis Output" />
              </TabsContent>
            )}
          </Tabs>

          {/* Account Detail Panel */}
          {selectedAccount && selectedAccountData && (
            <AccountPanel
              account={selectedAccountData}
              transactions={analysis.transactions?.filter(
                (t) => t.sender_id === selectedAccount || t.receiver_id === selectedAccount
              )}
              onClose={() => {
                setSelectedAccount(null);
                setSelectedAccountData(null);
              }}
            />
          )}
        ) : null}
      </div>
    </main>
  );
}
