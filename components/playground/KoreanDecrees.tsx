"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface PresInfo {
  en: string;
  term: string;
  order: number;
}

interface YearStat {
  total: number;
  by_type: Record<string, number>;
}

interface PresStat {
  total: number;
  by_type: Record<string, number>;
  years: [number, number];
}

interface Summary {
  meta: {
    total: number;
    year_range: [number, number];
    presidents: Record<string, PresInfo>;
    amendment_types: Record<string, string>;
    ministry_en: Record<string, string>;
  };
  yearly: Record<string, YearStat>;
  by_president: Record<string, PresStat>;
  top_ministries: Record<string, number>;
}

interface SearchRecord {
  n: string;
  y: number;
  p: string;
  t: string;
  m: string | null;
}

type Lang = "ko" | "en";

const LABELS: Record<string, Record<Lang, string>> = {
  title: { ko: "대통령령 탐색기", en: "Korean Presidential Decree Explorer" },
  subtitle: {
    ko: "1988년부터 현재까지 대한민국 대통령령 44,345건의 개정 이력을 탐색합니다.",
    en: "Explore 44,345 amendments to Korean presidential decrees from 1988 to March 2026.",
  },
  president: { ko: "대통령", en: "President" },
  allPresidents: { ko: "전체 대통령", en: "All Presidents" },
  type: { ko: "개정유형", en: "Amendment Type" },
  allTypes: { ko: "전체 유형", en: "All Types" },
  search: { ko: "법령명 검색", en: "Search decree name" },
  searchPlaceholder: { ko: "법령명 입력 (예: 소득세법)", en: "Decree name (e.g. 소득세법, Income Tax Act)" },
  yearly: { ko: "연도별 개정 현황", en: "Amendments by Year" },
  byPresident: { ko: "대통령별 현황", en: "By President" },
  byMinistry: { ko: "소관부처별 현황", en: "By Ministry" },
  results: { ko: "검색 결과", en: "Search Results" },
  showing: { ko: "건 표시 중", en: "shown" },
  amendments: { ko: "건", en: "amendments" },
  total: { ko: "총", en: "Total" },
  noResults: { ko: "검색 결과가 없습니다.", en: "No results found." },
  source: {
    ko: "출처: 법제처 국가법령정보센터 (law.go.kr)",
    en: "Source: Korea Legislation Research Institute (law.go.kr)",
  },
};

const TYPE_COLORS: Record<string, string> = {
  "제정": "#10b981",
  "일부개정": "#3b82f6",
  "전부개정": "#8b5cf6",
  "타법개정": "#6b7280",
  "폐지제정": "#ef4444",
};

export default function KoreanDecrees() {
  const [lang, setLang] = useState<Lang>("en");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [searchData, setSearchData] = useState<SearchRecord[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPres, setFilterPres] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const t = useCallback((key: string) => LABELS[key]?.[lang] || key, [lang]);

  useEffect(() => {
    fetch("/data/decree_summary.json")
      .then((r) => r.json())
      .then((d: Summary) => {
        setSummary(d);
        setLoading(false);
      });
  }, []);

  const loadSearchData = useCallback(async () => {
    if (searchData) return searchData;
    setSearchLoading(true);
    const res = await fetch("/data/decree_search.json");
    const data: SearchRecord[] = await res.json();
    setSearchData(data);
    setSearchLoading(false);
    return data;
  }, [searchData]);

  const handleSearch = useCallback(
    async (query: string) => {
      setSearchQuery(query);
      if (query.length >= 2 && !searchData) {
        await loadSearchData();
      }
    },
    [searchData, loadSearchData]
  );

  const searchResults = useMemo(() => {
    if (!searchData) return null;
    if (!filterYear && !filterPres && searchQuery.length < 2) return null;
    let results = searchData;
    if (searchQuery.length >= 2) {
      const q = searchQuery.toLowerCase();
      results = results.filter((d) => d.n.toLowerCase().includes(q));
    }
    if (filterYear) results = results.filter((d) => d.y === filterYear);
    if (filterPres) results = results.filter((d) => d.p === filterPres);
    if (filterType) results = results.filter((d) => d.t === filterType);
    return results.slice(0, 100);
  }, [searchData, searchQuery, filterPres, filterType, filterYear]);

  const drillDown = useCallback(
    async (opts: { year?: number; pres?: string }) => {
      await loadSearchData();
      setFilterYear(opts.year ?? null);
      setFilterPres(opts.pres ?? null);
      setFilterType(null);
      if (!opts.year && !opts.pres) setSearchQuery("");
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    },
    [loadSearchData]
  );

  const presName = useCallback(
    (ko: string) => {
      if (!summary) return ko;
      return lang === "en"
        ? summary.meta.presidents[ko]?.en || ko
        : ko;
    },
    [lang, summary]
  );

  const typeName = useCallback(
    (ko: string) => {
      if (!summary) return ko;
      return lang === "en"
        ? summary.meta.amendment_types[ko] || ko
        : ko;
    },
    [lang, summary]
  );

  const ministryName = useCallback(
    (ko: string) => {
      if (!summary) return ko;
      return lang === "en"
        ? summary.meta.ministry_en[ko] || ko
        : ko;
    },
    [lang, summary]
  );

  if (loading || !summary) {
    return (
      <div className="flex h-96 items-center justify-center text-slate-500">
        Loading decree data…
      </div>
    );
  }

  const sortedPres = Object.entries(summary.meta.presidents).sort(
    (a, b) => a[1].order - b[1].order
  );

  const yearKeys = Object.keys(summary.yearly)
    .map(Number)
    .sort();
  const maxYearCount = Math.max(
    ...yearKeys.map((y) => summary.yearly[String(y)]?.total || 0)
  );

  return (
    <div className="space-y-8">
      {/* Language toggle */}
      <div className="flex justify-end">
        <button
          onClick={() => setLang(lang === "ko" ? "en" : "ko")}
          className="rounded border border-slate-700 px-3 py-1 text-xs font-medium text-slate-400 transition-colors hover:border-slate-500 hover:text-slate-200"
        >
          {lang === "ko" ? "English" : "한국어"}
        </button>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-slate-800 p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500">
            {t("total")}
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-100">
            {summary.meta.total.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500">{t("amendments")}</p>
        </div>
        <div className="rounded-lg border border-slate-800 p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500">
            {t("president")}
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-100">9</p>
          <p className="text-xs text-slate-500">1988–2026</p>
        </div>
        <div className="rounded-lg border border-slate-800 p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500">
            {lang === "ko" ? "소관부처" : "Ministries"}
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-100">
            {Object.keys(summary.top_ministries).length}+
          </p>
        </div>
        <div className="rounded-lg border border-slate-800 p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500">
            {lang === "ko" ? "연평균" : "Per Year"}
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-100">
            {Math.round(summary.meta.total / yearKeys.length).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Yearly bar chart */}
      <div className="rounded-lg border border-slate-800 p-6">
        <h3 className="mb-4 text-sm font-medium text-slate-200">{t("yearly")}</h3>
        <div className="flex items-end gap-[2px]" style={{ height: 160 }}>
          {yearKeys.map((y) => {
            const stat = summary.yearly[String(y)];
            if (!stat) return null;
            const h = (stat.total / maxYearCount) * 100;
            return (
              <div
                key={y}
                className="group relative flex-1 cursor-pointer"
                style={{ height: "100%" }}
                onClick={() => drillDown({ year: y })}
              >
                <div
                  className={`absolute bottom-0 w-full rounded-t-sm transition-colors hover:bg-cyan-400/60 ${filterYear === y ? "bg-cyan-400/70" : "bg-cyan-400/40"}`}
                  style={{ height: `${h}%` }}
                />
                <div className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-[10px] text-slate-200 group-hover:block">
                  {y}: {stat.total.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-slate-600">
          <span>{yearKeys[0]}</span>
          <span>{yearKeys[yearKeys.length - 1]}</span>
        </div>
      </div>

      {/* By President */}
      <div className="rounded-lg border border-slate-800 p-6">
        <h3 className="mb-4 text-sm font-medium text-slate-200">{t("byPresident")}</h3>
        <div className="space-y-2">
          {sortedPres.map(([ko, info]) => {
            const stat = summary.by_president[ko];
            if (!stat) return null;
            const w = (stat.total / summary.meta.total) * 100;
            return (
              <div key={ko} className="flex cursor-pointer items-center gap-3" onClick={() => drillDown({ pres: ko })}>
                <span className={`w-36 flex-shrink-0 text-xs ${filterPres === ko ? "text-cyan-400" : "text-slate-400"}`}>
                  {lang === "en" ? info.en : ko}
                </span>
                <div className="relative h-5 flex-1">
                  <div
                    className="h-full rounded-sm bg-cyan-400/30"
                    style={{ width: `${w}%` }}
                  />
                  <span className="absolute right-0 top-0 pr-1 text-[11px] text-slate-500">
                    {stat.total.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* By Ministry */}
      <div className="rounded-lg border border-slate-800 p-6">
        <h3 className="mb-4 text-sm font-medium text-slate-200">{t("byMinistry")}</h3>
        <div className="space-y-1.5">
          {Object.entries(summary.top_ministries)
            .slice(0, 20)
            .map(([ko, count]) => {
              const maxMin = Object.values(summary.top_ministries)[0];
              const w = (count / maxMin) * 100;
              return (
                <div key={ko} className="flex items-center gap-3">
                  <span className="w-64 flex-shrink-0 truncate text-xs text-slate-400" title={ministryName(ko)}>
                    {ministryName(ko)}
                  </span>
                  <div className="relative h-4 flex-1">
                    <div
                      className="h-full rounded-sm bg-emerald-400/25"
                      style={{ width: `${w}%` }}
                    />
                    <span className="absolute right-0 top-0 pr-1 text-[10px] text-slate-500">
                      {count.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Search */}
      <div ref={resultsRef} className="rounded-lg border border-slate-800 p-6">
        <h3 className="mb-4 text-sm font-medium text-slate-200">{t("search")}</h3>
        {(filterYear || filterPres) && (
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {filterYear && (
              <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-400">
                {filterYear}
                <button onClick={() => setFilterYear(null)} className="ml-1.5 text-cyan-400/60 hover:text-cyan-400">&times;</button>
              </span>
            )}
            {filterPres && (
              <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-400">
                {presName(filterPres)}
                <button onClick={() => setFilterPres(null)} className="ml-1.5 text-cyan-400/60 hover:text-cyan-400">&times;</button>
              </span>
            )}
            <button
              onClick={() => { setFilterYear(null); setFilterPres(null); setFilterType(null); }}
              className="text-[10px] text-slate-500 hover:text-slate-300"
            >
              {lang === "ko" ? "필터 초기화" : "Clear all"}
            </button>
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="flex-1 rounded border border-slate-700 bg-slate-900 px-4 py-2 font-sans text-sm text-slate-200 placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
          />
          <select
            value={filterPres || ""}
            onChange={(e) => setFilterPres(e.target.value || null)}
            className="rounded border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300 focus:border-cyan-400 focus:outline-none"
          >
            <option value="">{t("allPresidents")}</option>
            {sortedPres.map(([ko, info]) => (
              <option key={ko} value={ko}>
                {lang === "en" ? info.en : ko}
              </option>
            ))}
          </select>
          <select
            value={filterType || ""}
            onChange={(e) => setFilterType(e.target.value || null)}
            className="rounded border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300 focus:border-cyan-400 focus:outline-none"
          >
            <option value="">{t("allTypes")}</option>
            {Object.entries(summary.meta.amendment_types).map(([ko, en]) => (
              <option key={ko} value={ko}>
                {lang === "en" ? en : ko}
              </option>
            ))}
          </select>
        </div>

        {searchLoading && (
          <p className="mt-4 text-xs text-slate-500">
            {lang === "ko" ? "검색 데이터 로딩 중..." : "Loading search index..."}
          </p>
        )}

        {searchResults && (
          <div className="mt-4">
            <p className="mb-3 text-xs text-slate-500">
              {searchResults.length >= 100 ? "100+" : searchResults.length}{" "}
              {t("results")} {t("showing")}
            </p>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-left font-sans text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500">
                    <th className="pb-2 pr-4">{lang === "ko" ? "연도" : "Year"}</th>
                    <th className="pb-2 pr-4">{lang === "ko" ? "법령명" : "Decree Name"}</th>
                    <th className="pb-2 pr-4">{t("president")}</th>
                    <th className="pb-2">{t("type")}</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((r, i) => (
                    <tr
                      key={i}
                      className="border-b border-slate-800/50 text-slate-300"
                    >
                      <td className="py-1.5 pr-4 text-slate-500">{r.y}</td>
                      <td className="py-1.5 pr-4">{r.n}</td>
                      <td className="py-1.5 pr-4 text-slate-400">
                        {presName(r.p)}
                      </td>
                      <td className="py-1.5">
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px]"
                          style={{
                            backgroundColor:
                              (TYPE_COLORS[r.t] || "#6b7280") + "20",
                            color: TYPE_COLORS[r.t] || "#6b7280",
                          }}
                        >
                          {typeName(r.t)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {searchResults.length === 0 && (
              <p className="mt-2 text-xs text-slate-500">{t("noResults")}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
