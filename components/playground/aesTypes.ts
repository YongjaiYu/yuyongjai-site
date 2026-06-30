export type IdeologyFlag = 0 | 1;

export type Directive = {
  readonly id: number;
  readonly s: number;
  readonly y: number;
  readonly p: string;
  readonly party: string;
  readonly dt: string;
  readonly c: string | null;
  readonly ib: IdeologyFlag;
};

export type DetailDirective = {
  readonly id: number;
  readonly s: number;
  readonly y: number;
  readonly t: string;
  readonly dt: string;
  readonly c: string | null;
  readonly ib: IdeologyFlag;
};

export type PresidentMeta = {
  readonly full: string;
  readonly short: string;
  readonly party: string;
};

export type Meta = {
  readonly total: number;
  readonly score_range: readonly [number, number];
  readonly year_range: readonly [number, number];
  readonly categories: Readonly<Record<string, string>>;
  readonly types: Readonly<Record<string, string>>;
  readonly presidents: readonly PresidentMeta[];
};

export type AESData = {
  readonly meta: Meta;
  readonly data: readonly Directive[];
};

export type ColorMode = "party" | "ideology" | "type";
export type FilterType = "all" | "eo" | "proclamation" | "memorandum";
export type IdeologyFilter = "all" | "ideological" | "non_ideological";

export type PartyYearBin = {
  readonly y: number;
  readonly party: string;
  readonly b: number;
  readonly n: number;
  readonly ideological: number;
  readonly non_ideological: number;
};

export type PartyYearStat = {
  readonly y: number;
  readonly party: string;
  readonly n: number;
  readonly mean: number;
  readonly ideological: number;
  readonly non_ideological: number;
};

export type PresidentMean = {
  readonly president: string;
  readonly short: string;
  readonly party: string;
  readonly start_year: number;
  readonly end_year: number;
  readonly n: number;
  readonly mean_all: number;
  readonly mean_ideological: number | null;
  readonly mean_non_ideological: number | null;
  readonly difference_ideological_minus_non: number | null;
};

export type CongressComparison = {
  readonly congress: number;
  readonly start_year: number;
  readonly end_year: number;
  readonly presidents: string;
  readonly n: number;
  readonly president_aes_mean: number;
  readonly president_aes_median: number;
  readonly president_nominate: number | null;
  readonly house_median_nominate: number | null;
  readonly senate_median_nominate: number | null;
  readonly congress_median_nominate: number | null;
  readonly president_gap_vs_congress_median: number | null;
};

export type PartyGap = {
  readonly sample: string;
  readonly n_D: number;
  readonly n_R: number;
  readonly mean_D: number;
  readonly mean_R: number;
  readonly diff_R_minus_D: number;
  readonly cohens_d_R_minus_D: number;
  readonly p_value: number;
};

export type NominatePoint = {
  readonly president: string;
  readonly short: string;
  readonly party: string;
  readonly sample: string;
  readonly n: number;
  readonly mean_aes: number;
  readonly nominate: number;
  readonly min_year: number;
  readonly max_year: number;
};

export type NominateMetric = {
  readonly sample: string;
  readonly n_presidents: number;
  readonly n_directives: number;
  readonly pearson_r: number;
  readonly pearson_p: number;
  readonly spearman_rho: number;
  readonly spearman_p: number;
  readonly weighted_slope_by_directives: number;
  readonly weighted_intercept_by_directives: number;
};

export type AESAnalyticsData = {
  readonly meta: {
    readonly score_bin_width: number;
    readonly score_range: readonly [number, number];
    readonly year_range: readonly [number, number];
    readonly source: string;
    readonly source_updated_on: string;
    readonly strict_cutoff: string;
  };
  readonly party_year_bins: readonly PartyYearBin[];
  readonly party_year_stats: readonly PartyYearStat[];
  readonly president_means: readonly PresidentMean[];
  readonly congress_comparisons: readonly CongressComparison[];
  readonly party_gaps: readonly PartyGap[];
  readonly nominate_points: readonly NominatePoint[];
  readonly nominate_metrics: readonly NominateMetric[];
};

export type AnalyticsTab = "party" | "presidents" | "congress" | "nominate";
