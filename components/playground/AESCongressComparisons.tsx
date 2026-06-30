"use client";

import { useMemo, useState } from "react";
import { AESCongressChart } from "./AESCongressChart";
import { AESCongressSummary } from "./AESCongressSummary";
import type { AESAnalyticsData } from "./aesTypes";

type AESCongressComparisonsProps = {
  readonly data: AESAnalyticsData;
  readonly startYear: number;
};

export function AESCongressComparisons({
  data,
  startYear,
}: AESCongressComparisonsProps) {
  const rows = useMemo(
    () =>
      data.congress_comparisons.filter((row) => row.start_year >= startYear),
    [data, startYear],
  );
  const [selectedCongress, setSelectedCongress] = useState<number | null>(null);
  const selected =
    rows.find((row) => row.congress === selectedCongress) ??
    rows[rows.length - 1] ??
    null;

  if (!selected || rows.length === 0) {
    return (
      <div className="rounded border border-slate-800 bg-slate-900/40 p-5 text-sm text-slate-500">
        Congress comparison rows are unavailable.
      </div>
    );
  }

  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
      <AESCongressChart
        rows={rows}
        selected={selected}
        onSelect={setSelectedCongress}
      />
      <AESCongressSummary
        row={selected}
        rows={rows}
        onSelect={setSelectedCongress}
      />
    </div>
  );
}
