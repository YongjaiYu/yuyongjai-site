from __future__ import annotations

import csv
from collections.abc import Sequence
from dataclasses import dataclass
from datetime import date, datetime
from pathlib import Path
from statistics import median

from aes_site_constants import PRESIDENTS
from aes_site_types import CanonicalRow, CongressComparison


@dataclass(frozen=True)
class CongressNominateMedians:
    president_nominate: float | None
    house_median_nominate: float | None
    senate_median_nominate: float | None


def congress_comparisons(
    rows: list[CanonicalRow],
    jcs_path: Path,
) -> list[CongressComparison]:
    aes_scores: dict[int, list[float]] = {}
    years: dict[int, set[int]] = {}
    presidents: dict[int, set[str]] = {}
    for row in rows:
        congress = congress_from_date(parse_directive_date(row["Date"]))
        aes_scores.setdefault(congress, []).append(row["aes_score"])
        years.setdefault(congress, set()).add(row["Year"])
        presidents.setdefault(congress, set()).add(PRESIDENTS[row["President"]].short)

    jcs = jcs_medians_by_congress(jcs_path)
    comparisons: list[CongressComparison] = []
    for congress, scores in sorted(aes_scores.items()):
        medians = jcs.get(congress)
        if medians is None:
            continue
        congress_median = median_or_none(
            [
                medians.house_median_nominate,
                medians.senate_median_nominate,
            ],
        )
        president_mean = sum(scores) / len(scores)
        comparisons.append(
            {
                "congress": congress,
                "start_year": min(years[congress]),
                "end_year": max(years[congress]),
                "presidents": ", ".join(sorted(presidents[congress])),
                "n": len(scores),
                "president_aes_mean": rounded_metric(president_mean),
                "president_aes_median": rounded_metric(median(scores)),
                "president_nominate": medians.president_nominate,
                "house_median_nominate": medians.house_median_nominate,
                "senate_median_nominate": medians.senate_median_nominate,
                "congress_median_nominate": congress_median,
                "president_gap_vs_congress_median": diff_or_none(
                    president_mean,
                    congress_median,
                ),
            },
        )
    return comparisons


def jcs_medians_by_congress(path: Path) -> dict[int, CongressNominateMedians]:
    values: dict[int, dict[str, list[float]]] = {}
    for row in csv_rows(path):
        congress = int(row["congress"])
        bucket = values.setdefault(
            congress,
            {
                "president_nominate": [],
                "house_median_nominate": [],
                "senate_median_nominate": [],
            },
        )
        add_numeric(bucket["president_nominate"], row["president"])
        add_numeric(bucket["house_median_nominate"], row["house_median"])
        add_numeric(bucket["senate_median_nominate"], row["senate_median"])

    return {
        congress: CongressNominateMedians(
            president_nominate=median_or_none(bucket["president_nominate"]),
            house_median_nominate=median_or_none(bucket["house_median_nominate"]),
            senate_median_nominate=median_or_none(bucket["senate_median_nominate"]),
        )
        for congress, bucket in values.items()
    }


def csv_rows(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def parse_directive_date(value: str) -> date:
    return datetime.strptime(value, "%B %d, %Y").date()


def congress_from_date(value: date) -> int:
    if value >= date(1935, 1, 3):
        start_year = value.year if value.year % 2 == 1 else value.year - 1
        if value < date(start_year, 1, 3):
            start_year -= 2
        return ((start_year - 1935) // 2) + 74

    start_year = value.year if value.year % 2 == 1 else value.year - 1
    if value < date(start_year, 3, 4):
        start_year -= 2
    return ((start_year - 1789) // 2) + 1


def add_numeric(values: list[float], raw: str) -> None:
    if raw == "" or raw == "NA":
        return
    values.append(float(raw))


def median_or_none(values: Sequence[float | None]) -> float | None:
    cleaned = [value for value in values if value is not None]
    if not cleaned:
        return None
    return rounded_metric(median(cleaned))


def diff_or_none(left: float, right: float | None) -> float | None:
    if right is None:
        return None
    return rounded_metric(left - right)


def rounded_metric(score: float) -> float:
    return round(score, 6)
