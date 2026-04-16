"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

interface TermScore {
  term: string;
  lo: number;
  d: number;
  r: number;
}

interface CongressData {
  congress: number;
  year: number;
  n_d: number;
  n_r: number;
  vocab_d: number;
  vocab_r: number;
  jaccard: number;
  top_d: TermScore[];
  top_r: TermScore[];
}

type PolarData = Record<string, CongressData>;

export default function TextPolarization() {
  const [data, setData] = useState<PolarData | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/polarization.json")
      .then((r) => r.json())
      .then((d: PolarData) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  const congresses = useMemo(() => {
    if (!data) return [];
    return Object.values(data).sort((a, b) => a.congress - b.congress);
  }, [data]);

  const current = useMemo(() => {
    if (!data || !selected) return null;
    return data[selected];
  }, [data, selected]);

  const jaccardRange = useMemo(() => {
    if (!congresses.length) return { min: 0, max: 1 };
    const vals = congresses.map((c) => c.jaccard);
    return { min: Math.min(...vals), max: Math.max(...vals) };
  }, [congresses]);

  const handleBarClick = useCallback((congress: string) => {
    setSelected((prev) => (prev === congress ? null : congress));
  }, []);

  if (loading || !data) {
    return (
      <div className="flex h-96 items-center justify-center text-slate-500">
        Loading polarization data…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-slate-800 p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Speeches
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-100">
            {congresses
              .reduce((s, c) => s + c.n_d + c.n_r, 0)
              .toLocaleString()}
          </p>
          <p className="text-xs text-slate-500">floor speeches</p>
        </div>
        <div className="rounded-lg border border-slate-800 p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Period
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-100">
            103rd–109th
          </p>
          <p className="text-xs text-slate-500">Congress (1993–2006)</p>
        </div>
        <div className="rounded-lg border border-slate-800 p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Avg Jaccard
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-100">
            {(
              congresses.reduce((s, c) => s + c.jaccard, 0) /
              congresses.length
            ).toFixed(3)}
          </p>
          <p className="text-xs text-slate-500">vocabulary overlap</p>
        </div>
        <div className="rounded-lg border border-slate-800 p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Trend
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-100">
            {congresses[congresses.length - 1].jaccard <
            congresses[0].jaccard
              ? "Diverging"
              : "Converging"}
          </p>
          <p className="text-xs text-slate-500">
            J: {congresses[0].jaccard} → {congresses[congresses.length - 1].jaccard}
          </p>
        </div>
      </div>

      {/* Jaccard over time */}
      <div className="rounded-lg border border-slate-800 p-6">
        <h3 className="mb-1 text-sm font-medium text-slate-200">
          Vocabulary Overlap Over Time
        </h3>
        <p className="mb-4 font-sans text-xs text-slate-500">
          Jaccard similarity between Democratic and Republican vocabularies.
          Lower = more distinct language. Click a bar for details.
        </p>
        <div className="flex items-end gap-3" style={{ height: 180 }}>
          {congresses.map((c) => {
            const range = jaccardRange.max - jaccardRange.min;
            const normalized = range > 0
              ? ((c.jaccard - jaccardRange.min) / range) * 70 + 30
              : 50;
            const isSelected = selected === String(c.congress);
            return (
              <div
                key={c.congress}
                className="group relative flex-1 cursor-pointer"
                style={{ height: "100%" }}
                onClick={() => handleBarClick(String(c.congress))}
              >
                <div
                  className={`absolute bottom-0 w-full rounded-t-sm transition-colors ${
                    isSelected
                      ? "bg-amber-400/70"
                      : "bg-slate-500/40 hover:bg-slate-500/60"
                  }`}
                  style={{ height: `${normalized}%` }}
                />
                <div className="pointer-events-none absolute -top-10 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-[10px] text-slate-200 group-hover:block">
                  {c.congress}th ({c.year}): J={c.jaccard}
                </div>
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-slate-600">
                  {c.year}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex items-center justify-center gap-4 text-[10px] text-slate-600">
          <span>↑ Higher = more shared vocabulary</span>
          <span>↓ Lower = more distinct language</span>
        </div>
      </div>

      {/* Selected congress detail */}
      {current && (
        <div className="rounded-lg border border-slate-800 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-200">
              {current.congress}th Congress ({current.year}–{current.year + 1})
            </h3>
            <button
              onClick={() => setSelected(null)}
              className="text-xs text-slate-500 hover:text-slate-300"
            >
              Close
            </button>
          </div>
          <div className="mb-6 grid grid-cols-3 gap-4 text-center font-sans text-xs">
            <div>
              <p className="text-blue-400">{current.n_d.toLocaleString()} D speeches</p>
              <p className="text-slate-500">{current.vocab_d.toLocaleString()} unique terms</p>
            </div>
            <div>
              <p className="text-amber-400">J = {current.jaccard}</p>
              <p className="text-slate-500">vocabulary overlap</p>
            </div>
            <div>
              <p className="text-red-400">{current.n_r.toLocaleString()} R speeches</p>
              <p className="text-slate-500">{current.vocab_r.toLocaleString()} unique terms</p>
            </div>
          </div>

          {/* Partisan terms */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h4 className="mb-2 text-xs font-medium text-blue-400">
                Distinctly Democratic
              </h4>
              <div className="space-y-1">
                {current.top_d.map((t) => {
                  const maxLo = Math.max(
                    ...current.top_d.map((x) => Math.abs(x.lo))
                  );
                  const w = (Math.abs(t.lo) / maxLo) * 100;
                  return (
                    <div key={t.term} className="group flex items-center gap-2">
                      <span className="w-24 flex-shrink-0 truncate text-right font-sans text-[11px] text-slate-300">
                        {t.term}
                      </span>
                      <div className="relative h-3.5 flex-1">
                        <div
                          className="h-full rounded-sm bg-blue-500/30"
                          style={{ width: `${w}%` }}
                        />
                      </div>
                      <span className="w-16 flex-shrink-0 font-sans text-[10px] text-slate-600">
                        D:{t.d} R:{t.r}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <h4 className="mb-2 text-xs font-medium text-red-400">
                Distinctly Republican
              </h4>
              <div className="space-y-1">
                {current.top_r.map((t) => {
                  const maxLo = Math.max(
                    ...current.top_r.map((x) => Math.abs(x.lo))
                  );
                  const w = (Math.abs(t.lo) / maxLo) * 100;
                  return (
                    <div key={t.term} className="group flex items-center gap-2">
                      <span className="w-24 flex-shrink-0 truncate text-right font-sans text-[11px] text-slate-300">
                        {t.term}
                      </span>
                      <div className="relative h-3.5 flex-1">
                        <div
                          className="h-full rounded-sm bg-red-500/30"
                          style={{ width: `${w}%` }}
                        />
                      </div>
                      <span className="w-16 flex-shrink-0 font-sans text-[10px] text-slate-600">
                        D:{t.d} R:{t.r}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Method note */}
      <div className="font-sans text-[11px] leading-relaxed text-slate-600">
        <p>
          Vocabulary overlap measured by Jaccard similarity on terms used ≥5
          times per party. Partisan terms ranked by log-odds ratio (frequency
          in one party relative to the other), filtered for terms used ≥200
          times total and ≥20 times by each party. Floor speech data from the
          103rd–109th Congress (1993–2006).
        </p>
      </div>
    </div>
  );
}
