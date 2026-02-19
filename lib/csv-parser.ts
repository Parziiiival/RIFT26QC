import { Transaction } from "./types";

export async function parseCSV(file: File): Promise<Transaction[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const csv = event.target?.result as string;
        const lines = csv.trim().split("\n");

        if (lines.length < 2) {
          reject(new Error("CSV file must contain at least a header and one data row"));
          return;
        }

        // Parse header
        const headers = lines[0].split(",").map(h => h.trim().toLowerCase());

        // Parse data rows
        const data: Transaction[] = [];
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          // Handle quoted values with commas
          const values = parseCSVLine(line);

          if (values.length !== headers.length) {
            console.warn(`Row ${i} has ${values.length} columns, expected ${headers.length}`);
            continue;
          }

          const row: Transaction = {};
          headers.forEach((header, index) => {
            const value = values[index]?.trim() || "";
            
            // Auto-detect types
            if (["amount", "value", "volume"].includes(header)) {
              row[header] = parseFloat(value) || 0;
            } else if (["timestamp", "date", "time"].includes(header)) {
              row[header] = value;
            } else {
              row[header] = value;
            }
          });

          // Map common column name variations
          if (!row.sender_id && (row.from || row.source || row.sender)) {
            row.sender_id = row.from || row.source || row.sender;
          }
          if (!row.receiver_id && (row.to || row.destination || row.receiver)) {
            row.receiver_id = row.to || row.destination || row.receiver;
          }

          data.push(row);
        }

        resolve(data);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsText(file);
  });
}

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
}

export function generateSampleCSV(): string {
  const sample = [
    "sender_id,receiver_id,amount,timestamp",
    "ACC001,ACC002,1000,2024-01-15T10:30:00",
    "ACC002,ACC003,500,2024-01-15T10:45:00",
    "ACC003,ACC001,1500,2024-01-15T11:00:00",
    "ACC004,ACC005,2000,2024-01-15T11:15:00",
    "ACC005,ACC004,2000,2024-01-15T11:30:00",
  ];
  return sample.join("\n");
}
