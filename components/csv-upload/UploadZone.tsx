"use client";

import React, { useState, useRef } from "react";
import { Upload, AlertCircle, CheckCircle } from "lucide-react";
import { parseCSV } from "@/lib/csv-parser";
import { validateCSVData, uploadCSV } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface UploadZoneProps {
  onUploadComplete: (datasetId: string) => void;
  onError: (error: string) => void;
}

export function UploadZone({ onUploadComplete, onError }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"info" | "error" | "success">("info");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.name.endsWith(".csv")) {
      setStatusMessage("Please select a CSV file");
      setStatusType("error");
      onError("Invalid file format");
      return;
    }

    setIsLoading(true);
    setStatusMessage("Parsing CSV file...");
    setStatusType("info");

    try {
      // Parse CSV
      const data = await parseCSV(file);

      // Validate data
      const validation = validateCSVData(data);

      if (!validation.isValid && validation.errors.length > 0) {
        const errorMsg = validation.errors[0];
        setStatusMessage(`Validation error: ${errorMsg}`);
        setStatusType("error");
        onError(errorMsg);
        setIsLoading(false);
        return;
      }

      setStatusMessage("Uploading data...");

      // Upload to server
      const response = await uploadCSV(data, file.name);

      if (response.success && response.datasetId) {
        setStatusMessage(`Dataset uploaded successfully! Health score: ${response.validation?.dataHealthScore}%`);
        setStatusType("success");
        setTimeout(() => {
          onUploadComplete(response.datasetId!);
        }, 1000);
      } else {
        throw new Error(response.error || "Upload failed");
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      setStatusMessage(`Error: ${errorMsg}`);
      setStatusType("error");
      onError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-2 border-dashed border-border">
      <CardHeader>
        <CardTitle>Upload Transaction Data</CardTitle>
        <CardDescription>
          Drag and drop your CSV file or click to select
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative rounded-lg border-2 border-dashed transition-colors p-8 text-center cursor-pointer ${
            isDragging
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
            disabled={isLoading}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-primary opacity-70" />
            <h3 className="text-lg font-semibold mb-1">
              {isLoading ? "Processing..." : "Drop CSV file here"}
            </h3>
            <p className="text-muted-foreground mb-4">
              or click to select from your computer
            </p>
            <p className="text-xs text-muted-foreground">
              Required columns: sender_id, receiver_id, amount
            </p>
          </button>
        </div>

        {statusMessage && (
          <div className={`mt-4 p-3 rounded-lg flex items-start gap-3 ${
            statusType === "error" ? "bg-red-500/10 text-red-500" : 
            statusType === "success" ? "bg-green-500/10 text-green-500" : 
            "bg-blue-500/10 text-blue-500"
          }`}>
            {statusType === "error" && <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
            {statusType === "success" && <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
            <div>
              <p className="text-sm font-medium">{statusMessage}</p>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/50 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-500/90">
            <p className="font-semibold mb-1">CSV Format Guide</p>
            <ul className="space-y-1 text-xs">
              <li>• Use comma-separated values</li>
              <li>• Required: sender_id, receiver_id, amount</li>
              <li>• Optional: timestamp for timeline analysis</li>
              <li>• Max 500k rows recommended for performance</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 text-xs text-muted-foreground space-y-1">
          <p className="font-semibold">Supported columns:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>sender_id or from / source / sender</li>
            <li>receiver_id or to / destination / receiver</li>
            <li>amount, value, or volume</li>
            <li>Optional: timestamp, date, or time</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
