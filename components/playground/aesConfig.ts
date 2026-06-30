import type {
  AnalyticsTab,
  ColorMode,
  FilterType,
  IdeologyFilter,
  IdeologyFlag,
} from "./aesTypes";

export type MajorParty = "Democratic" | "Republican";

export const MAJOR_PARTIES: readonly MajorParty[] = [
  "Democratic",
  "Republican",
];

export const PARTY_COLORS: Readonly<Record<MajorParty, string>> = {
  Democratic: "#3b82f6",
  Republican: "#ef4444",
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
  "congress",
  "nominate",
];
export const LINCOLN_START_YEAR = 1861;
export const TRUMAN_START_YEAR = 1945;

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
  const majorParty = majorPartyLabel(party);
  return majorParty === null ? "#64748b" : PARTY_COLORS[majorParty];
}

export function majorPartyLabel(party: string): MajorParty | null {
  switch (party) {
    case "Democratic":
    case "Democrat":
      return "Democratic";
    case "Republican":
      return "Republican";
    default:
      return null;
  }
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
