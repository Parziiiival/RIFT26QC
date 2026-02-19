"use client";

import { Insight } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, AlertTriangle, Zap, Target } from "lucide-react";

interface AlertEngineProps {
  insights: Insight[];
}

export function AlertEngine({ insights }: AlertEngineProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "high":
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case "medium":
        return <Zap className="w-5 h-5 text-yellow-500" />;
      default:
        return <Target className="w-5 h-5 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/10 border-red-500/30";
      case "high":
        return "bg-orange-500/10 border-orange-500/30";
      case "medium":
        return "bg-yellow-500/10 border-yellow-500/30";
      default:
        return "bg-blue-500/10 border-blue-500/30";
    }
  };

  const getSeverityLabel = (severity: string) => {
    return severity.charAt(0).toUpperCase() + severity.slice(1);
  };

  const groupedInsights = {
    critical: insights.filter((i) => i.severity === "critical"),
    high: insights.filter((i) => i.severity === "high"),
    medium: insights.filter((i) => i.severity === "medium"),
    low: insights.filter((i) => i.severity === "low"),
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-500">Critical Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{groupedInsights.critical.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-500">High Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{groupedInsights.high.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-500">Medium Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{groupedInsights.medium.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-500">Low Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{groupedInsights.low.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Insights by Severity */}
      {Object.entries(groupedInsights).map(
        ([severity, severityInsights]) =>
          severityInsights.length > 0 && (
            <Card key={severity}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  {getSeverityIcon(severity)}
                  {getSeverityLabel(severity)} Severity Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {severityInsights.map((insight, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${getSeverityColor(severity)}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-foreground">
                            {insight.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {insight.description}
                          </p>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 rounded bg-background/50">
                          {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                        </span>
                      </div>

                      {insight.affectedAccounts && insight.affectedAccounts.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border/50">
                          <p className="text-xs font-semibold text-muted-foreground mb-2">
                            Affected Accounts:
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            {insight.affectedAccounts.map((account) => (
                              <span
                                key={account}
                                className="text-xs bg-background/70 px-2 py-1 rounded font-mono"
                              >
                                {account}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
      )}

      {insights.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No insights generated</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
