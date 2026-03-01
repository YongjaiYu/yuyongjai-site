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
      <h3 className="mb-6 text-2xl font-semibold text-slate-200">About</h3>

      <p className="max-w-xl text-base leading-relaxed text-slate-200">
        My research interests span American political institutions, the
        separation of powers, and political polarization. Methodologically, I
        apply computational tools&mdash;large language models, text analysis,
        and multimodal deep learning&mdash;to questions about how political
        actors communicate, legislate, and exercise power.
      </p>

      <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-200">
        I am also interested in how polarization shapes political participation
        on digital platforms, and in particular, how online communication
        between elected officials and their constituents can be improved.
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
        <h3 className="mb-4 text-sm font-medium uppercase tracking-widest text-slate-500">
          Education
        </h3>
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
