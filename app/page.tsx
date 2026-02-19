"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadZone } from "@/components/csv-upload/UploadZone";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Shield, TrendingUp, Zap, Download } from "lucide-react";
import { downloadSampleCSV } from "@/lib/sample-data";

export default function Home() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleUploadComplete = (datasetId: string) => {
    router.push(`/dashboard?datasetId=${datasetId}`);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-secondary/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Fraud Detection Platform</h1>
                <p className="text-sm text-muted-foreground">Interactive Financial Crime Analysis</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-8 p-4 rounded-lg bg-red-500/10 border border-red-500/50 flex items-start gap-3 text-red-500">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold">Upload Error</h3>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Features */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Real-Time Analysis</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Instantly analyze transaction patterns and detect fraud rings with advanced graph algorithms
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Visual Intelligence</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Interactive graph visualization shows account relationships and suspicious patterns at a glance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Explainable AI</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Understand why accounts are flagged with detailed pattern analysis and risk explanations
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Upload Section */}
        <div className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Get Started</h2>
              <p className="text-muted-foreground">
                Upload your transaction data in CSV format to begin fraud detection analysis
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadSampleCSV()}
              className="gap-2 flex-shrink-0"
            >
              <Download className="w-4 h-4" />
              Download Sample
            </Button>
          </div>
          <UploadZone
            onUploadComplete={handleUploadComplete}
            onError={setError}
          />
        </div>

        {/* Info Section */}
        <Card className="bg-secondary/50">
          <CardHeader>
            <CardTitle className="text-lg">Data Requirements</CardTitle>
            <CardDescription>
              Your CSV must contain the following columns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Required Columns</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span><strong>sender_id</strong> - Account sending money (or: from, source, sender)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span><strong>receiver_id</strong> - Account receiving money (or: to, destination, receiver)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span><strong>amount</strong> - Transaction amount (or: value, volume)</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Optional Columns</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-muted rounded-full"></span>
                  <span><strong>timestamp</strong> - When transaction occurred (or: date, time)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-muted rounded-full"></span>
                  <span>Any other fields will be preserved in the analysis</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
