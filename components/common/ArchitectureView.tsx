"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Zap, Network, Brain } from "lucide-react";

export function ArchitectureView() {
  return (
    <div className="space-y-6">
      {/* System Overview */}
      <Card>
        <CardHeader>
          <CardTitle>System Architecture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground mb-4">Data Flow Pipeline</h3>
            
            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">
                  1
                </div>
                <div>
                  <p className="font-semibold text-sm">CSV Upload & Validation</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Transaction data is parsed, validated, and stored with health scoring
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">
                  2
                </div>
                <div>
                  <p className="font-semibold text-sm">Graph Construction</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Accounts become nodes, transactions become directed edges with weights
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">
                  3
                </div>
                <div>
                  <p className="font-semibold text-sm">Pattern Detection</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Multi-algorithm analysis detects cycles, fan patterns, and chains
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">
                  4
                </div>
                <div>
                  <p className="font-semibold text-sm">Risk Scoring</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sophisticated scoring combines activity volume, pattern membership, and behavior
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">
                  5
                </div>
                <div>
                  <p className="font-semibold text-sm">Interactive Visualization</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Real-time Cytoscape.js graph with filtering, zooming, and node selection
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Algorithms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-500" />
            Detection Algorithms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-border/50">
              <p className="font-semibold text-sm mb-1">Cycle Detection (O(n²))</p>
              <p className="text-xs text-muted-foreground">
                Identifies circular money loops indicating coordinated fraud rings. DFS-based detection finds all cycles up to length 10.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-border/50">
              <p className="font-semibold text-sm mb-1">Fan-In/Out Analysis (O(n))</p>
              <p className="text-xs text-muted-foreground">
                Detects smurfing patterns where money fans from one source to many destinations or concentrates into one hub.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-border/50">
              <p className="font-semibold text-sm mb-1">Layering Chain Detection (O(n²))</p>
              <p className="text-xs text-muted-foreground">
                Identifies potential money laundering chains with 4+ sequential hops, finding layering patterns.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-border/50">
              <p className="font-semibold text-sm mb-1">Risk Scoring Engine</p>
              <p className="text-xs text-muted-foreground">
                Multi-factor scoring: transaction count, total volume, pattern membership, and behavioral anomalies. Normalized to 0-100 scale.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2 text-muted-foreground">
            <p>• Sub-second analysis for 100-1000 accounts</p>
            <p>• Incremental graph updates</p>
            <p>• Caching for repeated queries</p>
            <p>• Optimized data structures</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Network className="w-4 h-4 text-blue-500" />
              Capabilities
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2 text-muted-foreground">
            <p>• Real-time transaction graph visualization</p>
            <p>• Multi-pattern fraud ring detection</p>
            <p>• Temporal analysis and playback</p>
            <p>• Account whitelisting and adjustment</p>
          </CardContent>
        </Card>
      </div>

      {/* Technical Stack */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-green-500" />
            Technical Stack
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-semibold text-foreground mb-1">Frontend</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Next.js 16</li>
                <li>• React 19</li>
                <li>• Cytoscape.js</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">State</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• In-memory storage</li>
                <li>• Context API</li>
                <li>• React hooks</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Analysis</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Graph algorithms</li>
                <li>• Pattern matching</li>
                <li>• Risk scoring</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
