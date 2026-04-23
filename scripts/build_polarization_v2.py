"""Build polarization_v2.json + term_trajectories.json from Hein + parquet corpus.

Coverage: 79th-119th Congress (1945-2026).
Sources:
  79-96   hein-bound  (bound edition, OCR-based)
  97-107  hein-daily  (daily edition)
  108-119 speeches_all.parquet (govinfo CREC, rebuilt)

Splits: main (all), house, senate.
Parties: D and R only.
Tokenization: lowercase alpha, len>=3, NLTK-like English stopwords removed.
Jaccard: terms appearing >=5 times per party.
Partisan log-odds top-20: terms total>=200 and each-party>=20.
Term trajectories: top 3000 global terms across corpus, per-congress [D,R] counts.
"""
from __future__ import annotations
import json
import math
import pickle
import re
import sys
import time
from collections import Counter
from pathlib import Path

import pandas as pd

SEED = 1017
BASE = Path("/Users/jay/desktop/workingspace/13. topic_mixture")
BOUND_DIR = BASE / "hein-bound"
DAILY_DIR = BASE / "hein-daily"
PARQUET = BASE / "data/corpus/speeches_all.parquet"

SITE_DIR = Path("/Users/jay/desktop/workingspace/00. site")
OUT_DIR = SITE_DIR / "public/data"
CACHE_DIR = SITE_DIR / "scripts/cache"
CACHE_DIR.mkdir(parents=True, exist_ok=True)

CONGRESSES = list(range(79, 120))  # 79..119 inclusive

CONGRESS_START_YEAR = {c: 1945 + (c - 79) * 2 for c in CONGRESSES}

STOPWORDS = set("""
a about above after again against all am an and any are as at be because been before being below between both but by
could did do does doing down during each few for from further had has have having he her here hers herself him himself
his how i if in into is it its itself just me more most my myself no nor not now of off on once only or other ought
our ours ourselves out over own same she should so some such than that the their theirs them themselves then there
these they this those through to too under until up very was we were what when where which while who whom why will
with would you your yours yourself yourselves aint arent cant couldnt didnt doesnt dont hadnt hasnt havent isnt lets
shouldnt thats theres theyre wasnt werent whats wont wouldnt youd youll youre youve let ms mr mrs dr
""".split())

PROCEDURAL = set("""
yield yielded yielding gentleman gentlelady gentlewoman gentlemen speaker chairman chair madam chairwoman
senator senators congressman congresswoman colleague colleagues distinguished honorable representative
will would shall may might must can could should
one two three four five six seven eight nine ten
upon therefore however thus hence whereas whereby thereof herein hereby hereto hereafter
also even though although although because whether either neither
said say says saying see seen seeing make made making
go going gone went come came coming
time times today tonight yesterday tomorrow year years day days week weeks month months
new old first last second next
many much very really quite rather
think thought know known knew want wanted need needed get got gets
bill bills act acts law laws amendment amendments
house senate congress committee committees subcommittee
member members floor record president vice
states state united america american
people country nation national federal government
vote voted voting votes
issue issues matter question questions answer
thank thanks
""".split())

STOP = STOPWORDS | PROCEDURAL

TOKEN_RE = re.compile(r"[a-z]+")


def tokenize(text: str) -> list[str]:
    if not isinstance(text, str):
        return []
    return [t for t in TOKEN_RE.findall(text.lower()) if len(t) >= 3 and t not in STOP]


def load_hein_congress(congress: int, source: str) -> pd.DataFrame:
    """Return DataFrame with columns speech, party, chamber. D/R only."""
    dir_ = DAILY_DIR if source == "daily" else BOUND_DIR
    sfile = dir_ / f"speeches_{congress:03d}.txt"
    mfile = dir_ / f"{congress:03d}_SpeakerMap.txt"
    speeches = pd.read_csv(
        sfile,
        sep="|",
        encoding="latin-1",
        on_bad_lines="skip",
        engine="python",
        quoting=3,
        dtype={"speech_id": "int64", "speech": "string"},
    )
    smap = pd.read_csv(
        mfile,
        sep="|",
        encoding="latin-1",
        on_bad_lines="skip",
        engine="python",
        quoting=3,
    )
    smap = smap[["speech_id", "party", "chamber"]]
    merged = speeches.merge(smap, on="speech_id", how="inner")
    merged = merged[merged["party"].isin(["D", "R"])]
    merged = merged[merged["chamber"].isin(["H", "S"])]
    return merged[["speech", "party", "chamber"]].reset_index(drop=True)


def load_parquet_congress(congress: int) -> pd.DataFrame:
    df = pd.read_parquet(
        PARQUET,
        columns=["congress", "chamber", "party", "speech"],
        filters=[("congress", "==", congress)],
    )
    df = df[df["party"].isin(["D", "R"])]
    df = df[df["chamber"].isin(["H", "S"])]
    return df[["speech", "party", "chamber"]].reset_index(drop=True)


def source_for(congress: int) -> str:
    if congress <= 96:
        return "bound"
    if congress <= 107:
        return "daily"
    return "parquet"


def load_congress(congress: int) -> pd.DataFrame:
    s = source_for(congress)
    if s == "parquet":
        return load_parquet_congress(congress)
    return load_hein_congress(congress, source=s)


def process_congress(congress: int) -> dict:
    """Build counters for main/house/senate x D/R, plus n_speeches."""
    print(f"  loading congress {congress} ({source_for(congress)})...", flush=True)
    t0 = time.time()
    df = load_congress(congress)
    print(f"    {len(df):,} speeches, load took {time.time()-t0:.1f}s", flush=True)

    counters = {
        "main": {"D": Counter(), "R": Counter()},
        "house": {"D": Counter(), "R": Counter()},
        "senate": {"D": Counter(), "R": Counter()},
    }
    n_speeches = {
        "main": {"D": 0, "R": 0},
        "house": {"D": 0, "R": 0},
        "senate": {"D": 0, "R": 0},
    }

    t0 = time.time()
    for row in df.itertuples(index=False):
        toks = tokenize(row.speech)
        if not toks:
            continue
        tc = Counter(toks)
        counters["main"][row.party].update(tc)
        n_speeches["main"][row.party] += 1
        split = "house" if row.chamber == "H" else "senate"
        counters[split][row.party].update(tc)
        n_speeches[split][row.party] += 1
    print(f"    tokenized in {time.time()-t0:.1f}s", flush=True)

    return {"counters": counters, "n_speeches": n_speeches, "congress": congress}


def jaccard(a_counter: Counter, b_counter: Counter, min_count: int = 5) -> float:
    a = {w for w, c in a_counter.items() if c >= min_count}
    b = {w for w, c in b_counter.items() if c >= min_count}
    if not a and not b:
        return 0.0
    inter = len(a & b)
    union = len(a | b)
    return round(inter / union, 4) if union else 0.0


def vocab_size(counter: Counter, min_count: int = 5) -> int:
    return sum(1 for c in counter.values() if c >= min_count)


def log_odds(d_count: int, r_count: int, d_tot: int, r_tot: int, alpha: float = 0.5) -> float:
    d = d_count + alpha
    r = r_count + alpha
    dn = d_tot - d_count + alpha
    rn = r_tot - r_count + alpha
    return math.log(d / dn) - math.log(r / rn)


def top_partisan_terms(
    d_counter: Counter, r_counter: Counter, top_k: int = 20,
    min_total: int = 200, min_each: int = 20,
) -> tuple[list[dict], list[dict]]:
    d_tot = sum(d_counter.values())
    r_tot = sum(r_counter.values())
    scores = []
    all_terms = set(d_counter) | set(r_counter)
    for term in all_terms:
        dc = d_counter.get(term, 0)
        rc = r_counter.get(term, 0)
        if dc + rc < min_total:
            continue
        if dc < min_each or rc < min_each:
            continue
        lo = log_odds(dc, rc, d_tot, r_tot)
        scores.append((term, lo, dc, rc))
    scores_d = sorted(scores, key=lambda x: -x[1])[:top_k]
    scores_r = sorted(scores, key=lambda x: x[1])[:top_k]
    fmt = lambda s: [{"term": t, "lo": round(lo, 3), "d": dc, "r": rc} for t, lo, dc, rc in s]
    return fmt(scores_d), fmt(scores_r)


def split_stats(counters, n_speeches, split: str) -> dict:
    d = counters[split]["D"]
    r = counters[split]["R"]
    top_d, top_r = top_partisan_terms(d, r)
    return {
        "n_d": n_speeches[split]["D"],
        "n_r": n_speeches[split]["R"],
        "vocab_d": vocab_size(d),
        "vocab_r": vocab_size(r),
        "jaccard": jaccard(d, r),
        "tokens_d": sum(d.values()),
        "tokens_r": sum(r.values()),
        "top_d": top_d,
        "top_r": top_r,
    }


def main():
    print("Processing congresses (caching per-congress counters)...", flush=True)
    per_congress = {}
    for c in CONGRESSES:
        cache = CACHE_DIR / f"counts_{c:03d}.pkl"
        if cache.exists():
            print(f"  [cached] congress {c}", flush=True)
            with cache.open("rb") as f:
                per_congress[c] = pickle.load(f)
            continue
        try:
            result = process_congress(c)
        except FileNotFoundError as e:
            print(f"  [skip] congress {c}: {e}", flush=True)
            continue
        except Exception as e:
            print(f"  [error] congress {c}: {e}", flush=True)
            continue
        with cache.open("wb") as f:
            pickle.dump(result, f)
        per_congress[c] = result

    print("\nBuilding polarization_v2.json...", flush=True)
    pol = {
        "meta": {
            "generated": time.strftime("%Y-%m-%d"),
            "congresses": sorted(per_congress.keys()),
            "parties": ["D", "R"],
            "sources": {
                "79-96": "hein-bound",
                "97-107": "hein-daily",
                "108-119": "speeches_all.parquet",
            },
            "notes": "Jaccard: terms>=5/party. Partisan: total>=200, each>=20, ranked by log-odds.",
        },
        "congresses": {},
    }
    for c, data in sorted(per_congress.items()):
        counters = data["counters"]
        n_speeches = data["n_speeches"]
        pol["congresses"][str(c)] = {
            "congress": c,
            "year": CONGRESS_START_YEAR[c],
            "source": source_for(c),
            "main": split_stats(counters, n_speeches, "main"),
            "house": split_stats(counters, n_speeches, "house"),
            "senate": split_stats(counters, n_speeches, "senate"),
        }

    (OUT_DIR / "polarization_v2.json").write_text(json.dumps(pol, separators=(",", ":")))
    print(f"  wrote {OUT_DIR / 'polarization_v2.json'}", flush=True)

    print("\nBuilding term_trajectories.json (top 5000 global + partisan-top union)...", flush=True)
    global_counter = Counter()
    for data in per_congress.values():
        global_counter.update(data["counters"]["main"]["D"])
        global_counter.update(data["counters"]["main"]["R"])
    top_by_freq = {t for t, _ in global_counter.most_common(5000)}
    # Union with any term that ever made the partisan top list in any congress/split
    partisan_terms: set[str] = set()
    for c_str, cdata in pol["congresses"].items():
        for split in ("main", "house", "senate"):
            for t in cdata[split]["top_d"] + cdata[split]["top_r"]:
                partisan_terms.add(t["term"])
    top_terms = sorted(top_by_freq | partisan_terms)
    min_in_top_freq = min(global_counter[t] for t in top_by_freq)
    print(
        f"  top-5000 by freq min count: {min_in_top_freq}; "
        f"+{len(partisan_terms - top_by_freq)} partisan-only adds; "
        f"final n_terms: {len(top_terms)}",
        flush=True,
    )

    terms_out = {}
    totals_out = {}
    for c, data in sorted(per_congress.items()):
        d = data["counters"]["main"]["D"]
        r = data["counters"]["main"]["R"]
        totals_out[str(c)] = {
            "d": sum(d.values()),
            "r": sum(r.values()),
            "year": CONGRESS_START_YEAR[c],
        }

    for term in top_terms:
        per_c = {}
        for c, data in sorted(per_congress.items()):
            dc = data["counters"]["main"]["D"].get(term, 0)
            rc = data["counters"]["main"]["R"].get(term, 0)
            if dc or rc:
                per_c[str(c)] = [dc, rc]
        terms_out[term] = per_c

    traj = {
        "meta": {
            "generated": time.strftime("%Y-%m-%d"),
            "n_terms": len(terms_out),
            "congresses": sorted(per_congress.keys()),
        },
        "totals": totals_out,
        "terms": terms_out,
    }
    (OUT_DIR / "term_trajectories.json").write_text(json.dumps(traj, separators=(",", ":")))
    print(f"  wrote {OUT_DIR / 'term_trajectories.json'}", flush=True)

    print("\nDone.", flush=True)


if __name__ == "__main__":
    main()
