import type {
  AnalyticsTab,
  ColorMode,
  FilterType,
  IdeologyFilter,
  IdeologyFlag,
} from "./aesTypes";

export const PARTY_COLORS: Readonly<Record<string, string>> = {
  Democratic: "#3b82f6",
  Democrat: "#3b82f6",
  Republican: "#ef4444",
  "Democratic-Republican": "#14b8a6",
  Federalist: "#a855f7",
  Whig: "#f59e0b",
  "National Union": "#64748b",
  Independent: "#94a3b8",
};

export const IDEOLOGY_COLORS: Readonly<Record<IdeologyFilter, string>> = {
  all: "#94a3b8",
  ideological: "#22d3ee",
  non_ideological: "#a78bfa",
};

export const TYPE_COLORS: Readonly<Record<FilterType, string>> = {
  all: "#94a3b8",
  eo: "#f59e0b",
  proclamation: "#8b5cf6",
  memorandum: "#10b981",
};

export const COLOR_MODES: readonly ColorMode[] = ["party", "ideology", "type"];
export const ANALYTICS_TABS: readonly AnalyticsTab[] = [
  "party",
  "presidents",
  "nominate",
];

export function parseFilterType(value: string): FilterType {
  switch (value) {
    case "all":
    case "eo":
    case "proclamation":
    case "memorandum":
      return value;
    default:
      return "all";
  }
}

export function parseIdeologyFilter(value: string): IdeologyFilter {
  switch (value) {
    case "all":
    case "ideological":
    case "non_ideological":
      return value;
    default:
      return "all";
  }
}

export function ideologyLabel(value: IdeologyFlag): string {
  return value === 1 ? "Ideological" : "Non-ideological";
}

export function ideologyColor(value: IdeologyFlag): string {
  return value === 1
    ? IDEOLOGY_COLORS.ideological
    : IDEOLOGY_COLORS.non_ideological;
}

export function partyColor(party: string): string {
  return PARTY_COLORS[party] ?? "#6b7280";
}

export function typeColor(value: string): string {
  return TYPE_COLORS[parseFilterType(value)];
}

export function formatScore(value: number): string {
  return `${value > 0 ? "+" : ""}${value.toFixed(3)}`;
}

export function assertNever(value: never): never {
  throw new Error(`Unhandled AES variant: ${String(value)}`);
}
