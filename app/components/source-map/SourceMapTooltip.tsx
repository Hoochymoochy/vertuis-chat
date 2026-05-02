"use client";

import { DESIGN } from "./sourceMap.constants";
import type { TooltipModel } from "./sourceMap.types";

type Props = {
  model: TooltipModel | null;
  x: number;
  y: number;
};

export function SourceMapTooltip({ model, x, y }: Props) {
  if (!model) return null;

  return (
    <div
      className="pointer-events-none fixed z-50 rounded-lg border font-sans shadow-2xl backdrop-blur-sm"
      style={{
        left: x + 14,
        top: y + 14,
        maxWidth: DESIGN.tooltipMaxWidth,
        padding: DESIGN.tooltipPadding,
        backgroundColor: DESIGN.bgTooltip,
        borderColor: DESIGN.borderGold,
        color: DESIGN.textPrimary,
      }}
    >
      <div
        className="text-[13px] font-semibold leading-snug tracking-tight"
        style={{ color: DESIGN.textPrimary }}
      >
        {model.title}
      </div>
      {model.subtitle ? (
        <p
          className="mt-1.5 text-[11px] leading-relaxed"
          style={{ color: DESIGN.textMuted }}
        >
          {model.subtitle}
        </p>
      ) : null}
      <dl className="mt-3 space-y-2 border-t border-white/10 pt-3 text-[12px]">
        {model.rows.map((row) => (
          <div key={row.label} className="grid gap-1">
            <dt
              className="text-[10px] font-medium uppercase tracking-wide"
              style={{ color: DESIGN.textMuted }}
            >
              {row.label}
            </dt>
            <dd
              className="min-w-0 wrap-break-word leading-snug tabular-nums"
              style={{ color: DESIGN.goldLight }}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
