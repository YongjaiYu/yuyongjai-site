import { partyColor } from "./aesConfig";
import type { AESAnalyticsData, PresidentMean } from "./aesTypes";

type AESPresidentMeansProps = {
  readonly data: AESAnalyticsData;
};

export function AESPresidentMeans({ data }: AESPresidentMeansProps) {
  const presidents = data.president_means;
  const minMean = Math.min(...presidents.map((item) => item.mean_all));
  const maxMean = Math.max(...presidents.map((item) => item.mean_all));
  const liberal = presidents[0];
  const conservative = presidents[presidents.length - 1];
  const gap =
    liberal && conservative ? conservative.mean_all - liberal.mean_all : 0;

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
                {liberal.short} ({signed(liberal.mean_all)})
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Most conservative mean</div>
              <div className="text-slate-200">
                {conservative.short} ({signed(conservative.mean_all)})
              </div>
            </div>
          </div>
        )}
        <div className="mt-4 text-xs leading-relaxed text-slate-500">
          Bars show each president&apos;s directive-level mean AES over the strict
          corpus. Ideological and non-ideological means are listed when both
          groups exist.
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
  const position = ((president.mean_all - minMean) / (maxMean - minMean || 1)) * 100;

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
        <span className="font-mono text-slate-200">{signed(president.mean_all)}</span>
      </div>
      <div className="relative mt-2 h-2 rounded-full bg-slate-800">
        <span
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border border-slate-950"
          style={{
            left: `calc(${position}% - 6px)`,
            backgroundColor: partyColor(president.party),
          }}
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
        <span>N={president.n.toLocaleString()}</span>
        <span>ideo {nullableScore(president.mean_ideological)}</span>
        <span>non-ideo {nullableScore(president.mean_non_ideological)}</span>
      </div>
    </div>
  );
}

function signed(value: number): string {
  return `${value > 0 ? "+" : ""}${value.toFixed(3)}`;
}

function nullableScore(value: number | null): string {
  return value === null ? "n/a" : signed(value);
}
