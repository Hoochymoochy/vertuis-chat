import { DESIGN } from "./sourceMap.constants";
import type { GraphEdge, PositionedNode, SourceMapData } from "./sourceMap.types";

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

/** Weighted mean direction on the circle (fewer crossing edges). */
function circularMeanWeighted(
  pairs: { angle: number; weight: number }[]
): number | null {
  if (!pairs.length) return null;
  let sx = 0;
  let sy = 0;
  let tw = 0;
  for (const { angle, weight } of pairs) {
    const w = Math.max(1e-6, weight);
    sx += Math.cos(angle) * w;
    sy += Math.sin(angle) * w;
    tw += w;
  }
  if (tw < 1e-9) return null;
  return Math.atan2(sy / tw, sx / tw);
}

/** Even spacing from top (-π/2), stable by sort order. */
function ringAngle(i: number, n: number, phase: number): number {
  const count = Math.max(n, 1);
  return (i / count) * Math.PI * 2 - Math.PI / 2 + phase;
}

/**
 * Edge-aware concentric layout: queries on inner ring, sources mid, jurisdictions outer.
 * Angles follow graph connectivity to reduce clutter vs fixed offsets on every ring.
 */
export function computeLayout(
  data: SourceMapData,
  edges: GraphEdge[],
  canvasWidth: number,
  canvasHeight: number
): Map<string, PositionedNode> {
  const minDim = Math.min(canvasWidth, canvasHeight);
  const cx = canvasWidth / 2;
  const cy = canvasHeight * 0.44;

  const positions = new Map<string, PositionedNode>();

  const rQuery = minDim * 0.19;
  const rSource = minDim * 0.335;
  const rJur = minDim * 0.475;

  const usedByTarget = new Map<string, { queryId: string; weight: number }[]>();
  for (const e of edges) {
    if (e.edgeType !== "USED") continue;
    const arr = usedByTarget.get(e.to) ?? [];
    arr.push({ queryId: e.from, weight: e.weight });
    usedByTarget.set(e.to, arr);
  }

  const fromByJur = new Map<string, { sourceId: string; weight: number }[]>();
  for (const e of edges) {
    if (e.edgeType !== "FROM") continue;
    const arr = fromByJur.get(e.to) ?? [];
    arr.push({ sourceId: e.from, weight: e.weight });
    fromByJur.set(e.to, arr);
  }

  const sortedQueries = [...data.queries].sort((a, b) => b.usage - a.usage);
  const queryAngle = new Map<string, number>();
  sortedQueries.forEach((q, i) => {
    queryAngle.set(q.id, ringAngle(i, sortedQueries.length, 0));
  });

  sortedQueries.forEach((q, i) => {
    const angle = queryAngle.get(q.id)!;
    positions.set(q.id, {
      ...q,
      px: cx + Math.cos(angle) * rQuery,
      py: cy + Math.sin(angle) * rQuery,
      r: clamp(
        DESIGN.queryNodeBase + q.usage * DESIGN.queryNodeMultiplier,
        DESIGN.queryNodeMin,
        DESIGN.queryNodeMax
      ),
    });
  });

  const sortedSources = [...data.sources].sort((a, b) => b.usage - a.usage);
  const sourceAngle = new Map<string, number>();
  const golden = 0.137 * Math.PI * 2;

  sortedSources.forEach((s, i) => {
    const links = usedByTarget.get(s.id) ?? [];
    const pairs = links
      .map((l) => {
        const ang = queryAngle.get(l.queryId);
        if (ang === undefined) return null;
        return { angle: ang, weight: l.weight };
      })
      .filter((x): x is { angle: number; weight: number } => x !== null);

    let angle =
      circularMeanWeighted(pairs) ??
      ringAngle(i, sortedSources.length, golden);
    angle += i * 0.004;
    sourceAngle.set(s.id, angle);
  });

  sortedSources.forEach((s, i) => {
    const angle = sourceAngle.get(s.id)!;
    positions.set(s.id, {
      ...s,
      px: cx + Math.cos(angle) * rSource,
      py: cy + Math.sin(angle) * rSource,
      r: clamp(
        DESIGN.sourceNodeBase + s.usage * DESIGN.sourceNodeMultiplier,
        DESIGN.sourceNodeMin,
        DESIGN.sourceNodeMax
      ),
    });
  });

  const sortedJur = [...data.jurisdictions].sort((a, b) => b.usage - a.usage);
  const jurPhase = golden * 1.7;

  sortedJur.forEach((j, i) => {
    const links = fromByJur.get(j.id) ?? [];
    const pairs = links
      .map((l) => {
        const ang = sourceAngle.get(l.sourceId);
        if (ang === undefined) return null;
        return { angle: ang, weight: l.weight };
      })
      .filter((x): x is { angle: number; weight: number } => x !== null);

    let angle =
      circularMeanWeighted(pairs) ??
      ringAngle(i, sortedJur.length, jurPhase);
    angle += i * 0.004;

    positions.set(j.id, {
      ...j,
      px: cx + Math.cos(angle) * rJur,
      py: cy + Math.sin(angle) * rJur,
      r: clamp(
        DESIGN.jurisdictionNodeBase +
          j.usage * DESIGN.jurisdictionNodeMultiplier,
        DESIGN.jurisdictionNodeMin,
        DESIGN.jurisdictionNodeMax
      ),
    });
  });

  return positions;
}
