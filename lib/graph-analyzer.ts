import { Transaction, GraphNode, GraphEdge, FraudRing, Account, Insight } from "./types";

export class GraphAnalyzer {
  private transactions: Transaction[];
  private accounts: Map<string, Account>;
  private edges: Map<string, { source: string; target: string; count: number; totalAmount: number }>;

  constructor(transactions: Transaction[]) {
    this.transactions = transactions;
    this.accounts = new Map();
    this.edges = new Map();
    this.initializeGraph();
  }

  private initializeGraph() {
    // Initialize all accounts
    const accountIds = new Set<string>();
    this.transactions.forEach(tx => {
      accountIds.add(tx.sender_id);
      accountIds.add(tx.receiver_id);
    });

    accountIds.forEach(id => {
      this.accounts.set(id, {
        id,
        riskScore: 0,
        totalOutgoing: 0,
        totalIncoming: 0,
        transactionCount: 0,
        patterns: [],
        isWhitelisted: false,
      });
    });

    // Build edges and aggregate metrics
    this.transactions.forEach(tx => {
      const amount = parseFloat(String(tx.amount)) || 0;
      const edgeKey = `${tx.sender_id}->${tx.receiver_id}`;

      // Update edge
      const existing = this.edges.get(edgeKey) || { source: tx.sender_id, target: tx.receiver_id, count: 0, totalAmount: 0 };
      existing.count += 1;
      existing.totalAmount += amount;
      this.edges.set(edgeKey, existing);

      // Update accounts
      const sender = this.accounts.get(tx.sender_id)!;
      const receiver = this.accounts.get(tx.receiver_id)!;

      sender.totalOutgoing += amount;
      receiver.totalIncoming += amount;
      sender.transactionCount += 1;
      receiver.transactionCount += 1;
    });
  }

  detectPatterns(): { cycles: FraudRing[]; fanInOut: FraudRing[]; layering: FraudRing[] } {
    const cycles = this.detectCycles();
    const fanInOut = this.detectFanInOut();
    const layering = this.detectLayering();

    return { cycles, fanInOut, layering };
  }

  private detectCycles(): FraudRing[] {
    const rings: FraudRing[] = [];
    const visited = new Set<string>();

    for (const [source] of this.edges) {
      const [from] = source.split("->");
      if (visited.has(from)) continue;

      const path = this.findCycleDFS(from, from, new Set([from]), [from]);
      if (path && path.length > 2) {
        const edgeKey = `cycle-${path.join("-")}`;
        if (!visited.has(edgeKey)) {
          visited.add(edgeKey);
          rings.push(this.createFraudRing(path, "cycle"));
        }
      }

      visited.add(from);
    }

    return rings;
  }

  private findCycleDFS(
    current: string,
    start: string,
    visited: Set<string>,
    path: string[]
  ): string[] | null {
    // Find all outgoing edges from current
    for (const [edgeKey] of this.edges) {
      const [from, to] = edgeKey.split("->");
      if (from !== current) continue;

      if (to === start && path.length > 2) {
        return [...path, to];
      }

      if (!visited.has(to) && visited.size < 10) {
        visited.add(to);
        const result = this.findCycleDFS(to, start, visited, [...path, to]);
        if (result) return result;
        visited.delete(to);
      }
    }

    return null;
  }

  private detectFanInOut(): FraudRing[] {
    const rings: FraudRing[] = [];
    const threshold = 3; // Minimum number of connections

    for (const [accountId, account] of this.accounts) {
      const outgoing = Array.from(this.edges.values()).filter(e => e.source === accountId);
      const incoming = Array.from(this.edges.values()).filter(e => e.target === accountId);

      // Fan-out: one account sending to many
      if (outgoing.length >= threshold) {
        const recipients = outgoing.map(e => e.target);
        rings.push(this.createFraudRing([accountId, ...recipients], "fan-in-out"));
      }

      // Fan-in: many accounts sending to one
      if (incoming.length >= threshold) {
        const senders = incoming.map(e => e.source);
        rings.push(this.createFraudRing([...senders, accountId], "fan-in-out"));
      }
    }

    return rings;
  }

  private detectLayering(): FraudRing[] {
    const rings: FraudRing[] = [];

    // Look for chains of 4+ accounts
    for (const [startId] of this.accounts) {
      const chains = this.findChains(startId, 4);
      for (const chain of chains) {
        rings.push(this.createFraudRing(chain, "layering"));
      }
    }

    return rings;
  }

  private findChains(start: string, minLength: number): string[][] {
    const chains: string[][] = [];

    const dfs = (current: string, path: string[]) => {
      if (path.length >= minLength) {
        chains.push([...path]);
        return;
      }

      for (const [edgeKey] of this.edges) {
        const [from, to] = edgeKey.split("->");
        if (from === current && !path.includes(to)) {
          dfs(to, [...path, to]);
        }
      }
    };

    dfs(start, [start]);
    return chains;
  }

  private createFraudRing(members: string[], pattern: "cycle" | "fan-in-out" | "layering"): FraudRing {
    const volume = members.reduce((sum, id) => {
      const account = this.accounts.get(id);
      return sum + (account?.totalOutgoing || 0);
    }, 0);

    const score = Math.min(100, 40 + (members.length * 10) + (volume / 1000));

    return {
      id: `${pattern}-${members.join("-")}`,
      members,
      pattern,
      riskScore: score,
      totalVolume: volume,
      transactionPath: this.buildTransactionPath(members),
      description: this.getPatternDescription(pattern, members.length),
    };
  }

  private buildTransactionPath(members: string[]): string[] {
    const path: string[] = [members[0]];
    for (let i = 1; i < members.length; i++) {
      const edgeKey = `${members[i - 1]}->${members[i]}`;
      if (this.edges.has(edgeKey)) {
        path.push(members[i]);
      }
    }
    return path;
  }

  private getPatternDescription(pattern: string, memberCount: number): string {
    switch (pattern) {
      case "cycle":
        return `Circular money loop detected with ${memberCount} accounts`;
      case "fan-in-out":
        return `High-risk fan-out pattern with ${memberCount} connections`;
      case "layering":
        return `Possible laundering chain with ${memberCount} hops`;
      default:
        return `Fraud pattern detected with ${memberCount} accounts`;
    }
  }

  calculateRiskScores() {
    const patterns = this.detectPatterns();
    const allRings = [...patterns.cycles, ...patterns.fanInOut, ...patterns.layering];

    // Mark accounts in fraud rings
    const ringMemberSet = new Set<string>();
    allRings.forEach(ring => {
      ring.members.forEach(member => ringMemberSet.add(member));
    });

    // Adjust risk scores
    for (const [id, account] of this.accounts) {
      let score = 0;

      // Base score from activity
      if (account.transactionCount > 100) score += 30;
      else if (account.transactionCount > 50) score += 20;
      else if (account.transactionCount > 20) score += 10;

      // Volume-based score
      if (account.totalOutgoing > 100000) score += 20;
      else if (account.totalOutgoing > 50000) score += 10;

      // Pattern membership
      if (ringMemberSet.has(id)) score += 40;

      // Unusual behavior (high in/out ratio)
      const ratio = account.totalOutgoing / (account.totalIncoming + 1);
      if (ratio > 2) score += 15;

      account.riskScore = Math.min(100, score);

      // Assign patterns
      const accountPatterns: Set<string> = new Set();
      allRings.forEach(ring => {
        if (ring.members.includes(id)) {
          accountPatterns.add(ring.pattern);
        }
      });

      account.patterns = Array.from(accountPatterns).map(p => ({
        name: p.charAt(0).toUpperCase() + p.slice(1),
        description: this.getPatternDescription(p, 0),
        severity: score >= 75 ? "critical" : score >= 50 ? "high" : score >= 25 ? "medium" : "low",
      }));
    }
  }

  generateInsights(): Insight[] {
    const insights: Insight[] = [];
    const patterns = this.detectPatterns();

    if (patterns.cycles.length > 0) {
      insights.push({
        type: "pattern",
        title: "Circular Money Loops Detected",
        description: `Detected ${patterns.cycles.length} circular money loop(s) indicating possible fraud rings`,
        severity: patterns.cycles.some(c => c.riskScore > 75) ? "critical" : "high",
      });
    }

    if (patterns.fanInOut.length > 0) {
      insights.push({
        type: "pattern",
        title: "High-Risk Fan-Out Pattern",
        description: `Found ${patterns.fanInOut.length} account(s) with suspicious fan-in/fan-out patterns`,
        severity: "high",
      });
    }

    if (patterns.layering.length > 0) {
      insights.push({
        type: "anomaly",
        title: "Possible Laundering Chains",
        description: `Identified ${patterns.layering.length} potential money laundering chain(s)`,
        severity: "critical",
      });
    }

    // High-risk accounts
    const highRiskAccounts = Array.from(this.accounts.values()).filter(a => a.riskScore >= 75);
    if (highRiskAccounts.length > 0) {
      insights.push({
        type: "alert",
        title: "Critical Risk Accounts",
        description: `${highRiskAccounts.length} account(s) require immediate investigation`,
        severity: "critical",
        affectedAccounts: highRiskAccounts.map(a => a.id).slice(0, 5),
      });
    }

    return insights;
  }

  getGraphData(): { nodes: GraphNode[]; edges: GraphEdge[] } {
    const nodes: GraphNode[] = Array.from(this.accounts.values()).map(account => ({
      data: {
        id: account.id,
        label: account.id,
        riskScore: account.riskScore,
        totalVolume: account.totalOutgoing,
        transactionCount: account.transactionCount,
        patterns: account.patterns.map(p => p.name),
      },
    }));

    const edges: GraphEdge[] = Array.from(this.edges.values()).map((edge, index) => ({
      data: {
        id: `edge-${index}`,
        source: edge.source,
        target: edge.target,
        weight: edge.totalAmount,
      },
    }));

    return { nodes, edges };
  }

  getAccountsData(): Account[] {
    return Array.from(this.accounts.values());
  }

  getFraudRings(): FraudRing[] {
    const patterns = this.detectPatterns();
    return [...patterns.cycles, ...patterns.fanInOut, ...patterns.layering]
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 20); // Top 20 rings
  }
}
