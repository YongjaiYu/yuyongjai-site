import { assertNever, formatScore } from "./aesConfig";
import type { CongressComparison } from "./aesTypes";

type AESCongressChartProps = {
  readonly rows: readonly CongressComparison[];
  readonly selected: CongressComparison;
  readonly onSelect: (congress: number) => void;
};

type SeriesKey = "aes" | "congressMedian" | "presidentNominate";

type ChartScales = {
  readonly x: (congress: number) => number;
  readonly y: (score: number) => number;
  readonly minCongress: number;
  readonly maxCongress: number;
  readonly minScore: number;
  readonly maxScore: number;
};

type SeriesPoint = { readonly row: CongressComparison; readonly value: number };

const CHART = {
  width: 760,
  height: 360,
  margin: { top: 24, right: 24, bottom: 44, left: 48 },
} as const;

const SERIES: readonly {
  readonly key: SeriesKey;
  readonly label: string;
  readonly color: string;
}[] = [
  { key: "aes", label: "President AES mean", color: "#22d3ee" },
  { key: "congressMedian", label: "Congress median NOMINATE", color: "#f59e0b" },
  { key: "presidentNominate", label: "President NOMINATE", color: "#a78bfa" },
];

export function AESCongressChart({
  rows,
  selected,
  onSelect,
}: AESCongressChartProps) {
  const scales = buildScales(rows);
  const scoreTicks = scoreTickValues(scales);
  const congressTicks = congressTickValues(scales);

  return (
    <div className="min-w-0 rounded border border-slate-800 bg-slate-900/30 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs uppercase tracking-widest text-slate-500">
          Congress comparison
        </div>
        <div className="flex flex-wrap gap-3 text-[11px] text-slate-400">
          {SERIES.map((series) => (
            <span key={series.key} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: series.color }}
              />
              {series.label}
            </span>
          ))}
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${CHART.width} ${CHART.height}`}
          className="block w-full min-w-[660px]"
        >
          {scoreTicks.map((tick) => (
            <g key={tick}>
              <line
                x1={CHART.margin.left}
                x2={CHART.width - CHART.margin.right}
                y1={scales.y(tick)}
                y2={scales.y(tick)}
                stroke={tick === 0 ? "#475569" : "#1e293b"}
                strokeDasharray={tick === 0 ? undefined : "4,4"}
              />
              <text
                x={CHART.margin.left - 10}
                y={scales.y(tick) + 4}
                textAnchor="end"
                className="fill-slate-500 text-[11px]"
              >
                {tick.toFixed(1)}
              </text>
            </g>
          ))}
          {SERIES.map((series) => (
            <path
              key={series.key}
              d={seriesPath(rows, scales, series.key)}
              fill="none"
              stroke={series.color}
              strokeWidth={series.key === "aes" ? 2.4 : 1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={series.key === "aes" ? 1 : 0.82}
            />
          ))}
          {rows.map((row) => (
            <CongressPoint
              key={row.congress}
              row={row}
              scales={scales}
              selected={row.congress === selected.congress}
              onSelect={onSelect}
            />
          ))}
          {congressTicks.map((congress) => (
            <text
              key={congress}
              x={scales.x(congress)}
              y={CHART.height - CHART.margin.bottom + 24}
              textAnchor="middle"
              className="fill-slate-500 text-[11px]"
            >
              {congress}
            </text>
          ))}
          <text
            x={CHART.width / 2}
            y={CHART.height - 6}
            textAnchor="middle"
            className="fill-slate-400 text-xs"
          >
            Congress
          </text>
          <text
            x={14}
            y={CHART.height / 2}
            textAnchor="middle"
            transform={`rotate(-90, 14, ${CHART.height / 2})`}
            className="fill-slate-400 text-xs"
          >
            Ideology score
          </text>
        </svg>
      </div>
    </div>
  );
}

function CongressPoint({
  row,
  scales,
  selected,
  onSelect,
}: {
  readonly row: CongressComparison;
  readonly scales: ChartScales;
  readonly selected: boolean;
  readonly onSelect: (congress: number) => void;
}) {
  return (
    <circle
      role="button"
      tabIndex={0}
      aria-label={`${row.congress}th Congress, president AES ${formatScore(
        row.president_aes_mean,
      )}`}
      cx={scales.x(row.congress)}
      cy={scales.y(row.president_aes_mean)}
      r={selected ? 5 : 3.2}
      fill="#22d3ee"
      stroke="#020617"
      strokeWidth={1.2}
      className="cursor-pointer transition-opacity hover:opacity-100"
      opacity={selected ? 1 : 0.74}
      onClick={() => onSelect(row.congress)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(row.congress);
        }
      }}
    />
  );
}

function buildScales(rows: readonly CongressComparison[]): ChartScales {
  const scores = rows.flatMap((row) => [
    row.president_aes_mean,
    row.congress_median_nominate,
    row.president_nominate,
  ]);
  const numericScores = scores.filter((score) => score !== null);
  const minCongress = Math.min(...rows.map((row) => row.congress));
  const maxCongress = Math.max(...rows.map((row) => row.congress));
  const minScore = Math.min(-0.6, ...numericScores);
  const maxScore = Math.max(0.8, ...numericScores);
  const innerWidth = CHART.width - CHART.margin.left - CHART.margin.right;
  const innerHeight = CHART.height - CHART.margin.top - CHART.margin.bottom;
  return {
    minCongress,
    maxCongress,
    minScore,
    maxScore,
    x: (congress) =>
      CHART.margin.left +
      ((congress - minCongress) / (maxCongress - minCongress || 1)) * innerWidth,
    y: (score) =>
      CHART.margin.top +
      ((maxScore - score) / (maxScore - minScore || 1)) * innerHeight,
  };
}

function seriesPath(
  rows: readonly CongressComparison[],
  scales: ChartScales,
  series: SeriesKey,
): string {
  return rows
    .map((row) => seriesPoint(row, series))
    .filter((point): point is SeriesPoint => point !== null)
    .map((point, index) => {
      const command = index === 0 ? "M" : "L";
      return `${command}${scales.x(point.row.congress)},${scales.y(point.value)}`;
    })
    .join(" ");
}

function seriesPoint(
  row: CongressComparison,
  series: SeriesKey,
): SeriesPoint | null {
  const value = seriesValue(row, series);
  return value === null ? null : { row, value };
}

function seriesValue(row: CongressComparison, series: SeriesKey): number | null {
  switch (series) {
    case "aes":
      return row.president_aes_mean;
    case "congressMedian":
      return row.congress_median_nominate;
    case "presidentNominate":
      return row.president_nominate;
    default:
      return assertNever(series);
  }
}

function scoreTickValues(scales: ChartScales): readonly number[] {
  const start = Math.ceil(scales.minScore * 5) / 5;
  const end = Math.floor(scales.maxScore * 5) / 5;
  const ticks: number[] = [];
  for (let value = start; value <= end + 0.001; value += 0.2) {
    ticks.push(Number(value.toFixed(1)));
  }
  return ticks;
}

function congressTickValues(scales: ChartScales): readonly number[] {
  const ticks: number[] = [];
  for (let value = scales.minCongress; value <= scales.maxCongress; value += 4) {
    ticks.push(value);
  }
  return ticks;
}
