"use client";

import { useEffect, useRef, useState } from "react";
import cytoscape from "cytoscape";
import { GraphNode, GraphEdge } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react";

interface GraphVisualizationProps {
  graphData: { nodes: GraphNode[]; edges: GraphEdge[] };
  onNodeSelect: (nodeId: string) => void;
  selectedNode: string | null;
}

export function GraphVisualization({
  graphData,
  onNodeSelect,
  selectedNode,
}: GraphVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [showSuspiciousOnly, setShowSuspiciousOnly] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // Filter data based on selection
    let filteredEdges = graphData.edges;
    let filteredNodes = graphData.nodes;

    if (showSuspiciousOnly) {
      const suspiciousNodeIds = new Set(
        graphData.nodes
          .filter((n) => n.data.riskScore >= 25)
          .map((n) => n.data.id)
      );

      filteredNodes = graphData.nodes.filter((n) =>
        suspiciousNodeIds.has(n.data.id)
      );
      filteredEdges = graphData.edges.filter(
        (e) =>
          suspiciousNodeIds.has(e.data.source) &&
          suspiciousNodeIds.has(e.data.target)
      );
    }

    const cy = cytoscape({
      container: containerRef.current,
      elements: [
        ...filteredNodes.map((n) => ({
          data: n.data,
        })),
        ...filteredEdges.map((e) => ({
          data: e.data,
        })),
      ],
      style: [
        {
          selector: "node",
          style: {
            "background-color": function (ele: any) {
              const score = ele.data("riskScore");
              if (score >= 75) return "#ef4444";
              if (score >= 50) return "#f97316";
              if (score >= 25) return "#eab308";
              return "#22c55e";
            },
            label: "data(label)",
            "text-valignment": "center",
            "text-halignment": "center",
            "font-size": 10,
            "width": function (ele: any) {
              const volume = ele.data("totalVolume");
              return Math.min(80, Math.max(20, Math.sqrt(volume / 100)));
            },
            "height": function (ele: any) {
              const volume = ele.data("totalVolume");
              return Math.min(80, Math.max(20, Math.sqrt(volume / 100)));
            },
            "color": "#ffffff",
            "border-width": function (ele: any) {
              return ele.id() === selectedNode ? 3 : 1;
            },
            "border-color": function (ele: any) {
              return ele.id() === selectedNode ? "#3b82f6" : "#555";
            },
            "box-shadow-color": function (ele: any) {
              const score = ele.data("riskScore");
              if (score >= 75) return "rgba(239, 68, 68, 0.6)";
              if (score >= 50) return "rgba(249, 115, 22, 0.6)";
              if (score >= 25) return "rgba(234, 179, 8, 0.6)";
              return "rgba(34, 197, 94, 0.4)";
            },
            "box-shadow-blur": 15,
            "box-shadow-offset-x": 0,
            "box-shadow-offset-y": 0,
            "box-shadow-opacity": 0.8,
          },
        },
        {
          selector: "edge",
          style: {
            width: 1.5,
            "line-color": "#555",
            "target-arrow-color": "#555",
            "target-arrow-shape": "triangle",
            "opacity": 0.6,
          },
        },
        {
          selector: "edge:selected",
          style: {
            "line-color": "#3b82f6",
            "target-arrow-color": "#3b82f6",
            opacity: 1,
          },
        },
      ],
      layout: {
        name: "cose",
        directed: true,
        animate: true,
        animationDuration: 500,
        nodeSpacing: 10,
        padding: 50,
      } as any,
      wheelSensitivity: 0.1,
    });

    // Handle node click
    cy.on("tap", "node", function (evt) {
      const node = evt.target;
      onNodeSelect(node.id());
    });

    // Pan on background click
    cy.on("tap", function (evt) {
      if (evt.target === cy) {
        onNodeSelect("");
      }
    });

    cyRef.current = cy;

    // Cleanup
    return () => {
      cy.destroy();
    };
  }, [graphData, onNodeSelect, selectedNode, showSuspiciousOnly]);

  const handleZoom = (direction: "in" | "out") => {
    if (!cyRef.current) return;
    const cy = cyRef.current;
    const currentZoom = cy.zoom();
    const step = 0.2;
    cy.zoom({
      level: direction === "in" ? currentZoom + step : currentZoom - step,
      position: { x: cy.width() / 2, y: cy.height() / 2 },
    });
  };

  const handleFit = () => {
    if (!cyRef.current) return;
    cyRef.current.fit();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={showSuspiciousOnly ? "default" : "outline"}
          size="sm"
          onClick={() => setShowSuspiciousOnly(!showSuspiciousOnly)}
        >
          {showSuspiciousOnly ? "Showing Suspicious" : "Showing All"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleZoom("in")}
          className="gap-2"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleZoom("out")}
          className="gap-2"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleFit}
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      <div
        ref={containerRef}
        className="w-full h-[600px] rounded-lg border border-border bg-secondary/50"
      />

      <div className="text-xs text-muted-foreground space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Legend:</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span>Critical (75+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
            <span>High (50-74)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span>Medium (25-49)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span>Low (&lt;25)</span>
          </div>
        </div>
        <p className="text-muted-foreground">
          Node size represents total transaction volume. Click nodes to select.
        </p>
      </div>
    </div>
  );
}
