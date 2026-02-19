import { NextRequest, NextResponse } from "next/server";
import { Transaction, ValidationResult } from "@/lib/types";
import { validateCSVData } from "@/lib/api-client";
import { v4 as uuidv4 } from "uuid";

// In-memory storage (replace with database in production)
const uploadedDatasets: Map<string, { transactions: Transaction[]; fileName: string; timestamp: string }> = new Map();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactions, fileName } = body;

    if (!transactions || !Array.isArray(transactions)) {
      return NextResponse.json(
        { success: false, error: "Invalid transaction data" },
        { status: 400 }
      );
    }

    // Validate CSV data
    const validation = validateCSVData(transactions);

    // Generate dataset ID
    const datasetId = uuidv4();

    // Store in memory
    uploadedDatasets.set(datasetId, {
      transactions,
      fileName,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: validation.isValid,
      datasetId,
      validation,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 }
    );
  }
}

export function getUploadedDataset(datasetId: string) {
  return uploadedDatasets.get(datasetId);
}
