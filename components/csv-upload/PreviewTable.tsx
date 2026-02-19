"use client";

import { Transaction } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PreviewTableProps {
  data: Transaction[];
  maxRows?: number;
}

export function PreviewTable({ data, maxRows = 10 }: PreviewTableProps) {
  if (data.length === 0) {
    return null;
  }

  const displayData = data.slice(0, maxRows);
  const columns = Object.keys(data[0] || {});

  const truncateValue = (value: any, maxLength: number = 30): string => {
    const str = String(value);
    return str.length > maxLength ? str.substring(0, maxLength) + "..." : str;
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-base">Data Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-2 text-left font-semibold text-foreground"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayData.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={`${idx}-${col}`}
                      className="px-4 py-2 text-muted-foreground font-mono text-xs"
                      title={String(row[col])}
                    >
                      {truncateValue(row[col])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.length > maxRows && (
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Showing {displayData.length} of {data.length} rows
          </p>
        )}
      </CardContent>
    </Card>
  );
}
