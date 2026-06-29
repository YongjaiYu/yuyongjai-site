import { assertNever, ideologyColor, partyColor, typeColor } from "./aesConfig";
import type { AESData, ColorMode, Directive } from "./aesTypes";

export type ChartDimensions = {
  readonly width: number;
  readonly height: number;
  readonly margin: {
    readonly top: number;
    readonly right: number;
    readonly bottom: number;
    readonly left: number;
  };
};

export type ScaleSet = {
  readonly xScale: (year: number) => number;
  readonly yScale: (score: number) => number;
  readonly minYear: number;
  readonly maxYear: number;
  readonly minScore: number;
  readonly maxScore: number;
};

export const CHART_DIMENSIONS: ChartDimensions = {
  width: 960,
  height: 500,
  margin: { top: 30, right: 30, bottom: 50, left: 60 },
};

export function buildScales(data: AESData): ScaleSet {
  const { width, height, margin } = CHART_DIMENSIONS;
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;
  const [minYear, maxYear] = data.meta.year_range;
  const [minScore, maxScore] = data.meta.score_range;
  const scorePad = 0.1;

  return {
    xScale: (year: number) =>
      margin.left + ((year - minYear) / (maxYear - minYear)) * innerW,
    yScale: (score: number) =>
      margin.top +
      ((maxScore + scorePad - score) / (maxScore - minScore + 2 * scorePad)) *
        innerH,
    minYear,
    maxYear,
    minScore,
    maxScore,
  };
}

export function buildScoreTicks(scales: ScaleSet): number[] {
  const ticks: number[] = [];
  const start = Math.floor(scales.minScore * 2) / 2;
  const end = Math.ceil(scales.maxScore * 2) / 2;
  for (let score = start; score <= end + 0.001; score += 0.5) {
    ticks.push(score);
  }
  return ticks;
}

export function buildYearTicks(scales: ScaleSet): number[] {
  const ticks: number[] = [];
  for (
    let year = Math.ceil(scales.minYear / 10) * 10;
    year <= scales.maxYear;
    year += 10
  ) {
    ticks.push(year);
  }
  return ticks;
}

export function findClosestPoint(
  directives: readonly Directive[],
  scales: ScaleSet,
  mx: number,
  my: number,
): Directive | null {
  let closest: Directive | null = null;
  let minDist = Infinity;
  for (const directive of directives) {
    const px = scales.xScale(directive.y);
    const py = scales.yScale(directive.s);
    const dist = Math.sqrt((mx - px) ** 2 + (my - py) ** 2);
    if (dist < minDist && dist < 15) {
      minDist = dist;
      closest = directive;
    }
  }
  return closest;
}

export function directiveColor(directive: Directive, colorMode: ColorMode): string {
  switch (colorMode) {
    case "party":
      return partyColor(directive.party);
    case "ideology":
      return ideologyColor(directive.ib);
    case "type":
      return typeColor(directive.dt);
    default:
      return assertNever(colorMode);
  }
}
