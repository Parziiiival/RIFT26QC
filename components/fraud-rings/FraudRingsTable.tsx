"use client";

import { useState } from "react";
import { FraudRing } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FraudRingsTableProps {
  rings: FraudRing[];
}

export function FraudRingsTable({ rings }: FraudRingsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (ringId: string) => {
    setExpandedId(expandedId === ringId ? null : ringId);
  };

  const getPatternColor = (pattern: string) => {
    switch (pattern) {
      case "cycle":
        return "bg-purple-500/20 text-purple-400";
      case "fan-in-out":
        return "bg-blue-500/20 text-blue-400";
      case "layering":
        return "bg-orange-500/20 text-orange-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 75) return "text-red-500";
    if (score >= 50) return "text-orange-500";
    if (score >= 25) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detected Fraud Rings ({rings.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {rings.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No fraud rings detected
          </p>
        ) : (
          <div className="space-y-2">
            {rings.map((ring) => (
              <div
                key={ring.id}
                className="border border-border rounded-lg overflow-hidden hover:bg-muted/50 transition-colors"
              >
                <button
                  onClick={() => toggleExpand(ring.id)}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-1 rounded text-sm font-semibold ${getPatternColor(ring.pattern)}`}>
                        {ring.pattern.toUpperCase()}
                      </span>
                      <span className={`text-lg font-bold ${getRiskColor(ring.riskScore)}`}>
                        {ring.riskScore.toFixed(1)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {ring.members.length} members
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{ring.description}</p>
                  </div>
                  {expandedId === ring.id ? (
                    <ChevronUp className="w-5 h-5 ml-2 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 ml-2 flex-shrink-0" />
                  )}
                </button>

                {expandedId === ring.id && (
                  <div className="px-4 pb-4 border-t border-border space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2">Members</h4>
                      <div className="flex gap-2 flex-wrap">
                        {ring.members.map((member) => (
                          <span
                            key={member}
                            className="px-3 py-1 rounded-full bg-secondary text-sm font-mono text-foreground"
                          >
                            {member}
                          </span>
                        ))}
                      </div>
                    </div>

                    {ring.transactionPath.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">
                          Transaction Path
                        </h4>
                        <div className="flex items-center gap-2 flex-wrap text-sm">
                          {ring.transactionPath.map((account, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <span className="px-2 py-1 rounded bg-primary/20 text-primary font-mono">
                                {account}
                              </span>
                              {index < ring.transactionPath.length - 1 && (
                                <span className="text-muted-foreground">→</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-4 p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="text-xs text-muted-foreground">Risk Score</p>
                        <p className="text-lg font-bold text-foreground">
                          {ring.riskScore.toFixed(1)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total Volume</p>
                        <p className="text-lg font-bold text-foreground">
                          ${(ring.totalVolume / 1000).toFixed(1)}k
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Pattern Type</p>
                        <p className="text-lg font-bold text-foreground capitalize">
                          {ring.pattern}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
