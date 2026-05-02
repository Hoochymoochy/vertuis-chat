"use client";

import { AlertTriangle, Minus, Plus, RefreshCw, RotateCcw } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useSidebar } from "@/app/hooks/Global/SidebarContext";

import { DESIGN } from "./sourceMap.constants";
import { useSourceMapOverviewPublisher } from "./SourceMapOverviewContext";
import {
  SourceMapCanvas,
  type NodeKind,
  type SourceMapCanvasHandle,
} from "./SourceMapCanvas";
import { SourceMapTooltip } from "./SourceMapTooltip";
import type {
  GraphEdge,
  SourceMapAPIResponse,
  SourceMapData,
  SourceMapSelection,
  SourceNode,
  TooltipModel,
} from "./sourceMap.types";
import { computeLayout } from "./useGraphLayout";
import { useSourceMapData } from "./useSourceMapData";

function computeRelatedIds(
  sel: SourceMapSelection,
  edges: GraphEdge[],
  sources: SourceNode[]
): Set<string> {
  const out = new Set<string>();
  if (!sel) return out;
  if (sel.kind === "query") {
    out.add(sel.id);
    for (const e of edges) {
      if (e.edgeType === "USED" && e.from === sel.id) out.add(e.to);
    }
  } else if (sel.kind === "source") {
    out.add(sel.id);
    for (const e of edges) {
      if (e.edgeType === "USED" && e.to === sel.id) out.add(e.from);
    }
    const s = sources.find((x) => x.id === sel.id);
    if (s) out.add(s.jurisdictionId);
  } else {
    out.add(sel.id);
    for (const e of edges) {
      if (e.edgeType === "FROM" && e.to === sel.id) out.add(e.from);
    }
  }
  return out;
}

function computeHoverDistances(
  hoverId: string | null,
  edges: GraphEdge[]
): Map<string, number> {
  if (!hoverId) return new Map();
  const neighbors = new Map<string, Set<string>>();
  for (const edge of edges) {
    const fromSet = neighbors.get(edge.from) ?? new Set<string>();
    fromSet.add(edge.to);
    neighbors.set(edge.from, fromSet);
    const toSet = neighbors.get(edge.to) ?? new Set<string>();
    toSet.add(edge.from);
    neighbors.set(edge.to, toSet);
  }

  const distances = new Map<string, number>();
  const queue: string[] = [hoverId];
  distances.set(hoverId, 0);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const baseDistance = distances.get(current) ?? 0;
    const linked = neighbors.get(current);
    if (!linked) continue;
    for (const next of linked) {
      if (distances.has(next)) continue;
      distances.set(next, baseDistance + 1);
      queue.push(next);
    }
  }

  return distances;
}

function truncate(s: string, max: number) {
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
}

const EMPTY_DATA: SourceMapData = {
  queries: [],
  sources: [],
  jurisdictions: [],
};

function sumEdgeWeights(edges: GraphEdge[]) {
  return edges.reduce((sum, e) => sum + e.weight, 0);
}

function formatMapDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

function buildTooltip(
  nodeId: string,
  kind: NodeKind,
  api: SourceMapAPIResponse
): TooltipModel | null {
  const { edges } = api;

  if (kind === "query") {
    const q = api.queries.find((x) => x.id === nodeId);
    if (!q) return null;
    const usedEdges = edges.filter(
      (e) => e.edgeType === "USED" && e.from === nodeId
    );
    const distinctSources = new Set(usedEdges.map((e) => e.to)).size;
    const citationWeight = sumEdgeWeights(usedEdges);
    const topEdge = [...usedEdges].sort((a, b) => b.weight - a.weight)[0];
    const topSource = topEdge
      ? api.sources.find((s) => s.id === topEdge.to)
      : undefined;
    return {
      title: q.label,
      subtitle:
        q.text.length > 200 ? `${q.text.slice(0, 199)}…` : q.text,
      rows: [
        { label: "Last activity", value: formatMapDate(q.createdAt) },
        {
          label: "Citations on map",
          value: `${citationWeight} total · ${usedEdges.length} link${usedEdges.length === 1 ? "" : "s"}`,
        },
        {
          label: "Distinct sources",
          value: `${distinctSources} (model lists ${q.sourceIds.length})`,
        },
        { label: "Usage score", value: `${q.usage}×` },
        ...(topSource
          ? [
              {
                label: "Heaviest link",
                value: `${truncate(topSource.label, 40)} (${topEdge!.weight})`,
              },
            ]
          : []),
      ],
    };
  }

  if (kind === "source") {
    const s = api.sources.find((x) => x.id === nodeId);
    if (!s) return null;
    const j = api.jurisdictions.find((x) => x.id === s.jurisdictionId);
    const usedEdges = edges.filter(
      (e) => e.edgeType === "USED" && e.to === nodeId
    );
    const queryCount = new Set(usedEdges.map((e) => e.from)).size;
    const citationWeight = sumEdgeWeights(usedEdges);
    return {
      title: s.label,
      subtitle:
        s.fullName.length > 220
          ? `${s.fullName.slice(0, 219)}…`
          : s.fullName,
      rows: [
        { label: "Material type", value: s.sourceType },
        {
          label: "Jurisdiction",
          value: j ? `${j.label} · ${j.region}` : "—",
        },
        {
          label: "Queries citing this",
          value: `${queryCount} quer${queryCount === 1 ? "y" : "ies"}`,
        },
        {
          label: "Citation weight on map",
          value: String(citationWeight),
        },
        { label: "Aggregate usage", value: `${s.usage}×` },
      ],
    };
  }

  const j = api.jurisdictions.find((x) => x.id === nodeId);
  if (!j) return null;
  const inJur = api.sources.filter((s) => s.jurisdictionId === j.id);
  const sourceIds = new Set(inJur.map((s) => s.id));
  const queryIds = new Set<string>();
  for (const e of edges) {
    if (e.edgeType === "USED" && sourceIds.has(e.to)) queryIds.add(e.from);
  }
  const topLabels = [...inJur]
    .sort((a, b) => b.usage - a.usage)
    .slice(0, 4)
    .map((s) => truncate(s.label, 28));
  return {
    title: j.label,
    subtitle: j.region,
    rows: [
      { label: "Sources on map", value: String(inJur.length) },
      {
        label: "Queries reached",
        value: `${queryIds.size} via sources in this jurisdiction`,
      },
      { label: "Total citations", value: `${j.usage}×` },
      {
        label: "Top sources here",
        value: topLabels.length ? topLabels.join(" · ") : "—",
      },
    ],
  };
}

export function SourceMap() {
  const { userId } = useSidebar();
  const uid = userId ?? "demo-user";
  const { data, loading, error, refresh } = useSourceMapData(uid, {
    window: "30d",
    maxQueries: 20,
  });

  const setOverviewPayload = useSourceMapOverviewPublisher();
  const [selection, setSelection] = useState<SourceMapSelection>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [hoverRevealProgress, setHoverRevealProgress] = useState(0);
  const [isPointerActive, setIsPointerActive] = useState(false);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [pulse, setPulse] = useState(0);
  const sizeRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<SourceMapCanvasHandle>(null);
  const fontProbeRef = useRef<HTMLSpanElement>(null);
  const [fontSans, setFontSans] = useState(
    "Inter, ui-sans-serif, system-ui, sans-serif"
  );
  const [size, setSize] = useState({ w: 720, h: 520 });

  useLayoutEffect(() => {
    const el = fontProbeRef.current;
    if (el) {
      const { fontFamily } = getComputedStyle(el);
      if (fontFamily) setFontSans(fontFamily);
    }
  }, []);

  useEffect(() => {
    setOverviewPayload({
      queries: data?.queries ?? [],
      sources: data?.sources ?? [],
      jurisdictions: data?.jurisdictions ?? [],
      edges: data?.edges ?? [],
      selection,
      setSelection,
      loading,
    });
    return () => {
      setOverviewPayload(null);
    };
  }, [
    data,
    loading,
    selection,
    setOverviewPayload,
    setSelection,
  ]);

  useEffect(() => {
    const el = sizeRef.current;
    if (!el) return;

    const apply = () => {
      const w = Math.max(280, el.clientWidth);
      const h = Math.max(380, el.clientHeight);
      setSize((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
    };

    const ro = new ResizeObserver(() => {
      apply();
    });
    ro.observe(el);
    apply();

    return () => {
      ro.disconnect();
    };
  }, []);

  const layoutData = useMemo(() => {
    const d = data ?? EMPTY_DATA;
    return {
      queries: d.queries,
      sources: d.sources,
      jurisdictions: d.jurisdictions,
    };
  }, [data]);

  const canvasEdges = data?.edges ?? [];

  const positions = useMemo(
    () => computeLayout(layoutData, canvasEdges, size.w, size.h),
    [layoutData, canvasEdges, size.w, size.h]
  );

  const relatedIds = useMemo(() => {
    if (!data || !selection) return new Set<string>();
    return computeRelatedIds(selection, data.edges, data.sources);
  }, [data, selection]);
  const hoverDistances = useMemo(
    () => computeHoverDistances(hoverId, canvasEdges),
    [hoverId, canvasEdges]
  );

  const selectedId =
    selection === null
      ? null
      : selection.kind === "query"
        ? selection.id
        : selection.kind === "source"
          ? selection.id
          : selection.id;
  useEffect(() => {
    if (!selectedId) {
      setPulse(0);
      return;
    }
    let frame = 0;
    let raf = 0;
    const tick = () => {
      frame += 1;
      setPulse(frame * DESIGN.pulseSpeed);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [selectedId]);

  useEffect(() => {
    if (!hoverId || isPointerActive) {
      setHoverRevealProgress(0);
      return;
    }
    let delayTimer = 0;
    let raf = 0;

    const runReveal = () => {
      const durationMs = 3200;
      const start = performance.now();
      const tick = (ts: number) => {
        const t = Math.max(0, Math.min(1, (ts - start) / durationMs));
        const eased = t * t * (3 - 2 * t);
        setHoverRevealProgress(eased);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    delayTimer = window.setTimeout(runReveal, 3000);

    return () => {
      window.clearTimeout(delayTimer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [hoverId, isPointerActive]);

  const onSelectNode = useCallback((id: string | null, kind: NodeKind | null) => {
    if (!id || !kind) {
      setSelection(null);
      return;
    }
    if (kind === "query") setSelection({ kind: "query", id });
    else if (kind === "source") setSelection({ kind: "source", id });
    else if (kind === "jurisdiction") setSelection({ kind: "jurisdiction", id });
  }, []);

  const onHoverNode = useCallback(
    (id: string | null, clientX: number, clientY: number) => {
      setHoverId(id);
      setHoverPos({ x: clientX, y: clientY });
    },
    []
  );

  const tooltip = useMemo(() => {
    if (!data || !hoverId) return null;
    const n = positions.get(hoverId);
    if (!n) return null;
    return buildTooltip(hoverId, n.type as NodeKind, data);
  }, [data, hoverId, positions]);

  const emptyMessage =
    !loading &&
    data &&
    data.queries.length === 0 &&
    data.sources.length === 0 &&
    data.jurisdictions.length === 0
      ? "Run your first query to see your source map build."
      : undefined;

  const controlBtn =
    "flex h-9 w-9 items-center justify-center rounded-md border border-gold-20/80 bg-black/70 text-gold-200 transition hover:bg-black/90 hover:border-gold-30 disabled:cursor-not-allowed disabled:opacity-35";

  const onToolbarRefresh = useCallback(() => {
    void refresh();
    canvasRef.current?.resetView();
  }, [refresh]);

  const mapControlsDisabled = Boolean(error);

  return (
    <div className="font-sans mx-auto flex w-full max-w-[1920px] flex-col gap-4 px-4 pb-4 pt-4 min-h-[calc(100dvh-4.5rem)] md:min-h-[calc(100dvh-5.25rem)] md:px-6 md:pb-6 md:pt-6">
      <span
        ref={fontProbeRef}
        className="font-sans pointer-events-none absolute left-0 top-0 opacity-0"
        aria-hidden
      >
        0
      </span>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 md:min-h-0">
        <header className="shrink-0">
          <h1 className="font-serif text-2xl text-[#F0E8D0] md:text-3xl">
            Source map
          </h1>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-neutral-400">
            What you are actually relying on: your queries, cited sources, and
            jurisdictions. No inferred themes.
          </p>
        </header>

        <div
          className="relative flex h-0 min-h-[min(52vh,320px)] w-full min-w-0 flex-1 overflow-hidden rounded-2xl border md:min-h-0"
          style={{
            borderColor: DESIGN.borderGold,
            backgroundColor: DESIGN.obsidian,
            backgroundImage: DESIGN.marbleOverlay,
          }}
        >
          {loading && (
            <div
              className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center gap-6"
              aria-hidden
            >
              {[0.22, 0.41, 0.58].map((t, i) => (
                <div
                  key={i}
                  className="rounded-full animate-pulse"
                  style={{
                    width: 18 + i * 10,
                    height: 18 + i * 10,
                    background: "rgba(201,168,76,0.14)",
                    transform: `translateY(${i * 6}px)`,
                  }}
                />
              ))}
            </div>
          )}

          {error && (
            <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 px-6 text-center">
              <AlertTriangle className="h-8 w-8 text-gold-400" aria-hidden />
              <p className="text-gold-300">Could not load source data.</p>
              <p className="max-w-xs text-xs text-neutral-500">
                Use the refresh control above to retry.
              </p>
            </div>
          )}

          <div className="absolute right-3 top-3 z-40 flex items-center gap-1 rounded-lg border border-gold-20/70 bg-black/75 p-1 shadow-lg backdrop-blur-sm">
            <button
              type="button"
              className={controlBtn}
              title="Reload data"
              aria-label="Reload data"
              disabled={loading}
              onClick={onToolbarRefresh}
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                strokeWidth={2.2}
              />
            </button>
            <span
              className="mx-0.5 h-6 w-px shrink-0 bg-gold-20/50"
              aria-hidden
            />
            <button
              type="button"
              className={controlBtn}
              title="Zoom out"
              aria-label="Zoom out"
              disabled={mapControlsDisabled}
              onClick={() => canvasRef.current?.zoomOut()}
            >
              <Minus className="h-4 w-4" strokeWidth={2.2} />
            </button>
            <button
              type="button"
              className={controlBtn}
              title="Zoom in"
              aria-label="Zoom in"
              disabled={mapControlsDisabled}
              onClick={() => canvasRef.current?.zoomIn()}
            >
              <Plus className="h-4 w-4" strokeWidth={2.2} />
            </button>
            <button
              type="button"
              className={controlBtn}
              title="Reset pan and zoom"
              aria-label="Reset pan and zoom"
              disabled={mapControlsDisabled}
              onClick={() => canvasRef.current?.resetView()}
            >
              <RotateCcw className="h-4 w-4" strokeWidth={2.2} />
            </button>
          </div>

          <div ref={sizeRef} className="absolute inset-0 min-h-0 min-w-0">
            {!error && (
              <SourceMapCanvas
                ref={canvasRef}
                width={size.w}
                height={size.h}
                positions={positions}
                edges={canvasEdges}
                relatedIds={relatedIds}
                hoverDistances={hoverDistances}
                hoverRevealProgress={hoverRevealProgress}
                selectedId={selectedId}
                hoveredId={hoverId}
                pulse={pulse}
                fontSans={fontSans}
                hasSelection={selection !== null}
                emptyMessage={emptyMessage}
                layoutKey={data?.generatedAt}
                onSelectNode={onSelectNode}
                onHoverNode={onHoverNode}
                onPointerActiveChange={setIsPointerActive}
              />
            )}
          </div>
        </div>
      </div>

      <SourceMapTooltip model={tooltip} x={hoverPos.x} y={hoverPos.y} />
    </div>
  );
}
