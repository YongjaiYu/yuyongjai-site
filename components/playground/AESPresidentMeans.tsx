import { IDEOLOGY_COLORS, formatScore, partyColor } from "./aesConfig";
import type { AESAnalyticsData, PresidentMean } from "./aesTypes";

type AESPresidentMeansProps = {
  readonly data: AESAnalyticsData;
  readonly startYear: number;
};

export function AESPresidentMeans({ data, startYear }: AESPresidentMeansProps) {
  const presidents = data.president_means.filter(
    (president) => president.start_year >= startYear,
  );
  const minMean = Math.min(...presidents.map((item) => item.mean_all));
  const maxMean = Math.max(...presidents.map((item) => item.mean_all));
  const liberal = presidents[0];
  const conservative = presidents[presidents.length - 1];
  const gap =
    liberal && conservative ? conservative.mean_all - liberal.mean_all : 0;
  const subgroupGap = largestIdeologyGap(presidents);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div className="max-h-[460px] space-y-2 overflow-y-auto pr-1">
        {presidents.map((president) => (
          <PresidentMeanRow
            key={president.short}
            president={president}
            minMean={minMean}
            maxMean={maxMean}
          />
        ))}
      </div>
      <div className="rounded border border-slate-800 bg-slate-900/30 p-4">
        <div className="text-xs uppercase tracking-widest text-slate-500">
          Presidential gap
        </div>
        <div className="mt-3 text-2xl font-bold text-slate-100">
          {gap.toFixed(3)}
        </div>
        {liberal && conservative && (
          <div className="mt-3 space-y-3 text-sm text-slate-400">
            <div>
              <div className="text-xs text-slate-500">Most liberal mean</div>
              <div className="text-slate-200">
                {liberal.short} ({formatScore(liberal.mean_all)})
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Most conservative mean</div>
              <div className="text-slate-200">
                {conservative.short} ({formatScore(conservative.mean_all)})
              </div>
            </div>
          </div>
        )}
        {subgroupGap && (
          <div className="mt-4 border-t border-slate-800 pt-4 text-sm text-slate-400">
            <div className="text-xs text-slate-500">Largest subgroup gap</div>
            <div className="mt-1 text-slate-200">
              {subgroupGap.short} (
              {formatScore(subgroupGap.difference_ideological_minus_non ?? 0)})
            </div>
          </div>
        )}
        <div className="mt-4 text-xs leading-relaxed text-slate-500">
          The track shows each president&apos;s overall mean, with paired
          ideological and non-ideological means when both groups exist.
        </div>
        <div className="mt-3 text-xs leading-relaxed text-slate-500">
          Displayed sample starts in {startYear}, so this panel begins with
          Truman and excludes prewar presidents.
        </div>
      </div>
    </div>
  );
}

function PresidentMeanRow({
  president,
  minMean,
  maxMean,
}: {
  readonly president: PresidentMean;
  readonly minMean: number;
  readonly maxMean: number;
}) {
  const allPosition = scorePosition(president.mean_all, minMean, maxMean);
  const ideologicalPosition = nullablePosition(
    president.mean_ideological,
    minMean,
    maxMean,
  );
  const nonIdeologicalPosition = nullablePosition(
    president.mean_non_ideological,
    minMean,
    maxMean,
  );
  return (
    <div className="rounded border border-slate-800 bg-slate-900/30 px-3 py-2">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="flex min-w-0 items-center gap-2 text-slate-300">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: partyColor(president.party) }}
          />
          <span className="truncate">{president.short}</span>
          <span className="hidden text-slate-600 sm:inline">
            {president.start_year}-{president.end_year}
          </span>
        </span>
        <span className="font-mono text-slate-200">
          {formatScore(president.mean_all)}
        </span>
      </div>
      <div className="relative mt-2 h-7 rounded bg-slate-950/35">
        <span className="absolute left-0 right-0 top-1/2 h-px bg-slate-800" />
        {ideologicalPosition !== null && nonIdeologicalPosition !== null && (
          <span
            className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-slate-700"
            style={{
              left: `${Math.min(ideologicalPosition, nonIdeologicalPosition)}%`,
              width: `${Math.abs(ideologicalPosition - nonIdeologicalPosition)}%`,
            }}
          />
        )}
        {nonIdeologicalPosition !== null && (
          <ScoreMarker
            label="Non-ideological mean"
            position={nonIdeologicalPosition}
            color={IDEOLOGY_COLORS.non_ideological}
          />
        )}
        {ideologicalPosition !== null && (
          <ScoreMarker
            label="Ideological mean"
            position={ideologicalPosition}
            color={IDEOLOGY_COLORS.ideological}
          />
        )}
        <span
          aria-label="Overall mean"
          className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border border-slate-950"
          style={{
            left: `calc(${allPosition}% - 7px)`,
            backgroundColor: partyColor(president.party),
          }}
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
        <span>N={president.n.toLocaleString()}</span>
        <span>ideo {nullableScore(president.mean_ideological)}</span>
        <span>non-ideo {nullableScore(president.mean_non_ideological)}</span>
        <span>gap {nullableScore(president.difference_ideological_minus_non)}</span>
      </div>
    </div>
  );
}

function ScoreMarker({
  label,
  position,
  color,
}: {
  readonly label: string;
  readonly position: number;
  readonly color: string;
}) {
  return (
    <span
      aria-label={label}
      className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border border-slate-950"
      style={{
        left: `calc(${position}% - 5px)`,
        backgroundColor: color,
      }}
    />
  );
}

function scorePosition(value: number, minMean: number, maxMean: number): number {
  return ((value - minMean) / (maxMean - minMean || 1)) * 100;
}

function nullablePosition(
  value: number | null,
  minMean: number,
  maxMean: number,
): number | null {
  return value === null ? null : scorePosition(value, minMean, maxMean);
}

function largestIdeologyGap(
  presidents: readonly PresidentMean[],
): PresidentMean | null {
  let largest: PresidentMean | null = null;
  let largestMagnitude = -1;
  for (const president of presidents) {
    if (president.difference_ideological_minus_non === null) {
      continue;
    }
    const magnitude = Math.abs(president.difference_ideological_minus_non);
    if (magnitude > largestMagnitude) {
      largest = president;
      largestMagnitude = magnitude;
    }
  }
  return largest;
}

function nullableScore(value: number | null): string {
  return value === null ? "n/a" : formatScore(value);
}
