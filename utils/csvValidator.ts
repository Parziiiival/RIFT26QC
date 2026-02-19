import { CSVValidationResult, DataHealthMetrics, ValidationError } from "@/types"

const REQUIRED_COLUMNS = [
  "sender_account",
  "receiver_account",
  "amount",
  "timestamp",
]

export function validateCSVHeaders(headers: string[]): {
  valid: boolean
  missing: string[]
} {
  const missing = REQUIRED_COLUMNS.filter(
    (col) => !headers.map((h) => h.toLowerCase()).includes(col.toLowerCase())
  )

  return {
    valid: missing.length === 0,
    missing,
  }
}

export function validateCSVRow(
  row: Record<string, any>,
  rowIndex: number,
  errors: ValidationError[] = []
): ValidationError[] {
  const newErrors = [...errors]

  // Validate sender_account
  if (!row.sender_account || typeof row.sender_account !== "string") {
    newErrors.push({
      row: rowIndex,
      column: "sender_account",
      message: "Invalid or missing sender_account",
    })
  }

  // Validate receiver_account
  if (!row.receiver_account || typeof row.receiver_account !== "string") {
    newErrors.push({
      row: rowIndex,
      column: "receiver_account",
      message: "Invalid or missing receiver_account",
    })
  }

  // Validate amount
  const amount = parseFloat(row.amount)
  if (isNaN(amount) || amount < 0) {
    newErrors.push({
      row: rowIndex,
      column: "amount",
      message: "Invalid or negative amount",
    })
  }

  // Check for unreasonable amounts (e.g., > 1 billion)
  if (amount > 1_000_000_000) {
    newErrors.push({
      row: rowIndex,
      column: "amount",
      message: "Amount exceeds reasonable limit (> 1B)",
    })
  }

  // Validate timestamp
  const timestamp = parseInt(row.timestamp)
  if (isNaN(timestamp) || timestamp <= 0) {
    newErrors.push({
      row: rowIndex,
      column: "timestamp",
      message: "Invalid or missing timestamp",
    })
  }

  return newErrors
}

export function calculateDataHealthScore(
  metrics: DataHealthMetrics
): number {
  return Math.round(
    metrics.completeness * 0.3 +
      metrics.validity * 0.4 +
      metrics.consistency * 0.3
  )
}

export function validateCSV(csvText: string): CSVValidationResult {
  const lines = csvText.trim().split("\n")
  if (lines.length < 2) {
    return {
      valid: false,
      errors: [{ message: "CSV file must contain at least a header and one row" }],
      healthScore: 0,
      rowCount: 0,
      columnCount: 0,
      missingColumns: [],
      anomalies: [],
    }
  }

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
  const headerValidation = validateCSVHeaders(headers)

  const errors: ValidationError[] = []
  let validRowCount = 0
  const amounts: number[] = []
  const timestamps: number[] = []
  const anomalies: string[] = []

  if (!headerValidation.valid) {
    return {
      valid: false,
      errors: [
        {
          message: `Missing required columns: ${headerValidation.missing.join(", ")}`,
        },
      ],
      healthScore: 0,
      rowCount: lines.length - 1,
      columnCount: headers.length,
      missingColumns: headerValidation.missing,
      anomalies: [],
    }
  }

  // Parse and validate rows
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim())
    if (values.length !== headers.length) continue

    const row: Record<string, any> = {}
    headers.forEach((header, idx) => {
      row[header] = values[idx]
    })

    const rowErrors = validateCSVRow(row, i)
    if (rowErrors.length === 0) {
      validRowCount++
      const amount = parseFloat(row.amount)
      const timestamp = parseInt(row.timestamp)
      amounts.push(amount)
      timestamps.push(timestamp)
    } else {
      errors.push(...rowErrors)
    }
  }

  // Detect anomalies
  if (amounts.length > 0) {
    const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length
    const stdDev = Math.sqrt(
      amounts.reduce((sq, n) => sq + Math.pow(n - avgAmount, 2), 0) /
        amounts.length
    )

    for (let i = 0; i < amounts.length; i++) {
      if (Math.abs(amounts[i] - avgAmount) > stdDev * 3) {
        anomalies.push(`Row ${i + 2}: Unusual transaction amount (${amounts[i]})`)
      }
    }
  }

  if (timestamps.length > 1) {
    const sortedTs = [...timestamps].sort((a, b) => a - b)
    for (let i = 0; i < sortedTs.length - 1; i++) {
      const timeDiff = sortedTs[i + 1] - sortedTs[i]
      if (timeDiff < 1000) {
        // Less than 1 second between transactions
        anomalies.push(
          `Suspicious: Multiple transactions within 1 second (timestamp ${sortedTs[i]})`
        )
      }
    }
  }

  const metrics: DataHealthMetrics = {
    completeness: Math.round((validRowCount / (lines.length - 1)) * 100),
    validity: Math.round((validRowCount / (lines.length - 1)) * 100),
    consistency: anomalies.length === 0 ? 100 : Math.max(0, 100 - anomalies.length * 5),
    overall: 0,
  }

  metrics.overall = calculateDataHealthScore(metrics)

  return {
    valid: errors.length === 0,
    errors,
    healthScore: metrics.overall,
    rowCount: lines.length - 1,
    columnCount: headers.length,
    missingColumns: [],
    anomalies: anomalies.slice(0, 5), // Keep only first 5 anomalies
  }
}
