"use client";

import { useEffect, useMemo, useState } from "react";
import { ANALYTICS_TABS, assertNever } from "./aesConfig";
import { clampYear } from "./aesAnalyticsUtils";
import { AESNominatePanel } from "./AESNominatePanel";
import { AESPartyDistribution } from "./AESPartyDistribution";
import { AESPresidentMeans } from "./AESPresidentMeans";
import type { AESAnalyticsData, AnalyticsTab } from "./aesTypes";

type YearParseConfig = {
  readonly value: string;
  readonly fallback: number;
  readonly minYear: number;
  readonly maxYear: number;
};

export function AESAnalytics() {
  const [data, setData] = useState<AESAnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("party");
  const [fromYear, setFromYear] = useState(1789);
  const [toYear, setToYear] = useState(2026);

  useEffect(() => {
    fetch("/data/aes_analytics.json")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`AES analytics request failed: ${response.status}`);
        }
        const payload: AESAnalyticsData = await response.json();
        setData(payload);
        setFromYear(payload.meta.year_range[0]);
        setToYear(payload.meta.year_range[1]);
      })
      .catch((fetchError) => {
        if (fetchError instanceof Error) {
          setError(fetchError.message);
        } else {
          setError("AES analytics request failed.");
        }
      });
  }, []);

  const yearRange = useMemo(() => {
    if (!data) {
      return { from: fromYear, to: toYear };
    }
    const [minYear, maxYear] = data.meta.year_range;
    const from = clampYear(Math.min(fromYear, toYear), minYear, maxYear);
    const to = clampYear(Math.max(fromYear, toYear), minYear, maxYear);
    return { from, to };
  }, [data, fromYear, toYear]);

  if (error) {
    return (
      <section className="rounded border border-slate-800 bg-slate-900/30 p-5 font-sans text-sm text-slate-500">
        {error}
      </section>
    );
  }

  if (!data) {
    return (
      <section className="rounded border border-slate-800 bg-slate-900/30 p-5 font-sans text-sm text-slate-500">
        Loading AES analytics…
      </section>
    );
  }

  const [minYear, maxYear] = data.meta.year_range;

  return (
    <section className="rounded border border-slate-800 bg-slate-950/40 p-5 font-sans">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">
            Party Distribution
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
            Compare score distributions by party, then switch to presidential
            means or the Truman-onward NOMINATE validation.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {ANALYTICS_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === tab
                  ? "bg-cyan-400/20 text-cyan-300"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {tabLabel(tab)}
            </button>
          ))}
        </div>
      </div>
      {activeTab === "party" && (
        <div className="mb-5 flex flex-wrap items-end gap-3">
          <YearInput
            label="From"
            value={fromYear}
            minYear={minYear}
            maxYear={maxYear}
            onChange={setFromYear}
          />
          <YearInput
            label="To"
            value={toYear}
            minYear={minYear}
            maxYear={maxYear}
            onChange={setToYear}
          />
          <div className="pb-1 text-xs text-slate-500">
            Showing {yearRange.from}-{yearRange.to}
          </div>
        </div>
      )}
      {activeTab === "party" && (
        <AESPartyDistribution data={data} range={yearRange} />
      )}
      {activeTab === "presidents" && <AESPresidentMeans data={data} />}
      {activeTab === "nominate" && <AESNominatePanel data={data} />}
    </section>
  );
}

function YearInput({
  label,
  value,
  minYear,
  maxYear,
  onChange,
}: {
  readonly label: string;
  readonly value: number;
  readonly minYear: number;
  readonly maxYear: number;
  readonly onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-widest text-slate-500">
        {label}
      </span>
      <input
        type="number"
        min={minYear}
        max={maxYear}
        value={value}
        onChange={(event) =>
          onChange(
            parseYear({
              value: event.target.value,
              fallback: value,
              minYear,
              maxYear,
            }),
          )
        }
        className="w-28 rounded border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-200 focus:border-cyan-400 focus:outline-none"
      />
    </label>
  );
}

function parseYear(config: YearParseConfig): number {
  const parsed = Number.parseInt(config.value, 10);
  if (Number.isNaN(parsed)) {
    return config.fallback;
  }
  return clampYear(parsed, config.minYear, config.maxYear);
}

function tabLabel(tab: AnalyticsTab): string {
  switch (tab) {
    case "party":
      return "Party distribution";
    case "presidents":
      return "President means";
    case "nominate":
      return "NOMINATE";
    default:
      return assertNever(tab);
  }
}
