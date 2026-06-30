from __future__ import annotations

from dataclasses import dataclass
from typing import TypedDict


@dataclass(frozen=True)
class PresidentInfo:
    full: str
    short: str
    party: str


class CanonicalRow(TypedDict):
    doc_id: str
    aes_score: float
    directive_type: str
    President: str
    Date: str
    Year: int
    Title: str
    lee_gemini: str
    lee_gemini_ideo: int
    cayton_gemini_ideo: int


class SummaryDirective(TypedDict):
    id: int
    s: float
    y: int
    p: str
    party: str
    dt: str
    c: str
    ib: int


class DetailDirective(TypedDict):
    id: int
    s: float
    y: int
    t: str
    dt: str
    c: str
    ib: int


class FullDirective(DetailDirective):
    p: str


class PresidentJson(TypedDict):
    full: str
    short: str
    party: str


class Meta(TypedDict):
    total: int
    score_range: list[float]
    year_range: list[int]
    categories: dict[str, str]
    types: dict[str, str]
    presidents: list[PresidentJson]
    source: str
    source_updated_on: str
    strict_cutoff: str


class PartyYearBin(TypedDict):
    y: int
    party: str
    b: float
    n: int
    ideological: int
    non_ideological: int


class PartyYearStat(TypedDict):
    y: int
    party: str
    n: int
    mean: float
    ideological: int
    non_ideological: int


class PresidentMean(TypedDict):
    president: str
    short: str
    party: str
    start_year: int
    end_year: int
    n: int
    n_ideological: int
    n_non_ideological: int
    mean_all: float
    mean_ideological: float | None
    mean_non_ideological: float | None
    difference_ideological_minus_non: float | None


class CongressComparison(TypedDict):
    congress: int
    start_year: int
    end_year: int
    presidents: str
    n: int
    president_aes_mean: float
    president_aes_median: float
    president_nominate: float | None
    house_median_nominate: float | None
    senate_median_nominate: float | None
    congress_median_nominate: float | None
    president_gap_vs_congress_median: float | None


class PartyGap(TypedDict):
    sample: str
    n_D: int
    n_R: int
    mean_D: float
    mean_R: float
    diff_R_minus_D: float
    cohens_d_R_minus_D: float
    p_value: float


class NominatePoint(TypedDict):
    president: str
    short: str
    party: str
    sample: str
    n: int
    mean_aes: float
    nominate: float
    min_year: int
    max_year: int


class NominateMetric(TypedDict):
    sample: str
    n_presidents: int
    n_directives: int
    pearson_r: float
    pearson_p: float
    spearman_rho: float
    spearman_p: float
    weighted_slope_by_directives: float
    weighted_intercept_by_directives: float


class AnalyticsMeta(TypedDict):
    score_bin_width: float
    score_range: list[float]
    year_range: list[int]
    source: str
    source_updated_on: str
    strict_cutoff: str


class AnalyticsJson(TypedDict):
    meta: AnalyticsMeta
    party_year_bins: list[PartyYearBin]
    party_year_stats: list[PartyYearStat]
    president_means: list[PresidentMean]
    congress_comparisons: list[CongressComparison]
    party_gaps: list[PartyGap]
    nominate_points: list[NominatePoint]
    nominate_metrics: list[NominateMetric]


@dataclass
class ScoreAccumulator:
    n: int = 0
    score_sum: float = 0.0
    ideological: int = 0
    non_ideological: int = 0
    start_year: int | None = None
    end_year: int | None = None

    def add(self, score: float, year: int, ideological: int) -> None:
        self.n += 1
        self.score_sum += score
        self.ideological += ideological
        self.non_ideological += int(ideological == 0)
        self.start_year = year if self.start_year is None else min(self.start_year, year)
        self.end_year = year if self.end_year is None else max(self.end_year, year)

    def mean(self) -> float:
        return self.score_sum / self.n
