// Application Constants and Configuration
export const COLORS = {
  // Primary colors
  PRIMARY_BROWN_1: "#8B4513",
  PRIMARY_BROWN_2: "#A0522D",
  PRIMARY_GRADIENT: "linear-gradient(135deg, #8B4513 0%, #A0522D 100%)",

  // Secondary colors
  SECONDARY_RED: "#DC143C",
  SECONDARY_RED_LIGHT: "#FF6B6B",

  // Text colors
  TEXT_BLACK: "#000000",
  TEXT_WHITE: "#FFFFFF",
  TEXT_GRAY: "#6B7280",

  // Background colors
  BG_LIGHT: "#F5F5F5",
  BG_DARK: "#1F2937",
  BG_OVERLAY: "rgba(0, 0, 0, 0.6)",

  // UI colors
  SUCCESS: "#10B981",
  ERROR: "#EF4444",
  WARNING: "#F59E0B",
  INFO: "#3B82F6",

  // Button states
  BUTTON_ACTIVE: "linear-gradient(135deg, #8B4513 0%, #A0522D 100%)",
  BUTTON_DISABLED: "#DC143C",
  BUTTON_HOVER: "linear-gradient(135deg, #A0522D 0%, #8B4513 100%)",
};

export const FONTS = {
  // Three popular out-of-the-box font options
  OPTION_1: {
    name: "Inter",
    family:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    import:
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
  },
  OPTION_2: {
    name: "Poppins",
    family:
      "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    import:
      "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap",
  },
  OPTION_3: {
    name: "Roboto",
    family: "'Roboto', -apple-system, BlinkMacSystemFont, sans-serif",
    import:
      "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap",
  },
};

// Selected font (change this to switch between OPTION_1, OPTION_2, or OPTION_3)
export const SELECTED_FONT = FONTS.OPTION_1;

export const TYPOGRAPHY = {
  HEADING_1: {
    fontSize: "3.5rem",
    fontWeight: "700",
    lineHeight: "1.2",
    letterSpacing: "-0.02em",
  },
  HEADING_2: {
    fontSize: "2.5rem",
    fontWeight: "600",
    lineHeight: "1.3",
    letterSpacing: "-0.01em",
  },
  HEADING_3: {
    fontSize: "2rem",
    fontWeight: "600",
    lineHeight: "1.4",
  },
  HEADING_4: {
    fontSize: "1.5rem",
    fontWeight: "600",
    lineHeight: "1.4",
  },
  BODY_LARGE: {
    fontSize: "1.125rem",
    fontWeight: "400",
    lineHeight: "1.6",
  },
  BODY: {
    fontSize: "1rem",
    fontWeight: "400",
    lineHeight: "1.5",
  },
  BODY_SMALL: {
    fontSize: "0.875rem",
    fontWeight: "400",
    lineHeight: "1.4",
  },
  BUTTON_TEXT: {
    fontSize: "1rem",
    fontWeight: "600",
    lineHeight: "1",
    textTransform: "uppercase",
    letterSpacing: "0.025em",
  },
};

export const SPACING = {
  XS: "0.25rem",
  SM: "0.5rem",
  MD: "1rem",
  LG: "1.5rem",
  XL: "2rem",
  XXL: "3rem",
};

export const BORDER_RADIUS = {
  SM: "4px",
  MD: "8px",
  LG: "12px",
  XL: "16px",
  ROUND: "50%",
  PILL: "9999px",
};

export const SHADOWS = {
  SM: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  MD: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  LG: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  XL: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
};

export const TRANSITIONS = {
  FAST: "150ms ease-in-out",
  DEFAULT: "250ms ease-in-out",
  SLOW: "350ms ease-in-out",
};

export const Z_INDEX = {
  BASE: 0,
  MID: 10,
  HIGH: 20,
  TOP: 30,
  MODAL: 40,
  TOOLTIP: 50,
};

export const BREAKPOINTS = {
  MOBILE: "320px",
  SM: "640px",
  MD: "768px",
  LG: "1024px",
  XL: "1280px",
  XXL: "1536px",
};
