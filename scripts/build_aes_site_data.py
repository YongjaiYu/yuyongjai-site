# /// script
# requires-python = ">=3.9"
# dependencies = ["pyarrow"]
# ///
#
# --- How to run ---
# python3 scripts/build_aes_site_data.py
#
from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Final

import pyarrow.parquet as pq

from aes_site_analytics import analytics_json, is_ideological, rounded_score
from aes_site_constants import CATEGORIES, DIRECTIVE_TYPES, PRESIDENTS
from aes_site_types import (
    CanonicalRow,
    DetailDirective,
    FullDirective,
    Meta,
    PresidentJson,
    SummaryDirective,
)


SITE_ROOT: Final = Path(__file__).resolve().parents[1]
PAPER_MAIN: Final = SITE_ROOT.parent / "01. Paper 1" / "data" / "main"
PAPER_VALIDATION: Final = (
    SITE_ROOT.parent / "01. Paper 1" / "output" / "main" / "validation"
)
PUBLIC_DATA: Final = SITE_ROOT / "public" / "data"


def doc_number(doc_id: str) -> int:
    return int(doc_id.removeprefix("doc_"))


def json_name(short_name: str) -> str:
    cleaned = short_name.lower().replace(" ", "_").replace(".", "")
    return re.sub(r"[^a-z0-9_]+", "", cleaned)


def load_rows() -> list[CanonicalRow]:
    aes = pq.read_table(PAPER_MAIN / "directive_aes.parquet").to_pylist()
    cls = pq.read_table(
        PAPER_MAIN / "directives_classified.parquet",
        columns=["doc_id", "lee_gemini", "lee_gemini_ideo", "cayton_gemini_ideo"],
    ).to_pylist()
    classified = {row["doc_id"]: row for row in cls}

    rows: list[CanonicalRow] = []
    for row in aes:
        label = classified[row["doc_id"]]
        rows.append(
            {
                "doc_id": row["doc_id"],
                "aes_score": row["aes_score"],
                "directive_type": row["directive_type"],
                "President": row["President"],
                "Year": row["Year"],
                "Title": row["Title"],
                "lee_gemini": label["lee_gemini"],
                "lee_gemini_ideo": label["lee_gemini_ideo"],
                "cayton_gemini_ideo": label["cayton_gemini_ideo"],
            },
        )
    return sorted(rows, key=lambda item: doc_number(item["doc_id"]))


def presidents_for_rows(rows: list[CanonicalRow]) -> list[PresidentJson]:
    seen: set[str] = set()
    presidents: list[PresidentJson] = []
    for row in rows:
        name = row["President"]
        if name in seen:
            continue
        info = PRESIDENTS[name]
        presidents.append({"full": info.full, "short": info.short, "party": info.party})
        seen.add(name)
    return presidents


def base_meta(rows: list[CanonicalRow]) -> Meta:
    scores = [row["aes_score"] for row in rows]
    years = [row["Year"] for row in rows]
    return {
        "total": len(rows),
        "score_range": [rounded_score(min(scores)), rounded_score(max(scores))],
        "year_range": [min(years), max(years)],
        "categories": dict(CATEGORIES),
        "types": dict(DIRECTIVE_TYPES),
        "presidents": presidents_for_rows(rows),
        "source": "Paper 1 data/main canonical directive_aes + directives_classified",
        "source_updated_on": "2026-06-25",
        "strict_cutoff": "2026-01-20",
    }


def summary_row(row: CanonicalRow) -> SummaryDirective:
    info = PRESIDENTS[row["President"]]
    return {
        "id": doc_number(row["doc_id"]),
        "s": rounded_score(row["aes_score"]),
        "y": row["Year"],
        "p": info.short,
        "party": info.party,
        "dt": row["directive_type"],
        "c": row["lee_gemini"],
        "ib": is_ideological(row),
    }


def detail_row(row: CanonicalRow) -> DetailDirective:
    return {
        "id": doc_number(row["doc_id"]),
        "s": rounded_score(row["aes_score"]),
        "y": row["Year"],
        "t": row["Title"],
        "dt": row["directive_type"],
        "c": row["lee_gemini"],
        "ib": is_ideological(row),
    }


def full_row(row: CanonicalRow) -> FullDirective:
    return {
        "id": doc_number(row["doc_id"]),
        "s": rounded_score(row["aes_score"]),
        "y": row["Year"],
        "t": row["Title"],
        "dt": row["directive_type"],
        "c": row["lee_gemini"],
        "ib": is_ideological(row),
        "p": row["President"],
    }


def write_json(path: Path, payload) -> None:
    path.write_text(
        json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + "\n",
        encoding="utf-8",
    )


def main() -> None:
    rows = load_rows()
    meta = base_meta(rows)

    write_json(
        PUBLIC_DATA / "aes_summary.json",
        {"meta": meta, "data": [summary_row(row) for row in rows]},
    )
    write_json(
        PUBLIC_DATA / "aes_directives.json",
        {"meta": meta, "data": [full_row(row) for row in rows]},
    )
    write_json(
        PUBLIC_DATA / "aes_analytics.json",
        analytics_json(rows, meta, PAPER_VALIDATION),
    )

    for president in presidents_for_rows(rows):
        detail_rows = [
            detail_row(row)
            for row in rows
            if PRESIDENTS[row["President"]].short == president["short"]
        ]
        write_json(PUBLIC_DATA / f"aes_{json_name(president['short'])}.json", detail_rows)

    print(f"Wrote AES site data for {len(rows):,} directives.")


if __name__ == "__main__":
    main()
