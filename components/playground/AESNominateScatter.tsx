import { partyColor } from "./aesConfig";
import type { NominateMetric } from "./aesTypes";
import type { NominateFitRow } from "./aesAnalyticsUtils";

type AESNominateScatterProps = {
  readonly rows: readonly NominateFitRow[];
  readonly metric: NominateMetric | null;
  readonly activeShort: string | null;
  readonly onSelect: (shortName: string) => void;
};

type Bounds = {
  readonly minX: number;
  readonly maxX: number;
  readonly minY: number;
  readonly maxY: number;
};

const WIDTH = 760;
const HEIGHT = 340;
const MARGIN = { top: 24, right: 34, bottom: 42, left: 54 };

export function AESNominateScatter({
  rows,
  metric,
  activeShort,
  onSelect,
}: AESNominateScatterProps) {
  const bounds = pointBounds(rows);
  const activeRow =
    rows.find((row) => row.point.short === activeShort) ?? rows[0] ?? null;

  return (
    <div className="max-w-full overflow-x-auto rounded border border-slate-800 bg-slate-900/30 p-4">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="block w-full min-w-[620px]"
      >
        {yTicks(bounds).map((tick) => (
          <line
            key={tick}
            x1={MARGIN.left}
            x2={WIDTH - MARGIN.right}
            y1={yScale(tick, bounds)}
            y2={yScale(tick, bounds)}
            stroke="#1e293b"
            strokeDasharray="4,4"
            strokeWidth={0.7}
          />
        ))}
        <line
          x1={MARGIN.left}
          x2={WIDTH - MARGIN.right}
          y1={yScale(0, bounds)}
          y2={yScale(0, bounds)}
          stroke="#334155"
          strokeDasharray="4,4"
          strokeWidth={0.8}
        />
        {metric && (
          <line
            x1={xScale(bounds.minX, bounds)}
            x2={xScale(bounds.maxX, bounds)}
            y1={yScale(trendY(bounds.minX, metric), bounds)}
            y2={yScale(trendY(bounds.maxX, metric), bounds)}
            stroke="#22d3ee"
            strokeOpacity={0.78}
            strokeWidth={1.8}
          />
        )}
        {activeRow && activeRow.predicted !== null && (
          <line
            x1={xScale(activeRow.point.nominate, bounds)}
            x2={xScale(activeRow.point.nominate, bounds)}
            y1={yScale(activeRow.point.mean_aes, bounds)}
            y2={yScale(activeRow.predicted, bounds)}
            stroke="#f8fafc"
            strokeDasharray="3,3"
            strokeOpacity={0.7}
            strokeWidth={1.2}
          />
        )}
        {rows.map((row) => (
          <NominatePointMark
            key={`${row.point.sample}-${row.point.short}`}
            row={row}
            bounds={bounds}
            active={row.point.short === activeRow?.point.short}
            onSelect={onSelect}
          />
        ))}
        {xTicks(bounds).map((tick) => (
          <text
            key={tick}
            x={xScale(tick, bounds)}
            y={HEIGHT - 14}
            textAnchor="middle"
            className="fill-slate-500 text-[10px]"
          >
            {tick.toFixed(1)}
          </text>
        ))}
        {yTicks(bounds).map((tick) => (
          <text
            key={`label-${tick}`}
            x={MARGIN.left - 8}
            y={yScale(tick, bounds) + 4}
            textAnchor="end"
            className="fill-slate-500 text-[10px]"
          >
            {tick.toFixed(1)}
          </text>
        ))}
        <text
          x={WIDTH / 2}
          y={HEIGHT - 2}
          textAnchor="middle"
          className="fill-slate-400 text-xs"
        >
          Presidential NOMINATE score
        </text>
        <text
          x={16}
          y={HEIGHT / 2}
          textAnchor="middle"
          transform={`rotate(-90 16 ${HEIGHT / 2})`}
          className="fill-slate-400 text-xs"
        >
          Mean AES score
        </text>
      </svg>
    </div>
  );
}

function NominatePointMark({
  row,
  bounds,
  active,
  onSelect,
}: {
  readonly row: NominateFitRow;
  readonly bounds: Bounds;
  readonly active: boolean;
  readonly onSelect: (shortName: string) => void;
}) {
  const point = row.point;
  const cx = xScale(point.nominate, bounds);
  const cy = yScale(point.mean_aes, bounds);
  const radius = Math.max(4, Math.min(11, Math.sqrt(point.n) / 3.4));

  return (
    <g
      role="button"
      tabIndex={0}
      aria-pressed={active}
      aria-label={`${point.short}: NOMINATE ${point.nominate.toFixed(3)}, AES ${point.mean_aes.toFixed(3)}`}
      data-active={active ? "true" : "false"}
      className="cursor-pointer outline-none"
      onClick={() => onSelect(point.short)}
      onMouseEnter={() => onSelect(point.short)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(point.short);
        }
      }}
    >
      {active && (
        <circle
          cx={cx}
          cy={cy}
          r={radius + 5}
          fill="none"
          stroke="#22d3ee"
          strokeOpacity={0.9}
          strokeWidth={1.8}
        />
      )}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill={partyColor(point.party)}
        fillOpacity={active ? 1 : 0.82}
      />
      <text
        x={cx + 8}
        y={cy + 4}
        className={active ? "fill-slate-100 text-[11px]" : "fill-slate-400 text-[10px]"}
      >
        {point.short}
      </text>
    </g>
  );
}

function pointBounds(rows: readonly NominateFitRow[]): Bounds {
  const xs = rows.map((row) => row.point.nominate);
  const ys = rows.flatMap((row) =>
    row.predicted === null
      ? [row.point.mean_aes]
      : [row.point.mean_aes, row.predicted],
  );
  return {
    minX: Math.min(...xs) - 0.05,
    maxX: Math.max(...xs) + 0.05,
    minY: Math.min(0, Math.min(...ys) - 0.05),
    maxY: Math.max(...ys) + 0.08,
  };
}

function xScale(value: number, bounds: Bounds): number {
  const innerW = WIDTH - MARGIN.left - MARGIN.right;
  return MARGIN.left + ((value - bounds.minX) / (bounds.maxX - bounds.minX)) * innerW;
}

function yScale(value: number, bounds: Bounds): number {
  const innerH = HEIGHT - MARGIN.top - MARGIN.bottom;
  return MARGIN.top + (1 - (value - bounds.minY) / (bounds.maxY - bounds.minY)) * innerH;
}

function trendY(nominate: number, metric: NominateMetric): number {
  return (
    metric.weighted_intercept_by_directives +
    metric.weighted_slope_by_directives * nominate
  );
}

function xTicks(bounds: Bounds): readonly number[] {
  return [-0.5, 0, 0.5].filter(
    (tick) => tick >= bounds.minX && tick <= bounds.maxX,
  );
}

function yTicks(bounds: Bounds): readonly number[] {
  return [0, 0.25, 0.5, 0.75].filter(
    (tick) => tick >= bounds.minY && tick <= bounds.maxY,
  );
}
