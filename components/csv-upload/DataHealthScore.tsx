"use client";

import { ValidationResult } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

interface DataHealthScoreProps {
  validation: ValidationResult;
}

export function DataHealthScore({ validation }: DataHealthScoreProps) {
  const getHealthColor = (score: number) => {
    if (score >= 90) return "text-green-500 bg-green-500/20 border-green-500/50";
    if (score >= 70) return "text-yellow-500 bg-yellow-500/20 border-yellow-500/50";
    return "text-red-500 bg-red-500/20 border-red-500/50";
  };

  const getHealthLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 70) return "Good";
    return "Poor";
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-lg">Data Quality Assessment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Health Score */}
        <div
          className={`p-4 rounded-lg border ${getHealthColor(validation.dataHealthScore)}`}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold">Overall Health Score</p>
            <span className="text-3xl font-bold">
              {validation.dataHealthScore}%
            </span>
          </div>
          <p className="text-sm opacity-75">
            Status: {getHealthLabel(validation.dataHealthScore)}
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground">Total Rows</p>
            <p className="text-2xl font-bold text-foreground">
              {validation.rowCount.toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground">Columns Detected</p>
            <p className="text-2xl font-bold text-foreground">
              {validation.columnInfo.length}
            </p>
          </div>
        </div>

        {/* Column Info */}
        {validation.columnInfo.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Column Details</p>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {validation.columnInfo.map((col) => (
                <div
                  key={col.name}
                  className="p-2 rounded-lg bg-secondary/50 border border-border text-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-foreground">
                      {col.name}
                    </span>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                      {col.type}
                    </span>
                  </div>
                  {col.missing > 0 && (
                    <p className="text-xs text-yellow-500 mt-1">
                      {col.missing} missing values
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Errors */}
        {validation.errors.length > 0 && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50">
            <div className="flex items-start gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-semibold text-red-500">Errors Found</p>
            </div>
            <ul className="text-xs text-red-500/80 space-y-1">
              {validation.errors.map((err, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="flex-shrink-0">•</span>
                  <span>{err}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Warnings */}
        {validation.warnings.length > 0 && (
          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/50">
            <div className="flex items-start gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-semibold text-yellow-500">Warnings</p>
            </div>
            <ul className="text-xs text-yellow-500/80 space-y-1">
              {validation.warnings.map((warn, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="flex-shrink-0">•</span>
                  <span>{warn}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Success */}
        {validation.isValid && validation.errors.length === 0 && (
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/50 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-500">
              Data validation passed. Ready for analysis.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
