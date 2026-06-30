from __future__ import annotations

import csv
import math
from dataclasses import dataclass
from pathlib import Path

from aes_site_constants import PRESIDENTS, SCORE_BIN_WIDTH
from aes_site_congress import congress_comparisons
from aes_site_types import (
    AnalyticsJson,
    CanonicalRow,
    Meta,
    NominateMetric,
    NominatePoint,
    PartyGap,
    PartyYearBin,
    PartyYearStat,
    PresidentMean,
    ScoreAccumulator,
)


@dataclass(frozen=True)
class AnalyticsSources:
    validation_root: Path
    external_root: Path


def rounded_score(score: float) -> float:
    return round(score, 3)


def rounded_metric(score: float) -> float:
    return round(score, 6)


def is_ideological(row: CanonicalRow) -> int:
    return int(row["lee_gemini_ideo"] == 1 or row["cayton_gemini_ideo"] == 1)


def analytics_json(
    rows: list[CanonicalRow],
    meta: Meta,
    sources: AnalyticsSources,
) -> AnalyticsJson:
    return {
        "meta": {
            "score_bin_width": SCORE_BIN_WIDTH,
            "score_range": meta["score_range"],
            "year_range": meta["year_range"],
            "source": "Paper 1 canonical directive rows plus validation CSV outputs",
            "source_updated_on": meta["source_updated_on"],
            "strict_cutoff": meta["strict_cutoff"],
        },
        "party_year_bins": party_year_bins(rows),
        "party_year_stats": party_year_stats(rows),
        "president_means": president_means(rows),
        "congress_comparisons": congress_comparisons(
            rows,
            sources.external_root / "jcs_medians_2024.csv",
        ),
        "party_gaps": party_gaps(sources.validation_root),
        "nominate_points": nominate_points(sources.validation_root),
        "nominate_metrics": nominate_metrics(sources.validation_root),
    }


def party_year_bins(rows: list[CanonicalRow]) -> list[PartyYearBin]:
    bins: dict[tuple[int, str, float], ScoreAccumulator] = {}
    for row in rows:
        party = PRESIDENTS[row["President"]].party
        key = (row["Year"], party, score_bin(row["aes_score"]))
        accumulator = bins.setdefault(key, ScoreAccumulator())
        accumulator.add(row["aes_score"], row["Year"], is_ideological(row))

    return [
        {
            "y": year,
            "party": party,
            "b": score,
            "n": accumulator.n,
            "ideological": accumulator.ideological,
            "non_ideological": accumulator.non_ideological,
        }
        for (year, party, score), accumulator in sorted(bins.items())
    ]


def party_year_stats(rows: list[CanonicalRow]) -> list[PartyYearStat]:
    stats: dict[tuple[int, str], ScoreAccumulator] = {}
    for row in rows:
        party = PRESIDENTS[row["President"]].party
        key = (row["Year"], party)
        accumulator = stats.setdefault(key, ScoreAccumulator())
        accumulator.add(row["aes_score"], row["Year"], is_ideological(row))

    return [
        {
            "y": year,
            "party": party,
            "n": accumulator.n,
            "mean": rounded_metric(accumulator.mean()),
            "ideological": accumulator.ideological,
            "non_ideological": accumulator.non_ideological,
        }
        for (year, party), accumulator in sorted(stats.items())
    ]


def president_means(rows: list[CanonicalRow]) -> list[PresidentMean]:
    all_scores: dict[str, ScoreAccumulator] = {}
    ideological_scores: dict[str, ScoreAccumulator] = {}
    non_ideological_scores: dict[str, ScoreAccumulator] = {}

    for row in rows:
        president = row["President"]
        ideological = is_ideological(row)
        all_scores.setdefault(president, ScoreAccumulator()).add(
            row["aes_score"],
            row["Year"],
            ideological,
        )
        target = ideological_scores if ideological == 1 else non_ideological_scores
        target.setdefault(president, ScoreAccumulator()).add(
            row["aes_score"],
            row["Year"],
            ideological,
        )

    means: list[PresidentMean] = []
    for president, accumulator in all_scores.items():
        info = PRESIDENTS[president]
        ideological_mean = mean_or_none(
            ideological_scores.get(president, ScoreAccumulator()),
        )
        non_ideological_mean = mean_or_none(
            non_ideological_scores.get(president, ScoreAccumulator()),
        )
        difference = (
            None
            if ideological_mean is None or non_ideological_mean is None
            else rounded_metric(ideological_mean - non_ideological_mean)
        )
        means.append(
            {
                "president": info.full,
                "short": info.short,
                "party": info.party,
                "start_year": accumulator.start_year or 0,
                "end_year": accumulator.end_year or 0,
                "n": accumulator.n,
                "mean_all": rounded_metric(accumulator.mean()),
                "mean_ideological": ideological_mean,
                "mean_non_ideological": non_ideological_mean,
                "difference_ideological_minus_non": difference,
            },
        )
    return sorted(means, key=lambda item: item["mean_all"])


def party_gaps(validation_root: Path) -> list[PartyGap]:
    return [
        {
            "sample": row["sample"],
            "n_D": int(row["n_D"]),
            "n_R": int(row["n_R"]),
            "mean_D": rounded_metric(float(row["mean_D"])),
            "mean_R": rounded_metric(float(row["mean_R"])),
            "diff_R_minus_D": rounded_metric(float(row["diff_R_minus_D"])),
            "cohens_d_R_minus_D": rounded_metric(float(row["cohens_d_R_minus_D"])),
            "p_value": float(row["p_value"]),
        }
        for row in csv_rows(validation_root / "aes_party_mean_difference.csv")
    ]


def nominate_points(validation_root: Path) -> list[NominatePoint]:
    return [
        {
            "president": row["president_base"],
            "short": short_name_for_base(row["president_base"]),
            "party": row["party"],
            "sample": row["sample"],
            "n": int(row["N"]),
            "mean_aes": rounded_metric(float(row["mean_aes"])),
            "nominate": rounded_metric(float(row["pres_nominate_dim1"])),
            "min_year": int(row["min_year"]),
            "max_year": int(row["max_year"]),
        }
        for row in csv_rows(
            validation_root / "aes_presidential_nominate_scatter_data_truman_on.csv",
        )
    ]


def nominate_metrics(validation_root: Path) -> list[NominateMetric]:
    return [
        {
            "sample": row["sample"],
            "n_presidents": int(row["n_presidents"]),
            "n_directives": int(row["n_directives"]),
            "pearson_r": rounded_metric(float(row["pearson_r"])),
            "pearson_p": float(row["pearson_p"]),
            "spearman_rho": rounded_metric(float(row["spearman_rho"])),
            "spearman_p": float(row["spearman_p"]),
            "weighted_slope_by_directives": rounded_metric(
                float(row["weighted_slope_by_directives"]),
            ),
            "weighted_intercept_by_directives": rounded_metric(
                float(row["weighted_intercept_by_directives"]),
            ),
        }
        for row in csv_rows(
            validation_root
            / "aes_presidential_nominate_validation_metrics_truman_on.csv",
        )
    ]


def score_bin(score: float) -> float:
    lower = math.floor(score / SCORE_BIN_WIDTH) * SCORE_BIN_WIDTH
    return rounded_score(lower + SCORE_BIN_WIDTH / 2)


def csv_rows(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def short_name_for_base(name: str) -> str:
    if name in PRESIDENTS:
        return PRESIDENTS[name].short
    if name == "Donald J. Trump":
        return "Trump"
    return name


def mean_or_none(accumulator: ScoreAccumulator) -> float | None:
    if accumulator.n == 0:
        return None
    return rounded_metric(accumulator.mean())
