"use client";

import { useMemo, useState } from "react";
import { AESNominateInspector } from "./AESNominateInspector";
import { AESNominateScatter } from "./AESNominateScatter";
import {
  nominateFitRows,
  nominateMetricForSample,
  nominatePointsForSample,
  nominateSampleFits,
  nominateSamples,
} from "./aesAnalyticsUtils";
import type { AESAnalyticsData } from "./aesTypes";

type AESNominatePanelProps = {
  readonly data: AESAnalyticsData;
};

export function AESNominatePanel({ data }: AESNominatePanelProps) {
  const samples = nominateSamples(data);
  const defaultSample = samples.includes("All directives")
    ? "All directives"
    : samples[0] ?? "";
  const [sample, setSample] = useState(defaultSample);
  const [selectedShort, setSelectedShort] = useState<string | null>(null);
  const [hoveredShort, setHoveredShort] = useState<string | null>(null);
  const points = useMemo(
    () => nominatePointsForSample(data, sample),
    [data, sample],
  );
  const metric = nominateMetricForSample(data, sample);
  const rows = useMemo(() => nominateFitRows(points, metric), [points, metric]);
  const activeShort = hoveredShort ?? selectedShort;
  const activeRow =
    rows.find((row) => row.point.short === activeShort) ?? rows[0] ?? null;
  const sampleFits = useMemo(
    () =>
      activeRow
        ? nominateSampleFits(data, samples, activeRow.point.short)
        : [],
    [activeRow, data, samples],
  );

  if (points.length === 0) {
    return (
      <div className="rounded border border-slate-800 bg-slate-900/40 p-5 text-sm text-slate-500">
        NOMINATE validation rows are unavailable.
      </div>
    );
  }

  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {samples.map((name) => (
              <button
                key={name}
                type="button"
                aria-pressed={sample === name}
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
          <div className="text-xs text-slate-500">
            Active:{" "}
            <span className="font-medium text-slate-300">
              {activeRow?.point.short ?? "none"}
            </span>
          </div>
        </div>
        <AESNominateScatter
          rows={rows}
          metric={metric}
          activeShort={activeShort}
          onSelect={setSelectedShort}
          onHover={setHoveredShort}
        />
      </div>
      <AESNominateInspector
        metric={metric}
        activeRow={activeRow}
        sample={sample}
        sampleFits={sampleFits}
        rows={rows}
        onSelect={setSelectedShort}
      />
    </div>
  );
}
