"use client";

import { Button } from "@/components/ui/button";
import { generateAndDownloadSampleCSV } from "@/lib/sample-csv-generator";
import { Download, Zap } from "lucide-react";

interface SampleDataButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  showIcon?: boolean;
}

export function SampleDataButton({
  variant = "outline",
  size = "default",
  showIcon = true,
}: SampleDataButtonProps) {
  const handleDownload = () => {
    try {
      generateAndDownloadSampleCSV({
        rowCount: 150,
        fraudPercentage: 20,
      });
    } catch (error) {
      console.error("Failed to generate sample data:", error);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      variant={variant}
      size={size}
      className="gap-2"
    >
      {showIcon && <Download className="w-4 h-4" />}
      <span>Download Sample CSV</span>
      <Zap className="w-3 h-3 text-yellow-500" />
    </Button>
  );
}
