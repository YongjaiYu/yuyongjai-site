import { partyColor } from "./aesConfig";
import {
  distributionLines,
  maxDistributionCount,
  partyAggregates,
  partyMeanDifference,
  sortedBins,
} from "./aesAnalyticsUtils";
import type { AESAnalyticsData } from "./aesTypes";
import type { PartyMeanDifference, YearRange } from "./aesAnalyticsUtils";

type AESPartyDistributionProps = {
  readonly data: AESAnalyticsData;
  readonly range: YearRange;
};

const WIDTH = 880;
const HEIGHT = 260;
const MARGIN = { top: 22, right: 26, bottom: 38, left: 52 };

export function AESPartyDistribution({ data, range }: AESPartyDistributionProps) {
  const aggregates = partyAggregates(data, range);
  const lines = distributionLines(data, range);
  const bins = sortedBins(data);
  const maxCount = maxDistributionCount(lines);
  const maxPartyCount = Math.max(1, ...aggregates.map((item) => item.n));
  const difference = partyMeanDifference(aggregates);

  if (aggregates.length === 0) {
    return (
      <div className="rounded border border-slate-800 bg-slate-900/40 p-5 text-sm text-slate-500">
        No directives in this period.
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.75fr)]">
      <div className="overflow-x-auto rounded border border-slate-800 bg-slate-900/30 p-4">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full min-w-[620px]">
          {yTicks(maxCount).map((tick) => (
            <line
              key={tick}
              x1={MARGIN.left}
              x2={WIDTH - MARGIN.right}
              y1={yScale(tick, maxCount)}
              y2={yScale(tick, maxCount)}
              stroke="#1e293b"
              strokeWidth={0.7}
              strokeDasharray="4,4"
            />
          ))}
          {lines.map((line) => (
            <polyline
              key={line.party}
              fill="none"
              stroke={partyColor(line.party)}
              strokeWidth={line.party === "Democratic" || line.party === "Republican" ? 2.4 : 1.5}
              strokeOpacity={line.party === "Democratic" || line.party === "Republican" ? 0.95 : 0.58}
              points={line.points
                .map((point) => `${xScale(point.bin, bins)},${yScale(point.count, maxCount)}`)
                .join(" ")}
            />
          ))}
          {scoreTicks(bins).map((bin) => (
            <text
              key={bin}
              x={xScale(bin, bins)}
              y={HEIGHT - 12}
              textAnchor="middle"
              className="fill-slate-500 text-[10px]"
            >
              {bin.toFixed(1)}
            </text>
          ))}
          {yTicks(maxCount).map((tick) => (
            <text
              key={`label-${tick}`}
              x={MARGIN.left - 8}
              y={yScale(tick, maxCount) + 4}
              textAnchor="end"
              className="fill-slate-500 text-[10px]"
            >
              {tick.toLocaleString()}
            </text>
          ))}
          <text
            x={WIDTH / 2}
            y={HEIGHT - 2}
            textAnchor="middle"
            className="fill-slate-400 text-xs"
          >
            AES score bins
          </text>
        </svg>
      </div>
      <div className="space-y-3">
        {difference && <PartyDifferenceCard difference={difference} />}
        {aggregates.map((item) => (
          <div key={item.party} className="rounded border border-slate-800 bg-slate-900/30 p-3">
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 font-medium text-slate-200">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: partyColor(item.party) }}
                />
                {item.party}
              </span>
              <span className="text-xs text-slate-500">
                mean {signed(item.mean)}
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-800">
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${Math.max(3, (item.n / maxPartyCount) * 100)}%`,
                  backgroundColor: partyColor(item.party),
                }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-slate-500">
              <span>{item.n.toLocaleString()} directives</span>
              <span>{ideologyShare(item)} ideological</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PartyDifferenceCard({
  difference,
}: {
  readonly difference: PartyMeanDifference;
}) {
  return (
    <div className="rounded border border-cyan-400/25 bg-cyan-400/5 p-3">
      <div className="text-xs uppercase tracking-widest text-slate-500">
        D/R mean difference
      </div>
      <div className="mt-2 flex items-baseline justify-between gap-3">
        <span className="text-sm text-slate-400">R minus D</span>
        <span className="font-mono text-lg font-semibold text-cyan-200">
          {signed(difference.republicanMinusDemocratic)}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500">
        <div>
          <div className="text-slate-400">Democratic mean</div>
          <div>
            {signed(difference.democraticMean)} · N=
            {difference.democraticN.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-slate-400">Republican mean</div>
          <div>
            {signed(difference.republicanMean)} · N=
            {difference.republicanN.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}

function xScale(bin: number, bins: readonly number[]): number {
  const minBin = bins[0] ?? -2;
  const maxBin = bins[bins.length - 1] ?? 2;
  const innerW = WIDTH - MARGIN.left - MARGIN.right;
  return MARGIN.left + ((bin - minBin) / (maxBin - minBin)) * innerW;
}

function yScale(count: number, maxCount: number): number {
  const innerH = HEIGHT - MARGIN.top - MARGIN.bottom;
  return MARGIN.top + (1 - count / maxCount) * innerH;
}

function yTicks(maxCount: number): readonly number[] {
  const step = Math.max(1, Math.ceil(maxCount / 4 / 10) * 10);
  return [0, step, step * 2, step * 3, step * 4].filter(
    (tick) => tick <= maxCount,
  );
}

function scoreTicks(bins: readonly number[]): readonly number[] {
  return bins.filter((_, index) => index % 4 === 0);
}

function signed(value: number): string {
  return `${value > 0 ? "+" : ""}${value.toFixed(3)}`;
}

function ideologyShare(item: { readonly ideological: number; readonly n: number }): string {
  if (item.n === 0) {
    return "0%";
  }
  return `${Math.round((item.ideological / item.n) * 100)}%`;
}
