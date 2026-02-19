"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Filter, RotateCcw } from "lucide-react";

interface GraphControlsProps {
  onFilterChange: (filters: GraphFilters) => void;
  totalNodes: number;
  totalEdges: number;
}

export interface GraphFilters {
  suspiciousOnly: boolean;
  minRiskScore: number;
  maxAmount: number;
  patternType: "all" | "cycle" | "fan-in-out" | "layering";
}

export function GraphControls({
  onFilterChange,
  totalNodes,
  totalEdges,
}: GraphControlsProps) {
  const [filters, setFilters] = useState<GraphFilters>({
    suspiciousOnly: true,
    minRiskScore: 25,
    maxAmount: 100000,
    patternType: "all",
  });

  const handleSuspiciousToggle = () => {
    const newFilters = { ...filters, suspiciousOnly: !filters.suspiciousOnly };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRiskScoreChange = (value: number[]) => {
    const newFilters = { ...filters, minRiskScore: value[0] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAmountChange = (value: number[]) => {
    const newFilters = { ...filters, maxAmount: value[0] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePatternChange = (
    value: "all" | "cycle" | "fan-in-out" | "layering"
  ) => {
    const newFilters = { ...filters, patternType: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const defaultFilters: GraphFilters = {
      suspiciousOnly: true,
      minRiskScore: 25,
      maxAmount: 100000,
      patternType: "all",
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            <CardTitle>Graph Filters</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="gap-1"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground">Nodes</p>
            <p className="text-2xl font-bold text-foreground">{totalNodes}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground">Edges</p>
            <p className="text-2xl font-bold text-foreground">{totalEdges}</p>
          </div>
        </div>

        {/* Suspicious Only Toggle */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Display Mode</label>
          <Button
            variant={filters.suspiciousOnly ? "default" : "outline"}
            onClick={handleSuspiciousToggle}
            className="w-full"
          >
            {filters.suspiciousOnly ? "Suspicious Nodes Only" : "All Nodes"}
          </Button>
        </div>

        {/* Risk Score Filter */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground">
              Minimum Risk Score
            </label>
            <span className="text-sm font-bold text-primary">
              {filters.minRiskScore}
            </span>
          </div>
          <Slider
            value={[filters.minRiskScore]}
            onValueChange={handleRiskScoreChange}
            min={0}
            max={100}
            step={5}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Show only accounts with risk score ≥ {filters.minRiskScore}
          </p>
        </div>

        {/* Transaction Amount Filter */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground">
              Max Transaction Amount
            </label>
            <span className="text-sm font-bold text-primary">
              ${(filters.maxAmount / 1000).toFixed(0)}k
            </span>
          </div>
          <Slider
            value={[filters.maxAmount]}
            onValueChange={handleAmountChange}
            min={1000}
            max={1000000}
            step={10000}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Show edges with amounts up to ${(filters.maxAmount / 1000).toFixed(0)}k
          </p>
        </div>

        {/* Pattern Type Filter */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Fraud Pattern Type
          </label>
          <Select value={filters.patternType} onValueChange={handlePatternChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Patterns</SelectItem>
              <SelectItem value="cycle">Circular Money Loops</SelectItem>
              <SelectItem value="fan-in-out">Fan-In/Fan-Out</SelectItem>
              <SelectItem value="layering">Money Laundering Chains</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Filter by detected fraud pattern type
          </p>
        </div>

        {/* Info */}
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/50 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-500/90">
            Adjust filters to highlight specific fraud patterns and accounts of interest
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
