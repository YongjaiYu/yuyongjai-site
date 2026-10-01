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
          I study presidential power and policy choice under institutional
          constraints. My research examines which policies presidents pursue
          through unilateral action and how far those actions move policy from
          the status quo. My dissertation develops methods to classify
          presidential directives and measure their ideological content.
        </p>

        <p>
          My methodological work focuses on measurement and validation in
          computational social science. I study how evaluation design shapes
          the choice of text classifiers and how faithfully survey digital
          twins reproduce human response patterns.
        </p>

        <p>
          I am affiliated with the{" "}
          <a
            href="https://tecd-lab.ucr.edu/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 transition-colors hover:text-cyan-300 hover:underline focus-visible:underline"
          >
            Laboratory for Technology, Communication and Democracy (TeCD-Lab)
          </a>{" "}
          at UC Riverside, directed by Professor Kevin Esterling. I also serve
          on the web development team for{" "}
          <a
            href="https://tecd-lab.ucr.edu/prytaneum"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 transition-colors hover:text-cyan-300 hover:underline focus-visible:underline"
          >
            Prytaneum
          </a>
          , a platform for deliberative public engagement.
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
