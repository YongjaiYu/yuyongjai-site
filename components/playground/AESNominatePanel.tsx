"use client";

import { useMemo, useState } from "react";
import { partyColor } from "./aesConfig";
import {
  nominateMetricForSample,
  nominatePointsForSample,
  nominateSamples,
} from "./aesAnalyticsUtils";
import type { AESAnalyticsData, NominatePoint } from "./aesTypes";

type AESNominatePanelProps = {
  readonly data: AESAnalyticsData;
};

const WIDTH = 760;
const HEIGHT = 320;
const MARGIN = { top: 24, right: 32, bottom: 42, left: 54 };

export function AESNominatePanel({ data }: AESNominatePanelProps) {
  const samples = nominateSamples(data);
  const defaultSample = samples.includes("All directives")
    ? "All directives"
    : samples[0] ?? "";
  const [sample, setSample] = useState(defaultSample);
  const points = useMemo(
    () => nominatePointsForSample(data, sample),
    [data, sample],
  );
  const metric = nominateMetricForSample(data, sample);
  const bounds = useMemo(() => pointBounds(points), [points]);

  if (points.length === 0) {
    return (
      <div className="rounded border border-slate-800 bg-slate-900/40 p-5 text-sm text-slate-500">
        NOMINATE validation rows are unavailable.
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {samples.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setSample(name)}
              className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                sample === name
                  ? "bg-cyan-400/20 text-cyan-300"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto rounded border border-slate-800 bg-slate-900/30 p-4">
          <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full min-w-[620px]">
            <line
              x1={MARGIN.left}
              x2={WIDTH - MARGIN.right}
              y1={yScale(0, bounds)}
              y2={yScale(0, bounds)}
              stroke="#334155"
              strokeWidth={0.8}
              strokeDasharray="4,4"
            />
            {metric && (
              <line
                x1={xScale(bounds.minX, bounds)}
                x2={xScale(bounds.maxX, bounds)}
                y1={yScale(trendY(bounds.minX, metric), bounds)}
                y2={yScale(trendY(bounds.maxX, metric), bounds)}
                stroke="#22d3ee"
                strokeWidth={1.6}
                strokeOpacity={0.72}
              />
            )}
            {points.map((point) => (
              <g key={`${point.sample}-${point.president}`}>
                <circle
                  cx={xScale(point.nominate, bounds)}
                  cy={yScale(point.mean_aes, bounds)}
                  r={Math.max(4, Math.min(10, Math.sqrt(point.n) / 3.4))}
                  fill={partyColor(point.party)}
                  fillOpacity={0.86}
                />
                <text
                  x={xScale(point.nominate, bounds) + 8}
                  y={yScale(point.mean_aes, bounds) + 4}
                  className="fill-slate-400 text-[10px]"
                >
                  {point.short}
                </text>
              </g>
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
                key={tick}
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
          </svg>
        </div>
      </div>
      <div className="rounded border border-slate-800 bg-slate-900/30 p-4">
        <div className="text-xs uppercase tracking-widest text-slate-500">
          Relationship
        </div>
        {metric ? (
          <div className="mt-3 space-y-3">
            <Metric label="Pearson r" value={metric.pearson_r.toFixed(3)} />
            <Metric label="p-value" value={metric.pearson_p.toExponential(2)} />
            <Metric
              label="Weighted slope"
              value={metric.weighted_slope_by_directives.toFixed(3)}
            />
            <Metric
              label="Presidents"
              value={metric.n_presidents.toLocaleString()}
            />
          </div>
        ) : (
          <div className="mt-3 text-sm text-slate-500">No metric for sample.</div>
        )}
        <div className="mt-4 text-xs leading-relaxed text-slate-500">
          Points are Truman-onward presidents; point size follows directive
          count in the selected sample.
        </div>
      </div>
    </div>
  );
}

type Bounds = {
  readonly minX: number;
  readonly maxX: number;
  readonly minY: number;
  readonly maxY: number;
};

function pointBounds(points: readonly NominatePoint[]): Bounds {
  const xs = points.map((point) => point.nominate);
  const ys = points.map((point) => point.mean_aes);
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

function trendY(
  nominate: number,
  metric: { readonly weighted_slope_by_directives: number; readonly weighted_intercept_by_directives: number },
): number {
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

function Metric({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <div>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-mono text-lg text-slate-100">{value}</div>
    </div>
  );
}
