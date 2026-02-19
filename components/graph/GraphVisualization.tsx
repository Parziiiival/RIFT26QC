"use client"

import { useEffect, useRef, useState } from "react"
import cytoscape from "cytoscape"
import { CytoscapeData, getCytoscapeStyles, transformGraphData } from "@/utils/graphTransform"
import { GraphData, SuspiciousAccount, FraudRing } from "@/types"
import { Loader } from "lucide-react"

interface GraphVisualizationProps {
  graphData: GraphData
  suspiciousAccounts: SuspiciousAccount[]
  fraudRings: FraudRing[]
  selectedNodeId?: string | null
  onNodeSelect?: (nodeId: string) => void
  selectedRingId?: string | null
  filterByRing?: boolean
}

export function GraphVisualization({
  graphData,
  suspiciousAccounts,
  fraudRings,
  selectedNodeId,
  onNodeSelect,
  selectedRingId,
  filterByRing = false,
}: GraphVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cyRef = useRef<cytoscape.Core | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!containerRef.current) return

    setIsLoading(true)

    try {
      // Transform data
      let dataToUse = graphData
      if (filterByRing && selectedRingId) {
        const ring = fraudRings.find((r) => r.ring_id === selectedRingId)
        if (ring) {
          const memberSet = new Set(ring.members)
          const edgesInRing = graphData.edges.filter(
            (e) => memberSet.has(e.source) && memberSet.has(e.target)
          )
          dataToUse = {
            nodes: graphData.nodes.filter((n) => memberSet.has(n.id)),
            edges: edgesInRing,
            timestamps: graphData.timestamps,
          }
        }
      }

      const cytoscapeData = transformGraphData(
        dataToUse,
        suspiciousAccounts,
        fraudRings
      )

      const cy = cytoscape({
        container: containerRef.current,
        elements: [
          ...cytoscapeData.nodes.map((n) => ({ data: n.data })),
          ...cytoscapeData.edges.map((e) => ({ data: e.data })),
        ],
        style: getCytoscapeStyles(true),
        layout: {
          name: "cose-bilkent",
          directed: true,
          animate: true,
          animationDuration: 500,
          randomize: false,
          gravity: -1,
          numIter: 2500,
          tile: true,
          tilingPaddingVertical: 10,
          tilingPaddingHorizontal: 10,
        },
        wheelSensitivity: 0.1,
        minZoom: 0.1,
        maxZoom: 4,
      })

      // Node click handler
      cy.on("tap", "node", (evt) => {
        const node = evt.target
        onNodeSelect?.(node.id())
      })

      // Fit to view on load
      setTimeout(() => {
        cy.fit()
        setIsLoading(false)
      }, 600)

      cyRef.current = cy
    } catch (error) {
      console.error("[v0] Cytoscape error:", error)
      setIsLoading(false)
    }

    return () => {
      cyRef.current?.destroy()
    }
  }, [graphData, suspiciousAccounts, fraudRings, selectedRingId, filterByRing])

  // Handle node selection highlighting
  useEffect(() => {
    if (!cyRef.current) return

    cyRef.current.elements().style("opacity", 1)

    if (selectedNodeId) {
      const selectedNode = cyRef.current.$id(selectedNodeId)
      if (selectedNode.length > 0) {
        selectedNode.style("opacity", 1)
        cyRef.current.elements().not(selectedNode).not(selectedNode.neighborhood()).style("opacity", 0.3)

        // Animate to node
        cyRef.current.animate({
          center: { eles: selectedNode },
          zoom: 2,
          duration: 500,
        })
      }
    }
  }, [selectedNodeId])

  return (
    <div className="relative w-full h-full bg-background rounded-lg overflow-hidden">
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ minHeight: "500px" }}
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2">
            <Loader className="w-8 h-8 text-accent animate-spin" />
            <p className="text-sm text-muted">Building graph visualization...</p>
          </div>
        </div>
      )}

      {/* Graph info overlay */}
      <div className="absolute bottom-4 right-4 card-base text-xs text-muted">
        <p>Nodes: {graphData.nodes.length}</p>
        <p>Edges: {graphData.edges.length}</p>
      </div>
    </div>
  )
}
