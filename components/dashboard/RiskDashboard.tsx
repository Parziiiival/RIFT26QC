"use client";

import { AnalysisResult } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, TrendingUp, Activity, Clock } from "lucide-react";
import { formatNumber, formatCurrency } from "@/lib/utils";

interface RiskDashboardProps {
  analysis: AnalysisResult;
}

export function RiskDashboard({ analysis }: RiskDashboardProps) {
  const avgRiskScore =
    analysis.suspiciousAccounts.length > 0
      ? (
          analysis.suspiciousAccounts.reduce((sum, a) => sum + a.riskScore, 0) /
          analysis.suspiciousAccounts.length
        ).toFixed(1)
      : "0";

  const totalVolume = analysis.suspiciousAccounts.reduce(
    (sum, a) => sum + a.totalOutgoing,
    0
  );

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <AlertCircle className="w-4 h-4 text-red-500" />
              Suspicious Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {analysis.suspiciousAccounts.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              of {analysis.totalAccounts} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              Fraud Rings Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {analysis.fraudRings.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {analysis.fraudRings.reduce((sum, r) => sum + r.members.length, 0)} members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <Activity className="w-4 h-4 text-blue-500" />
              Avg Risk Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{avgRiskScore}</div>
            <p className="text-xs text-muted-foreground mt-1">
              out of 100
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4 text-green-500" />
              Processing Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {analysis.processingTime}
            </div>
            <p className="text-xs text-muted-foreground mt-1">milliseconds</p>
          </CardContent>
        </Card>
      </div>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Transactions</p>
              <p className="text-2xl font-bold text-foreground">
                {formatNumber(analysis.totalTransactions)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Accounts</p>
              <p className="text-2xl font-bold text-foreground">
                {formatNumber(analysis.totalAccounts)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Suspicious Volume</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(totalVolume)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Critical Risk Accounts</p>
              <p className="text-2xl font-bold text-red-500">
                {analysis.suspiciousAccounts.filter((a) => a.riskScore >= 75).length}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">High Risk Accounts</p>
              <p className="text-2xl font-bold text-orange-500">
                {analysis.suspiciousAccounts.filter(
                  (a) => a.riskScore >= 50 && a.riskScore < 75
                ).length}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Medium Risk Accounts</p>
              <p className="text-2xl font-bold text-yellow-500">
                {analysis.suspiciousAccounts.filter(
                  (a) => a.riskScore >= 25 && a.riskScore < 50
                ).length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top 5 Most Dangerous Rings */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Most Dangerous Fraud Rings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.fraudRings.slice(0, 5).map((ring, index) => (
              <div
                key={ring.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-semibold text-foreground truncate">
                      {ring.pattern.toUpperCase()} - {ring.members.length} members
                    </p>
                    <span className="text-sm font-bold text-red-500 flex-shrink-0">
                      {ring.riskScore.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{ring.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    {ring.members.slice(0, 5).map((member) => (
                      <span
                        key={member}
                        className="text-xs bg-muted px-2 py-1 rounded font-mono"
                      >
                        {member}
                      </span>
                    ))}
                    {ring.members.length > 5 && (
                      <span className="text-xs text-muted-foreground px-2 py-1">
                        +{ring.members.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
