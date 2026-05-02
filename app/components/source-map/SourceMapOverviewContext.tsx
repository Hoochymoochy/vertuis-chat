"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import type {
  GraphEdge,
  JurisdictionNode,
  QueryNode,
  SourceMapSelection,
  SourceNode,
} from "./sourceMap.types";

export type SourceMapOverviewPayload = {
  queries: QueryNode[];
  sources: SourceNode[];
  jurisdictions: JurisdictionNode[];
  edges: GraphEdge[];
  selection: SourceMapSelection;
  setSelection: Dispatch<SetStateAction<SourceMapSelection>>;
  loading: boolean;
};

type Ctx = {
  payload: SourceMapOverviewPayload | null;
  setPayload: Dispatch<SetStateAction<SourceMapOverviewPayload | null>>;
};

const SourceMapOverviewContext = createContext<Ctx | null>(null);

export function SourceMapOverviewProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [payload, setPayload] = useState<SourceMapOverviewPayload | null>(null);
  const value = useMemo(() => ({ payload, setPayload }), [payload]);

  return (
    <SourceMapOverviewContext.Provider value={value}>
      {children}
    </SourceMapOverviewContext.Provider>
  );
}

export function useSourceMapOverviewPublisher() {
  const ctx = useContext(SourceMapOverviewContext);
  if (!ctx) {
    throw new Error("SourceMapOverviewProvider is missing");
  }
  return ctx.setPayload;
}

export function useSourceMapOverviewPayload() {
  const ctx = useContext(SourceMapOverviewContext);
  return ctx?.payload ?? null;
}
