"use client";

import { useCallback, useMemo, useState } from "react";

const MIN_DOCS = 5;
const MAX_DOCS = 500;
const MAX_CHARS = 500000;


const EXAMPLES = [
  {
    name: "Immigration vs. Defense",
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
    name: "Progressive vs. Conservative",
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
    name: "Senate Floor Speeches (D vs. R)",
    classA: {
      label: "Democrat",
      texts: [
        "Mr. President. I rise today to introduce legislation to celebrate the children of our Nation by establishing National Childrens Day on Sunday. November 21. Childrens Day will enable us to pay tribute to children and to focus on issues that are so important to their health. development. and education. Many children today face crises of grave proportions. especially as they enter adolescent years. It is of particular concern that over 5 million children go hungry at some point each month. and that there has been a 60percent increase in the number of children needing foster care in the last 10 years.",
        "Madam President. I rise to fully join in the strong bipartisan support for the nomination of Dr. David Satcher. as expressed on the Senate floor today. for the dual position of U.S. Surgeon General and Assistant Secretary of Health. This Nation is fortunate that a man of Dr. Satchers dedication. vision and deep commitment to public service has agreed. in fact. to take on this critically important role. a critical role. I might add. that has been unfilled since 1994. It is time to fill this critical position.",
        "Mr. President. I rise on behalf of millions of Americans and their families holding out hope that the Senate will do the right thing today. which is to support embryonic stem cell research so that scientists have the resources they need to potentially save millions of lives. My support for this promising research is painfully personal. When I visit my mother. who suffers from Alzheimers. and see her vacant stare. in which she doesnt even recognize her own family. I just cannot comprehend how anyone in this body can vote against this bill.",
        "Mr. President. I rise in support of the Freedom of Access to Clinic Entrances Act. Whether they are prochoice or prolife. lawabiding people absolutely deplore the increasing number of attacks against women who seek to exercise their constitutional right to have a legal abortion. and the health professionals that help them exercise this right. As members of a civilized society we must strongly denounce any interjection of violence into this debate.",
        "Madam President. it is my understanding that the transportation appropriations bill currently before us does not earmark discretionary funds for buses and bus facilities. It is also my understanding that the transportation appropriations bill approved by the House of Representatives did earmark transit projects and $2.3 million was approved for the city of Tucson. I would like to ensure that the transit needs of growing cities like Tucson are addressed in the conference report.",
      ],
    },
    classB: {
      label: "Republican",
      texts: [
        "Mr. President. 3 years ago. a dear friend of mine. and a dedicated and patriotic public servant was taken untimely by cancer from his friends and family. Nicholas Ruwe worked in numerous political campaigns. served two Presidents as assistant chief of protocol and spent 4 years representing our Government abroad in the diplomatic corps. His life and his career were cut short at the age of 56 by the caprice of a horrible disease. robbing his family and friends of a beloved companion.",
        "Mr. President. as Congress prepares to take up a balanced budget amendment. I would like to offer to my Senate colleagues the perspective of a new freshman Senator who ran on an aggressive platform to reform Congress and limit the size of Government. In my view. the balanced budget amendment to the Constitution embodies the spirit of the electorate that voted for a Republican Congress for the first time in 40 years last November.",
        "Mr. President. I rise today to join Senator CRAIG in introducing the Hardrock Mining Reform Act of 1993. This bill represents a middle ground solution to the debate over mining on our public lands. Throughout the history of our country and my State. mining has been a driving force. Mineral exploration and development played an important role in our countrys expansion westward.",
        "Mr. President. on behalf of myself. Senators BAUCUS. BOND. and MURRAY. I am introducing today the Civil Aircraft Trade Enforcement Act of 1993. In 1990. the Commerce Department released an independent analysis that concluded that the European aircraft consortium. Airbus Industrie. had received nearly $26 billion in subsidies from the Governments of France. Germany. and the United Kingdom as of 1989.",
        "Mr. President. I rise today to join my colleague to speak about our great loss. the loss of a great friend. the passing of Congresswoman Tillie Fowler of Jacksonville. Tillie was taken from us suddenly yesterday. passing from this Earth to a better life. and we are sad and shocked by this terrific loss that the State and the Nation has suffered. In every way. Tillie was a great lady. She had such a unique combination of strengths.",
      ],
    },
  },
];

const STOPWORDS = new Set([
  "the","and","for","that","this","with","from","are","was","were","been",
  "being","have","has","had","having","does","did","doing","will","would",
  "shall","should","may","might","can","could","not","but","nor","yet",
  "both","each","all","any","few","more","most","other","some","such",
  "than","too","very","just","also","its","our","their","your","his",
  "her","who","whom","which","what","when","where","how","why","about",
  "into","through","during","before","after","above","below","between",
  "out","off","over","under","again","further","then","once","here",
  "there","these","those","them","they","she","him","itself","own",
]);

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 2)
  );
}

function tokenizeWithFreq(text: string): Map<string, number> {
  const freq = new Map<string, number>();
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .forEach((w) => freq.set(w, (freq.get(w) || 0) + 1));
  return freq;
}

function parseDocs(text: string): string[] {
  return text
    .split(/\n\n+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function computeJaccard(textsA: string[], textsB: string[]) {
  const vocabA = new Set<string>();
  const vocabB = new Set<string>();
  const freqA = new Map<string, number>();
  const freqB = new Map<string, number>();

  textsA.forEach((t) => {
    tokenize(t).forEach((w) => vocabA.add(w));
    tokenizeWithFreq(t).forEach((count, w) =>
      freqA.set(w, (freqA.get(w) || 0) + count)
    );
  });
  textsB.forEach((t) => {
    tokenize(t).forEach((w) => vocabB.add(w));
    tokenizeWithFreq(t).forEach((count, w) =>
      freqB.set(w, (freqB.get(w) || 0) + count)
    );
  });

  const vocabAArr = Array.from(vocabA);
  const vocabBArr = Array.from(vocabB);

  const intersection = new Set(vocabAArr.filter((w) => vocabB.has(w)));
  const union = new Set(vocabAArr.concat(vocabBArr));

  const jaccard = union.size > 0 ? intersection.size / union.size : 0;

  const sortByFreq = (words: string[], freq: Map<string, number>) =>
    words
      .filter((w) => !STOPWORDS.has(w))
      .sort((a, b) => (freq.get(b) || 0) - (freq.get(a) || 0))
      .slice(0, 25);

  const onlyA = sortByFreq(
    vocabAArr.filter((w) => !vocabB.has(w)),
    freqA
  );
  const onlyB = sortByFreq(
    vocabBArr.filter((w) => !vocabA.has(w)),
    freqB
  );
  const shared = sortByFreq(Array.from(intersection), new Map(
    Array.from(intersection).map((w) => [w, (freqA.get(w) || 0) + (freqB.get(w) || 0)])
  ));

  return {
    jaccard,
    vocabASize: vocabA.size,
    vocabBSize: vocabB.size,
    intersectionSize: intersection.size,
    unionSize: union.size,
    onlyA,
    onlyB,
    shared,
    freqA,
    freqB,
    docsA: textsA.length,
    docsB: textsB.length,
  };
}

function getRecommendation(j: number) {
  if (j > 0.7)
    return {
      tag: "SPARSE (TF-IDF)" as const,
      color: "text-emerald-400",
      line: `High vocabulary overlap (${j.toFixed(3)} > 0.7 threshold)`,
      detail:
        "suggests discriminative signal is distributed across shared terms. Sparse methods should capture weight differences effectively.",
    };
  if (j > 0.4)
    return {
      tag: "CONSIDER BOTH" as const,
      color: "text-amber-400",
      line: `Moderate vocabulary overlap (0.4 < ${j.toFixed(3)} < 0.7)`,
      detail:
        "suggests trade-offs exist. Run a TF-IDF baseline first to calibrate expectations before investing in neural approaches.",
    };
  return {
    tag: "DENSE (Neural)" as const,
    color: "text-blue-400",
    line: `Low vocabulary overlap (${j.toFixed(3)} < 0.4 threshold)`,
    detail:
      "suggests class-specific terms are the primary signal. Dense models may capture compositional or semantic patterns that sparse models miss.",
  };
}

function validate(
  textA: string,
  textB: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const docsA = parseDocs(textA);
  const docsB = parseDocs(textB);

  if (docsA.length < MIN_DOCS)
    errors.push(`Class A needs at least ${MIN_DOCS} documents (currently ${docsA.length})`);
  if (docsB.length < MIN_DOCS)
    errors.push(`Class B needs at least ${MIN_DOCS} documents (currently ${docsB.length})`);
  if (docsA.length > MAX_DOCS)
    errors.push(`Class A exceeds ${MAX_DOCS} document limit (currently ${docsA.length})`);
  if (docsB.length > MAX_DOCS)
    errors.push(`Class B exceeds ${MAX_DOCS} document limit (currently ${docsB.length})`);
  if (textA.length > MAX_CHARS)
    errors.push(`Class A text exceeds ${(MAX_CHARS / 1000).toFixed(0)}K character limit`);
  if (textB.length > MAX_CHARS)
    errors.push(`Class B text exceeds ${(MAX_CHARS / 1000).toFixed(0)}K character limit`);

  return { valid: errors.length === 0, errors };
}

function VennDiagram({
  result,
  labelA,
  labelB,
}: {
  result: ReturnType<typeof computeJaccard>;
  labelA: string;
  labelB: string;
}) {
  const overlap = result.jaccard;
  const separation = 120 - overlap * 80;
  const r = 80;

  return (
    <svg viewBox="0 0 360 200" className="mx-auto w-full max-w-sm">
      <circle
        cx={180 - separation / 2}
        cy={100}
        r={r}
        fill="rgba(59, 130, 246, 0.15)"
        stroke="rgba(59, 130, 246, 0.5)"
        strokeWidth={1.5}
      />
      <circle
        cx={180 + separation / 2}
        cy={100}
        r={r}
        fill="rgba(239, 68, 68, 0.15)"
        stroke="rgba(239, 68, 68, 0.5)"
        strokeWidth={1.5}
      />
      <text
        x={180 - separation / 2 - 30}
        y={100}
        textAnchor="middle"
        className="fill-blue-400 text-[11px]"
      >
        {result.vocabASize - result.intersectionSize}
      </text>
      <text
        x={180}
        y={95}
        textAnchor="middle"
        className="fill-purple-400 text-[11px]"
      >
        {result.intersectionSize}
      </text>
      <text
        x={180}
        y={110}
        textAnchor="middle"
        className="fill-purple-400/60 text-[9px]"
      >
        shared
      </text>
      <text
        x={180 + separation / 2 + 30}
        y={100}
        textAnchor="middle"
        className="fill-red-400 text-[11px]"
      >
        {result.vocabBSize - result.intersectionSize}
      </text>
      <text
        x={180 - separation / 2}
        y={190}
        textAnchor="middle"
        className="fill-blue-300 text-[10px]"
      >
        {labelA}
      </text>
      <text
        x={180 + separation / 2}
        y={190}
        textAnchor="middle"
        className="fill-red-300 text-[10px]"
      >
        {labelB}
      </text>
    </svg>
  );
}

export default function PoljaccDemo() {
  const [classALabel, setClassALabel] = useState("Class A");
  const [classBLabel, setClassBLabel] = useState("Class B");
  const [classAText, setClassAText] = useState("");
  const [classBText, setClassBText] = useState("");
  const [result, setResult] = useState<ReturnType<typeof computeJaccard> | null>(null);

  const docsACount = useMemo(() => parseDocs(classAText).length, [classAText]);
  const docsBCount = useMemo(() => parseDocs(classBText).length, [classBText]);

  const validation = useMemo(
    () => validate(classAText, classBText),
    [classAText, classBText]
  );

  const canRun =
    classAText.trim().length > 0 &&
    classBText.trim().length > 0 &&
    validation.valid;

  const loadExample = useCallback((idx: number) => {
    const ex = EXAMPLES[idx];
    setClassALabel(ex.classA.label);
    setClassBLabel(ex.classB.label);
    setClassAText(ex.classA.texts.join("\n\n"));
    setClassBText(ex.classB.texts.join("\n\n"));
    setResult(null);
  }, []);

  const handleRun = useCallback(() => {
    if (!canRun) return;
    const textsA = parseDocs(classAText);
    const textsB = parseDocs(classBText);
    setResult(computeJaccard(textsA, textsB));
  }, [classAText, classBText, canRun]);

  const recommendation = useMemo(
    () => (result ? getRecommendation(result.jaccard) : null),
    [result]
  );

  const handleDownloadCSV = useCallback(() => {
    if (!result) return;
    const rows = [
      ["metric", "value"],
      ["class_a_label", classALabel],
      ["class_b_label", classBLabel],
      ["class_a_docs", String(result.docsA)],
      ["class_b_docs", String(result.docsB)],
      ["class_a_vocab", String(result.vocabASize)],
      ["class_b_vocab", String(result.vocabBSize)],
      ["shared_vocab", String(result.intersectionSize)],
      ["union_vocab", String(result.unionSize)],
      ["jaccard_similarity", result.jaccard.toFixed(6)],
      ["recommendation", recommendation?.tag || ""],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "poljacc_diagnostic.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [result, classALabel, classBLabel, recommendation]);


  const docCountLabel = (count: number) => {
    if (count === 0) return "Separate documents with blank lines";
    const color =
      count < MIN_DOCS
        ? "text-amber-400"
        : count > MAX_DOCS
          ? "text-red-400"
          : "text-slate-500";
    return (
      <span className={color}>
        {count} document{count !== 1 ? "s" : ""}
        {count < MIN_DOCS && ` (min ${MIN_DOCS})`}
        {count > MAX_DOCS && ` (max ${MAX_DOCS})`}
      </span>
    );
  };

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
          <p className="mt-1 text-xs">{docCountLabel(docsACount)}</p>
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
          <p className="mt-1 text-xs">{docCountLabel(docsBCount)}</p>
        </div>
      </div>

      {/* Validation errors */}
      {classAText.trim().length > 0 &&
        classBText.trim().length > 0 &&
        !validation.valid && (
          <div className="rounded border border-amber-500/30 bg-amber-500/5 px-4 py-3">
            {validation.errors.map((err, i) => (
              <p key={i} className="font-sans text-xs text-amber-400">
                {err}
              </p>
            ))}
          </div>
        )}

      {/* Run button */}
      <button
        onClick={handleRun}
        disabled={!canRun}
        className="rounded bg-cyan-400/20 px-6 py-2 text-sm font-medium text-cyan-400 transition-colors hover:bg-cyan-400/30 disabled:cursor-not-allowed disabled:opacity-30"
      >
        Run Diagnostic
      </button>

      {/* Results */}
      {result && recommendation && (
        <div className="space-y-6">
          {/* Terminal output */}
          <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 p-5">
            <pre className="text-[13px] leading-relaxed text-slate-400">
              <span className="text-slate-600">
                {"── DIAGNOSTIC RESULTS ──────────────────────────\n\n"}
              </span>
              <span className="text-slate-500">
                {`${classALabel} vocabulary size:`.padEnd(30)}
              </span>
              <span className="text-slate-200">
                {`${result.vocabASize.toLocaleString()} tokens\n`}
              </span>
              <span className="text-slate-500">
                {`${classBLabel} vocabulary size:`.padEnd(30)}
              </span>
              <span className="text-slate-200">
                {`${result.vocabBSize.toLocaleString()} tokens\n`}
              </span>
              <span className="text-slate-500">{"Shared vocabulary:".padEnd(30)}</span>
              <span className="text-slate-200">
                {`${result.intersectionSize.toLocaleString()} tokens\n`}
              </span>
              <span className="text-slate-500">{"Union vocabulary:".padEnd(30)}</span>
              <span className="text-slate-200">
                {`${result.unionSize.toLocaleString()} tokens\n`}
              </span>
              <span className="text-slate-500">
                {"Jaccard overlap:".padEnd(30)}
              </span>
              <span className="text-cyan-400 font-semibold">
                {`${result.jaccard.toFixed(3)}\n`}
              </span>
              {"\n"}
              <span className="text-slate-500">{"Recommendation: "}</span>
              <span className={`font-semibold ${recommendation.color}`}>
                {recommendation.tag}
              </span>
              {"\n"}
              <span className="text-slate-600">{`${"└── "}${recommendation.line}\n`}</span>
              <span className="text-slate-600">
                {`    ${recommendation.detail}\n`}
              </span>
              {"\n"}
              <span className="text-slate-600">
                {`n = (${result.docsA}, ${result.docsB}) documents\n`}
              </span>
            </pre>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleDownloadCSV}
              className="rounded border border-slate-700 px-4 py-1.5 font-sans text-xs text-slate-400 transition-colors hover:border-slate-500 hover:text-slate-200"
            >
              Download CSV
            </button>
          </div>

          {/* Venn Diagram */}
          <div className="rounded-lg border border-slate-800 p-6">
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-slate-500">
              Vocabulary Overlap
            </p>
            <VennDiagram
              result={result}
              labelA={classALabel}
              labelB={classBLabel}
            />
          </div>

          {/* Threshold gauge */}
          <div className="rounded-lg border border-slate-800 p-6">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-slate-500">
              Diagnostic Scale
            </p>
            <div className="relative">
              <div className="flex h-4 overflow-hidden rounded-full">
                <div className="w-[40%] bg-blue-500/30" />
                <div className="w-[30%] bg-amber-500/30" />
                <div className="w-[30%] bg-emerald-500/30" />
              </div>
              <div
                className="absolute top-0 h-4 w-1 rounded-full bg-slate-100"
                style={{ left: `${Math.min(result.jaccard, 1) * 100}%` }}
              />
            </div>
            <div className="mt-2 flex font-sans text-[11px] text-slate-600">
              <span className="w-[40%] text-blue-400">Dense (Neural)</span>
              <span className="w-[30%] text-center text-amber-400">
                Consider both
              </span>
              <span className="w-[30%] text-right text-emerald-400">
                Sparse (TF-IDF)
              </span>
            </div>
            <div className="mt-0 flex font-sans text-[10px] text-slate-700">
              <span className="w-[40%]">0</span>
              <span className="w-[30%] text-center">0.4</span>
              <span className="w-[30%] text-right">0.7 — 1.0</span>
            </div>
          </div>

          {/* Sample terms (sorted by frequency, stopwords filtered) */}
          <div className="grid gap-4 rounded-lg border border-slate-800 p-6 lg:grid-cols-3">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-blue-400">
                {classALabel} only
              </p>
              <div className="flex flex-wrap gap-1">
                {result.onlyA.map((w) => (
                  <span
                    key={w}
                    className="rounded bg-blue-500/10 px-1.5 py-0.5 font-mono text-[11px] text-blue-300"
                    title={`${result.freqA.get(w) || 0} occurrences`}
                  >
                    {w}
                    <span className="ml-1 text-blue-500">
                      {result.freqA.get(w) || 0}
                    </span>
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
                    title={`A: ${result.freqA.get(w) || 0}, B: ${result.freqB.get(w) || 0}`}
                  >
                    {w}
                    <span className="ml-1 text-purple-500">
                      {(result.freqA.get(w) || 0) + (result.freqB.get(w) || 0)}
                    </span>
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
                    title={`${result.freqB.get(w) || 0} occurrences`}
                  >
                    {w}
                    <span className="ml-1 text-red-500">
                      {result.freqB.get(w) || 0}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
