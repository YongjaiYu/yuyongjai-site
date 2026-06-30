import { formatScore } from "./aesConfig";
import type { CongressComparison } from "./aesTypes";

type AESCongressSummaryProps = {
  readonly row: CongressComparison;
  readonly rows: readonly CongressComparison[];
  readonly onSelect: (congress: number) => void;
};

export function AESCongressSummary({
  row,
  rows,
  onSelect,
}: AESCongressSummaryProps) {
  return (
    <div className="rounded border border-slate-800 bg-slate-900/30 p-4">
      <div className="text-xs uppercase tracking-widest text-slate-500">
        Selected Congress
      </div>
      <div className="mt-2 text-2xl font-bold text-slate-100">
        {row.congress}th
      </div>
      <div className="text-xs text-slate-500">
        {row.start_year}-{row.end_year} · {row.presidents}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Metric label="President AES" value={formatScore(row.president_aes_mean)} />
        <Metric
          label="Congress median"
          value={nullableScore(row.congress_median_nominate)}
        />
        <Metric
          label="President NOM"
          value={nullableScore(row.president_nominate)}
        />
        <Metric label="Directives" value={row.n.toLocaleString()} />
      </div>
      <div className="mt-4 border-t border-slate-800 pt-4 text-xs leading-relaxed text-slate-500">
        House median {nullableScore(row.house_median_nominate)} · Senate median{" "}
        {nullableScore(row.senate_median_nominate)}
      </div>
      <div className="mt-4 space-y-1.5 border-t border-slate-800 pt-4">
        {rows.slice(-5).reverse().map((item) => (
          <button
            key={item.congress}
            type="button"
            aria-pressed={item.congress === row.congress}
            onClick={() => onSelect(item.congress)}
            className={`flex w-full items-center justify-between rounded border px-2.5 py-2 text-xs transition-colors ${
              item.congress === row.congress
                ? "border-cyan-400/50 bg-cyan-400/10 text-slate-100"
                : "border-slate-800 bg-slate-950/35 text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>{item.congress}th</span>
            <span className="font-mono">{formatScore(item.president_aes_mean)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <div className="rounded border border-slate-800 bg-slate-950/35 p-2">
      <div className="text-[11px] text-slate-500">{label}</div>
      <div className="mt-1 font-mono text-sm text-slate-200">{value}</div>
    </div>
  );
}

function nullableScore(value: number | null): string {
  return value === null ? "n/a" : formatScore(value);
}
