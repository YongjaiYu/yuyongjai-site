import { formatScore } from "./aesConfig";
import type { PartyGap } from "./aesTypes";

type AESPartyGapSummaryProps = {
  readonly gaps: readonly PartyGap[];
};

export function AESPartyGapSummary({ gaps }: AESPartyGapSummaryProps) {
  if (gaps.length === 0) {
    return null;
  }

  return (
    <div className="rounded border border-slate-800 bg-slate-900/30 p-3">
      <div className="text-xs uppercase tracking-widest text-slate-500">
        Party gap tests
      </div>
      <div className="mt-3 space-y-2">
        {gaps.map((gap) => (
          <div
            key={gap.sample}
            className="rounded border border-slate-800 bg-slate-950/35 px-2.5 py-2"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-medium text-slate-300">
                {partyGapLabel(gap)}
              </span>
              <span className="font-mono text-xs text-cyan-200">
                {formatScore(gap.diff_R_minus_D)}
              </span>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] text-slate-500">
              <GapMetric label="Cohen's d" value={gap.cohens_d_R_minus_D.toFixed(2)} />
              <GapMetric label="p" value={formatPValue(gap.p_value)} />
              <GapMetric
                label="N"
                value={(gap.n_D + gap.n_R).toLocaleString()}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GapMetric({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string;
}) {
  return (
    <div>
      <div>{label}</div>
      <div className="font-mono text-slate-300">{value}</div>
    </div>
  );
}

function formatPValue(value: number): string {
  if (value < 0.001) {
    return "<.001";
  }
  return value.toFixed(3);
}

function partyGapLabel(gap: PartyGap): string {
  switch (gap.sample) {
    case "all_truman_on_dr":
      return "All directives";
    case "ideological_truman_on_dr":
      return "Ideological";
    case "non_ideological_truman_on_dr":
      return "Non-ideological";
    default:
      return gap.sample;
  }
}
