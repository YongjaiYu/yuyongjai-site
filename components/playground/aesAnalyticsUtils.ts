import type {
  AESAnalyticsData,
  NominateMetric,
  NominatePoint,
  PartyYearBin,
  PartyYearStat,
} from "./aesTypes";
import { TRUMAN_START_YEAR, majorPartyLabel } from "./aesConfig";

export type YearParseConfig = {
  readonly value: string;
  readonly fallback: number;
  readonly minYear: number;
  readonly maxYear: number;
};

export type YearRange = {
  readonly from: number;
  readonly to: number;
};

export type PartyAggregate = {
  readonly party: string;
  readonly n: number;
  readonly mean: number;
  readonly ideological: number;
  readonly nonIdeological: number;
};

export type PartyMeanDifference = {
  readonly democraticMean: number;
  readonly democraticN: number;
  readonly republicanMean: number;
  readonly republicanN: number;
  readonly republicanMinusDemocratic: number;
};

export type DistributionLine = {
  readonly party: string;
  readonly n: number;
  readonly points: readonly DistributionPoint[];
};

export type DistributionPoint = {
  readonly bin: number;
  readonly count: number;
};

export type DistributionMode = "count" | "density";

export type NominateFitRow = {
  readonly point: NominatePoint;
  readonly predicted: number | null;
  readonly residual: number | null;
  readonly absResidual: number | null;
};

export type NominateSampleFit = {
  readonly sample: string;
  readonly row: NominateFitRow | null;
};

export function clampYear(value: number, minYear: number, maxYear: number): number {
  return Math.min(maxYear, Math.max(minYear, value));
}

export function defaultStartYear(data: AESAnalyticsData): number {
  const [minYear, maxYear] = data.meta.year_range;
  return clampYear(TRUMAN_START_YEAR, minYear, maxYear);
}

export function parseYear(config: YearParseConfig): number {
  const parsed = Number.parseInt(config.value, 10);
  if (Number.isNaN(parsed)) {
    return config.fallback;
  }
  return clampYear(parsed, config.minYear, config.maxYear);
}

export function partyAggregates(
  data: AESAnalyticsData,
  range: YearRange,
): readonly PartyAggregate[] {
  const buckets = new Map<string, { n: number; sum: number; ideo: number; non: number }>();
  for (const stat of data.party_year_stats) {
    if (!isInRange(stat, range)) {
      continue;
    }
    const party = majorPartyLabel(stat.party);
    if (party === null) {
      continue;
    }
    const current = buckets.get(party) ?? { n: 0, sum: 0, ideo: 0, non: 0 };
    current.n += stat.n;
    current.sum += stat.mean * stat.n;
    current.ideo += stat.ideological;
    current.non += stat.non_ideological;
    buckets.set(party, current);
  }
  return Array.from(buckets.entries())
    .map(([party, bucket]) => ({
      party,
      n: bucket.n,
      mean: bucket.n === 0 ? 0 : bucket.sum / bucket.n,
      ideological: bucket.ideo,
      nonIdeological: bucket.non,
    }))
    .sort((a, b) => b.n - a.n);
}

export function partyMeanDifference(
  aggregates: readonly PartyAggregate[],
): PartyMeanDifference | null {
  const democratic = aggregates.find((item) => item.party === "Democratic");
  const republican = aggregates.find((item) => item.party === "Republican");
  if (!democratic || !republican) {
    return null;
  }
  return {
    democraticMean: democratic.mean,
    democraticN: democratic.n,
    republicanMean: republican.mean,
    republicanN: republican.n,
    republicanMinusDemocratic: republican.mean - democratic.mean,
  };
}

export function distributionLines(
  data: AESAnalyticsData,
  range: YearRange,
): readonly DistributionLine[] {
  const bins = sortedBins(data);
  const counts = new Map<string, Map<number, number>>();
  const totals = new Map<string, number>();
  for (const row of data.party_year_bins) {
    if (!isBinInRange(row, range)) {
      continue;
    }
    const party = majorPartyLabel(row.party);
    if (party === null) {
      continue;
    }
    const partyCounts = counts.get(party) ?? new Map<number, number>();
    partyCounts.set(row.b, (partyCounts.get(row.b) ?? 0) + row.n);
    counts.set(party, partyCounts);
    totals.set(party, (totals.get(party) ?? 0) + row.n);
  }
  return Array.from(counts.entries())
    .map(([party, partyCounts]) => ({
      party,
      n: totals.get(party) ?? 0,
      points: bins.map((bin) => ({
        bin,
        count: partyCounts.get(bin) ?? 0,
      })),
    }))
    .filter((line) => line.n > 0)
    .sort((a, b) => b.n - a.n);
}

export function sortedBins(data: AESAnalyticsData): readonly number[] {
  return Array.from(new Set(data.party_year_bins.map((row) => row.b))).sort(
    (a, b) => a - b,
  );
}

export function maxDistributionCount(lines: readonly DistributionLine[]): number {
  return Math.max(
    1,
    ...lines.flatMap((line) => line.points.map((point) => point.count)),
  );
}

export function maxDistributionValue(
  lines: readonly DistributionLine[],
  mode: DistributionMode,
): number {
  return Math.max(
    1,
    ...lines.flatMap((line) =>
      line.points.map((point) => distributionPointValue(line, point, mode)),
    ),
  );
}

export function distributionPointValue(
  line: DistributionLine,
  point: DistributionPoint,
  mode: DistributionMode,
): number {
  if (mode === "density") {
    return line.n === 0 ? 0 : (point.count / line.n) * 100;
  }
  return point.count;
}

export function nominateSamples(data: AESAnalyticsData): readonly string[] {
  return Array.from(new Set(data.nominate_points.map((point) => point.sample)));
}

export function nominatePointsForSample(
  data: AESAnalyticsData,
  sample: string,
): readonly NominatePoint[] {
  return data.nominate_points.filter((point) => point.sample === sample);
}

export function nominateMetricForSample(
  data: AESAnalyticsData,
  sample: string,
): NominateMetric | null {
  return data.nominate_metrics.find((metric) => metric.sample === sample) ?? null;
}

export function nominateFitRows(
  points: readonly NominatePoint[],
  metric: NominateMetric | null,
): readonly NominateFitRow[] {
  return points
    .map((point) => {
      if (!metric) {
        return {
          point,
          predicted: null,
          residual: null,
          absResidual: null,
        };
      }
      const predicted =
        metric.weighted_intercept_by_directives +
        metric.weighted_slope_by_directives * point.nominate;
      const residual = point.mean_aes - predicted;
      return {
        point,
        predicted,
        residual,
        absResidual: Math.abs(residual),
      };
    })
    .sort(compareNominateFitRows);
}

export function nominateSampleFits(
  data: AESAnalyticsData,
  samples: readonly string[],
  shortName: string,
): readonly NominateSampleFit[] {
  return samples.map((sample) => {
    const metric = nominateMetricForSample(data, sample);
    const row =
      nominateFitRows(nominatePointsForSample(data, sample), metric).find(
        (fitRow) => fitRow.point.short === shortName,
      ) ?? null;
    return { sample, row };
  });
}

function compareNominateFitRows(
  left: NominateFitRow,
  right: NominateFitRow,
): number {
  if (left.absResidual === null || right.absResidual === null) {
    return right.point.n - left.point.n;
  }
  return right.absResidual - left.absResidual;
}

function isInRange(stat: PartyYearStat, range: YearRange): boolean {
  return stat.y >= range.from && stat.y <= range.to;
}

function isBinInRange(row: PartyYearBin, range: YearRange): boolean {
  return row.y >= range.from && row.y <= range.to;
}
