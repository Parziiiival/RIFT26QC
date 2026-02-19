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
    const fraudRings = analyzer.getFraudRings();

    return NextResponse.json({
      success: true,
      data: fraudRings,
    });
  } catch (error) {
    console.error("Error fetching fraud rings:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch fraud rings",
      },
      { status: 500 }
    );
  }
}
