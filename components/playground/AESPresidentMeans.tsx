import { formatScore, partyColor } from "./aesConfig";
import type { AESAnalyticsData, PresidentMean } from "./aesTypes";

type AESPresidentMeansProps = {
  readonly data: AESAnalyticsData;
  readonly startYear: number;
};

type IdeologicalPresidentMean = PresidentMean & {
  readonly mean_ideological: number;
};

export function AESPresidentMeans({ data, startYear }: AESPresidentMeansProps) {
  const presidents = data.president_means
    .filter(hasIdeologicalMean)
    .filter((president) => president.start_year >= startYear)
    .sort((left, right) => left.mean_ideological - right.mean_ideological);

  if (presidents.length === 0) {
    return (
      <div className="rounded border border-slate-800 bg-slate-900/40 p-5 text-sm text-slate-500">
        Ideological presidential mean AES rows are unavailable.
      </div>
    );
  }

  const minMean = Math.min(...presidents.map((item) => item.mean_ideological));
  const maxMean = Math.max(...presidents.map((item) => item.mean_ideological));
  const liberal = presidents[0];
  const conservative = presidents[presidents.length - 1];
  const spread =
    liberal && conservative
      ? conservative.mean_ideological - liberal.mean_ideological
      : 0;

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
          Presidential ideological mean spread
        </div>
        <div className="mt-3 text-2xl font-bold text-slate-100">
          {spread.toFixed(3)}
        </div>
        {liberal && conservative && (
          <div className="mt-3 space-y-3 text-sm text-slate-400">
            <MeanEndpoint label="Most liberal ideological mean" president={liberal} />
            <MeanEndpoint
              label="Most conservative ideological mean"
              president={conservative}
            />
          </div>
        )}
        <div className="mt-4 border-t border-slate-800 pt-4 text-xs leading-relaxed text-slate-500">
          Each row shows one president&apos;s directive-level mean AES score among
          ideological directives. This panel starts in {startYear}, so it begins
          with Truman.
        </div>
      </div>
    </div>
  );
}

function MeanEndpoint({
  label,
  president,
}: {
  readonly label: string;
  readonly president: IdeologicalPresidentMean;
}) {
  return (
    <div>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-slate-200">
        {president.short} ({formatScore(president.mean_ideological)})
      </div>
    </div>
  );
}

function PresidentMeanRow({
  president,
  minMean,
  maxMean,
}: {
  readonly president: IdeologicalPresidentMean;
  readonly minMean: number;
  readonly maxMean: number;
}) {
  const position = scorePosition(president.mean_ideological, minMean, maxMean);
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
          {formatScore(president.mean_ideological)}
        </span>
      </div>
      <div className="relative mt-2 h-2 rounded-full bg-slate-800">
        <span
          aria-label="President ideological mean AES"
          className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border border-slate-950"
          style={{
            left: `calc(${position}% - 7px)`,
            backgroundColor: partyColor(president.party),
          }}
        />
      </div>
      <div className="mt-2 text-[11px] text-slate-500">
        Ideological N={president.n_ideological.toLocaleString()}
      </div>
    </div>
  );
}

function hasIdeologicalMean(
  president: PresidentMean,
): president is IdeologicalPresidentMean {
  return president.mean_ideological !== null;
}

function scorePosition(value: number, minMean: number, maxMean: number): number {
  return ((value - minMean) / (maxMean - minMean || 1)) * 100;
}
