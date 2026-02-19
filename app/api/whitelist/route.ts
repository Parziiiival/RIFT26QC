import { NextRequest, NextResponse } from "next/server";
import { getUploadedDataset } from "../upload/route";
import { GraphAnalyzer } from "@/lib/graph-analyzer";

// In-memory whitelist storage
const whitelistStorage: Map<string, Set<string>> = new Map();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { datasetId, accountId } = body;

    if (!datasetId || !accountId) {
      return NextResponse.json(
        { success: false, error: "Dataset ID and account ID are required" },
        { status: 400 }
      );
    }

    // Add to whitelist
    if (!whitelistStorage.has(datasetId)) {
      whitelistStorage.set(datasetId, new Set());
    }
    whitelistStorage.get(datasetId)!.add(accountId);

    // Recalculate with whitelisted account marked
    const dataset = getUploadedDataset(datasetId);
    if (!dataset) {
      return NextResponse.json(
        { success: false, error: "Dataset not found" },
        { status: 404 }
      );
    }

    const analyzer = new GraphAnalyzer(dataset.transactions);
    analyzer.calculateRiskScores();

    // Mark whitelisted account
    const accounts = analyzer.getAccountsData();
    const account = accounts.find((a) => a.id === accountId);
    if (account) {
      account.isWhitelisted = true;
    }

    return NextResponse.json({
      success: true,
      data: {
        message: `Account ${accountId} whitelisted`,
        whitelistedAccounts: Array.from(whitelistStorage.get(datasetId) || new Set()),
      },
    });
  } catch (error) {
    console.error("Whitelist error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Whitelist failed",
      },
      { status: 500 }
    );
  }
}

export function getWhitelistedAccounts(datasetId: string): Set<string> {
  return whitelistStorage.get(datasetId) || new Set();
}
