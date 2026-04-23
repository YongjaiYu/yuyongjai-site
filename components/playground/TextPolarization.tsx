"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";

interface TermScore {
  term: string;
  lo: number;
  d: number;
  r: number;
}

interface SplitStats {
  n_d: number;
  n_r: number;
  vocab_d: number;
  vocab_r: number;
  jaccard: number;
  tokens_d: number;
  tokens_r: number;
  top_d: TermScore[];
  top_r: TermScore[];
}

interface CongressData {
  congress: number;
  year: number;
  source: string;
  main: SplitStats;
  house: SplitStats;
  senate: SplitStats;
}

interface PolarData {
  meta: {
    generated: string;
    congresses: number[];
    sources: Record<string, string>;
    notes: string;
  };
  congresses: Record<string, CongressData>;
}

interface TermTotals {
  d: number;
  r: number;
  year: number;
}

interface TrajectoryData {
  meta: {
    generated: string;
    n_terms: number;
    congresses: number[];
  };
  totals: Record<string, TermTotals>;
  terms: Record<string, Record<string, [number, number]>>;
}

type Split = "main" | "house" | "senate";

const SPLIT_LABEL: Record<Split, string> = {
  main: "Combined",
  house: "House",
  senate: "Senate",
};

const SPLIT_COLOR: Record<Split, string> = {
  main: "rgb(148 163 184)",
  house: "rgb(34 197 94)",
  senate: "rgb(168 85 247)",
};

const SUGGESTED_TERMS = [
  "communism",
  "inflation",
  "abortion",
  "climate",
  "terrorism",
  "immigration",
  "tariff",
  "impeachment",
];

export default function TextPolarization() {
  const [data, setData] = useState<PolarData | null>(null);
  const [traj, setTraj] = useState<TrajectoryData | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/data/polarization_v2.json").then((r) => r.json()),
      fetch("/data/term_trajectories.json").then((r) => r.json()),
    ])
      .then(([pol, tr]) => {
        setData(pol);
        setTraj(tr);
        setLoading(false);
      })
      .catch((e) => {
        setError(String(e));
        setLoading(false);
      });
  }, []);

  const congresses = useMemo(() => {
    if (!data) return [];
    return Object.values(data.congresses).sort(
      (a, b) => a.congress - b.congress,
    );
  }, [data]);

  const current = useMemo(() => {
    if (!data || !selected) return null;
    return data.congresses[selected] ?? null;
  }, [data, selected]);

  const handleBarClick = useCallback((congress: string) => {
    setSelected((prev) => (prev === congress ? null : congress));
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-slate-500">
        Loading polarization data…
      </div>
    );
  }
  if (error || !data || !traj) {
    return (
      <div className="flex h-96 items-center justify-center text-rose-400">
        Failed to load: {error ?? "unknown error"}
      </div>
    );
  }

  const totalSpeeches = congresses.reduce(
    (s, c) => s + c.main.n_d + c.main.n_r,
    0,
  );
  const avgJaccard =
    congresses.reduce((s, c) => s + c.main.jaccard, 0) / congresses.length;
  const firstJ = congresses[0].main.jaccard;
  const lastJ = congresses[congresses.length - 1].main.jaccard;

  return (
    <div className="space-y-10">
      {/* Overview stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Speeches"
          value={totalSpeeches.toLocaleString()}
          sub={`${congresses.length} Congresses`}
        />
        <StatCard
          label="Period"
          value={`${congresses[0].congress}th–${congresses[congresses.length - 1].congress}th`}
          sub={`${congresses[0].year}–${congresses[congresses.length - 1].year + 1}`}
        />
        <StatCard
          label="Avg Jaccard"
          value={avgJaccard.toFixed(3)}
          sub="vocabulary overlap"
        />
        <StatCard
          label="Trend"
          value={lastJ < firstJ ? "Diverging" : "Converging"}
          sub={`J: ${firstJ.toFixed(3)} → ${lastJ.toFixed(3)}`}
        />
      </div>

      {/* A: Chamber-split Jaccard over time */}
      <ChamberSplitChart
        congresses={congresses}
        selected={selected}
        onSelect={handleBarClick}
      />

      {/* B: Term trajectory search */}
      <TermTrajectory traj={traj} />

      {/* C: Era comparison */}
      <EraComparison data={data} />

      {/* Selected congress detail (drill-down, same as before but with chamber tabs) */}
      {current && (
        <CongressDetail
          current={current}
          onClose={() => setSelected(null)}
        />
      )}

      {/* Method note */}
      <div className="font-sans text-[11px] leading-relaxed text-slate-600">
        <p>
          Vocabulary overlap (Jaccard) computed on terms used ≥5 times per
          party. Partisan terms ranked by log-odds (Dirichlet α=0.5), filtered
          to terms appearing ≥200 times total and ≥20 times by each party.
          Tokenization: lowercase alpha, length ≥3, with English plus
          procedural stopwords removed. Because pre-1981 bound-edition text is
          OCR-derived, absolute comparisons across the 1980-1981 boundary
          should be interpreted with care.
        </p>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-lg border border-slate-800 p-4">
      <p className="text-xs uppercase tracking-widest text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-slate-100">{value}</p>
      <p className="text-xs text-slate-500">{sub}</p>
    </div>
  );
}

/* ============================================================
 * A. Chamber-split Jaccard over time
 * ========================================================== */
function ChamberSplitChart({
  congresses,
  selected,
  onSelect,
}: {
  congresses: CongressData[];
  selected: string | null;
  onSelect: (c: string) => void;
}) {
  const [enabled, setEnabled] = useState<Record<Split, boolean>>({
    main: true,
    house: true,
    senate: true,
  });

  const vals = useMemo(() => {
    const all: number[] = [];
    for (const c of congresses) {
      if (enabled.main) all.push(c.main.jaccard);
      if (enabled.house) all.push(c.house.jaccard);
      if (enabled.senate) all.push(c.senate.jaccard);
    }
    return all;
  }, [congresses, enabled]);

  const yMin = Math.min(...vals, 0.5);
  const yMax = Math.max(...vals, 0.8);
  const range = Math.max(yMax - yMin, 0.05);
  const pad = range * 0.1;
  const domain = { min: yMin - pad, max: yMax + pad };

  const W = 1000;
  const H = 260;
  const marginL = 40;
  const marginR = 20;
  const marginT = 20;
  const marginB = 32;
  const innerW = W - marginL - marginR;
  const innerH = H - marginT - marginB;

  const xFor = (i: number) =>
    marginL +
    (congresses.length <= 1
      ? innerW / 2
      : (i / (congresses.length - 1)) * innerW);
  const yFor = (j: number) =>
    marginT + innerH - ((j - domain.min) / (domain.max - domain.min)) * innerH;

  const lineFor = (split: Split) =>
    congresses
      .map((c, i) => `${i === 0 ? "M" : "L"}${xFor(i)},${yFor(c[split].jaccard)}`)
      .join(" ");

  const yTicks = 4;
  const tickVals = Array.from({ length: yTicks + 1 }, (_, i) =>
    domain.min + (i * (domain.max - domain.min)) / yTicks,
  );

  const xTickStep = Math.max(1, Math.ceil(congresses.length / 10));

  return (
    <div className="rounded-lg border border-slate-800 p-6">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-200">
          Vocabulary Overlap Over Time — by Chamber
        </h3>
        <div className="flex gap-2">
          {(Object.keys(SPLIT_LABEL) as Split[]).map((s) => (
            <button
              key={s}
              onClick={() =>
                setEnabled((e) => ({ ...e, [s]: !e[s] }))
              }
              className={`rounded border px-2 py-1 text-[10px] uppercase tracking-widest transition-colors ${
                enabled[s]
                  ? "border-slate-600 text-slate-200"
                  : "border-slate-800 text-slate-600"
              }`}
              style={{
                borderColor: enabled[s] ? SPLIT_COLOR[s] : undefined,
                color: enabled[s] ? SPLIT_COLOR[s] : undefined,
              }}
            >
              {SPLIT_LABEL[s]}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-4 font-sans text-xs text-slate-500">
        Jaccard similarity (terms ≥5 uses per party) between Democratic and
        Republican vocabularies. Lower = more distinct. Click a Congress to
        drill down; toggle chambers with the buttons above.
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* gridlines + y-axis */}
        {tickVals.map((v) => (
          <g key={v}>
            <line
              x1={marginL}
              x2={W - marginR}
              y1={yFor(v)}
              y2={yFor(v)}
              stroke="rgb(30 41 59)"
              strokeDasharray="2 3"
            />
            <text
              x={marginL - 6}
              y={yFor(v) + 3}
              textAnchor="end"
              fontSize={9}
              fill="rgb(100 116 139)"
            >
              {v.toFixed(2)}
            </text>
          </g>
        ))}

        {/* x-axis ticks */}
        {congresses.map((c, i) =>
          i % xTickStep === 0 || i === congresses.length - 1 ? (
            <text
              key={c.congress}
              x={xFor(i)}
              y={H - marginB + 14}
              textAnchor="middle"
              fontSize={9}
              fill="rgb(100 116 139)"
            >
              {c.year}
            </text>
          ) : null,
        )}

        {/* lines */}
        {(["main", "house", "senate"] as Split[])
          .filter((s) => enabled[s])
          .map((s) => (
            <g key={s}>
              <path
                d={lineFor(s)}
                fill="none"
                stroke={SPLIT_COLOR[s]}
                strokeWidth={1.5}
                opacity={0.85}
              />
              {congresses.map((c, i) => (
                <circle
                  key={c.congress}
                  cx={xFor(i)}
                  cy={yFor(c[s].jaccard)}
                  r={selected === String(c.congress) ? 4 : 2.2}
                  fill={SPLIT_COLOR[s]}
                  opacity={selected === String(c.congress) ? 1 : 0.7}
                />
              ))}
            </g>
          ))}

        {/* clickable overlay bars */}
        {congresses.map((c, i) => {
          const x = xFor(i);
          const w = innerW / Math.max(congresses.length, 1);
          return (
            <g key={`hit-${c.congress}`}>
              <rect
                x={x - w / 2}
                y={marginT}
                width={w}
                height={innerH}
                fill="transparent"
                onClick={() => onSelect(String(c.congress))}
                style={{ cursor: "pointer" }}
              >
                <title>
                  {c.congress}th ({c.year}) — M:{c.main.jaccard.toFixed(3)} H:
                  {c.house.jaccard.toFixed(3)} S:{c.senate.jaccard.toFixed(3)}
                </title>
              </rect>
              {selected === String(c.congress) && (
                <line
                  x1={x}
                  x2={x}
                  y1={marginT}
                  y2={marginT + innerH}
                  stroke="rgb(251 191 36)"
                  strokeDasharray="3 3"
                  opacity={0.5}
                />
              )}
            </g>
          );
        })}
      </svg>
      <p className="mt-2 text-center text-[10px] text-slate-600">
        ↓ Lower Jaccard = more distinct partisan vocabularies
      </p>
    </div>
  );
}

/* ============================================================
 * B. Term trajectory search
 * ========================================================== */
function TermTrajectory({ traj }: { traj: TrajectoryData }) {
  const [term, setTerm] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);

  const congresses = traj.meta.congresses;

  const lookup = useMemo(() => {
    if (!submitted) return null;
    const key = submitted.toLowerCase().trim();
    const row = traj.terms[key];
    if (!row) return { found: false as const, term: key };
    return { found: true as const, term: key, row };
  }, [traj, submitted]);

  const handleSubmit = useCallback(() => {
    const t = term.trim().toLowerCase();
    if (t) setSubmitted(t);
  }, [term]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
  }, []);

  return (
    <div className="rounded-lg border border-slate-800 p-6">
      <h3 className="mb-1 text-sm font-medium text-slate-200">
        Term Trajectory — Search a Word
      </h3>
      <p className="mb-4 font-sans text-xs text-slate-500">
        How Democratic and Republican use-rates of a single word evolved across
        Congresses. Rate = uses per million party tokens. Try one of the
        suggested terms or type your own ({traj.meta.n_terms.toLocaleString()}{" "}
        terms indexed).
      </p>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={term}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          placeholder="e.g. climate, inflation, impeachment"
          className="flex-1 rounded border border-slate-700 bg-slate-900 px-3 py-1.5 font-sans text-xs text-slate-100 placeholder:text-slate-600 focus:border-slate-500 focus:outline-none"
        />
        <button
          onClick={handleSubmit}
          className="rounded border border-slate-600 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800"
        >
          Plot
        </button>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {SUGGESTED_TERMS.map((t) => (
          <button
            key={t}
            onClick={() => {
              setTerm(t);
              setSubmitted(t);
            }}
            className="rounded-full border border-slate-800 px-2.5 py-0.5 text-[10px] text-slate-400 hover:border-slate-600 hover:text-slate-200"
          >
            {t}
          </button>
        ))}
      </div>

      {lookup && lookup.found && (
        <TrajectoryChart
          term={lookup.term}
          row={lookup.row}
          totals={traj.totals}
          congresses={congresses}
        />
      )}
      {lookup && !lookup.found && (
        <div className="rounded border border-slate-800 p-4 font-sans text-xs text-slate-500">
          &ldquo;{lookup.term}&rdquo; is not among the top-
          {traj.meta.n_terms.toLocaleString()} indexed terms. Try a more
          frequent word or a different spelling.
        </div>
      )}
    </div>
  );
}

function TrajectoryChart({
  term,
  row,
  totals,
  congresses,
}: {
  term: string;
  row: Record<string, [number, number]>;
  totals: Record<string, TermTotals>;
  congresses: number[];
}) {
  const series = congresses.map((c) => {
    const [dc, rc] = row[String(c)] ?? [0, 0];
    const t = totals[String(c)];
    const d_rate = t && t.d > 0 ? (dc / t.d) * 1e6 : 0;
    const r_rate = t && t.r > 0 ? (rc / t.r) * 1e6 : 0;
    return { congress: c, year: t?.year ?? 0, d_rate, r_rate, dc, rc };
  });

  const allRates = series.flatMap((s) => [s.d_rate, s.r_rate]);
  const yMax = Math.max(...allRates, 1);

  const W = 1000;
  const H = 240;
  const marginL = 50;
  const marginR = 20;
  const marginT = 20;
  const marginB = 32;
  const innerW = W - marginL - marginR;
  const innerH = H - marginT - marginB;

  const xFor = (i: number) =>
    marginL +
    (series.length <= 1
      ? innerW / 2
      : (i / (series.length - 1)) * innerW);
  const yFor = (v: number) =>
    marginT + innerH - (v / yMax) * innerH;

  const pathD = series
    .map((s, i) => `${i === 0 ? "M" : "L"}${xFor(i)},${yFor(s.d_rate)}`)
    .join(" ");
  const pathR = series
    .map((s, i) => `${i === 0 ? "M" : "L"}${xFor(i)},${yFor(s.r_rate)}`)
    .join(" ");

  const xTickStep = Math.max(1, Math.ceil(series.length / 10));

  const totalUses = series.reduce((s, x) => s + x.dc + x.rc, 0);

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-4 font-sans text-xs">
        <span className="text-slate-300">
          Term: <span className="font-semibold text-slate-100">{term}</span>
        </span>
        <span className="text-slate-500">{totalUses.toLocaleString()} total uses</span>
        <span className="flex items-center gap-1 text-blue-400">
          <span className="inline-block h-0.5 w-4 bg-blue-400" />
          Democratic
        </span>
        <span className="flex items-center gap-1 text-red-400">
          <span className="inline-block h-0.5 w-4 bg-red-400" />
          Republican
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {[0, 0.25, 0.5, 0.75, 1].map((f) => {
          const v = f * yMax;
          return (
            <g key={f}>
              <line
                x1={marginL}
                x2={W - marginR}
                y1={yFor(v)}
                y2={yFor(v)}
                stroke="rgb(30 41 59)"
                strokeDasharray="2 3"
              />
              <text
                x={marginL - 6}
                y={yFor(v) + 3}
                textAnchor="end"
                fontSize={9}
                fill="rgb(100 116 139)"
              >
                {v.toFixed(1)}
              </text>
            </g>
          );
        })}
        <text
          x={10}
          y={marginT + 8}
          fontSize={9}
          fill="rgb(100 116 139)"
        >
          uses/M tokens
        </text>

        {series.map((s, i) =>
          i % xTickStep === 0 || i === series.length - 1 ? (
            <text
              key={s.congress}
              x={xFor(i)}
              y={H - marginB + 14}
              textAnchor="middle"
              fontSize={9}
              fill="rgb(100 116 139)"
            >
              {s.year}
            </text>
          ) : null,
        )}

        <path d={pathD} fill="none" stroke="rgb(96 165 250)" strokeWidth={1.5} />
        <path d={pathR} fill="none" stroke="rgb(248 113 113)" strokeWidth={1.5} />
        {series.map((s, i) => (
          <g key={s.congress}>
            <circle
              cx={xFor(i)}
              cy={yFor(s.d_rate)}
              r={2}
              fill="rgb(96 165 250)"
            />
            <circle
              cx={xFor(i)}
              cy={yFor(s.r_rate)}
              r={2}
              fill="rgb(248 113 113)"
            />
            <rect
              x={xFor(i) - innerW / series.length / 2}
              y={marginT}
              width={innerW / series.length}
              height={innerH}
              fill="transparent"
            >
              <title>
                {s.congress}th ({s.year}): D={s.dc} ({s.d_rate.toFixed(1)}/M)
                · R={s.rc} ({s.r_rate.toFixed(1)}/M)
              </title>
            </rect>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ============================================================
 * C. Era comparison
 * ========================================================== */
function EraComparison({ data }: { data: PolarData }) {
  const congresses = useMemo(
    () => Object.values(data.congresses).sort((a, b) => a.congress - b.congress),
    [data],
  );

  const [left, setLeft] = useState<string>(
    String(congresses[0]?.congress ?? ""),
  );
  const [right, setRight] = useState<string>(
    String(congresses[congresses.length - 1]?.congress ?? ""),
  );

  const leftData = data.congresses[left];
  const rightData = data.congresses[right];

  return (
    <div className="rounded-lg border border-slate-800 p-6">
      <h3 className="mb-1 text-sm font-medium text-slate-200">
        Era Comparison — Partisan Vocabularies Side by Side
      </h3>
      <p className="mb-4 font-sans text-xs text-slate-500">
        Pick any two Congresses to compare their most distinctly partisan
        terms. The shape of partisan language shifts sharply across decades.
      </p>
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <CongressPicker
          label="Left"
          value={left}
          onChange={setLeft}
          congresses={congresses}
        />
        <CongressPicker
          label="Right"
          value={right}
          onChange={setRight}
          congresses={congresses}
        />
      </div>
      {leftData && rightData && (
        <div className="grid gap-6 sm:grid-cols-2">
          <EraPanel data={leftData} />
          <EraPanel data={rightData} />
        </div>
      )}
    </div>
  );
}

function CongressPicker({
  label,
  value,
  onChange,
  congresses,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  congresses: CongressData[];
}) {
  return (
    <label className="flex items-center gap-2 font-sans text-xs text-slate-400">
      <span className="w-10 text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 rounded border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-100 focus:border-slate-500 focus:outline-none"
      >
        {congresses.map((c) => (
          <option key={c.congress} value={c.congress}>
            {c.congress}th Congress ({c.year}–{c.year + 1})
          </option>
        ))}
      </select>
    </label>
  );
}

function EraPanel({ data }: { data: CongressData }) {
  const m = data.main;
  return (
    <div className="rounded border border-slate-800 p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <p className="text-sm font-semibold text-slate-100">
          {data.congress}th Congress
        </p>
        <p className="font-sans text-[10px] text-slate-500">
          {data.year}–{data.year + 1} · J={m.jaccard.toFixed(3)}
        </p>
      </div>
      <div className="mb-3 flex justify-between font-sans text-[10px] text-slate-500">
        <span>
          <span className="text-blue-400">{m.n_d.toLocaleString()}</span> D
        </span>
        <span>
          <span className="text-red-400">{m.n_r.toLocaleString()}</span> R
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <TermList side="D" terms={m.top_d} />
        <TermList side="R" terms={m.top_r} />
      </div>
    </div>
  );
}

function TermList({ side, terms }: { side: "D" | "R"; terms: TermScore[] }) {
  const color =
    side === "D"
      ? { text: "text-blue-400", bar: "bg-blue-500/30" }
      : { text: "text-red-400", bar: "bg-red-500/30" };
  if (!terms.length) {
    return (
      <div className="font-sans text-[10px] text-slate-600">
        No terms pass the threshold.
      </div>
    );
  }
  const maxLo = Math.max(...terms.map((t) => Math.abs(t.lo)));
  return (
    <div>
      <h5 className={`mb-1.5 text-[10px] font-medium uppercase ${color.text}`}>
        {side === "D" ? "Democratic" : "Republican"}
      </h5>
      <div className="space-y-1">
        {terms.slice(0, 10).map((t) => {
          const w = (Math.abs(t.lo) / maxLo) * 100;
          return (
            <div key={t.term} className="flex items-center gap-2">
              <span className="w-20 flex-shrink-0 truncate text-right font-sans text-[10px] text-slate-300">
                {t.term}
              </span>
              <div className="relative h-3 flex-1">
                <div
                  className={`h-full rounded-sm ${color.bar}`}
                  style={{ width: `${w}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
 * Drill-down detail (selected Congress)
 * ========================================================== */
function CongressDetail({
  current,
  onClose,
}: {
  current: CongressData;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Split>("main");
  const s = current[tab];
  return (
    <div className="rounded-lg border border-slate-800 p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-slate-200">
          {current.congress}th Congress ({current.year}–{current.year + 1})
        </h3>
        <div className="flex gap-2">
          {(Object.keys(SPLIT_LABEL) as Split[]).map((v) => (
            <button
              key={v}
              onClick={() => setTab(v)}
              className={`rounded border px-2 py-1 text-[10px] uppercase tracking-widest transition-colors ${
                tab === v
                  ? "border-slate-500 text-slate-100"
                  : "border-slate-800 text-slate-500 hover:text-slate-300"
              }`}
            >
              {SPLIT_LABEL[v]}
            </button>
          ))}
          <button
            onClick={onClose}
            className="ml-2 text-xs text-slate-500 hover:text-slate-300"
          >
            Close
          </button>
        </div>
      </div>
      <div className="mb-6 grid grid-cols-3 gap-4 text-center font-sans text-xs">
        <div>
          <p className="text-blue-400">{s.n_d.toLocaleString()} D speeches</p>
          <p className="text-slate-500">
            {s.vocab_d.toLocaleString()} unique terms
          </p>
        </div>
        <div>
          <p className="text-amber-400">J = {s.jaccard.toFixed(4)}</p>
          <p className="text-slate-500">vocabulary overlap</p>
        </div>
        <div>
          <p className="text-red-400">{s.n_r.toLocaleString()} R speeches</p>
          <p className="text-slate-500">
            {s.vocab_r.toLocaleString()} unique terms
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <h4 className="mb-2 text-xs font-medium text-blue-400">
            Distinctly Democratic
          </h4>
          <TermBars terms={s.top_d} color="blue" />
        </div>
        <div>
          <h4 className="mb-2 text-xs font-medium text-red-400">
            Distinctly Republican
          </h4>
          <TermBars terms={s.top_r} color="red" />
        </div>
      </div>
    </div>
  );
}

function TermBars({
  terms,
  color,
}: {
  terms: TermScore[];
  color: "blue" | "red";
}) {
  if (!terms.length) {
    return (
      <div className="font-sans text-[11px] text-slate-600">
        No terms met the frequency threshold for this split.
      </div>
    );
  }
  const maxLo = Math.max(...terms.map((t) => Math.abs(t.lo)));
  const barColor = color === "blue" ? "bg-blue-500/30" : "bg-red-500/30";
  return (
    <div className="space-y-1">
      {terms.map((t) => {
        const w = (Math.abs(t.lo) / maxLo) * 100;
        return (
          <div key={t.term} className="group flex items-center gap-2">
            <span className="w-24 flex-shrink-0 truncate text-right font-sans text-[11px] text-slate-300">
              {t.term}
            </span>
            <div className="relative h-3.5 flex-1">
              <div
                className={`h-full rounded-sm ${barColor}`}
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
  );
}
