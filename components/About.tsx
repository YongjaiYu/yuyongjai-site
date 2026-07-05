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
    <section id="about" className="site_section">
      <h2 className="section_heading">About</h2>

      <div className="content_limiter stack font-sans text-base leading-relaxed text-slate-300">
        <p>
        I study presidential power in the separation of powers system. My
        research asks what policy presidents pursue through unilateral
        actions, and how they calibrate the policy content of those actions
        under institutional constraint. To study this, I develop an anchored
        embedding scaling method to measure policy displacement of unilateral
        actions.
        </p>

        <p>
        Substantively, I work on American political institutions, executive
        politics, legislative politics, and political communication.
        Methodologically, I use large-scale text analysis, large language
        models, and other computational tools to build new measures from
        political texts.
        </p>
      </div>

      {/* Research Interests */}
      <div className="cluster mt-8">
        {RESEARCH_INTERESTS.map((interest) => (
          <span
            key={interest}
            className="rounded-full border border-slate-700/80 bg-slate-900/40 px-3 py-1 text-sm text-slate-300"
          >
            {interest}
          </span>
        ))}
      </div>

      {/* Education */}
      <div className="mt-12">
        <h3 className="section_kicker mb-4">
          Education
        </h3>
        <ul className="feed">
          {EDUCATION.map((entry) => (
            <li key={entry.degree} className="surface_card text-base">
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
