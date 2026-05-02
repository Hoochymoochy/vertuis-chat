/** Aligned with site gold palette (globals --gold-*) + neutral-950 shell */
export const DESIGN = {
  gold: "#F7C948",
  goldLight: "#FCE588",
  goldDark: "#DE911D",
  obsidian: "#0A0A0C",
  onyx: "#111114",
  charcoal: "#1A1A1F",
  textPrimary: "#F5F0E6",
  textMuted: "#a3a3a3",

  /** Nodes: gold family + warm neutrals (no blue/purple) */
  nodeUser: "#FCE588",
  nodeQuery: "#4F46E5",
  nodeSource: "#2563EB",
  nodeJurisdiction: "#0891B2",
  nodeStroke: "#E5E7EB",

  /** Edge stroke prefixes: append `${alpha})` */
  edgeNeutralOpen: "rgba(148, 163, 184,",

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
  tooltipMaxWidth: 200,
  tooltipPadding: "10px 14px",

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
