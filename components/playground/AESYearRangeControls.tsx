import { LINCOLN_START_YEAR } from "./aesConfig";
import {
  clampYear,
  defaultStartYear,
  parseYear,
} from "./aesAnalyticsUtils";
import type { AESAnalyticsData } from "./aesTypes";
import type { YearRange } from "./aesAnalyticsUtils";

type AESYearRangeControlsProps = {
  readonly data: AESAnalyticsData;
  readonly fromYear: string;
  readonly toYear: string;
  readonly range: YearRange;
  readonly setFromYear: (value: string) => void;
  readonly setToYear: (value: string) => void;
};

export function AESYearRangeControls({
  data,
  fromYear,
  toYear,
  range,
  setFromYear,
  setToYear,
}: AESYearRangeControlsProps) {
  const [minYear, maxYear] = data.meta.year_range;

  return (
    <div className="mb-5 flex flex-wrap items-end gap-3">
      <YearInput
        label="From"
        value={fromYear}
        minYear={minYear}
        maxYear={maxYear}
        onChange={setFromYear}
        onBlur={() =>
          setFromYear(
            String(
              parseYear({
                value: fromYear,
                fallback: range.from,
                minYear,
                maxYear,
              }),
            ),
          )
        }
      />
      <YearInput
        label="To"
        value={toYear}
        minYear={minYear}
        maxYear={maxYear}
        onChange={setToYear}
        onBlur={() =>
          setToYear(
            String(
              parseYear({
                value: toYear,
                fallback: range.to,
                minYear,
                maxYear,
              }),
            ),
          )
        }
      />
      <div className="pb-1 text-xs text-slate-500">
        Showing {range.from}-{range.to}
      </div>
      <div className="flex gap-1 pb-0.5">
        <YearPresetButton
          label="Truman onward"
          onClick={() => setFromYear(String(defaultStartYear(data)))}
        />
        <YearPresetButton
          label="Lincoln onward"
          onClick={() =>
            setFromYear(String(clampYear(LINCOLN_START_YEAR, minYear, maxYear)))
          }
        />
      </div>
    </div>
  );
}

function YearInput({
  label,
  value,
  minYear,
  maxYear,
  onChange,
  onBlur,
}: {
  readonly label: string;
  readonly value: string;
  readonly minYear: number;
  readonly maxYear: number;
  readonly onChange: (value: string) => void;
  readonly onBlur: () => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-widest text-slate-500">
        {label}
      </span>
      <input
        type="number"
        inputMode="numeric"
        min={minYear}
        max={maxYear}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        className="w-28 rounded border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-200 focus:border-cyan-400 focus:outline-none"
      />
    </label>
  );
}

function YearPresetButton({
  label,
  onClick,
}: {
  readonly label: string;
  readonly onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-slate-200"
    >
      {label}
    </button>
  );
}
