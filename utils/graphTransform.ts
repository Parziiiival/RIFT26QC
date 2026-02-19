import { GraphData, SuspiciousAccount, FraudRing } from "@/types"
import { getRiskColorHex } from "@/lib/utils"

interface CytoscapeNode {
  data: {
    id: string
    label: string
    accountId: string
    suspicionScore?: number
    isInRing?: boolean
    ringIds?: string[]
  }
}

interface CytoscapeEdge {
  data: {
    id: string
    source: string
    target: string
    amount?: number
    timestamp?: number
    weight?: number
    riskLevel?: number
  }
}

export interface CytoscapeData {
  nodes: CytoscapeNode[]
  edges: CytoscapeEdge[]
}

export function transformGraphData(
  graphData: GraphData,
  suspiciousAccounts: SuspiciousAccount[],
  fraudRings: FraudRing[]
): CytoscapeData {
  const suspiciousMap = new Map(
    suspiciousAccounts.map((a) => [a.account_id, a])
  )

  // Create suspicious account lookup
  const accountToRings = new Map<string, string[]>()
  fraudRings.forEach((ring) => {
    ring.members.forEach((member) => {
      if (!accountToRings.has(member)) {
        accountToRings.set(member, [])
      }
      accountToRings.get(member)!.push(ring.ring_id)
    })
  })

  // Transform nodes
  const nodes: CytoscapeNode[] = graphData.nodes.map((node) => {
    const suspiciousData = suspiciousMap.get(node.data.account_id)
    const ringIds = accountToRings.get(node.data.account_id) || []

    return {
      data: {
        id: node.id,
        label: node.label,
        accountId: node.data.account_id,
        suspicionScore: suspiciousData?.suspicion_score || 0,
        isInRing: ringIds.length > 0,
        ringIds,
      },
    }
  })

  // Transform edges
  const edges: CytoscapeEdge[] = graphData.edges.map((edge, idx) => ({
    data: {
      id: edge.id || `edge-${idx}`,
      source: edge.source,
      target: edge.target,
      amount: edge.amount,
      timestamp: edge.timestamp,
      weight: edge.weight,
      riskLevel: edge.risk_level,
    },
  }))

  return { nodes, edges }
}

export function getCytoscapeStyles(darkMode = true) {
  return [
    {
      selector: "node",
      style: {
        "background-color": "data(suspicionScore)",
        "node-text-valignment": "center",
        "node-text-halignment": "center",
        label: "data(label)",
        width: "mapData(suspicionScore, 0, 100, 20, 50)",
        height: "mapData(suspicionScore, 0, 100, 20, 50)",
        "font-size": 12,
        color: darkMode ? "#e0e7ff" : "#000",
        "text-background-color": darkMode ? "#1a1f3a" : "#fff",
        "text-background-opacity": 0.8,
        "text-background-padding": "4px",
        "border-width": "2px",
        "border-color": (ele: any) =>
          ele.data("isInRing") ? "#ff4444" : "#6b7280",
        "box-shadow": (ele: any) =>
          ele.data("suspicionScore") > 75
            ? `0 0 15px ${getRiskColorHex(ele.data("suspicionScore"))}`
            : "none",
      },
    },
    {
      selector: "edge",
      style: {
        "line-color": (ele: any) =>
          getRiskColorHex(ele.data("riskLevel") || 50),
        "target-arrow-color": (ele: any) =>
          getRiskColorHex(ele.data("riskLevel") || 50),
        "target-arrow-shape": "triangle",
        width: "mapData(weight, 0, 100, 1, 4)",
        opacity: 0.7,
      },
    },
    {
      selector: "node:selected",
      style: {
        "border-width": "3px",
        "border-color": "#00d9ff",
      },
    },
    {
      selector: "edge:selected",
      style: {
        opacity: 1,
        width: "4px",
      },
    },
  ]
}

export function getNodePosition(
  nodeCount: number,
  index: number
): { x: number; y: number } {
  const angle = (index / nodeCount) * Math.PI * 2
  const radius = 300 + Math.random() * 50
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  }
}

export function filterGraphByTimeRange(
  graphData: GraphData,
  minTime: number,
  maxTime: number
): GraphData {
  const edgesInRange = graphData.edges.filter(
    (e) => !e.timestamp || (e.timestamp >= minTime && e.timestamp <= maxTime)
  )

  const nodeIds = new Set<string>()
  edgesInRange.forEach((e) => {
    nodeIds.add(e.source)
    nodeIds.add(e.target)
  })

  const nodesInRange = graphData.nodes.filter((n) => nodeIds.has(n.id))

  return {
    nodes: nodesInRange,
    edges: edgesInRange,
    timestamps: graphData.timestamps,
  }
}

export function filterGraphByRing(
  graphData: GraphData,
  ringId: string,
  fraudRings: FraudRing[]
): GraphData {
  const ring = fraudRings.find((r) => r.ring_id === ringId)
  if (!ring) return graphData

  const memberSet = new Set(ring.members)

  const edgesInRing = graphData.edges.filter(
    (e) => memberSet.has(e.source) && memberSet.has(e.target)
  )

  return {
    nodes: graphData.nodes.filter((n) => memberSet.has(n.id)),
    edges: edgesInRing,
    timestamps: graphData.timestamps,
  }
}
