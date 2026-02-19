import { NextRequest, NextResponse } from "next/server";
import { getUploadedDataset } from "../upload/route";
import { GraphAnalyzer } from "@/lib/graph-analyzer";

export async function GET(request: NextRequest) {
  try {
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
    const insights = analyzer.generateInsights();

    return NextResponse.json({
      success: true,
      data: insights,
    });
  } catch (error) {
    console.error("Error generating insights:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate insights",
      },
      { status: 500 }
    );
  }
}
