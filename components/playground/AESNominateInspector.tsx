import { partyColor } from "./aesConfig";
import type { NominateMetric } from "./aesTypes";
import type { NominateFitRow } from "./aesAnalyticsUtils";

type AESNominateInspectorProps = {
  readonly metric: NominateMetric | null;
  readonly activeRow: NominateFitRow | null;
  readonly rows: readonly NominateFitRow[];
  readonly onSelect: (shortName: string) => void;
};

export function AESNominateInspector({
  metric,
  activeRow,
  rows,
  onSelect,
}: AESNominateInspectorProps) {
  return (
    <div className="rounded border border-slate-800 bg-slate-900/30 p-4">
      <div className="text-xs uppercase tracking-widest text-slate-500">
        Relationship
      </div>
      {metric ? (
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Metric label="Pearson r" value={metric.pearson_r.toFixed(3)} />
          <Metric label="Spearman rho" value={metric.spearman_rho.toFixed(3)} />
          <Metric label="p-value" value={metric.pearson_p.toExponential(2)} />
          <Metric
            label="Weighted slope"
            value={metric.weighted_slope_by_directives.toFixed(3)}
          />
        </div>
      ) : (
        <div className="mt-3 text-sm text-slate-500">No metric for sample.</div>
      )}
      <div className="mt-4 border-t border-slate-800 pt-4">
        {activeRow ? (
          <ActivePresident row={activeRow} />
        ) : (
          <div className="text-sm text-slate-500">
            Select a president to inspect model fit.
          </div>
        )}
      </div>
      <div className="mt-4 border-t border-slate-800 pt-4">
        <div className="mb-2 text-xs uppercase tracking-widest text-slate-500">
          Largest residuals
        </div>
        <div className="space-y-1.5">
          {rows.slice(0, 5).map((row) => {
            const active = row.point.short === activeRow?.point.short;
            return (
              <button
                key={row.point.short}
                type="button"
                aria-pressed={active}
                onClick={() => onSelect(row.point.short)}
                className={`flex w-full items-center justify-between gap-3 rounded border px-2.5 py-2 text-left text-xs transition-colors ${
                  active
                    ? "border-cyan-400/50 bg-cyan-400/10 text-slate-100"
                    : "border-slate-800 bg-slate-950/35 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: partyColor(row.point.party) }}
                  />
                  <span className="truncate">{row.point.short}</span>
                </span>
                <span className="font-mono text-slate-300">
                  {row.residual === null ? "n/a" : signed(row.residual)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-4 border-t border-slate-800 pt-4 text-xs leading-relaxed text-slate-500">
        Click or hover a point to compare its observed AES mean against the
        weighted regression line. Residuals above zero are more conservative on
        AES than NOMINATE predicts.
      </div>
    </div>
  );
}

function ActivePresident({ row }: { readonly row: NominateFitRow }) {
  const point = row.point;
  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-100">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: partyColor(point.party) }}
            />
            {point.short}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {point.min_year}-{point.max_year} · N={point.n.toLocaleString()}
          </div>
        </div>
        <div className="font-mono text-lg text-cyan-200">
          {row.residual === null ? "n/a" : signed(row.residual)}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        <FitMetric label="AES mean" value={signed(point.mean_aes)} />
        <FitMetric label="NOMINATE" value={signed(point.nominate)} />
        <FitMetric
          label="Predicted AES"
          value={row.predicted === null ? "n/a" : signed(row.predicted)}
        />
        <FitMetric
          label="Residual"
          value={row.residual === null ? "n/a" : signed(row.residual)}
        />
      </div>
    </div>
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

function FitMetric({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string;
}) {
  return (
    <div>
      <div className="text-slate-500">{label}</div>
      <div className="font-mono text-slate-200">{value}</div>
    </div>
  );
}

function signed(value: number): string {
  return `${value > 0 ? "+" : ""}${value.toFixed(3)}`;
}
