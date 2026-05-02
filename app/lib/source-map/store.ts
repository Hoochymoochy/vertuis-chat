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
  const jurisdictions: JurisdictionNode[] = [
    { id: "j1", type: "jurisdiction", label: "Federal U.S.", region: "US Federal", usage: 0 },
    { id: "j2", type: "jurisdiction", label: "California", region: "US State", usage: 0 },
    { id: "j3", type: "jurisdiction", label: "New York", region: "US State", usage: 0 },
    { id: "j4", type: "jurisdiction", label: "Texas", region: "US State", usage: 0 },
    { id: "j5", type: "jurisdiction", label: "English Common Law", region: "International", usage: 0 },
    { id: "j6", type: "jurisdiction", label: "EU", region: "International", usage: 0 },
    { id: "j7", type: "jurisdiction", label: "Delaware", region: "US State", usage: 0 },
    { id: "j8", type: "jurisdiction", label: "Florida", region: "US State", usage: 0 },
  ];

  const sourceSeeds: Array<{
    label: string;
    fullName: string;
    sourceType: SourceNode["sourceType"];
    jurisdictionId: string;
  }> = [
    { label: "Hadley v Baxendale", fullName: "Hadley v Baxendale [1854] EWHC J70", sourceType: "Case", jurisdictionId: "j5" },
    { label: "Copyright Act", fullName: "Copyright Act of 1976, 17 U.S.C. §101", sourceType: "Statute", jurisdictionId: "j1" },
    { label: "FLSA", fullName: "Fair Labor Standards Act, 29 U.S.C. §201", sourceType: "Statute", jurisdictionId: "j1" },
    { label: "Campbell v Acuff-Rose", fullName: "Campbell v. Acuff-Rose Music, 510 U.S. 569 (1994)", sourceType: "Case", jurisdictionId: "j1" },
    { label: "DMCA §512", fullName: "Digital Millennium Copyright Act, 17 U.S.C. §512", sourceType: "Statute", jurisdictionId: "j1" },
    { label: "SEC Rule 10b-5", fullName: "SEC Rule 10b-5, 17 C.F.R. §240.10b-5", sourceType: "Document", jurisdictionId: "j1" },
    { label: "HSR Act §7A", fullName: "Hart-Scott-Rodino Antitrust Act, 15 U.S.C. §18a", sourceType: "Statute", jurisdictionId: "j1" },
    { label: "UCC Article 2", fullName: "Uniform Commercial Code Article 2", sourceType: "Statute", jurisdictionId: "j7" },
    { label: "Restatement Contracts", fullName: "Restatement (Second) of Contracts", sourceType: "Document", jurisdictionId: "j1" },
    { label: "Lanham Act", fullName: "Lanham Act, 15 U.S.C. §1051", sourceType: "Statute", jurisdictionId: "j1" },
    { label: "GDPR Art. 6", fullName: "GDPR Regulation (EU) 2016/679, Article 6", sourceType: "Statute", jurisdictionId: "j6" },
    { label: "CCPA", fullName: "California Consumer Privacy Act", sourceType: "Statute", jurisdictionId: "j2" },
    { label: "NYS Labor Law", fullName: "New York Labor Law §190", sourceType: "Statute", jurisdictionId: "j3" },
    { label: "Texas Bus. Code", fullName: "Texas Business and Commerce Code", sourceType: "Statute", jurisdictionId: "j4" },
    { label: "Delaware GCL", fullName: "Delaware General Corporation Law", sourceType: "Statute", jurisdictionId: "j7" },
    { label: "Bluebook Rules", fullName: "The Bluebook: A Uniform System of Citation", sourceType: "Document", jurisdictionId: "j1" },
    { label: "FRCP Rule 12", fullName: "Federal Rules of Civil Procedure Rule 12", sourceType: "Document", jurisdictionId: "j1" },
    { label: "Daubert", fullName: "Daubert v. Merrell Dow Pharmaceuticals, Inc.", sourceType: "Case", jurisdictionId: "j1" },
    { label: "Erie Doctrine", fullName: "Erie Railroad Co. v. Tompkins", sourceType: "Case", jurisdictionId: "j1" },
    { label: "Brulotte", fullName: "Brulotte v. Thys Co.", sourceType: "Case", jurisdictionId: "j1" },
    { label: "Florida Rules Civ.", fullName: "Florida Rules of Civil Procedure", sourceType: "Document", jurisdictionId: "j8" },
    { label: "Cal Civ. Code §1542", fullName: "California Civil Code §1542", sourceType: "Statute", jurisdictionId: "j2" },
    { label: "SOX 404", fullName: "Sarbanes-Oxley Act Section 404", sourceType: "Statute", jurisdictionId: "j1" },
    { label: "Title VII", fullName: "Civil Rights Act of 1964, Title VII", sourceType: "Statute", jurisdictionId: "j1" },
    { label: "Sherman Act §1", fullName: "Sherman Antitrust Act, 15 U.S.C. §1", sourceType: "Statute", jurisdictionId: "j1" },
    { label: "Clayton Act §7", fullName: "Clayton Act, 15 U.S.C. §18", sourceType: "Statute", jurisdictionId: "j1" },
    { label: "EU Merger Reg", fullName: "Council Regulation (EC) No 139/2004", sourceType: "Statute", jurisdictionId: "j6" },
    { label: "Model Penal Code", fullName: "Model Penal Code", sourceType: "Document", jurisdictionId: "j1" },
    { label: "FOIA", fullName: "Freedom of Information Act, 5 U.S.C. §552", sourceType: "Statute", jurisdictionId: "j1" },
    { label: "HIPAA", fullName: "Health Insurance Portability and Accountability Act", sourceType: "Statute", jurisdictionId: "j1" },
    { label: "FERPA", fullName: "Family Educational Rights and Privacy Act", sourceType: "Statute", jurisdictionId: "j1" },
    { label: "CFAA", fullName: "Computer Fraud and Abuse Act", sourceType: "Statute", jurisdictionId: "j1" },
    { label: "Federal Arbitration Act", fullName: "Federal Arbitration Act, 9 U.S.C. §1", sourceType: "Statute", jurisdictionId: "j1" },
    { label: "UETA", fullName: "Uniform Electronic Transactions Act", sourceType: "Statute", jurisdictionId: "j7" },
    { label: "PIPEDA", fullName: "Personal Information Protection and Electronic Documents Act", sourceType: "Statute", jurisdictionId: "j6" },
  ];

  const sources: SourceNode[] = sourceSeeds.map((seed, i) => ({
    id: `s${i + 1}`,
    type: "source",
    label: seed.label,
    fullName: seed.fullName,
    sourceType: seed.sourceType,
    jurisdictionId: seed.jurisdictionId,
    usage: 0,
  }));

  const topicSeeds = [
    "Contract breach remedies",
    "IP fair use exceptions",
    "Employment termination",
    "Securities disclosures",
    "Merger review standards",
    "Data privacy consent",
    "Arbitration enforceability",
    "Trademark dilution",
    "Expert testimony admissibility",
    "Consumer protection claims",
    "Cybersecurity incident response",
    "Executive compensation limits",
    "Wage and hour exemptions",
    "M&A disclosure obligations",
    "Antitrust market definition",
    "Discovery proportionality",
    "FOIA production timelines",
    "Healthcare data access",
    "Education records requests",
    "Cross-border transfer safeguards",
    "Class certification standards",
    "Injunction irreparable harm",
    "License termination clauses",
    "Trade secret misappropriation",
    "Open source compliance",
    "Whistleblower protections",
    "Non-compete enforceability",
    "Jurisdiction selection clauses",
    "Choice of law conflicts",
    "Regulatory notice requirements",
    "Board fiduciary duties",
    "Shareholder derivative actions",
    "Document retention policies",
    "E-signature validity",
    "Platform intermediary liability",
    "AI training data rights",
    "Employee monitoring limits",
    "Financial audit controls",
    "Insurance coverage disputes",
    "Settlement release scope",
  ];

  const edges: GraphEdge[] = [];
  const queries: QueryNode[] = topicSeeds.map((topic, i) => {
    const sourceCount = 3 + (i % 3);
    const start = (i * 2) % sources.length;
    const sourceIds = Array.from({ length: sourceCount }, (_, k) => {
      const idx = (start + k * 3 + (i % 5)) % sources.length;
      return sources[idx].id;
    });

    const usage = Math.max(3, 28 - Math.floor(i * 0.55));
    sourceIds.forEach((sid, k) => {
      edges.push({
        from: `q${i + 1}`,
        to: sid,
        edgeType: "USED",
        weight: Math.max(1, Math.min(12, usage - k * 2)),
      });
    });

    return {
      id: `q${i + 1}`,
      type: "query",
      label: topic,
      text: `${topic} legal analysis with controlling authority`,
      usage,
      sourceIds,
      createdAt: isoDaysAgo(1 + ((i * 3) % 90)),
    };
  });

  const sourceUseTally = new Map<string, number>();
  for (const edge of edges) {
    if (edge.edgeType !== "USED") continue;
    sourceUseTally.set(edge.to, (sourceUseTally.get(edge.to) ?? 0) + edge.weight);
  }

  const jurUseTally = new Map<string, number>();
  sources.forEach((source) => {
    const usage = sourceUseTally.get(source.id) ?? 1;
    source.usage = usage;
    edges.push({
      from: source.id,
      to: source.jurisdictionId,
      edgeType: "FROM",
      weight: usage,
    });
    jurUseTally.set(
      source.jurisdictionId,
      (jurUseTally.get(source.jurisdictionId) ?? 0) + usage
    );
  });

  jurisdictions.forEach((jur) => {
    jur.usage = jurUseTally.get(jur.id) ?? 1;
  });

  return { queries, sources, jurisdictions, edges };
}

const store = new SourceMapStore();

export function getSourceMapStore() {
  return store;
}

export function parseSourceMapWindow(param: string) {
  return parseWindowDays(param);
}
