"use client";

import { useEffect, useState } from "react";
import { Account } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatNumber, getRiskLabel, getRiskColor } from "@/lib/utils";
import { AlertCircle, TrendingDown, TrendingUp, X } from "lucide-react";
import { getAccountDetails, whitelistAccount } from "@/lib/api-client";

interface AccountDeepDiveProps {
  accountId: string;
  datasetId: string;
  onClose: () => void;
}

export function AccountDeepDive({ accountId, datasetId, onClose }: AccountDeepDiveProps) {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [whitelisting, setWhitelisting] = useState(false);

  useEffect(() => {
    const loadAccount = async () => {
      try {
        setLoading(true);
        const response = await getAccountDetails(datasetId, accountId);
        if (response.data) {
          setAccount(response.data);
        } else {
          setError("Failed to load account details");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading account");
      } finally {
        setLoading(false);
      }
    };

    loadAccount();
  }, [accountId, datasetId]);

  const handleWhitelist = async () => {
    setWhitelisting(true);
    try {
      await whitelistAccount(datasetId, accountId);
      if (account) {
        setAccount({ ...account, isWhitelisted: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to whitelist account");
    } finally {
      setWhitelisting(false);
    }
  };

  if (loading) {
    return (
      <Card className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Loading account details...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full border-red-500/50 bg-red-500/10">
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-500/80">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!account) {
    return (
      <Card className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Account not found</p>
      </Card>
    );
  }

  return (
    <Card className="h-full overflow-y-auto">
      <CardHeader className="pb-3 flex items-start justify-between">
        <div>
          <CardTitle className="font-mono">{account.id}</CardTitle>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-sm font-bold ${getRiskColor(account.riskScore)}`}>
              {getRiskLabel(account.riskScore)} Risk
            </span>
            <span className="text-2xl font-bold text-foreground">{account.riskScore.toFixed(1)}</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Transaction Summary</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">Total Transactions</p>
              <p className="text-lg font-bold text-foreground">
                {account.transactionCount}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">Avg Per Transaction</p>
              <p className="text-lg font-bold text-foreground">
                {account.transactionCount > 0
                  ? formatCurrency(account.totalOutgoing / account.transactionCount)
                  : "$0"}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-orange-500" />
                Total Outgoing
              </p>
              <p className="text-lg font-bold text-foreground">
                {formatCurrency(account.totalOutgoing)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingDown className="w-3 h-3 text-green-500" />
                Total Incoming
              </p>
              <p className="text-lg font-bold text-foreground">
                {formatCurrency(account.totalIncoming)}
              </p>
            </div>
          </div>
        </div>

        {/* Detected Patterns */}
        {account.patterns.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Detected Patterns</h3>
            <div className="space-y-2">
              {account.patterns.map((pattern) => (
                <div
                  key={pattern.name}
                  className={`p-3 rounded-lg border ${
                    pattern.severity === "critical"
                      ? "border-red-500/50 bg-red-500/10"
                      : pattern.severity === "high"
                      ? "border-orange-500/50 bg-orange-500/10"
                      : pattern.severity === "medium"
                      ? "border-yellow-500/50 bg-yellow-500/10"
                      : "border-blue-500/50 bg-blue-500/10"
                  }`}
                >
                  <p className="font-semibold text-sm">{pattern.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {pattern.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Why Flagged */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-500" />
            Why Flagged?
          </h3>
          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/50 text-sm space-y-2">
            {account.riskScore >= 75 && (
              <p>• Critical risk score ({account.riskScore.toFixed(1)}) due to suspicious patterns</p>
            )}
            {account.transactionCount > 100 && (
              <p>• High transaction frequency ({account.transactionCount} transactions)</p>
            )}
            {account.totalOutgoing > 100000 && (
              <p>• Large transaction volume ({formatCurrency(account.totalOutgoing)})</p>
            )}
            {account.totalOutgoing > account.totalIncoming * 2 && (
              <p>
                • Unusual in/out ratio ({(account.totalOutgoing / (account.totalIncoming + 1)).toFixed(1)}:1)
              </p>
            )}
            {account.patterns.length > 0 && (
              <p>• Part of {account.patterns.length} suspicious pattern(s)</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {!account.isWhitelisted && (
            <Button
              onClick={handleWhitelist}
              disabled={whitelisting}
              variant="outline"
              className="w-full"
            >
              {whitelisting ? "Whitelisting..." : "Mark as Legitimate"}
            </Button>
          )}
          {account.isWhitelisted && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/50 text-sm text-green-500">
              ✓ Marked as legitimate
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
