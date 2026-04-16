const RESEARCH_INTERESTS = [
  "Presidential Power",
  "Political Institutions",
  "LLM",
  "Computational Social Science",
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
      <h2 className="mb-6 text-2xl font-semibold text-slate-100">About</h2>

      <p className="max-w-xl text-base font-sans leading-relaxed text-slate-300">
        I study presidential power in the separation of powers system. My
        research asks what policy presidents pursue through unilateral
        actions, and how they calibrate the policy content of those actions
        under institutional constraint. To study this, I develop an anchored
        embedding scaling method to measure policy displacement of unilateral
        actions.
      </p>

      <p className="mt-4 max-w-xl text-base font-sans leading-relaxed text-slate-300">
        Substantively, I work on American political institutions, executive
        politics, legislative politics, and political communication.
        Methodologically, I use large-scale text analysis, large language
        models, and other computational tools to build new measures from
        political texts.
      </p>

      {/* Research Interests */}
      <div className="mt-8 flex flex-wrap gap-2">
        {RESEARCH_INTERESTS.map((interest) => (
          <span
            key={interest}
            className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-300"
          >
            {interest}
          </span>
        ))}
      </div>

      {/* Education */}
      <div className="mt-12">
        <h4 className="mb-4 text-sm font-medium uppercase tracking-widest text-slate-500">
          Education
        </h4>
        <ul className="space-y-3">
          {EDUCATION.map((entry) => (
            <li key={entry.degree} className="text-base">
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
