"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { MouseEvent } from "react";
import {
  CHART_DIMENSIONS,
  buildScales,
  buildScoreTicks,
  buildYearTicks,
  directiveColor,
  findClosestPoint,
} from "./aesChartUtils";
import { AESPointTooltip } from "./AESPointTooltip";
import type { HoveredPoint } from "./AESPointTooltip";
import { AESScatterLegend } from "./AESScatterLegend";
import type { AESData, ColorMode, DetailDirective, Directive } from "./aesTypes";

type AESScatterPlotProps = {
  readonly data: AESData;
  readonly filteredData: readonly Directive[];
  readonly colorMode: ColorMode;
};

export function AESScatterPlot({
  data,
  filteredData,
  colorMode,
}: AESScatterPlotProps) {
  const [hoveredPoint, setHoveredPoint] = useState<HoveredPoint | null>(null);
  const [detailCache, setDetailCache] = useState<
    Readonly<Record<string, readonly DetailDirective[]>>
  >({});
  const svgRef = useRef<SVGSVGElement>(null);

  const scales = useMemo(() => buildScales(data), [data]);
  const scoreTicks = useMemo(() => buildScoreTicks(scales), [scales]);
  const yearTicks = useMemo(() => buildYearTicks(scales), [scales]);

  const loadPresidentDetail = useCallback(
    async (shortName: string) => {
      if (detailCache[shortName] !== undefined) {
        return;
      }
      const fname = shortName.toLowerCase().replace(/ /g, "_").replace(/\./g, "");
      try {
        const res = await fetch(`/data/aes_${fname}.json`);
        if (!res.ok) {
          throw new Error(`AES detail request failed: ${res.status}`);
        }
        const details: DetailDirective[] = await res.json();
        setDetailCache((prev) => ({ ...prev, [shortName]: details }));
      } catch (error) {
        if (error instanceof Error) {
          console.warn(error.message);
        } else {
          console.warn("AES detail request failed.");
        }
        setDetailCache((prev) => ({ ...prev, [shortName]: [] }));
      }
    },
    [detailCache],
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent<SVGSVGElement>) => {
      if (!svgRef.current) {
        return;
      }
      const rect = svgRef.current.getBoundingClientRect();
      const scaleX = CHART_DIMENSIONS.width / rect.width;
      const scaleY = CHART_DIMENSIONS.height / rect.height;
      const mx = (event.clientX - rect.left) * scaleX;
      const my = (event.clientY - rect.top) * scaleY;
      const closest = findClosestPoint(filteredData, scales, mx, my);

      if (closest === null) {
        setHoveredPoint(null);
        return;
      }

      const detail = detailCache[closest.p]?.find((item) => item.id === closest.id);
      setHoveredPoint({
        d: closest,
        x: event.clientX,
        y: event.clientY,
        title: detail?.t,
      });
      if (detailCache[closest.p] === undefined) {
        void loadPresidentDetail(closest.p);
      }
    },
    [detailCache, filteredData, loadPresidentDetail, scales],
  );

  const partyLegend = Array.from(
    new Set(data.meta.presidents.map((president) => president.party)),
  );
  const { margin } = CHART_DIMENSIONS;

  return (
    <>
      <div className="overflow-x-auto">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${CHART_DIMENSIONS.width} ${CHART_DIMENSIONS.height}`}
          className="w-full min-w-[640px]"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredPoint(null)}
        >
          {scoreTicks.map((score) => (
            <line
              key={`grid-${score}`}
              x1={margin.left}
              x2={CHART_DIMENSIONS.width - margin.right}
              y1={scales.yScale(score)}
              y2={scales.yScale(score)}
              stroke={score === 0 ? "#475569" : "#1e293b"}
              strokeWidth={score === 0 ? 1.5 : 0.5}
              strokeDasharray={score === 0 ? undefined : "4,4"}
            />
          ))}
          {yearTicks.map((year) => (
            <line
              key={`ygrid-${year}`}
              x1={scales.xScale(year)}
              x2={scales.xScale(year)}
              y1={margin.top}
              y2={CHART_DIMENSIONS.height - margin.bottom}
              stroke="#1e293b"
              strokeWidth={0.5}
              strokeDasharray="4,4"
            />
          ))}
          {filteredData.map((directive) => (
            <circle
              key={directive.id}
              cx={scales.xScale(directive.y)}
              cy={scales.yScale(directive.s)}
              r={hoveredPoint?.d.id === directive.id ? 5 : 2.5}
              fill={directiveColor(directive, colorMode)}
              opacity={hoveredPoint?.d.id === directive.id ? 1 : 0.5}
              className="transition-opacity duration-75"
            />
          ))}
          {yearTicks.map((year) => (
            <text
              key={`xlabel-${year}`}
              x={scales.xScale(year)}
              y={CHART_DIMENSIONS.height - margin.bottom + 25}
              textAnchor="middle"
              className="fill-slate-500 text-[11px]"
            >
              {year}
            </text>
          ))}
          {scoreTicks.map((score) => (
            <text
              key={`ylabel-${score}`}
              x={margin.left - 10}
              y={scales.yScale(score) + 4}
              textAnchor="end"
              className="fill-slate-500 text-[11px]"
            >
              {score.toFixed(1)}
            </text>
          ))}
          <text
            x={CHART_DIMENSIONS.width / 2}
            y={CHART_DIMENSIONS.height - 5}
            textAnchor="middle"
            className="fill-slate-400 text-xs"
          >
            Year
          </text>
          <text
            x={15}
            y={CHART_DIMENSIONS.height / 2}
            textAnchor="middle"
            transform={`rotate(-90, 15, ${CHART_DIMENSIONS.height / 2})`}
            className="fill-slate-400 text-xs"
          >
            AES Score (Liberal → Conservative)
          </text>
          <text
            x={CHART_DIMENSIONS.width - margin.right + 5}
            y={scales.yScale(0) + 4}
            className="fill-slate-500 text-[10px]"
          >
            0
          </text>
        </svg>
      </div>
      {hoveredPoint && (
        <AESPointTooltip data={data} hoveredPoint={hoveredPoint} />
      )}
      <AESScatterLegend
        colorMode={colorMode}
        parties={partyLegend}
        types={data.meta.types}
      />
    </>
  );
}
