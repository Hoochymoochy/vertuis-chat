"use client";

import { DESIGN } from "./sourceMap.constants";

/** Same geometry as `drawNodeTypeIcon` in SourceMapCanvas (px=py=12, s=10). */
const S = 10;
const PX = 12;
const PY = 12;

function QueryGlyph({ className }: { className?: string }) {
  const ox = PX - S * 0.12;
  const oy = PY - S * 0.12;
  const cr = S * 0.26;
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
    >
      <circle
        cx={ox}
        cy={oy}
        r={cr}
        fill="none"
        stroke="currentColor"
        strokeWidth={Math.max(1.05, S * 0.13)}
        strokeLinecap="round"
      />
      <line
        x1={ox + S * 0.2}
        y1={oy + S * 0.2}
        x2={PX + S * 0.48}
        y2={PY + S * 0.48}
        stroke="currentColor"
        strokeWidth={Math.max(1.05, S * 0.13)}
        strokeLinecap="round"
      />
    </svg>
  );
}

function SourceGlyph({ className }: { className?: string }) {
  const w = S * 0.52;
  const h = S * 0.62;
  const left = PX - w / 2;
  const top = PY - h / 2;
  const strokeW = Math.max(1, S * 0.11);
  const lineStroke = Math.max(1, S * 0.11);
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect
        x={left}
        y={top}
        width={w}
        height={h}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeW}
      />
      {[0, 1, 2].map((i) => {
        const y = top + h * 0.26 + i * S * 0.15;
        return (
          <line
            key={i}
            x1={left + w * 0.18}
            y1={y}
            x2={left + w * 0.82}
            y2={y}
            stroke="currentColor"
            strokeWidth={lineStroke}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

function JurisdictionGlyph({ className }: { className?: string }) {
  const pinD = [
    `M ${PX} ${PY - S * 0.42}`,
    `C ${PX + S * 0.45} ${PY - S * 0.1} ${PX + S * 0.35} ${PY + S * 0.38} ${PX} ${PY + S * 0.42}`,
    `C ${PX - S * 0.35} ${PY + S * 0.38} ${PX - S * 0.45} ${PY - S * 0.1} ${PX} ${PY - S * 0.42}`,
    "Z",
  ].join(" ");
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d={pinD} fill="currentColor" />
      <circle
        cx={PX}
        cy={PY - S * 0.02}
        r={S * 0.12}
        fill={DESIGN.charcoal}
        fillOpacity={0.55}
      />
    </svg>
  );
}

const rows: {
  Glyph: typeof QueryGlyph;
  title: string;
  hint: string;
  swatch: string;
}[] = [
  {
    Glyph: QueryGlyph,
    title: "Query",
    hint: "A search you ran",
    swatch: DESIGN.nodeQuery,
  },
  {
    Glyph: SourceGlyph,
    title: "Source",
    hint: "Case, statute, or doc cited",
    swatch: DESIGN.nodeSource,
  },
  {
    Glyph: JurisdictionGlyph,
    title: "Jurisdiction",
    hint: "Where sources apply",
    swatch: DESIGN.nodeJurisdiction,
  },
];

export function SourceMapLegend() {
  return (
    <div className="mb-3 border-t border-gold-20/15 pt-3">
      <p
        className="mb-2 text-[9px] font-semibold uppercase tracking-[0.18em]"
        style={{ color: DESIGN.goldLight }}
      >
        Legend
      </p>
      <ul className="space-y-2">
        {rows.map(({ Glyph, title, hint, swatch }) => (
          <li key={title} className="flex items-start gap-2.5">
            <span
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border"
              style={{
                borderColor: DESIGN.borderGoldDim,
                background: `radial-gradient(circle at 30% 25%, ${DESIGN.highlightWarm}33, ${swatch}cc)`,
                color: DESIGN.textPrimary,
              }}
            >
              <Glyph className="h-3.5 w-3.5" />
            </span>
            <span className="min-w-0 pt-0.5">
              <span
                className="block text-[11px] font-medium leading-tight"
                style={{ color: DESIGN.textPrimary }}
              >
                {title}
              </span>
              <span
                className="mt-0.5 block text-[10px] leading-snug"
                style={{ color: DESIGN.textMuted }}
              >
                {hint}
              </span>
            </span>
          </li>
        ))}
      </ul>
      <p
        className="mt-2 border-t border-gold-20/10 pt-2 text-[9px] leading-relaxed"
        style={{ borderColor: DESIGN.borderGoldFaint, color: DESIGN.textMuted }}
      >
        Hover a node on the map for its name.
      </p>
    </div>
  );
}
