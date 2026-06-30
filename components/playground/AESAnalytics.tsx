"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ANALYTICS_TABS,
  TRUMAN_START_YEAR,
  assertNever,
} from "./aesConfig";
import { defaultStartYear, parseYear } from "./aesAnalyticsUtils";
import { AESNominatePanel } from "./AESNominatePanel";
import { AESPartyDistribution } from "./AESPartyDistribution";
import { AESPresidentMeans } from "./AESPresidentMeans";
import { AESYearRangeControls } from "./AESYearRangeControls";
import type { AESAnalyticsData, AnalyticsTab } from "./aesTypes";

export function AESAnalytics() {
  const [data, setData] = useState<AESAnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("party");
  const [fromYear, setFromYear] = useState(String(TRUMAN_START_YEAR));
  const [toYear, setToYear] = useState("2026");

  useEffect(() => {
    fetch("/data/aes_analytics.json")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`AES analytics request failed: ${response.status}`);
        }
        const payload: AESAnalyticsData = await response.json();
        setData(payload);
        setFromYear(String(defaultStartYear(payload)));
        setToYear(String(payload.meta.year_range[1]));
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
      return {
        from: parseYear({
          value: fromYear,
          fallback: TRUMAN_START_YEAR,
          minYear: TRUMAN_START_YEAR,
          maxYear: TRUMAN_START_YEAR,
        }),
        to: parseYear({
          value: toYear,
          fallback: TRUMAN_START_YEAR,
          minYear: TRUMAN_START_YEAR,
          maxYear: TRUMAN_START_YEAR,
        }),
      };
    }
    const [minYear, maxYear] = data.meta.year_range;
    const parsedFrom = parseYear({
      value: fromYear,
      fallback: defaultStartYear(data),
      minYear,
      maxYear,
    });
    const parsedTo = parseYear({
      value: toYear,
      fallback: maxYear,
      minYear,
      maxYear,
    });
    const from = Math.min(parsedFrom, parsedTo);
    const to = Math.max(parsedFrom, parsedTo);
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

  return (
    <section className="overflow-hidden rounded border border-slate-800 bg-slate-950/40 p-5 font-sans">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">
            {tabTitle(activeTab)}
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
            {tabDescription(activeTab)}
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
        <AESYearRangeControls
          data={data}
          fromYear={fromYear}
          toYear={toYear}
          range={yearRange}
          setFromYear={setFromYear}
          setToYear={setToYear}
        />
      )}
      {activeTab === "party" && (
        <AESPartyDistribution data={data} range={yearRange} />
      )}
      {activeTab === "presidents" && (
        <AESPresidentMeans data={data} startYear={defaultStartYear(data)} />
      )}
      {activeTab === "nominate" && <AESNominatePanel data={data} />}
    </section>
  );
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

function tabTitle(tab: AnalyticsTab): string {
  switch (tab) {
    case "party":
      return "Party Distribution";
    case "presidents":
      return "President Means";
    case "nominate":
      return "NOMINATE Validation";
    default:
      return assertNever(tab);
  }
}

function tabDescription(tab: AnalyticsTab): string {
  switch (tab) {
    case "party":
      return "Compare score distributions and party means for the selected period.";
    case "presidents":
      return "Compare directive-level presidential means from Truman onward.";
    case "nominate":
      return "Compare Truman-onward AES means with presidential NOMINATE scores.";
    default:
      return assertNever(tab);
  }
}
