import type {
  GraphEdge,
  JurisdictionNode,
  QueryNode,
  SourceMapAPIResponse,
  SourceNode,
} from "@/app/components/source-map/sourceMap.types";

type FullGraph = {
  queries: QueryNode[];
  sources: SourceNode[];
  jurisdictions: JurisdictionNode[];
  edges: GraphEdge[];
};

function parseWindowDays(windowParam: string): number {
  const m = /^(\d+)d$/i.exec(windowParam.trim());
  if (m) return Math.max(1, Math.min(365, Number(m[1])));
  return 30;
}

function selectQueriesForWindow(
  queries: QueryNode[],
  windowDays: number,
  maxQueries: number
): QueryNode[] {
  const cutoff = Date.now() - windowDays * 86400000;
  const recentIds = new Set(
    queries
      .filter((q) => new Date(q.createdAt).getTime() >= cutoff)
      .map((q) => q.id)
  );
  const topByUsage = [...queries]
    .sort((a, b) => b.usage - a.usage)
    .slice(0, maxQueries)
    .map((q) => q.id);
  for (const id of topByUsage) recentIds.add(id);

  return [...queries]
    .filter((q) => recentIds.has(q.id))
    .sort((a, b) => b.usage - a.usage)
    .slice(0, maxQueries);
}

class SourceMapStore {
  private graphs = new Map<string, FullGraph>();

  constructor() {
    this.graphs.set("demo-user", demoGraph());
  }

  getPayload(
    userId: string,
    opts: { windowDays: number; maxQueries: number }
  ): SourceMapAPIResponse {
    const full =
      this.graphs.get(userId) ?? this.graphs.get("demo-user") ?? null;
    if (!full) {
      return {
        queries: [],
        sources: [],
        jurisdictions: [],
        edges: [],
        generatedAt: new Date().toISOString(),
      };
    }

    const qPick = selectQueriesForWindow(
      full.queries,
      opts.windowDays,
      opts.maxQueries
    );
    const qIds = new Set(qPick.map((q) => q.id));

    const usedEdges = full.edges.filter(
      (e) => e.edgeType === "USED" && qIds.has(e.from)
    );
    const srcIds = new Set(usedEdges.map((e) => e.to));
    let sourcesPick = full.sources.filter((s) => srcIds.has(s.id));
    sourcesPick = [...sourcesPick]
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 40);

    const srcPickIds = new Set(sourcesPick.map((s) => s.id));
    const fromEdges = full.edges.filter(
      (e) => e.edgeType === "FROM" && srcPickIds.has(e.from)
    );
    const jurIds = new Set(fromEdges.map((e) => e.to));
    let jurPick = full.jurisdictions.filter((j) => jurIds.has(j.id));
    jurPick = [...jurPick].sort((a, b) => b.usage - a.usage).slice(0, 20);

    const jurPickIds = new Set(jurPick.map((j) => j.id));
    const edges = full.edges.filter((e) => {
      if (e.edgeType === "USED")
        return qIds.has(e.from) && srcPickIds.has(e.to);
      return srcPickIds.has(e.from) && jurPickIds.has(e.to);
    });

    return {
      queries: qPick,
      sources: sourcesPick,
      jurisdictions: jurPick,
      edges,
      generatedAt: new Date().toISOString(),
    };
  }
}

function isoDaysAgo(days: number) {
  return new Date(Date.now() - days * 86400000).toISOString();
}

function demoGraph(): FullGraph {
  const queries: QueryNode[] = [
    {
      id: "q1",
      type: "query",
      label: "Contract breach remedies",
      text: "Contract breach remedies in commercial disputes",
      usage: 12,
      sourceIds: ["s1", "s2", "s3"],
      createdAt: isoDaysAgo(2),
    },
    {
      id: "q2",
      type: "query",
      label: "IP fair use exceptions",
      text: "IP fair use exceptions digital content",
      usage: 9,
      sourceIds: ["s2", "s4", "s5"],
      createdAt: isoDaysAgo(5),
    },
    {
      id: "q3",
      type: "query",
      label: "Employment termination",
      text: "Employment termination wrongful discharge",
      usage: 7,
      sourceIds: ["s3", "s6"],
      createdAt: isoDaysAgo(8),
    },
    {
      id: "q4",
      type: "query",
      label: "Securities regulation",
      text: "Securities regulation disclosure requirements",
      usage: 5,
      sourceIds: ["s4", "s7"],
      createdAt: isoDaysAgo(12),
    },
    {
      id: "q5",
      type: "query",
      label: "Merger review",
      text: "Merger review antitrust analysis",
      usage: 4,
      sourceIds: ["s1", "s7", "s8"],
      createdAt: isoDaysAgo(20),
    },
  ];

  const sources: SourceNode[] = [
    {
      id: "s1",
      type: "source",
      label: "Hadley v Baxendale",
      fullName: "Hadley v Baxendale [1854] EWHC J70",
      sourceType: "Case",
      jurisdictionId: "j2",
      usage: 14,
    },
    {
      id: "s2",
      type: "source",
      label: "Copyright Act 1976",
      fullName: "Copyright Act of 1976, 17 U.S.C. §101",
      sourceType: "Statute",
      jurisdictionId: "j1",
      usage: 11,
    },
    {
      id: "s3",
      type: "source",
      label: "FLSA 29 U.S.C.",
      fullName: "Fair Labor Standards Act, 29 U.S.C. §201",
      sourceType: "Statute",
      jurisdictionId: "j1",
      usage: 8,
    },
    {
      id: "s4",
      type: "source",
      label: "Campbell v Acuff-Rose",
      fullName: "Campbell v. Acuff-Rose Music, 510 U.S. 569 (1994)",
      sourceType: "Case",
      jurisdictionId: "j1",
      usage: 7,
    },
    {
      id: "s5",
      type: "source",
      label: "DMCA §512",
      fullName: "Digital Millennium Copyright Act, 17 U.S.C. §512",
      sourceType: "Statute",
      jurisdictionId: "j1",
      usage: 6,
    },
    {
      id: "s6",
      type: "source",
      label: "Martin v Plain Dealer",
      fullName: "Martin v. Plain Dealer Publishing Co., Ohio App.",
      sourceType: "Case",
      jurisdictionId: "j3",
      usage: 5,
    },
    {
      id: "s7",
      type: "source",
      label: "SEC Rule 10b-5",
      fullName: "SEC Rule 10b-5, 17 C.F.R. §240.10b-5",
      sourceType: "Document",
      jurisdictionId: "j1",
      usage: 9,
    },
    {
      id: "s8",
      type: "source",
      label: "HSR Act §7A",
      fullName: "Hart-Scott-Rodino Antitrust Act, 15 U.S.C. §18a",
      sourceType: "Statute",
      jurisdictionId: "j1",
      usage: 4,
    },
  ];

  const jurisdictions: JurisdictionNode[] = [
    {
      id: "j1",
      type: "jurisdiction",
      label: "Federal U.S.",
      region: "US Federal",
      usage: 42,
    },
    {
      id: "j2",
      type: "jurisdiction",
      label: "English Common Law",
      region: "International",
      usage: 14,
    },
    {
      id: "j3",
      type: "jurisdiction",
      label: "Ohio State",
      region: "US State",
      usage: 5,
    },
  ];

  const edges: GraphEdge[] = [
    { from: "q1", to: "s1", edgeType: "USED", weight: 5 },
    { from: "q1", to: "s2", edgeType: "USED", weight: 4 },
    { from: "q1", to: "s3", edgeType: "USED", weight: 3 },
    { from: "q2", to: "s2", edgeType: "USED", weight: 3 },
    { from: "q2", to: "s4", edgeType: "USED", weight: 3 },
    { from: "q2", to: "s5", edgeType: "USED", weight: 3 },
    { from: "q3", to: "s3", edgeType: "USED", weight: 4 },
    { from: "q3", to: "s6", edgeType: "USED", weight: 3 },
    { from: "q4", to: "s4", edgeType: "USED", weight: 2 },
    { from: "q4", to: "s7", edgeType: "USED", weight: 3 },
    { from: "q5", to: "s1", edgeType: "USED", weight: 2 },
    { from: "q5", to: "s7", edgeType: "USED", weight: 1 },
    { from: "q5", to: "s8", edgeType: "USED", weight: 1 },
    { from: "s1", to: "j2", edgeType: "FROM", weight: 14 },
    { from: "s2", to: "j1", edgeType: "FROM", weight: 11 },
    { from: "s3", to: "j1", edgeType: "FROM", weight: 8 },
    { from: "s4", to: "j1", edgeType: "FROM", weight: 7 },
    { from: "s5", to: "j1", edgeType: "FROM", weight: 6 },
    { from: "s6", to: "j3", edgeType: "FROM", weight: 5 },
    { from: "s7", to: "j1", edgeType: "FROM", weight: 9 },
    { from: "s8", to: "j1", edgeType: "FROM", weight: 4 },
  ];

  return { queries, sources, jurisdictions, edges };
}

const store = new SourceMapStore();

export function getSourceMapStore() {
  return store;
}

export function parseSourceMapWindow(param: string) {
  return parseWindowDays(param);
}
