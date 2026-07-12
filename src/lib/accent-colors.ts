export interface AccentColor {
  id: string;
  label: string;
  hex: string;
  light: {
    primary: string;
    "primary-foreground": string;
    accent: string;
    ring: string;
    "sidebar-primary": string;
  };
  dark: {
    primary: string;
    "primary-foreground": string;
    accent: string;
    ring: string;
    "sidebar-primary": string;
  };
}

export const ACCENT_COLORS: AccentColor[] = [
  {
    id: "aara-green",
    label: "Aara Green",
    hex: "#618764",
    light: {
      primary: "oklch(0.45 0.10 165)",
      "primary-foreground": "oklch(0.98 0 0)",
      accent: "oklch(0.55 0.10 165)",
      ring: "oklch(0.45 0.10 165)",
      "sidebar-primary": "oklch(0.45 0.10 165)",
    },
    dark: {
      primary: "oklch(0.55 0.10 165)",
      "primary-foreground": "oklch(0.98 0 0)",
      accent: "oklch(0.55 0.10 165)",
      ring: "oklch(0.55 0.10 165)",
      "sidebar-primary": "oklch(0.55 0.10 165)",
    },
  },
  {
    id: "forest-green",
    label: "Forest Green",
    hex: "#2B5748",
    light: {
      primary: "oklch(0.38 0.07 165)",
      "primary-foreground": "oklch(0.98 0 0)",
      accent: "oklch(0.48 0.07 165)",
      ring: "oklch(0.38 0.07 165)",
      "sidebar-primary": "oklch(0.38 0.07 165)",
    },
    dark: {
      primary: "oklch(0.50 0.08 165)",
      "primary-foreground": "oklch(0.98 0 0)",
      accent: "oklch(0.50 0.08 165)",
      ring: "oklch(0.50 0.08 165)",
      "sidebar-primary": "oklch(0.50 0.08 165)",
    },
  },
  {
    id: "emerald",
    label: "Emerald",
    hex: "#2E8B57",
    light: {
      primary: "oklch(0.55 0.15 155)",
      "primary-foreground": "oklch(0.98 0 0)",
      accent: "oklch(0.65 0.15 155)",
      ring: "oklch(0.55 0.15 155)",
      "sidebar-primary": "oklch(0.55 0.15 155)",
    },
    dark: {
      primary: "oklch(0.65 0.15 155)",
      "primary-foreground": "oklch(0.15 0.02 170)",
      accent: "oklch(0.65 0.15 155)",
      ring: "oklch(0.65 0.15 155)",
      "sidebar-primary": "oklch(0.65 0.15 155)",
    },
  },
  {
    id: "ocean-blue",
    label: "Ocean Blue",
    hex: "#3B82F6",
    light: {
      primary: "oklch(0.55 0.18 255)",
      "primary-foreground": "oklch(0.98 0 0)",
      accent: "oklch(0.65 0.18 255)",
      ring: "oklch(0.55 0.18 255)",
      "sidebar-primary": "oklch(0.55 0.18 255)",
    },
    dark: {
      primary: "oklch(0.65 0.18 255)",
      "primary-foreground": "oklch(0.15 0.02 170)",
      accent: "oklch(0.65 0.18 255)",
      ring: "oklch(0.65 0.18 255)",
      "sidebar-primary": "oklch(0.65 0.18 255)",
    },
  },
  {
    id: "indigo",
    label: "Indigo",
    hex: "#6366F1",
    light: {
      primary: "oklch(0.50 0.20 270)",
      "primary-foreground": "oklch(0.98 0 0)",
      accent: "oklch(0.60 0.20 270)",
      ring: "oklch(0.50 0.20 270)",
      "sidebar-primary": "oklch(0.50 0.20 270)",
    },
    dark: {
      primary: "oklch(0.60 0.20 270)",
      "primary-foreground": "oklch(0.15 0.02 170)",
      accent: "oklch(0.60 0.20 270)",
      ring: "oklch(0.60 0.20 270)",
      "sidebar-primary": "oklch(0.60 0.20 270)",
    },
  },
  {
    id: "royal-purple",
    label: "Royal Purple",
    hex: "#7C3AED",
    light: {
      primary: "oklch(0.48 0.22 290)",
      "primary-foreground": "oklch(0.98 0 0)",
      accent: "oklch(0.58 0.22 290)",
      ring: "oklch(0.48 0.22 290)",
      "sidebar-primary": "oklch(0.48 0.22 290)",
    },
    dark: {
      primary: "oklch(0.58 0.22 290)",
      "primary-foreground": "oklch(0.15 0.02 170)",
      accent: "oklch(0.58 0.22 290)",
      ring: "oklch(0.58 0.22 290)",
      "sidebar-primary": "oklch(0.58 0.22 290)",
    },
  },
  {
    id: "warm-orange",
    label: "Warm Orange",
    hex: "#EA580C",
    light: {
      primary: "oklch(0.62 0.18 45)",
      "primary-foreground": "oklch(0.98 0 0)",
      accent: "oklch(0.72 0.18 45)",
      ring: "oklch(0.62 0.18 45)",
      "sidebar-primary": "oklch(0.62 0.18 45)",
    },
    dark: {
      primary: "oklch(0.70 0.18 45)",
      "primary-foreground": "oklch(0.15 0.02 170)",
      accent: "oklch(0.70 0.18 45)",
      ring: "oklch(0.70 0.18 45)",
      "sidebar-primary": "oklch(0.70 0.18 45)",
    },
  },
  {
    id: "rose",
    label: "Rose",
    hex: "#E11D48",
    light: {
      primary: "oklch(0.55 0.22 15)",
      "primary-foreground": "oklch(0.98 0 0)",
      accent: "oklch(0.65 0.22 15)",
      ring: "oklch(0.55 0.22 15)",
      "sidebar-primary": "oklch(0.55 0.22 15)",
    },
    dark: {
      primary: "oklch(0.65 0.22 15)",
      "primary-foreground": "oklch(0.15 0.02 170)",
      accent: "oklch(0.65 0.22 15)",
      ring: "oklch(0.65 0.22 15)",
      "sidebar-primary": "oklch(0.65 0.22 15)",
    },
  },
  {
    id: "slate",
    label: "Slate",
    hex: "#475569",
    light: {
      primary: "oklch(0.42 0.02 250)",
      "primary-foreground": "oklch(0.98 0 0)",
      accent: "oklch(0.52 0.02 250)",
      ring: "oklch(0.42 0.02 250)",
      "sidebar-primary": "oklch(0.42 0.02 250)",
    },
    dark: {
      primary: "oklch(0.55 0.02 250)",
      "primary-foreground": "oklch(0.15 0.02 170)",
      accent: "oklch(0.55 0.02 250)",
      ring: "oklch(0.55 0.02 250)",
      "sidebar-primary": "oklch(0.55 0.02 250)",
    },
  },
];

export const DEFAULT_ACCENT_COLOR_ID = "aara-green";
export const ACCENT_COLOR_STORAGE_KEY = "aara-accent-color";

export function getAccentColorById(id: string): AccentColor | undefined {
  return ACCENT_COLORS.find((c) => c.id === id);
}

export function getStoredAccentColorId(): string {
  if (typeof window === "undefined") return DEFAULT_ACCENT_COLOR_ID;
  const stored = localStorage.getItem(ACCENT_COLOR_STORAGE_KEY);
  if (stored && getAccentColorById(stored)) return stored;
  return DEFAULT_ACCENT_COLOR_ID;
}
