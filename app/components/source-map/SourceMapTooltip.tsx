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
      className="pointer-events-none fixed z-50 rounded-md border font-sans shadow-xl"
      style={{
        left: x + 14,
        top: y + 14,
        maxWidth: DESIGN.tooltipMaxWidth,
        padding: DESIGN.tooltipPadding,
        backgroundColor: DESIGN.bgTooltip,
        borderColor: DESIGN.borderGoldDim,
        color: DESIGN.textPrimary,
      }}
    >
      <div
        className="mb-1.5 text-[11px] font-semibold leading-snug tracking-wide"
        style={{
          color: DESIGN.goldLight,
        }}
      >
        {model.title}
      </div>
      <dl className="space-y-1 text-[12px]">
        {model.rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4">
            <dt style={{ color: DESIGN.textMuted }}>{row.label}</dt>
            <dd className="shrink-0 tabular-nums" style={{ color: DESIGN.gold }}>
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
