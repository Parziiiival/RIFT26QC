/**
 * Generate realistic sample CSV data for fraud detection testing
 */

interface GenerateOptions {
  rowCount?: number;
  fraudPercentage?: number;
  seed?: number;
}

export function generateSampleCSV(options: GenerateOptions = {}): string {
  const {
    rowCount = 100,
    fraudPercentage = 15,
    seed = Date.now(),
  } = options;

  // Simple seeded random number generator
  let current = seed;
  const random = () => {
    current = (current * 9301 + 49297) % 233280;
    return current / 233280;
  };

  const accounts = Array.from({ length: 50 }, (_, i) => `ACC${String(i + 1).padStart(4, "0")}`);
  const lines: string[] = ["sender_id,receiver_id,amount,timestamp"];

  const baseDate = new Date("2024-01-01");
  let fraudRingCycle: string[] = [];
  let fraudRingFanOut: string[] = [];

  for (let i = 0; i < rowCount; i++) {
    const isFraud = random() < fraudPercentage / 100;
    let sender: string;
    let receiver: string;
    let amount: number;

    if (isFraud) {
      const fraudType = Math.floor(random() * 3);

      if (fraudType === 0) {
        // Cycle fraud: rebuild cycle every few transactions
        if (fraudRingCycle.length === 0 || random() < 0.3) {
          fraudRingCycle = [];
          const cycleSize = 3 + Math.floor(random() * 4);
          for (let j = 0; j < cycleSize; j++) {
            fraudRingCycle.push(accounts[Math.floor(random() * accounts.length)]);
          }
        }
        const cycleIndex = Math.floor(random() * fraudRingCycle.length);
        sender = fraudRingCycle[cycleIndex];
        receiver = fraudRingCycle[(cycleIndex + 1) % fraudRingCycle.length];
        amount = 5000 + Math.floor(random() * 45000);
      } else if (fraudType === 1) {
        // Fan-out fraud: one sender to many receivers
        if (fraudRingFanOut.length === 0 || random() < 0.4) {
          fraudRingFanOut = [accounts[Math.floor(random() * accounts.length)]];
          const fanOutSize = 3 + Math.floor(random() * 5);
          for (let j = 0; j < fanOutSize; j++) {
            fraudRingFanOut.push(accounts[Math.floor(random() * accounts.length)]);
          }
        }
        sender = fraudRingFanOut[0];
        receiver = fraudRingFanOut[1 + Math.floor(random() * (fraudRingFanOut.length - 1))];
        amount = 1000 + Math.floor(random() * 9000);
      } else {
        // Layering fraud: long chain of transfers
        const chain = Array.from({ length: 4 + Math.floor(random() * 3) }, () =>
          accounts[Math.floor(random() * accounts.length)]
        );
        const chainIndex = Math.floor(random() * (chain.length - 1));
        sender = chain[chainIndex];
        receiver = chain[chainIndex + 1];
        amount = 8000 + Math.floor(random() * 42000);
      }
    } else {
      // Legitimate transaction
      sender = accounts[Math.floor(random() * accounts.length)];
      receiver = accounts[Math.floor(random() * accounts.length)];
      while (receiver === sender) {
        receiver = accounts[Math.floor(random() * accounts.length)];
      }
      amount = 1000 + Math.floor(random() * 50000);
    }

    // Generate timestamp
    const daysOffset = Math.floor(random() * 90);
    const hoursOffset = Math.floor(random() * 24);
    const minutesOffset = Math.floor(random() * 60);
    const timestamp = new Date(baseDate);
    timestamp.setDate(timestamp.getDate() + daysOffset);
    timestamp.setHours(timestamp.getHours() + hoursOffset);
    timestamp.setMinutes(timestamp.getMinutes() + minutesOffset);

    lines.push(
      `${sender},${receiver},${amount.toFixed(2)},${timestamp.toISOString()}`
    );
  }

  return lines.join("\n");
}

/**
 * Download CSV as file
 */
export function downloadCSV(csvContent: string, filename: string = "transactions.csv") {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Generate CSV and trigger download
 */
export function generateAndDownloadSampleCSV(options?: GenerateOptions) {
  const csv = generateSampleCSV(options);
  downloadCSV(csv, "sample-transactions.csv");
}
