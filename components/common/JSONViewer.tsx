"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";

interface JSONViewerProps {
  data: any;
  title?: string;
  collapsible?: boolean;
}

export function JSONViewer({ data, title = "JSON Output", collapsible = true }: JSONViewerProps) {
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([jsonString], { type: "application/json" });
    element.href = URL.createObjectURL(file);
    element.download = "fraud-analysis.json";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{title}</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-2"
          >
            <Copy className="w-4 h-4" />
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
          {collapsible && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? "Expand" : "Collapse"}
            </Button>
          )}
        </div>
      </CardHeader>
      {!collapsed && (
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono max-h-96 overflow-y-auto border border-border">
            <code>{jsonString}</code>
          </pre>
        </CardContent>
      )}
    </Card>
  );
}
