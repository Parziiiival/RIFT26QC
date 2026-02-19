import { NextRequest, NextResponse } from "next/server";
import { GraphAnalyzer } from "@/lib/graph-analyzer";
import { getUploadedDataset } from "../upload/route";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { datasetId } = body;

    if (!datasetId) {
      return NextResponse.json(
        { success: false, error: "Dataset ID is required" },
        { status: 400 }
      );
    }

    // Get uploaded dataset
    const dataset = getUploadedDataset(datasetId);
    if (!dataset) {
      return NextResponse.json(
        { success: false, error: "Dataset not found" },
        { status: 404 }
      );
    }

    const startTime = Date.now();

    // Perform graph analysis
    const analyzer = new GraphAnalyzer(dataset.transactions);
    analyzer.calculateRiskScores();

    const fraudRings = analyzer.getFraudRings();
    const accounts = analyzer.getAccountsData();
    const graphData = analyzer.getGraphData();
    const insights = analyzer.generateInsights();

    const suspiciousAccounts = accounts
      .filter(a => a.riskScore >= 25)
      .sort((a, b) => b.riskScore - a.riskScore);

    const processingTime = Date.now() - startTime;

    const analysisResult = {
      datasetId,
      totalAccounts: accounts.length,
      totalTransactions: dataset.transactions.length,
      suspiciousAccounts,
      fraudRings,
      insights,
      processingTime,
      timestamp: new Date().toISOString(),
      graphData,
      transactions: dataset.transactions,
    };

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Analysis failed",
      },
      { status: 500 }
    );
  }
}
