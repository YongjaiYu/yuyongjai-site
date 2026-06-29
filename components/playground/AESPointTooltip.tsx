import { formatScore, ideologyColor, ideologyLabel } from "./aesConfig";
import type { AESData, Directive } from "./aesTypes";

export type HoveredPoint = {
  readonly d: Directive;
  readonly x: number;
  readonly y: number;
  readonly title?: string;
};

type AESPointTooltipProps = {
  readonly data: AESData;
  readonly hoveredPoint: HoveredPoint;
};

export function AESPointTooltip({ data, hoveredPoint }: AESPointTooltipProps) {
  return (
    <div
      className="pointer-events-none fixed z-50 max-w-xs rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 font-sans text-sm shadow-xl"
      style={{
        left: hoveredPoint.x + 12,
        top: hoveredPoint.y - 10,
        transform: "translateY(-100%)",
      }}
    >
      <div className="mb-1 text-xs text-slate-500">
        {hoveredPoint.d.p} · {hoveredPoint.d.y} ·{" "}
        {data.meta.types[hoveredPoint.d.dt]}
      </div>
      {hoveredPoint.title && (
        <div className="mb-2 text-slate-200">{hoveredPoint.title}</div>
      )}
      <div className="flex items-center gap-3">
        <span
          className={`text-lg font-bold ${
            hoveredPoint.d.s > 0 ? "text-red-400" : "text-blue-400"
          }`}
        >
          {formatScore(hoveredPoint.d.s)}
        </span>
        <span
          className="rounded-full px-2 py-0.5 text-xs"
          style={{
            backgroundColor: `${ideologyColor(hoveredPoint.d.ib)}20`,
            color: ideologyColor(hoveredPoint.d.ib),
          }}
        >
          {ideologyLabel(hoveredPoint.d.ib)}
        </span>
      </div>
    </div>
  );
}
