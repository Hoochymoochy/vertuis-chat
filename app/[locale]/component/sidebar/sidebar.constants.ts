export const SIDEBAR = {
    COLLAPSED_WIDTH: 80,
    EXPANDED_WIDTH: 280,
    HEADER_HEIGHT: 64,
    SEARCH_HEIGHT: 40,
    ITEM_HEIGHT: 40,
    BORDER_COLOR: "border-neutral-800",
  };
  
  export const ANIMATION = {
    DURATION: 500,
    EASING: "cubic-bezier(0.25, 1.1, 0.4, 1)",
  
    // for smaller transitions (optional)
    FAST_DURATION: 200,
    FAST_EASING: "cubic-bezier(0.4, 0, 0.2, 1)",
  
    // for hover states
    HOVER_DURATION: 120,
    HOVER_EASING: "linear",
  };
  
  export const MOTION = {
    COLLAPSE: {
      duration: ANIMATION.DURATION,
      easing: ANIMATION.EASING,
    },
    FADE: {
      duration: ANIMATION.DURATION,
      easing: ANIMATION.EASING,
    },
    ICON_ROTATE: {
      duration: ANIMATION.DURATION,
      easing: ANIMATION.EASING,
    },
    TOOLTIP: {
      duration: ANIMATION.FAST_DURATION,
      easing: ANIMATION.FAST_EASING,
    },
  };
  