"use client";

import { useEffect, useMemo, useState } from "react";
import { AESAnalytics } from "./AESAnalytics";
import { AESScatterPlot } from "./AESScatterPlot";
import {
  COLOR_MODES,
  parseFilterType,
  parseIdeologyFilter,
} from "./aesConfig";
import type {
  AESData,
  ColorMode,
  Directive,
  FilterType,
  IdeologyFilter,
} from "./aesTypes";

type FilterState = {
  readonly selectedPresident: string | null;
  readonly filterType: FilterType;
  readonly ideologyFilter: IdeologyFilter;
};

export default function AESExplorer() {
  const [data, setData] = useState<AESData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedPresident, setSelectedPresident] = useState<string | null>(null);
  const [colorMode, setColorMode] = useState<ColorMode>("party");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [ideologyFilter, setIdeologyFilter] = useState<IdeologyFilter>("all");

  useEffect(() => {
    fetch("/data/aes_summary.json")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`AES summary request failed: ${response.status}`);
        }
        const payload: AESData = await response.json();
        setData(payload);
      })
      .catch((fetchError) => {
        if (fetchError instanceof Error) {
          setError(fetchError.message);
        } else {
          setError("AES summary request failed.");
        }
      });
  }, []);

  const filteredData = useMemo(() => {
    if (!data) {
      return [];
    }
    const filters = { selectedPresident, filterType, ideologyFilter };
    return data.data.filter((directive) =>
      matchesFilters(directive, filters),
    );
  }, [data, selectedPresident, filterType, ideologyFilter]);

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center text-slate-500">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-96 items-center justify-center text-slate-500">
        Loading AES directives…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Controls
        data={data}
        selectedPresident={selectedPresident}
        filterType={filterType}
        ideologyFilter={ideologyFilter}
        colorMode={colorMode}
        setSelectedPresident={setSelectedPresident}
        setFilterType={setFilterType}
        setIdeologyFilter={setIdeologyFilter}
        setColorMode={setColorMode}
      />
      <StatsBar
        filteredData={filteredData}
        selectedPresident={selectedPresident}
      />
      <AESScatterPlot
        data={data}
        filteredData={filteredData}
        colorMode={colorMode}
      />
      <AESAnalytics />
    </div>
  );
}

function Controls({
  data,
  selectedPresident,
  filterType,
  ideologyFilter,
  colorMode,
  setSelectedPresident,
  setFilterType,
  setIdeologyFilter,
  setColorMode,
}: {
  readonly data: AESData;
  readonly selectedPresident: string | null;
  readonly filterType: FilterType;
  readonly ideologyFilter: IdeologyFilter;
  readonly colorMode: ColorMode;
  readonly setSelectedPresident: (value: string | null) => void;
  readonly setFilterType: (value: FilterType) => void;
  readonly setIdeologyFilter: (value: IdeologyFilter) => void;
  readonly setColorMode: (value: ColorMode) => void;
}) {
  return (
    <div className="flex flex-wrap gap-4 font-sans text-sm">
      <div>
        <label className="mb-1 block text-xs uppercase tracking-widest text-slate-500">
          President
        </label>
        <select
          value={selectedPresident ?? ""}
          onChange={(event) => setSelectedPresident(event.target.value || null)}
          className="rounded border border-slate-700 bg-slate-900 px-3 py-1.5 text-slate-200 focus:border-cyan-400 focus:outline-none"
        >
          <option value="">All Presidents</option>
          {data.meta.presidents.map((president) => (
            <option key={president.short} value={president.short}>
              {president.short}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs uppercase tracking-widest text-slate-500">
          Type
        </label>
        <select
          value={filterType}
          onChange={(event) => setFilterType(parseFilterType(event.target.value))}
          className="rounded border border-slate-700 bg-slate-900 px-3 py-1.5 text-slate-200 focus:border-cyan-400 focus:outline-none"
        >
          <option value="all">All Types</option>
          {Object.entries(data.meta.types).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs uppercase tracking-widest text-slate-500">
          Ideology
        </label>
        <select
          value={ideologyFilter}
          onChange={(event) =>
            setIdeologyFilter(parseIdeologyFilter(event.target.value))
          }
          className="rounded border border-slate-700 bg-slate-900 px-3 py-1.5 text-slate-200 focus:border-cyan-400 focus:outline-none"
        >
          <option value="all">All</option>
          <option value="ideological">Ideological</option>
          <option value="non_ideological">Non-ideological</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs uppercase tracking-widest text-slate-500">
          Color by
        </label>
        <div className="flex gap-1">
          {COLOR_MODES.map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setColorMode(mode)}
              className={`rounded px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                colorMode === mode
                  ? "bg-cyan-400/20 text-cyan-400"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatsBar({
  filteredData,
  selectedPresident,
}: {
  readonly filteredData: readonly Directive[];
  readonly selectedPresident: string | null;
}) {
  const mean = filteredData.length === 0 ? null : directiveMean(filteredData);
  return (
    <div className="flex flex-wrap gap-6 font-sans text-xs text-slate-500">
      <span>
        Showing{" "}
        <span className="text-slate-300">
          {filteredData.length.toLocaleString()}
        </span>{" "}
        directives
      </span>
      {selectedPresident && mean !== null && (
        <span>
          Mean AES: <span className="text-slate-300">{mean.toFixed(3)}</span>
        </span>
      )}
    </div>
  );
}

function matchesFilters(
  directive: Directive,
  filters: FilterState,
): boolean {
  const matchesPresident =
    filters.selectedPresident === null || directive.p === filters.selectedPresident;
  const matchesType =
    filters.filterType === "all" || directive.dt === filters.filterType;
  const matchesIdeology =
    filters.ideologyFilter === "all" ||
    (filters.ideologyFilter === "ideological" && directive.ib === 1) ||
    (filters.ideologyFilter === "non_ideological" && directive.ib === 0);
  return matchesPresident && matchesType && matchesIdeology;
}

function directiveMean(directives: readonly Directive[]): number {
  return (
    directives.reduce((total, directive) => total + directive.s, 0) /
    directives.length
  );
}
