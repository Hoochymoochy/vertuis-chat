"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import { DESIGN } from "./sourceMap.constants";
import type { GraphEdge, PositionedNode } from "./sourceMap.types";

const MIN_SCALE = 0.35;
const MAX_SCALE = 3;
const ZOOM_STEP = 1.18;

function clampScale(s: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));
}

function screenToWorld(
  sx: number,
  sy: number,
  tx: number,
  ty: number,
  scale: number
) {
  return { wx: (sx - tx) / scale, wy: (sy - ty) / scale };
}

function buildEffectivePositions(
  positions: Map<string, PositionedNode>,
  offsets: Record<string, { dx: number; dy: number }>
): Map<string, PositionedNode> {
  const m = new Map<string, PositionedNode>();
  for (const [id, node] of positions) {
    const o = offsets[id];
    m.set(
      id,
      o ? { ...node, px: node.px + o.dx, py: node.py + o.dy } : node
    );
  }
  return m;
}

function drawEdge(
  ctx: CanvasRenderingContext2D,
  from: PositionedNode,
  to: PositionedNode,
  edge: GraphEdge,
  alpha: number
) {
  const color =
    edge.edgeType === "FROM" ? DESIGN.edgeFromOpen : DESIGN.edgeUsedOpen;
  const width = 0.5 + (edge.weight / 15) * 2.5;

  ctx.strokeStyle = `${color}${alpha})`;
  ctx.lineWidth = Math.min(DESIGN.edgeWidthMax, Math.max(DESIGN.edgeWidthMin, width));
  ctx.beginPath();
  ctx.moveTo(from.px, from.py);
  ctx.lineTo(to.px, to.py);
  ctx.stroke();
}

function nodeFillColor(type: PositionedNode["type"]): string {
  switch (type) {
    case "user":
      return DESIGN.nodeUser;
    case "query":
      return DESIGN.nodeQuery;
    case "source":
      return DESIGN.nodeSource;
    case "jurisdiction":
      return DESIGN.nodeJurisdiction;
    default:
      return DESIGN.nodeQuery;
  }
}

function withAlpha(hex: string, a: number): string {
  if (hex.startsWith("#") && hex.length === 7) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${a})`;
  }
  return hex;
}

/** Small centered glyph per node type (canvas paths). */
function drawNodeTypeIcon(
  ctx: CanvasRenderingContext2D,
  type: PositionedNode["type"],
  px: number,
  py: number,
  r: number,
  iconAlpha: number
) {
  const s = Math.max(3.8, Math.min(14, Math.min(r * 0.42, 13)));
  const ink = withAlpha("#FFF8E8", Math.max(0.2, iconAlpha * 0.92));
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  switch (type) {
    case "user":
      break;
    case "query": {
      ctx.strokeStyle = ink;
      ctx.lineWidth = Math.max(1.05, s * 0.13);
      const ox = px - s * 0.12;
      const oy = py - s * 0.12;
      ctx.beginPath();
      ctx.arc(ox, oy, s * 0.26, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(ox + s * 0.2, oy + s * 0.2);
      ctx.lineTo(px + s * 0.48, py + s * 0.48);
      ctx.stroke();
      break;
    }
    case "source": {
      ctx.strokeStyle = ink;
      ctx.lineWidth = Math.max(1, s * 0.11);
      const w = s * 0.52;
      const h = s * 0.62;
      const left = px - w / 2;
      const top = py - h / 2;
      ctx.strokeRect(left, top, w, h);
      for (let i = 0; i < 3; i++) {
        const y = top + h * 0.26 + i * s * 0.15;
        ctx.beginPath();
        ctx.moveTo(left + w * 0.18, y);
        ctx.lineTo(left + w * 0.82, y);
        ctx.stroke();
      }
      break;
    }
    case "jurisdiction": {
      ctx.fillStyle = ink;
      ctx.beginPath();
      ctx.moveTo(px, py - s * 0.42);
      ctx.bezierCurveTo(
        px + s * 0.45,
        py - s * 0.1,
        px + s * 0.35,
        py + s * 0.38,
        px,
        py + s * 0.42
      );
      ctx.bezierCurveTo(
        px - s * 0.35,
        py + s * 0.38,
        px - s * 0.45,
        py - s * 0.1,
        px,
        py - s * 0.42
      );
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = withAlpha(DESIGN.charcoal, 0.55 * iconAlpha);
      ctx.beginPath();
      ctx.arc(px, py - s * 0.02, s * 0.12, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    default:
      break;
  }
  ctx.restore();
}

function drawNodeDisc(
  ctx: CanvasRenderingContext2D,
  node: PositionedNode,
  isSelected: boolean,
  isHovered: boolean,
  isDimmed: boolean,
  pulseValue: number
) {
  const alpha = isDimmed ? 0.12 : isSelected || isHovered ? 1 : 0.85;
  const base = nodeFillColor(node.type);

  ctx.save();
  if (isSelected) {
    ctx.shadowColor = withAlpha(DESIGN.gold, 0.55);
    ctx.shadowBlur = 16 + pulseValue * 8;
  } else if (isHovered && !isDimmed) {
    ctx.shadowColor = withAlpha(DESIGN.gold, 0.35);
    ctx.shadowBlur = 10;
  }

  const r = node.r + (isSelected ? pulseValue * 3 : 0);
  const grd = ctx.createRadialGradient(
    node.px - r * 0.3,
    node.py - r * 0.3,
    0,
    node.px,
    node.py,
    r
  );
  grd.addColorStop(0, withAlpha(DESIGN.highlightWarm, 0.42 * alpha));
  grd.addColorStop(0.38, withAlpha(base, 0.96 * alpha));
  grd.addColorStop(1, withAlpha(DESIGN.charcoal, 0.72 * alpha));

  ctx.beginPath();
  ctx.arc(node.px, node.py, r, 0, Math.PI * 2);
  ctx.fillStyle = grd;
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.strokeStyle = withAlpha(
    DESIGN.gold,
    (isSelected ? 0.9 : isHovered ? 0.55 : 0.38) * alpha
  );
  ctx.lineWidth = isSelected ? 2.2 : 1;
  ctx.stroke();

  drawNodeTypeIcon(ctx, node.type, node.px, node.py, r, alpha);
  ctx.restore();
}

function truncate(s: string, max: number) {
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
}

/** Label only for the hovered node (not shown by default under nodes). */
function drawHoverLabel(
  ctx: CanvasRenderingContext2D,
  positions: Map<string, PositionedNode>,
  fontSans: string,
  relatedIds: Set<string>,
  hasSelection: boolean,
  hoveredId: string | null
) {
  if (!hoveredId) return;
  const node = positions.get(hoveredId);
  if (!node) return;
  const dim = hasSelection && !relatedIds.has(node.id);

  const line1 =
    node.type === "query"
      ? truncate(node.label, 30)
      : node.type === "source"
        ? truncate(node.label, 32)
        : truncate(node.label, 28);

  const x = node.px;
  const y = node.py + node.r + 8;
  ctx.save();
  ctx.font = `500 12px ${fontSans}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(0,0,0,0.72)";
  ctx.strokeText(line1, x, y);
  ctx.fillStyle = withAlpha(DESIGN.textPrimary, dim ? 0.45 : 0.95);
  ctx.fillText(line1, x, y);
  ctx.restore();
}

export type NodeKind = "user" | "query" | "source" | "jurisdiction";

export type SourceMapCanvasHandle = {
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
};

export type SourceMapCanvasProps = {
  width: number;
  height: number;
  positions: Map<string, PositionedNode>;
  edges: GraphEdge[];
  relatedIds: Set<string>;
  selectedId: string | null;
  hoveredId: string | null;
  pulse: number;
  fontSans: string;
  hasSelection: boolean;
  emptyMessage?: string;
  layoutKey?: string;
  onSelectNode: (id: string | null, kind: NodeKind | null) => void;
  onHoverNode: (id: string | null, clientX: number, clientY: number) => void;
};

type NodeDragRef = {
  pointerId: number;
  id: string;
  kind: NodeKind;
  lastWx: number;
  lastWy: number;
  startWx: number;
  startWy: number;
  startSx: number;
  startSy: number;
  dragging: boolean;
  vx: number;
  vy: number;
  lastMoveMs: number;
} | null;

export const SourceMapCanvas = forwardRef<SourceMapCanvasHandle, SourceMapCanvasProps>(
  function SourceMapCanvas(
    {
      width,
      height,
      positions,
      edges,
      relatedIds,
      selectedId,
      hoveredId,
      pulse,
      fontSans,
      hasSelection,
      emptyMessage,
      layoutKey,
      onSelectNode,
      onHoverNode,
    },
    ref
  ) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [view, setView] = useState({ tx: 0, ty: 0, scale: 1 });
    const viewRef = useRef(view);
    viewRef.current = view;

    const [nodeOffsets, setNodeOffsets] = useState<
      Record<string, { dx: number; dy: number }>
    >({});

    const effectivePositions = useMemo(
      () => buildEffectivePositions(positions, nodeOffsets),
      [positions, nodeOffsets]
    );

    const panRef = useRef({
      active: false,
      pointerId: -1,
      lastX: 0,
      lastY: 0,
    });
    const clickRef = useRef<{
      hit: { id: string; kind: NodeKind } | null;
      startX: number;
      startY: number;
    } | null>(null);
    const nodeDragRef = useRef<NodeDragRef>(null);
    const inertiaRef = useRef<{
      velocities: Record<string, { vx: number; vy: number }>;
      lastTs: number | null;
      raf: number | null;
    }>({
      velocities: {},
      lastTs: null,
      raf: null,
    });

    const [isPanning, setIsPanning] = useState(false);
    const [isNodeDragging, setIsNodeDragging] = useState(false);

    const stopNodeInertia = useCallback((id: string) => {
      const state = inertiaRef.current;
      if (state.velocities[id]) {
        delete state.velocities[id];
      }
      if (Object.keys(state.velocities).length === 0) {
        state.lastTs = null;
        if (state.raf !== null && typeof window !== "undefined") {
          window.cancelAnimationFrame(state.raf);
          state.raf = null;
        }
      }
    }, []);

    const ensureInertiaLoop = useCallback(() => {
      const state = inertiaRef.current;
      if (state.raf !== null || typeof window === "undefined") return;

      const tick = (ts: number) => {
        const s = inertiaRef.current;
        const prevTs = s.lastTs ?? ts;
        const dt = Math.max(0.001, Math.min(50, ts - prevTs));
        s.lastTs = ts;
        const friction = Math.pow(0.9, dt / 16.6667);
        const stopSpeed = 0.0022; // world px/ms

        setNodeOffsets((prev) => {
          const next = { ...prev };
          let active = 0;
          for (const [id, v] of Object.entries(s.velocities)) {
            v.vx *= friction;
            v.vy *= friction;
            const speed = Math.hypot(v.vx, v.vy);
            if (speed < stopSpeed) {
              delete s.velocities[id];
              continue;
            }
            active++;
            const cur = next[id] ?? { dx: 0, dy: 0 };
            next[id] = { dx: cur.dx + v.vx * dt, dy: cur.dy + v.vy * dt };
          }
          if (active === 0) {
            if (s.raf !== null && typeof window !== "undefined") {
              window.cancelAnimationFrame(s.raf);
            }
            s.raf = null;
            s.lastTs = null;
          }
          return next;
        });

        if (s.raf !== null && typeof window !== "undefined") {
          s.raf = window.requestAnimationFrame(tick);
        }
      };

      state.lastTs = null;
      state.raf = window.requestAnimationFrame(tick);
    }, []);

    const prevLayoutKey = useRef<string | undefined>(undefined);
    useEffect(() => {
      if (layoutKey === undefined) return;
      if (prevLayoutKey.current === undefined) {
        prevLayoutKey.current = layoutKey;
        return;
      }
      if (layoutKey !== prevLayoutKey.current) {
        prevLayoutKey.current = layoutKey;
        setView({ tx: 0, ty: 0, scale: 1 });
        setNodeOffsets({});
        inertiaRef.current.velocities = {};
        inertiaRef.current.lastTs = null;
        if (inertiaRef.current.raf !== null && typeof window !== "undefined") {
          window.cancelAnimationFrame(inertiaRef.current.raf);
          inertiaRef.current.raf = null;
        }
      }
    }, [layoutKey]);

    const zoomAtScreen = useCallback((sx: number, sy: number, zoomIn: boolean) => {
      const factor = zoomIn ? ZOOM_STEP : 1 / ZOOM_STEP;
      setView((v) => {
        const newScale = clampScale(v.scale * factor);
        const wx = (sx - v.tx) / v.scale;
        const wy = (sy - v.ty) / v.scale;
        return {
          scale: newScale,
          tx: sx - wx * newScale,
          ty: sy - wy * newScale,
        };
      });
    }, []);

    const zoomAtCenter = useCallback(
      (zoomIn: boolean) => {
        zoomAtScreen(width / 2, height / 2, zoomIn);
      },
      [width, height, zoomAtScreen]
    );

    useImperativeHandle(
      ref,
      () => ({
        zoomIn: () => zoomAtCenter(true),
        zoomOut: () => zoomAtCenter(false),
        resetView: () => {
          setView({ tx: 0, ty: 0, scale: 1 });
          setNodeOffsets({});
          inertiaRef.current.velocities = {};
          inertiaRef.current.lastTs = null;
          if (inertiaRef.current.raf !== null && typeof window !== "undefined") {
            window.cancelAnimationFrame(inertiaRef.current.raf);
            inertiaRef.current.raf = null;
          }
        },
      }),
      [zoomAtCenter]
    );

    useEffect(() => {
      return () => {
        const state = inertiaRef.current;
        if (state.raf !== null && typeof window !== "undefined") {
          window.cancelAnimationFrame(state.raf);
          state.raf = null;
        }
      };
    }, []);

    const hitTestWorld = useCallback(
      (wx: number, wy: number, graph: Map<string, PositionedNode>) => {
        let best: { id: string; kind: NodeKind; d: number } | null = null;
        for (const [id, n] of graph) {
          const d = Math.hypot(wx - n.px, wy - n.py);
          if (d <= n.r && (!best || d < best.d)) {
            best = { id, kind: n.type as NodeKind, d };
          }
        }
        return best;
      },
      []
    );

    const draw = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas || width < 32 || height < 32) return;
      const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const { tx, ty, scale } = viewRef.current;

      ctx.fillStyle = DESIGN.obsidian;
      ctx.fillRect(0, 0, width, height);

      const pulseValue = (Math.sin(pulse) + 1) / 2;

      ctx.save();
      ctx.translate(tx, ty);
      ctx.scale(scale, scale);

      const edgeAlpha = (fromId: string, toId: string) => {
        if (!hasSelection) return DESIGN.activeAlpha;
        if (relatedIds.has(fromId) && relatedIds.has(toId)) return 0.8;
        return DESIGN.dimAlpha;
      };

      for (const e of edges) {
        const from = effectivePositions.get(e.from);
        const to = effectivePositions.get(e.to);
        if (!from || !to) continue;
        drawEdge(ctx, from, to, e, edgeAlpha(e.from, e.to));
      }

      const ordered = [...effectivePositions.entries()].sort(
        (a, b) => a[1].r - b[1].r
      );

      for (const [, node] of ordered) {
        const isSel = selectedId === node.id;
        const isHi = hoveredId === node.id;
        const dim = hasSelection && !relatedIds.has(node.id);
        drawNodeDisc(
          ctx,
          node,
          isSel,
          isHi,
          Boolean(dim && !isHi),
          isSel ? pulseValue : 0
        );
      }

      drawHoverLabel(
        ctx,
        effectivePositions,
        fontSans,
        relatedIds,
        hasSelection,
        hoveredId
      );
      ctx.restore();

      if (emptyMessage) {
        ctx.save();
        ctx.font = `italic 400 15px ${fontSans}`;
        ctx.fillStyle = withAlpha(DESIGN.gold, 0.88);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(emptyMessage, width / 2, height / 2 + 56);
        ctx.restore();
      }
    }, [
      width,
      height,
      effectivePositions,
      edges,
      relatedIds,
      selectedId,
      hoveredId,
      pulse,
      fontSans,
      hasSelection,
      emptyMessage,
      view,
    ]);

    useEffect(() => {
      draw();
    }, [draw]);

    const updateHoverFromEvent = useCallback(
      (e: React.PointerEvent<HTMLCanvasElement>) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const sx = e.clientX - rect.left;
        const sy = e.clientY - rect.top;
        const { tx, ty, scale } = viewRef.current;
        const { wx, wy } = screenToWorld(sx, sy, tx, ty, scale);
        const hit = hitTestWorld(wx, wy, effectivePositions);
        onHoverNode(hit?.id ?? null, e.clientX, e.clientY);
      },
      [hitTestWorld, effectivePositions, onHoverNode]
    );

    const onPointerDown = useCallback(
      (e: React.PointerEvent<HTMLCanvasElement>) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const sx = e.clientX - rect.left;
        const sy = e.clientY - rect.top;
        const { tx, ty, scale } = viewRef.current;
        const { wx, wy } = screenToWorld(sx, sy, tx, ty, scale);
        const hit = hitTestWorld(wx, wy, effectivePositions);

        nodeDragRef.current = null;

        if (!hit) {
          clickRef.current = { hit: null, startX: sx, startY: sy };
          panRef.current = {
            active: false,
            pointerId: e.pointerId,
            lastX: sx,
            lastY: sy,
          };
          canvasRef.current?.setPointerCapture(e.pointerId);
        } else {
          stopNodeInertia(hit.id);
          panRef.current = { active: false, pointerId: -1, lastX: 0, lastY: 0 };
          clickRef.current = null;
          const now =
            typeof performance !== "undefined" ? performance.now() : Date.now();
          nodeDragRef.current = {
            pointerId: e.pointerId,
            id: hit.id,
            kind: hit.kind,
            lastWx: wx,
            lastWy: wy,
            startWx: wx,
            startWy: wy,
            startSx: sx,
            startSy: sy,
            dragging: false,
            vx: 0,
            vy: 0,
            lastMoveMs: now,
          };
          canvasRef.current?.setPointerCapture(e.pointerId);
        }
      },
      [hitTestWorld, effectivePositions, stopNodeInertia]
    );

    const onPointerMove = useCallback(
      (e: React.PointerEvent<HTMLCanvasElement>) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const sx = e.clientX - rect.left;
        const sy = e.clientY - rect.top;
        const { tx, ty, scale } = viewRef.current;
        const { wx, wy } = screenToWorld(sx, sy, tx, ty, scale);

        const drag = nodeDragRef.current;
        if (drag && e.pointerId === drag.pointerId) {
          if (!drag.dragging) {
            const dist = Math.hypot(wx - drag.startWx, wy - drag.startWy);
            if (dist > 4 / scale) {
              drag.dragging = true;
              drag.lastWx = wx;
              drag.lastWy = wy;
              setIsNodeDragging(true);
            }
          }
          if (drag.dragging) {
            const dwx = wx - drag.lastWx;
            const dwy = wy - drag.lastWy;
            const now =
              typeof performance !== "undefined" ? performance.now() : Date.now();
            const dt = Math.max(1, now - drag.lastMoveMs);
            const instantVx = dwx / dt;
            const instantVy = dwy / dt;
            drag.vx = drag.vx * 0.55 + instantVx * 0.45;
            drag.vy = drag.vy * 0.55 + instantVy * 0.45;
            drag.lastMoveMs = now;
            drag.lastWx = wx;
            drag.lastWy = wy;
            const id = drag.id;
            setNodeOffsets((prev) => {
              const cur = prev[id] ?? { dx: 0, dy: 0 };
              return { ...prev, [id]: { dx: cur.dx + dwx, dy: cur.dy + dwy } };
            });
          }
        }

        const c = clickRef.current;
        if (panRef.current.pointerId === e.pointerId && c && c.hit === null) {
          const dragPx = Math.hypot(sx - c.startX, sy - c.startY);
          if (!panRef.current.active && dragPx > 4) {
            panRef.current.active = true;
            panRef.current.lastX = c.startX;
            panRef.current.lastY = c.startY;
            setIsPanning(true);
          }
          if (panRef.current.active) {
            const dx = sx - panRef.current.lastX;
            const dy = sy - panRef.current.lastY;
            panRef.current.lastX = sx;
            panRef.current.lastY = sy;
            setView((v) => ({ ...v, tx: v.tx + dx, ty: v.ty + dy }));
          }
        }

        updateHoverFromEvent(e);
      },
      [updateHoverFromEvent]
    );

    const onPointerUp = useCallback(
      (e: React.PointerEvent<HTMLCanvasElement>) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const sx = e.clientX - rect.left;
        const sy = e.clientY - rect.top;

        const nd = nodeDragRef.current;
        if (nd && e.pointerId === nd.pointerId) {
          try {
            canvasRef.current?.releasePointerCapture(e.pointerId);
          } catch {
            /* ignore */
          }
          const movedScreen = Math.hypot(sx - nd.startSx, sy - nd.startSy);
          const wasDragging = nd.dragging;
          nodeDragRef.current = null;
          setIsNodeDragging(false);

          if (wasDragging) {
            const launchSpeed = Math.hypot(nd.vx, nd.vy);
            if (launchSpeed > 0.0022) {
              inertiaRef.current.velocities[nd.id] = { vx: nd.vx, vy: nd.vy };
              ensureInertiaLoop();
            }
          }

          if (!wasDragging && movedScreen <= 6) {
            onSelectNode(nd.id, nd.kind);
          }
          return;
        }

        if (panRef.current.pointerId === e.pointerId && clickRef.current?.hit === null) {
          try {
            canvasRef.current?.releasePointerCapture(e.pointerId);
          } catch {
            /* ignore */
          }
          const startX = clickRef.current?.startX ?? sx;
          const startY = clickRef.current?.startY ?? sy;
          const moved = Math.hypot(sx - startX, sy - startY);
          const wasPan = panRef.current.active;
          panRef.current = { active: false, pointerId: -1, lastX: 0, lastY: 0 };
          setIsPanning(false);
          if (!wasPan && moved <= 4) {
            onSelectNode(null, null);
          }
          clickRef.current = null;
          return;
        }
      },
      [ensureInertiaLoop, onSelectNode]
    );

    const onPointerLeave = useCallback(() => {
      onHoverNode(null, 0, 0);
    }, [onHoverNode]);

    useEffect(() => {
      const el = canvasRef.current;
      if (!el) return;
      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        const rect = el.getBoundingClientRect();
        const sx = e.clientX - rect.left;
        const sy = e.clientY - rect.top;
        const factor = e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP;
        const v = viewRef.current;
        const newScale = clampScale(v.scale * factor);
        const wx = (sx - v.tx) / v.scale;
        const wy = (sy - v.ty) / v.scale;
        setView({
          scale: newScale,
          tx: sx - wx * newScale,
          ty: sy - wy * newScale,
        });
      };
      el.addEventListener("wheel", onWheel, { passive: false });
      return () => el.removeEventListener("wheel", onWheel);
    }, [width, height]);

    const cursor = isPanning || isNodeDragging ? "grabbing" : hoveredId ? "pointer" : "grab";

    return (
      <canvas
        ref={canvasRef}
        className="pointer-events-auto absolute left-0 top-0 touch-none rounded-2xl"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          cursor,
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerLeave}
      />
    );
  }
);
