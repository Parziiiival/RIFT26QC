import { NextRequest, NextResponse } from "next/server";
import { getUploadedDataset } from "../../upload/route";
import { GraphAnalyzer } from "@/lib/graph-analyzer";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ accountId: string }> }
) {
  try {
    const accountId = (await params).accountId;
    const { searchParams } = new URL(request.url);
    const datasetId = searchParams.get("datasetId");

    if (!datasetId) {
      return NextResponse.json(
        { success: false, error: "Dataset ID is required" },
        { status: 400 }
      );
    }

    const dataset = getUploadedDataset(datasetId);
    if (!dataset) {
      return NextResponse.json(
        { success: false, error: "Dataset not found" },
        { status: 404 }
      );
    }

    const analyzer = new GraphAnalyzer(dataset.transactions);
    analyzer.calculateRiskScores();

    const accounts = analyzer.getAccountsData();
    const account = accounts.find((a) => a.id === accountId);

    if (!account) {
      return NextResponse.json(
        { success: false, error: "Account not found" },
        { status: 404 }
      );
    }

    // Get transactions for this account
    const transactions = dataset.transactions.filter(
      (t) => t.sender_id === accountId || t.receiver_id === accountId
    );

    return NextResponse.json({
      success: true,
      data: {
        ...account,
        transactions,
        incomingTransactions: transactions.filter((t) => t.receiver_id === accountId),
        outgoingTransactions: transactions.filter((t) => t.sender_id === accountId),
      },
    });
  } catch (error) {
    console.error("Error fetching account details:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch account",
      },
      { status: 500 }
    );
  }
}
