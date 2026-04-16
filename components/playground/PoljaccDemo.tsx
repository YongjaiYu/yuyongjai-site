"use client";

import { useCallback, useMemo, useState } from "react";

const EXAMPLES = [
  {
    name: "Congressional Bills: Immigration vs. Defense",
    classA: {
      label: "Immigration",
      texts: [
        "To amend the Immigration and Nationality Act to provide for comprehensive immigration reform, border security, and a pathway to citizenship for undocumented immigrants residing in the United States.",
        "A bill to increase the number of visas available for skilled workers, reform the family-based immigration system, and strengthen enforcement at ports of entry.",
        "To establish a program for the admission of refugees and asylum seekers, and to provide legal protections for unaccompanied minors at the border.",
        "A bill to create a merit-based immigration system, eliminate the diversity visa lottery, and reduce chain migration while maintaining family reunification priorities.",
        "To provide temporary protected status for nationals of designated countries affected by armed conflict, environmental disaster, or extraordinary conditions.",
        "A bill to require employers to verify the immigration status of all employees through an electronic employment verification system.",
        "To amend the Immigration and Nationality Act to eliminate the per-country numerical limitation for employment-based immigrants and increase visa allocations.",
        "A bill to provide for the adjustment of status of certain nationals who entered the United States as children and have contributed to the country through education and military service.",
        "To strengthen border security by authorizing additional personnel, technology, and infrastructure along the southern border of the United States.",
        "A bill to reform the process for determining refugee admissions and to establish new criteria for evaluating asylum claims at the border.",
      ],
    },
    classB: {
      label: "Defense",
      texts: [
        "To authorize appropriations for fiscal year for military activities of the Department of Defense and to prescribe military personnel strengths for such fiscal year.",
        "A bill to provide for the modernization of the nuclear triad, including intercontinental ballistic missiles, submarine-launched ballistic missiles, and strategic bombers.",
        "To establish requirements for the acquisition of major defense systems and to reform the procurement process for the Armed Forces.",
        "A bill to authorize the use of military force against terrorist organizations operating in designated regions and to set limitations on the duration of such authorization.",
        "To amend title 10, United States Code, to improve the readiness of the Armed Forces by addressing maintenance backlogs and equipment shortfalls across all service branches.",
        "A bill to provide for the development and deployment of missile defense systems to protect the United States homeland and deployed forces abroad.",
        "To establish a commission on military compensation and retirement modernization and to make recommendations for updating the military pay system.",
        "A bill to enhance cybersecurity capabilities of the Department of Defense and to establish a unified command for cyber operations.",
        "To authorize military construction projects and to provide for the improvement of military family housing at installations in the United States and overseas.",
        "A bill to strengthen the defense industrial base by incentivizing domestic manufacturing of critical weapons systems and military components.",
      ],
    },
  },
  {
    name: "Policy Rhetoric: Progressive vs. Conservative",
    classA: {
      label: "Progressive",
      texts: [
        "We must invest in renewable energy and green infrastructure to create millions of good-paying jobs while addressing the existential threat of climate change.",
        "Universal healthcare is a human right, and we must build on existing programs to ensure that no American goes bankrupt because they got sick.",
        "Systemic racism continues to shape outcomes in housing, education, and criminal justice, and we need bold policies to dismantle structural inequality.",
        "Working families deserve a living wage, paid family leave, and affordable childcare so that no one has to choose between their job and their family.",
        "We must reform our criminal justice system to end mass incarceration, eliminate cash bail, and invest in community-based alternatives to policing.",
        "Access to affordable higher education should be available to every student, regardless of their family income or zip code.",
        "We need comprehensive gun violence prevention legislation including universal background checks and an assault weapons ban.",
        "Climate justice demands that we center the voices of frontline communities who bear the disproportionate burden of pollution and environmental degradation.",
        "Expanding voting rights and protecting democratic participation is essential to ensuring that every citizen has an equal voice in our democracy.",
        "Corporate consolidation threatens competition and consumer welfare, and we must strengthen antitrust enforcement to protect small businesses and workers.",
      ],
    },
    classB: {
      label: "Conservative",
      texts: [
        "We must cut taxes and reduce government regulations to unleash the power of free enterprise and let American businesses compete and grow.",
        "The Second Amendment right to keep and bear arms is fundamental, and any attempt to restrict law-abiding citizens access to firearms must be opposed.",
        "Securing our border and enforcing immigration law is essential to national sovereignty and protecting American workers from unfair competition.",
        "Government spending is out of control, and we must balance the federal budget to stop burdening future generations with unsustainable national debt.",
        "Parents should have the right to choose the best educational environment for their children, whether public, private, charter, or homeschool.",
        "American energy independence requires expanding domestic oil, gas, and coal production rather than relying on unreliable foreign sources.",
        "Law enforcement officers deserve our support and respect, and defunding the police puts communities at risk and undermines public safety.",
        "The federal government has grown far beyond its constitutional limits, and we must restore power to state and local governments where it belongs.",
        "Traditional values and religious liberty are under attack, and we must protect the right of Americans to live according to their faith without government interference.",
        "A strong national defense requires investment in our military and a commitment to peace through strength on the world stage.",
      ],
    },
  },
  {
    name: "High Overlap: Senate Floor Speeches (Economy)",
    classA: {
      label: "Democrat on Economy",
      texts: [
        "The economy is growing but the benefits are not being shared equally. Working families are struggling with rising costs of housing, healthcare, and education while corporate profits reach record highs.",
        "We need to invest in infrastructure and job training to build an economy that works for everyone, not just those at the top.",
        "The unemployment rate is low but wages have not kept pace with the cost of living. We must raise the minimum wage to give workers a fair shot.",
        "Small businesses are the backbone of our economy, and we should provide them with tax incentives and access to capital to help them grow.",
        "Trade policy should protect American workers and ensure a level playing field so our manufacturers can compete globally.",
        "The middle class is being squeezed by stagnant wages and rising costs. We need tax reform that puts money back in the pockets of working Americans.",
        "Economic growth must be sustainable and inclusive. We cannot build prosperity on the backs of workers who cannot afford basic necessities.",
        "The tax code is rigged in favor of the wealthy and corporations. We need to close loopholes and ensure everyone pays their fair share.",
        "Job creation in the clean energy sector represents the greatest economic opportunity of our generation.",
        "We must strengthen Social Security and Medicare to ensure economic security for seniors who have worked hard their entire lives.",
      ],
    },
    classB: {
      label: "Republican on Economy",
      texts: [
        "The economy grows when government gets out of the way. Lower taxes and fewer regulations let businesses invest, hire, and create opportunities for American workers.",
        "Small businesses are the engine of job creation, and we must reduce the regulatory burden that prevents them from expanding and hiring.",
        "The national debt is a threat to our economic future. We must cut wasteful spending and balance the budget to protect the next generation.",
        "Trade agreements must be fair and reciprocal. We will not allow other countries to take advantage of American workers and businesses.",
        "Tax reform is essential to making America competitive. Lower rates for individuals and businesses will spur investment and wage growth.",
        "The unemployment rate shows our economy is strong, but we must continue pro-growth policies to keep Americans working and businesses thriving.",
        "Energy production is key to economic prosperity. By unleashing American energy we can create jobs, lower costs, and strengthen national security.",
        "Workers deserve more take-home pay, and the best way to achieve that is through tax cuts and economic policies that promote growth.",
        "Excessive regulation kills jobs and hurts small businesses. We need a regulatory system that protects consumers without strangling economic growth.",
        "American manufacturers need a level playing field. Fair trade and lower taxes will bring jobs back to communities across this country.",
      ],
    },
  },
];

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 2)
  );
}

function computeJaccard(textsA: string[], textsB: string[]) {
  const vocabA = new Set<string>();
  const vocabB = new Set<string>();

  textsA.forEach((t) => tokenize(t).forEach((w) => vocabA.add(w)));
  textsB.forEach((t) => tokenize(t).forEach((w) => vocabB.add(w)));

  const vocabAArr = Array.from(vocabA);
  const vocabBArr = Array.from(vocabB);

  const intersection = new Set(vocabAArr.filter((w) => vocabB.has(w)));
  const union = new Set(vocabAArr.concat(vocabBArr));

  const jaccard = union.size > 0 ? intersection.size / union.size : 0;

  const onlyA = vocabAArr.filter((w) => !vocabB.has(w));
  const onlyB = vocabBArr.filter((w) => !vocabA.has(w));

  return {
    jaccard,
    vocabASize: vocabA.size,
    vocabBSize: vocabB.size,
    intersectionSize: intersection.size,
    unionSize: union.size,
    onlyA: onlyA.sort().slice(0, 30),
    onlyB: onlyB.sort().slice(0, 30),
    shared: Array.from(intersection).sort().slice(0, 30),
  };
}

function getRecommendation(j: number) {
  if (j > 0.7)
    return {
      model: "Sparse (TF-IDF)" as const,
      color: "text-emerald-400",
      explanation:
        "High vocabulary overlap. Signal is distributed across shared terms. Sparse models can capture discriminative weight differences effectively.",
    };
  if (j > 0.4)
    return {
      model: "Consider both" as const,
      color: "text-amber-400",
      explanation:
        "Moderate vocabulary overlap. Both sparse and dense models are viable. Run a TF-IDF baseline first to calibrate expectations before investing in neural approaches.",
    };
  return {
    model: "Dense (Neural)" as const,
    color: "text-blue-400",
    explanation:
      "Low vocabulary overlap. Class-specific terms carry most of the signal. Dense models may capture compositional or semantic patterns that sparse models miss.",
  };
}

export default function PoljaccDemo() {
  const [classALabel, setClassALabel] = useState("Class A");
  const [classBLabel, setClassBLabel] = useState("Class B");
  const [classAText, setClassAText] = useState("");
  const [classBText, setClassBText] = useState("");
  const [result, setResult] = useState<ReturnType<typeof computeJaccard> | null>(null);

  const loadExample = useCallback((idx: number) => {
    const ex = EXAMPLES[idx];
    setClassALabel(ex.classA.label);
    setClassBLabel(ex.classB.label);
    setClassAText(ex.classA.texts.join("\n\n"));
    setClassBText(ex.classB.texts.join("\n\n"));
    setResult(null);
  }, []);

  const handleRun = useCallback(() => {
    const textsA = classAText
      .split(/\n\n+/)
      .map((t) => t.trim())
      .filter(Boolean);
    const textsB = classBText
      .split(/\n\n+/)
      .map((t) => t.trim())
      .filter(Boolean);

    if (textsA.length === 0 || textsB.length === 0) return;
    setResult(computeJaccard(textsA, textsB));
  }, [classAText, classBText]);

  const recommendation = useMemo(
    () => (result ? getRecommendation(result.jaccard) : null),
    [result]
  );

  return (
    <div className="space-y-8">
      {/* Example selector */}
      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-slate-500">
          Load Example
        </label>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => loadExample(i)}
              className="rounded border border-slate-700 bg-slate-900 px-3 py-1.5 font-sans text-xs text-slate-400 transition-colors hover:border-slate-500 hover:text-slate-200"
            >
              {ex.name}
            </button>
          ))}
        </div>
      </div>

      {/* Text inputs */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-500" />
            <input
              type="text"
              value={classALabel}
              onChange={(e) => setClassALabel(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none"
            />
          </label>
          <textarea
            value={classAText}
            onChange={(e) => {
              setClassAText(e.target.value);
              setResult(null);
            }}
            placeholder="Paste documents here, separated by blank lines..."
            className="h-48 w-full resize-none rounded border border-slate-700 bg-slate-900 px-4 py-3 font-sans text-sm text-slate-300 placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
          />
          <p className="mt-1 text-xs text-slate-600">
            {classAText
              ? `${classAText.split(/\n\n+/).filter(Boolean).length} documents`
              : "Separate documents with blank lines"}
          </p>
        </div>
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
            <input
              type="text"
              value={classBLabel}
              onChange={(e) => setClassBLabel(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none"
            />
          </label>
          <textarea
            value={classBText}
            onChange={(e) => {
              setClassBText(e.target.value);
              setResult(null);
            }}
            placeholder="Paste documents here, separated by blank lines..."
            className="h-48 w-full resize-none rounded border border-slate-700 bg-slate-900 px-4 py-3 font-sans text-sm text-slate-300 placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
          />
          <p className="mt-1 text-xs text-slate-600">
            {classBText
              ? `${classBText.split(/\n\n+/).filter(Boolean).length} documents`
              : "Separate documents with blank lines"}
          </p>
        </div>
      </div>

      {/* Run button */}
      <button
        onClick={handleRun}
        disabled={!classAText.trim() || !classBText.trim()}
        className="rounded bg-cyan-400/20 px-6 py-2 text-sm font-medium text-cyan-400 transition-colors hover:bg-cyan-400/30 disabled:cursor-not-allowed disabled:opacity-30"
      >
        Run Diagnostic
      </button>

      {/* Results */}
      {result && recommendation && (
        <div className="space-y-6 rounded-lg border border-slate-800 p-6">
          {/* Jaccard score */}
          <div className="flex items-start gap-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
                Jaccard Similarity
              </p>
              <p className="mt-1 text-4xl font-bold text-slate-100">
                {result.jaccard.toFixed(3)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
                Recommendation
              </p>
              <p className={`mt-1 text-xl font-semibold ${recommendation.color}`}>
                {recommendation.model}
              </p>
            </div>
          </div>

          <p className="font-sans text-sm leading-relaxed text-slate-400">
            {recommendation.explanation}
          </p>

          {/* Vocabulary bar */}
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-slate-500">
              Vocabulary Overlap
            </p>
            <div className="flex h-8 overflow-hidden rounded">
              <div
                className="bg-blue-500/60 transition-all"
                style={{
                  width: `${((result.vocabASize - result.intersectionSize) / result.unionSize) * 100}%`,
                }}
                title={`${classALabel} only: ${result.vocabASize - result.intersectionSize}`}
              />
              <div
                className="bg-purple-500/80 transition-all"
                style={{
                  width: `${(result.intersectionSize / result.unionSize) * 100}%`,
                }}
                title={`Shared: ${result.intersectionSize}`}
              />
              <div
                className="bg-red-500/60 transition-all"
                style={{
                  width: `${((result.vocabBSize - result.intersectionSize) / result.unionSize) * 100}%`,
                }}
                title={`${classBLabel} only: ${result.vocabBSize - result.intersectionSize}`}
              />
            </div>
            <div className="mt-2 flex justify-between font-sans text-xs text-slate-500">
              <span>
                <span className="text-blue-400">{classALabel}</span> only:{" "}
                {result.vocabASize - result.intersectionSize}
              </span>
              <span>
                <span className="text-purple-400">Shared</span>:{" "}
                {result.intersectionSize}
              </span>
              <span>
                <span className="text-red-400">{classBLabel}</span> only:{" "}
                {result.vocabBSize - result.intersectionSize}
              </span>
            </div>
          </div>

          {/* Sample terms */}
          <div className="grid gap-4 lg:grid-cols-3">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-blue-400">
                {classALabel} only
              </p>
              <div className="flex flex-wrap gap-1">
                {result.onlyA.map((w) => (
                  <span
                    key={w}
                    className="rounded bg-blue-500/10 px-1.5 py-0.5 font-mono text-[11px] text-blue-300"
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-purple-400">
                Shared
              </p>
              <div className="flex flex-wrap gap-1">
                {result.shared.map((w) => (
                  <span
                    key={w}
                    className="rounded bg-purple-500/10 px-1.5 py-0.5 font-mono text-[11px] text-purple-300"
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-red-400">
                {classBLabel} only
              </p>
              <div className="flex flex-wrap gap-1">
                {result.onlyB.map((w) => (
                  <span
                    key={w}
                    className="rounded bg-red-500/10 px-1.5 py-0.5 font-mono text-[11px] text-red-300"
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Threshold guide */}
          <div className="border-t border-slate-800 pt-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-slate-500">
              Diagnostic Thresholds
            </p>
            <div className="flex h-3 overflow-hidden rounded-full">
              <div className="w-[40%] bg-blue-500/40" />
              <div className="w-[30%] bg-amber-500/40" />
              <div className="w-[30%] bg-emerald-500/40" />
            </div>
            <div className="mt-1 flex font-sans text-[10px] text-slate-600">
              <span className="w-[40%]">0 — Dense (Neural)</span>
              <span className="w-[30%]">0.4 — Consider both</span>
              <span className="w-[30%] text-right">0.7 — Sparse (TF-IDF) — 1</span>
            </div>
            {/* Current position marker */}
            <div className="relative mt-1 h-2">
              <div
                className="absolute top-0 h-2 w-0.5 bg-slate-100"
                style={{ left: `${result.jaccard * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
