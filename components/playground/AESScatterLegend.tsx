import { IDEOLOGY_COLORS, partyColor, typeColor } from "./aesConfig";
import type { ColorMode } from "./aesTypes";

type AESScatterLegendProps = {
  readonly colorMode: ColorMode;
  readonly parties: readonly string[];
  readonly types: Readonly<Record<string, string>>;
};

export function AESScatterLegend({
  colorMode,
  parties,
  types,
}: AESScatterLegendProps) {
  if (colorMode === "party") {
    return (
      <div className="flex flex-wrap gap-4 font-sans text-xs text-slate-500">
        {parties.map((party) => (
          <span key={party} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: partyColor(party) }}
            />
            {party}
          </span>
        ))}
      </div>
    );
  }
  if (colorMode === "ideology") {
    return (
      <div className="flex flex-wrap gap-4 font-sans text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: IDEOLOGY_COLORS.ideological }}
          />
          Ideological
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: IDEOLOGY_COLORS.non_ideological }}
          />
          Non-ideological
        </span>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap gap-4 font-sans text-xs text-slate-500">
      {Object.entries(types).map(([key, label]) => (
        <span key={key} className="flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: typeColor(key) }}
          />
          {label}
        </span>
      ))}
    </div>
  );
}
