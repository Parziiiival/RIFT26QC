"use client";

import { useState } from "react";
import { Account, Transaction } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, TrendingIn, TrendingOut, AlertTriangle, Flag } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface AccountPanelProps {
  account: Account;
  transactions?: Transaction[];
  onClose: () => void;
  onWhitelist?: (accountId: string) => void;
}

export function AccountPanel({
  account,
  transactions = [],
  onClose,
  onWhitelist,
}: AccountPanelProps) {
  const [showDetail, setShowDetail] = useState(false);

  const incomingTx = transactions.filter((t) => t.receiver_id === account.id);
  const outgoingTx = transactions.filter((t) => t.sender_id === account.id);

  const totalIncoming = incomingTx.reduce((sum, t) => sum + (parseFloat(String(t.amount)) || 0), 0);
  const totalOutgoing = outgoingTx.reduce((sum, t) => sum + (parseFloat(String(t.amount)) || 0), 0);

  const getRiskColor = (score: number) => {
    if (score >= 75) return "text-red-500 bg-red-500/10";
    if (score >= 50) return "text-orange-500 bg-orange-500/10";
    if (score >= 25) return "text-yellow-500 bg-yellow-500/10";
    return "text-green-500 bg-green-500/10";
  };

  const getRiskLabel = (score: number) => {
    if (score >= 75) return "Critical";
    if (score >= 50) return "High";
    if (score >= 25) return "Medium";
    return "Low";
  };

  return (
    <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-secondary border-l border-border shadow-lg z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-secondary border-b border-border p-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Account Details</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="p-0 w-8 h-8"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Account ID */}
        <div>
          <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">
            Account ID
          </p>
          <p className="font-mono text-sm break-all bg-muted p-3 rounded">
            {account.id}
          </p>
        </div>

        {/* Risk Score */}
        <div>
          <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">
            Risk Assessment
          </p>
          <div className={`p-4 rounded-lg border-2 ${getRiskColor(account.riskScore)}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-2xl">
                {account.riskScore.toFixed(1)}
              </span>
              <span className="font-semibold">
                {getRiskLabel(account.riskScore)}
              </span>
            </div>
            {account.isWhitelisted && (
              <div className="text-xs font-semibold mt-2 p-2 bg-green-500/20 rounded text-green-400">
                ✓ Whitelisted
              </div>
            )}
          </div>
        </div>

        {/* Transaction Summary */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
                <TrendingIn className="w-4 h-4 text-blue-500" />
                Incoming
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold">{incomingTx.length}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(totalIncoming)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
                <TrendingOut className="w-4 h-4 text-orange-500" />
                Outgoing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold">{outgoingTx.length}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(totalOutgoing)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detected Patterns */}
        {account.patterns.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold mb-3">
              Detected Patterns
            </p>
            <div className="space-y-2">
              {account.patterns.map((pattern) => (
                <div
                  key={pattern.name}
                  className="p-3 rounded-lg border border-border flex items-start gap-2"
                >
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-500" />
                  <div>
                    <p className="font-semibold text-sm">{pattern.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {pattern.description}
                    </p>
                    <div className="mt-1">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded ${
                          pattern.severity === "critical" ? "bg-red-500/20 text-red-400" :
                          pattern.severity === "high" ? "bg-orange-500/20 text-orange-400" :
                          pattern.severity === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {pattern.severity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        {transactions.length > 0 && (
          <div>
            <button
              onClick={() => setShowDetail(!showDetail)}
              className="text-xs text-muted-foreground uppercase font-semibold mb-3 hover:text-foreground transition-colors"
            >
              {showDetail ? "Hide" : "Show"} Recent Transactions
            </button>
            {showDetail && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {transactions.slice(0, 10).map((tx, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded bg-muted/50 text-xs border border-border/50"
                  >
                    <div className="flex justify-between mb-1">
                      <span className="font-mono">
                        {tx.sender_id === account.id ? "OUT" : "IN"}
                      </span>
                      <span className="font-bold">
                        {formatCurrency(parseFloat(String(tx.amount)) || 0)}
                      </span>
                    </div>
                    <div className="text-muted-foreground">
                      {tx.sender_id === account.id ? "→" : "←"} {tx.sender_id === account.id ? tx.receiver_id : tx.sender_id}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-4 border-t border-border">
          {!account.isWhitelisted && onWhitelist && (
            <Button
              onClick={() => onWhitelist(account.id)}
              className="w-full gap-2"
              variant="outline"
            >
              <Flag className="w-4 h-4" />
              Mark as Legitimate
            </Button>
          )}
          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
