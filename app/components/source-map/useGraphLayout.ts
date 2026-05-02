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

function blendAngles(a: number, b: number, blendToA: number): number {
  const wA = clamp(blendToA, 0, 1);
  const wB = 1 - wA;
  const x = Math.cos(a) * wA + Math.cos(b) * wB;
  const y = Math.sin(a) * wA + Math.sin(b) * wB;
  return Math.atan2(y, x);
}

/** Pixels below node center reserved for the canvas title row (font + padding). */
const LABEL_BELOW = 34;
/** Approximate half-width of truncated label text for horizontal clearance. */
const LABEL_HALF_WIDTH = 62;

/**
 * Effective collision radius: disc + space for label beneath + approximate text width,
 * so overlap resolution keeps titles from stacking on neighbors.
 */
function effectiveLayoutRadius(node: PositionedNode): number {
  const w = Math.max(node.r, LABEL_HALF_WIDTH);
  const h = node.r + LABEL_BELOW;
  return Math.hypot(w, h);
}

function resolveNodeOverlaps(
  positions: Map<string, PositionedNode>,
  canvasWidth: number,
  canvasHeight: number
) {
  const ids = [...positions.keys()];
  const gap = 18;
  const maxIterations = 90;

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    let maxPenetration = 0;

    for (let i = 0; i < ids.length; i++) {
      const a = positions.get(ids[i]);
      if (!a) continue;
      const ra = effectiveLayoutRadius(a);

      for (let j = i + 1; j < ids.length; j++) {
        const b = positions.get(ids[j]);
        if (!b) continue;
        const rb = effectiveLayoutRadius(b);

        const dx = b.px - a.px;
        const dy = b.py - a.py;
        const distance = Math.hypot(dx, dy);
        const minDistance = ra + rb + gap;
        const overlap = minDistance - distance;
        if (overlap <= 0) continue;

        maxPenetration = Math.max(maxPenetration, overlap);

        const angle =
          distance > 1e-5 ? Math.atan2(dy, dx) : ((i + 1) * (j + 3)) % (Math.PI * 2);
        const ux = Math.cos(angle);
        const uy = Math.sin(angle);
        const move = overlap * 0.5;

        a.px -= ux * move;
        a.py -= uy * move;
        b.px += ux * move;
        b.py += uy * move;
      }
    }

    const marginX = 16;
    const marginTop = 16;
    const labelBottomPad = 12;
    for (const id of ids) {
      const node = positions.get(id);
      if (!node) continue;
      node.px = clamp(
        node.px,
        LABEL_HALF_WIDTH + marginX,
        canvasWidth - LABEL_HALF_WIDTH - marginX
      );
      node.py = clamp(
        node.py,
        node.r + marginTop,
        canvasHeight - node.r - LABEL_BELOW - labelBottomPad
      );
    }

    if (maxPenetration < 0.55) break;
  }
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
  const cy = canvasHeight * 0.5;

  const positions = new Map<string, PositionedNode>();

  const ringPaddingX = 64;
  const ringPaddingY = 56;
  const maxOuterX = Math.max(
    minDim * 0.4,
    canvasWidth / 2 - DESIGN.jurisdictionNodeMax - ringPaddingX
  );
  const maxOuterY = Math.max(
    minDim * 0.34,
    canvasHeight / 2 - DESIGN.jurisdictionNodeMax - ringPaddingY
  );
  const queryRx = maxOuterX * 0.28;
  const queryRy = maxOuterY * 0.28;
  const sourceRx = maxOuterX * 0.58;
  const sourceRy = maxOuterY * 0.58;
  const jurRx = maxOuterX * 0.96;
  const jurRy = maxOuterY * 0.96;

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
      px: cx + Math.cos(angle) * queryRx,
      py: cy + Math.sin(angle) * queryRy,
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

    const fallback = ringAngle(i, sortedSources.length, golden);
    let angle =
      circularMeanWeighted(pairs) ??
      fallback;
    angle = blendAngles(angle, fallback, 0.62);
    angle += i * 0.004;
    sourceAngle.set(s.id, angle);
  });

  sortedSources.forEach((s, i) => {
    const angle = sourceAngle.get(s.id)!;
    positions.set(s.id, {
      ...s,
      px: cx + Math.cos(angle) * sourceRx,
      py: cy + Math.sin(angle) * sourceRy,
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

    const fallback = ringAngle(i, sortedJur.length, jurPhase);
    let angle =
      circularMeanWeighted(pairs) ??
      fallback;
    angle = blendAngles(angle, fallback, 0.58);
    angle += i * 0.004;

    positions.set(j.id, {
      ...j,
      px: cx + Math.cos(angle) * jurRx,
      py: cy + Math.sin(angle) * jurRy,
      r: clamp(
        DESIGN.jurisdictionNodeBase +
          j.usage * DESIGN.jurisdictionNodeMultiplier,
        DESIGN.jurisdictionNodeMin,
        DESIGN.jurisdictionNodeMax
      ),
    });
  });

  resolveNodeOverlaps(positions, canvasWidth, canvasHeight);

  return positions;
}
