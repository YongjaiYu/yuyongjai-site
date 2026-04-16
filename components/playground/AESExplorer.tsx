"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface Directive {
  id: number;
  s: number; // AES score
  y: number; // year
  p: string; // president short name
  party: string;
  dt: string; // directive type
  c: string | null; // category
}

interface DetailDirective {
  id: number;
  s: number;
  y: number;
  t: string; // title
  dt: string;
  c: string | null;
}

interface Meta {
  total: number;
  score_range: [number, number];
  year_range: [number, number];
  categories: Record<string, string>;
  types: Record<string, string>;
  presidents: { full: string; short: string; party: string }[];
}

interface AESData {
  meta: Meta;
  data: Directive[];
}

const CATEGORY_COLORS: Record<string, string> = {
  A: "#f59e0b", // amber — Economic
  B: "#8b5cf6", // violet — Social
  C: "#ef4444", // red — Military
  D: "#3b82f6", // blue — International
  E: "#6b7280", // gray — Administrative
  F: "#10b981", // emerald — Infrastructure
  G: "#a3a3a3", // neutral — Ceremonial
};

const PARTY_COLORS = {
  D: "#3b82f6",
  R: "#ef4444",
};

type ColorMode = "party" | "category" | "type";
type FilterType = "all" | "eo" | "proclamation" | "memorandum";

export default function AESExplorer() {
  const [data, setData] = useState<AESData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPresident, setSelectedPresident] = useState<string | null>(
    null
  );
  const [colorMode, setColorMode] = useState<ColorMode>("party");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{
    d: Directive;
    x: number;
    y: number;
    title?: string;
  } | null>(null);
  const [detailCache, setDetailCache] = useState<
    Record<string, DetailDirective[]>
  >({});
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/data/aes_summary.json")
      .then((r) => r.json())
      .then((d: AESData) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  const loadPresidentDetail = useCallback(
    async (shortName: string) => {
      if (detailCache[shortName]) return;
      const fname = shortName.toLowerCase().replace(/ /g, "_").replace(/\./g, "");
      try {
        const res = await fetch(`/data/aes_${fname}.json`);
        const details: DetailDirective[] = await res.json();
        setDetailCache((prev) => ({ ...prev, [shortName]: details }));
      } catch {
        // detail load failed, hover will show without title
      }
    },
    [detailCache]
  );

  const filteredData = useMemo(() => {
    if (!data) return [];
    let items = data.data;
    if (selectedPresident) {
      items = items.filter((d) => d.p === selectedPresident);
    }
    if (filterType !== "all") {
      items = items.filter((d) => d.dt === filterType);
    }
    if (filterCategory) {
      items = items.filter((d) => d.c === filterCategory);
    }
    return items;
  }, [data, selectedPresident, filterType, filterCategory]);

  const chartDimensions = useMemo(() => {
    const width = 960;
    const height = 500;
    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    return { width, height, margin };
  }, []);

  const scales = useMemo(() => {
    if (!data) return null;
    const { width, height, margin } = chartDimensions;
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const [minYear, maxYear] = data.meta.year_range;
    const [minScore, maxScore] = data.meta.score_range;
    const scorePad = 0.1;

    const xScale = (year: number) =>
      margin.left + ((year - minYear) / (maxYear - minYear)) * innerW;
    const yScale = (score: number) =>
      margin.top +
      ((maxScore + scorePad - score) / (maxScore - minScore + 2 * scorePad)) *
        innerH;

    return { xScale, yScale, minYear, maxYear, minScore, maxScore, innerW, innerH };
  }, [data, chartDimensions]);

  const getColor = useCallback(
    (d: Directive) => {
      if (colorMode === "party") {
        return PARTY_COLORS[d.party as keyof typeof PARTY_COLORS] || "#6b7280";
      }
      if (colorMode === "category") {
        return d.c ? CATEGORY_COLORS[d.c] || "#6b7280" : "#374151";
      }
      // type
      if (d.dt === "eo") return "#f59e0b";
      if (d.dt === "proclamation") return "#8b5cf6";
      return "#10b981";
    },
    [colorMode]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!scales || !data || !svgRef.current) return;

      const rect = svgRef.current.getBoundingClientRect();
      const scaleX = chartDimensions.width / rect.width;
      const scaleY = chartDimensions.height / rect.height;
      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top) * scaleY;

      let closest: Directive | null = null;
      let minDist = Infinity;

      for (const d of filteredData) {
        const px = scales.xScale(d.y);
        const py = scales.yScale(d.s);
        const dist = Math.sqrt((mx - px) ** 2 + (my - py) ** 2);
        if (dist < minDist && dist < 15) {
          minDist = dist;
          closest = d;
        }
      }

      if (closest) {
        const detail = detailCache[closest.p]?.find(
          (dd) => dd.id === closest!.id
        );
        setHoveredPoint({
          d: closest,
          x: e.clientX,
          y: e.clientY,
          title: detail?.t,
        });
        if (!detailCache[closest.p]) {
          loadPresidentDetail(closest.p);
        }
      } else {
        setHoveredPoint(null);
      }
    },
    [scales, filteredData, data, detailCache, loadPresidentDetail, chartDimensions]
  );

  if (loading || !data || !scales) {
    return (
      <div className="flex h-96 items-center justify-center text-slate-500">
        Loading 20,961 directives…
      </div>
    );
  }

  const { margin } = chartDimensions;
  const yearTicks = [];
  for (let y = Math.ceil(scales.minYear / 10) * 10; y <= scales.maxYear; y += 10) {
    yearTicks.push(y);
  }

  const scoreTicks = [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 font-sans text-sm">
        {/* President filter */}
        <div>
          <label className="mb-1 block text-xs uppercase tracking-widest text-slate-500">
            President
          </label>
          <select
            value={selectedPresident || ""}
            onChange={(e) =>
              setSelectedPresident(e.target.value || null)
            }
            className="rounded border border-slate-700 bg-slate-900 px-3 py-1.5 text-slate-200 focus:border-cyan-400 focus:outline-none"
          >
            <option value="">All Presidents</option>
            {data.meta.presidents.map((p) => (
              <option key={p.short} value={p.short}>
                {p.short}
              </option>
            ))}
          </select>
        </div>

        {/* Directive type */}
        <div>
          <label className="mb-1 block text-xs uppercase tracking-widest text-slate-500">
            Type
          </label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as FilterType)}
            className="rounded border border-slate-700 bg-slate-900 px-3 py-1.5 text-slate-200 focus:border-cyan-400 focus:outline-none"
          >
            <option value="all">All Types</option>
            {Object.entries(data.meta.types).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {/* Policy category */}
        <div>
          <label className="mb-1 block text-xs uppercase tracking-widest text-slate-500">
            Policy Area
          </label>
          <select
            value={filterCategory || ""}
            onChange={(e) =>
              setFilterCategory(e.target.value || null)
            }
            className="rounded border border-slate-700 bg-slate-900 px-3 py-1.5 text-slate-200 focus:border-cyan-400 focus:outline-none"
          >
            <option value="">All Categories</option>
            {Object.entries(data.meta.categories).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {/* Color mode */}
        <div>
          <label className="mb-1 block text-xs uppercase tracking-widest text-slate-500">
            Color by
          </label>
          <div className="flex gap-1">
            {(["party", "category", "type"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setColorMode(mode)}
                className={`rounded px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  colorMode === mode
                    ? "bg-cyan-400/20 text-cyan-400"
                    : "bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex gap-6 font-sans text-xs text-slate-500">
        <span>
          Showing{" "}
          <span className="text-slate-300">
            {filteredData.length.toLocaleString()}
          </span>{" "}
          directives
        </span>
        {selectedPresident && (
          <span>
            Mean AES:{" "}
            <span className="text-slate-300">
              {(
                filteredData.reduce((a, d) => a + d.s, 0) / filteredData.length
              ).toFixed(3)}
            </span>
          </span>
        )}
      </div>

      {/* Chart */}
      <div ref={containerRef} className="overflow-x-auto">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${chartDimensions.width} ${chartDimensions.height}`}
          className="w-full min-w-[640px]"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredPoint(null)}
        >
          {/* Grid lines */}
          {scoreTicks.map((s) => (
            <line
              key={`grid-${s}`}
              x1={margin.left}
              x2={chartDimensions.width - margin.right}
              y1={scales.yScale(s)}
              y2={scales.yScale(s)}
              stroke={s === 0 ? "#475569" : "#1e293b"}
              strokeWidth={s === 0 ? 1.5 : 0.5}
              strokeDasharray={s === 0 ? undefined : "4,4"}
            />
          ))}

          {/* Year grid */}
          {yearTicks.map((y) => (
            <line
              key={`ygrid-${y}`}
              x1={scales.xScale(y)}
              x2={scales.xScale(y)}
              y1={margin.top}
              y2={chartDimensions.height - margin.bottom}
              stroke="#1e293b"
              strokeWidth={0.5}
              strokeDasharray="4,4"
            />
          ))}

          {/* Data points */}
          {filteredData.map((d) => (
            <circle
              key={d.id}
              cx={scales.xScale(d.y)}
              cy={scales.yScale(d.s)}
              r={hoveredPoint?.d.id === d.id ? 5 : 2.5}
              fill={getColor(d)}
              opacity={hoveredPoint?.d.id === d.id ? 1 : 0.5}
              className="transition-opacity duration-75"
            />
          ))}

          {/* X axis labels */}
          {yearTicks.map((y) => (
            <text
              key={`xlabel-${y}`}
              x={scales.xScale(y)}
              y={chartDimensions.height - margin.bottom + 25}
              textAnchor="middle"
              className="fill-slate-500 text-[11px]"
            >
              {y}
            </text>
          ))}

          {/* Y axis labels */}
          {scoreTicks.map((s) => (
            <text
              key={`ylabel-${s}`}
              x={margin.left - 10}
              y={scales.yScale(s) + 4}
              textAnchor="end"
              className="fill-slate-500 text-[11px]"
            >
              {s.toFixed(1)}
            </text>
          ))}

          {/* Axis labels */}
          <text
            x={chartDimensions.width / 2}
            y={chartDimensions.height - 5}
            textAnchor="middle"
            className="fill-slate-400 text-xs"
          >
            Year
          </text>
          <text
            x={15}
            y={chartDimensions.height / 2}
            textAnchor="middle"
            transform={`rotate(-90, 15, ${chartDimensions.height / 2})`}
            className="fill-slate-400 text-xs"
          >
            AES Score (Liberal → Conservative)
          </text>

          {/* Zero line label */}
          <text
            x={chartDimensions.width - margin.right + 5}
            y={scales.yScale(0) + 4}
            className="fill-slate-500 text-[10px]"
          >
            0
          </text>
        </svg>
      </div>

      {/* Tooltip */}
      {hoveredPoint && (
        <div
          className="pointer-events-none fixed z-50 max-w-xs rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 font-sans text-sm shadow-xl"
          style={{
            left: hoveredPoint.x + 12,
            top: hoveredPoint.y - 10,
            transform: "translateY(-100%)",
          }}
        >
          <div className="mb-1 text-xs text-slate-500">
            {hoveredPoint.d.p} · {hoveredPoint.d.y} ·{" "}
            {data.meta.types[hoveredPoint.d.dt]}
          </div>
          {hoveredPoint.title && (
            <div className="mb-2 text-slate-200">{hoveredPoint.title}</div>
          )}
          <div className="flex items-center gap-3">
            <span
              className={`text-lg font-bold ${
                hoveredPoint.d.s > 0 ? "text-red-400" : "text-blue-400"
              }`}
            >
              {hoveredPoint.d.s > 0 ? "+" : ""}
              {hoveredPoint.d.s.toFixed(3)}
            </span>
            {hoveredPoint.d.c && (
              <span
                className="rounded-full px-2 py-0.5 text-xs"
                style={{
                  backgroundColor:
                    CATEGORY_COLORS[hoveredPoint.d.c] + "20",
                  color: CATEGORY_COLORS[hoveredPoint.d.c],
                }}
              >
                {data.meta.categories[hoveredPoint.d.c]}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="font-sans text-xs text-slate-500">
        {colorMode === "party" && (
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-500" />
              Democrat
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
              Republican
            </span>
          </div>
        )}
        {colorMode === "category" && (
          <div className="flex flex-wrap gap-3">
            {Object.entries(data.meta.categories).map(([k, v]) => (
              <span key={k} className="flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[k] }}
                />
                {v}
              </span>
            ))}
          </div>
        )}
        {colorMode === "type" && (
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />
              Executive Order
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-violet-500" />
              Proclamation
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Memorandum
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
