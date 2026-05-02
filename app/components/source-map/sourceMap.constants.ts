/**
 * Matches `app/globals.css` --gold-* tokens (site gold palette).
 * Canvas cannot read CSS variables here, so hex mirrors those vars.
 */
export const DESIGN = {
  /** --gold-400 */
  gold: "#F7C948",
  /** --gold-200 */
  goldLight: "#FCE588",
  /** --gold-600 */
  goldDark: "#DE911D",
  /** --gold-DEFAULT */
  goldPure: "#FFD700",
  obsidian: "#0A0A0C",
  onyx: "#111114",
  charcoal: "#1A1A1F",
  textPrimary: "#F5F0E6",
  textMuted: "#a3a3a3",

  /** Nodes: distinct roles, all from site gold scale */
  nodeUser: "#FCE588",
  nodeQuery: "#F7C948",
  /** --gold-500 */
  nodeSource: "#F0B429",
  /** --gold-700 */
  nodeJurisdiction: "#CB6E17",
  /** Opaque rim (no alpha on node stroke). */
  nodeStroke: "#D8C9A8",

  /**
   * Edge main stroke: warm muted gold-gray (append `${alpha})`).
   * Glow uses `gold` / `goldPure` in canvas with alpha.
   */
  edgeStrokeOpen: "rgba(196, 175, 120,",

  highlightWarm: "#fff8e6",

  fontDisplay: "'Playfair Display', serif",
  fontBody: "Inter, ui-sans-serif, system-ui, sans-serif",

  borderGold: "rgba(255, 215, 0, 0.28)",
  borderGoldDim: "rgba(255, 215, 0, 0.14)",
  borderGoldFaint: "rgba(255, 215, 0, 0.09)",

  bgPanel: "rgba(0,0,0,0.4)",
  bgTooltip: "rgba(10,10,12,0.97)",
  bgHeader: "rgba(0,0,0,0.3)",

  marbleOverlay: `repeating-linear-gradient(
    -45deg,
    transparent 0px, transparent 40px,
    rgba(255, 215, 0, 0.02) 40px, rgba(255, 215, 0, 0.02) 41px
  )`,

  panelWidth: 228,
  headerHeight: 56,
  infoBarHeight: 32,
  tooltipMaxWidth: 300,
  tooltipPadding: "12px 16px",

  queryNodeBase: 8,
  queryNodeMultiplier: 0.6,
  queryNodeMin: 10,
  queryNodeMax: 28,
  sourceNodeBase: 7,
  sourceNodeMultiplier: 0.5,
  jurisdictionNodeBase: 9,
  jurisdictionNodeMultiplier: 0.25,

  sourceNodeMin: 8,
  sourceNodeMax: 26,
  jurisdictionNodeMin: 10,
  jurisdictionNodeMax: 30,

  edgeWidthMin: 0.5,
  edgeWidthMax: 3.0,

  pulseSpeed: 0.06,
  dimAlpha: 0.08,
  activeAlpha: 0.85,
  idleEdgeAlpha: 0.1,
  hoverRevealSpeed: 2.5,
  hoverEdgeBoost: 0.72,
} as const;
