const RESEARCH_INTERESTS = [
  "Presidential Power",
  "Separation of Powers",
  "Executive Orders",
  "Polarization",
  "Computational Social Science",
  "LLMs",
  "Multimodal Analysis",
  "Text Analysis",
];

const EDUCATION = [
  {
    degree: "Ph.D. Political Science",
    institution: "UC Riverside",
    period: "2022 -- present",
  },
  {
    degree: "M.P.P.",
    institution: "Seoul National University",
    period: "2022",
  },
  {
    degree: "B.A. History",
    institution: "Korea University",
    period: "2016",
  },
] as const;

export default function About() {
  return (
    <section id="about" className="py-20">
      <p className="text-sm">
        <span className="text-slate-500">$</span>{" "}
        <span className="text-cyan-400">whoami</span>
      </p>

      <p className="mt-6 max-w-xl text-sm leading-relaxed text-slate-200">
        I study the presidency and the separation of powers, with a particular
        emphasis on measuring the extent to which presidential unilateral
        actions change the policy status quo. I leverage large language models
        to analyze the text of unilateral actions to estimate their ideological
        positions. My methodological interests include applications of LLMs,
        Bayesian statistics, causal inference with machine learning, and
        multimodal deep learning analysis of political visual and textual data.
      </p>

      {/* Research Interests */}
      <div className="mt-8 flex flex-wrap gap-2">
        {RESEARCH_INTERESTS.map((interest) => (
          <span
            key={interest}
            className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300"
          >
            {interest}
          </span>
        ))}
      </div>

      {/* Education */}
      <div className="mt-12">
        <h3 className="mb-4 text-xs font-medium uppercase tracking-widest text-slate-500">
          Education
        </h3>
        <ul className="space-y-3">
          {EDUCATION.map((entry) => (
            <li key={entry.degree} className="text-sm">
              <span className="font-medium text-slate-300">
                {entry.degree}
              </span>
              <span className="text-slate-400">
                {" "}
                &mdash; {entry.institution} ({entry.period})
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
