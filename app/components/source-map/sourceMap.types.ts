export type NodeType = "user" | "query" | "source" | "jurisdiction";

export interface QueryNode {
  id: string;
  type: "query";
  label: string;
  text: string;
  usage: number;
  sourceIds: string[];
  createdAt: string;
}

export interface SourceNode {
  id: string;
  type: "source";
  label: string;
  fullName: string;
  sourceType: "Case" | "Statute" | "Document";
  jurisdictionId: string;
  usage: number;
}

export interface JurisdictionNode {
  id: string;
  type: "jurisdiction";
  label: string;
  region: string;
  usage: number;
}

export interface UserNode {
  id: "user";
  type: "user";
  label: string;
}

export type GraphNode = QueryNode | SourceNode | JurisdictionNode | UserNode;

export interface GraphEdge {
  from: string;
  to: string;
  edgeType: "USED" | "FROM";
  weight: number;
}

export type PositionedNode =
  | (QueryNode & { px: number; py: number; r: number })
  | (SourceNode & { px: number; py: number; r: number })
  | (JurisdictionNode & { px: number; py: number; r: number })
  | (UserNode & { px: number; py: number; r: number });

export interface SourceMapData {
  queries: QueryNode[];
  sources: SourceNode[];
  jurisdictions: JurisdictionNode[];
}

export interface SourceMapAPIResponse extends SourceMapData {
  edges: GraphEdge[];
  generatedAt: string;
}

export interface SelectedNodeState {
  node: PositionedNode;
  relatedIds: Set<string>;
}

export type SourceMapSelection =
  | { kind: "query"; id: string }
  | { kind: "source"; id: string }
  | { kind: "jurisdiction"; id: string }
  | null;

export type TooltipRow = { label: string; value: string };

export interface TooltipModel {
  title: string;
  rows: TooltipRow[];
}
