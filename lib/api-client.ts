import { Transaction, UploadResponse, AnalysisResponse, ValidationResult } from "./types";

export async function uploadCSV(
  data: Transaction[],
  fileName: string
): Promise<UploadResponse> {
  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transactions: data,
        fileName,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function analyzeDataset(datasetId: string): Promise<AnalysisResponse> {
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ datasetId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function getFraudRings(datasetId: string) {
  try {
    const response = await fetch(`/api/fraud-rings?datasetId=${datasetId}`);
    if (!response.ok) throw new Error("Failed to fetch fraud rings");
    return await response.json();
  } catch (error) {
    console.error("Error fetching fraud rings:", error);
    throw error;
  }
}

export async function getAccountDetails(datasetId: string, accountId: string) {
  try {
    const response = await fetch(
      `/api/accounts/${accountId}?datasetId=${datasetId}`
    );
    if (!response.ok) throw new Error("Failed to fetch account details");
    return await response.json();
  } catch (error) {
    console.error("Error fetching account details:", error);
    throw error;
  }
}

export async function getInsights(datasetId: string) {
  try {
    const response = await fetch(`/api/insights?datasetId=${datasetId}`);
    if (!response.ok) throw new Error("Failed to fetch insights");
    return await response.json();
  } catch (error) {
    console.error("Error fetching insights:", error);
    throw error;
  }
}

export async function whitelistAccount(datasetId: string, accountId: string) {
  try {
    const response = await fetch("/api/whitelist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ datasetId, accountId }),
    });

    if (!response.ok) throw new Error("Failed to whitelist account");
    return await response.json();
  } catch (error) {
    console.error("Error whitelisting account:", error);
    throw error;
  }
}

export function validateCSVData(data: Transaction[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let healthScore = 100;

  if (!data || data.length === 0) {
    errors.push("No data found in CSV");
    return { isValid: false, errors, warnings, dataHealthScore: 0, rowCount: 0, columnInfo: [] };
  }

  // Check required columns
  const firstRow = data[0];
  const requiredColumns = ["sender_id", "receiver_id", "amount"];
  
  const columnInfo = Object.keys(firstRow).map(col => ({
    name: col,
    type: "string" as const,
    missing: 0,
  }));

  for (const col of requiredColumns) {
    if (!(col in firstRow)) {
      errors.push(`Missing required column: ${col}`);
    }
  }

  // Validate data types and completeness
  let missingValues = 0;
  data.forEach((row, index) => {
    if (!row.sender_id || !row.receiver_id) {
      errors.push(`Row ${index + 1}: Missing sender or receiver ID`);
    }
    if (!row.amount || isNaN(Number(row.amount))) {
      errors.push(`Row ${index + 1}: Invalid amount`);
    }
    if (!row.sender_id || !row.receiver_id || !row.amount) {
      missingValues++;
    }
  });

  // Calculate health score
  const completeness = ((data.length - missingValues) / data.length) * 100;
  healthScore = Math.round(completeness);

  if (healthScore < 70) {
    warnings.push("Data quality is below 70%. Results may be inaccurate.");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    dataHealthScore: healthScore,
    rowCount: data.length,
    columnInfo,
  };
}
