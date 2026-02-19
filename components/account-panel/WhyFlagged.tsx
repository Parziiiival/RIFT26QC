"use client";

import { Account } from "@/lib/types";
import { AlertTriangle, TrendingUp, BarChart3, Zap } from "lucide-react";

interface WhyFlaggedProps {
  account: Account;
}

export function WhyFlagged({ account }: WhyFlaggedProps) {
  const explanations: Array<{ reason: string; severity: "low" | "medium" | "high" | "critical"; weight: number }> = [];

  // Activity volume
  if (account.totalOutgoing > 100000) {
    explanations.push({
      reason: "Very high outgoing transaction volume",
      severity: "high",
      weight: 20,
    });
  } else if (account.totalOutgoing > 50000) {
    explanations.push({
      reason: "High outgoing transaction volume",
      severity: "medium",
      weight: 10,
    });
  }

  // Transaction frequency
  if (account.transactionCount > 100) {
    explanations.push({
      reason: "Extremely high transaction frequency",
      severity: "high",
      weight: 20,
    });
  } else if (account.transactionCount > 50) {
    explanations.push({
      reason: "High transaction frequency",
      severity: "medium",
      weight: 10,
    });
  }

  // Pattern membership
  if (account.patterns.length > 0) {
    explanations.push({
      reason: `Member of ${account.patterns.length} detected fraud pattern(s)`,
      severity: account.patterns.some(p => p.severity === "critical") ? "critical" : "high",
      weight: 40,
    });
  }

  // Unusual balance
  const ratio = account.totalOutgoing / (account.totalIncoming + 1);
  if (ratio > 2) {
    explanations.push({
      reason: "Unusual outgoing/incoming ratio (more outgoing than incoming)",
      severity: "medium",
      weight: 15,
    });
  }

  if (account.isWhitelisted) {
    explanations.push({
      reason: "Marked as legitimate by analyst",
      severity: "low",
      weight: -account.riskScore,
    });
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-500 bg-red-500/10 border-red-500/30";
      case "high":
        return "text-orange-500 bg-orange-500/10 border-orange-500/30";
      case "medium":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/30";
      default:
        return "text-blue-500 bg-blue-500/10 border-blue-500/30";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
      case "high":
        return <AlertTriangle className="w-4 h-4" />;
      case "medium":
        return <Zap className="w-4 h-4" />;
      default:
        return <TrendingUp className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-blue-500" />
        <h3 className="font-semibold text-foreground">Risk Explanation</h3>
      </div>

      <p className="text-xs text-muted-foreground mb-3">
        This account was flagged due to the following risk factors:
      </p>

      <div className="space-y-2">
        {explanations.length > 0 ? (
          explanations.map((exp, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border flex items-start gap-3 ${getSeverityColor(exp.severity)}`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getSeverityIcon(exp.severity)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{exp.reason}</p>
                <div className="mt-2 w-full bg-background/30 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      exp.severity === "critical" ? "bg-red-500" :
                      exp.severity === "high" ? "bg-orange-500" :
                      exp.severity === "medium" ? "bg-yellow-500" :
                      "bg-blue-500"
                    }`}
                    style={{ width: `${Math.min(100, exp.weight)}%` }}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-3 rounded-lg border border-green-500/30 bg-green-500/10 text-green-400">
            <p className="text-sm">No risk factors detected</p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground mb-2">
          <strong>Overall Risk Score: {account.riskScore.toFixed(1)}/100</strong>
        </p>
        <p className="text-xs text-muted-foreground">
          This is a machine-generated assessment. Human review is recommended for all suspicious accounts.
        </p>
      </div>
    </div>
  );
}
