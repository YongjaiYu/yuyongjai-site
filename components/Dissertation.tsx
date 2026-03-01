const PAPERS = [
  {
    number: 1,
    title: "Not Every Unilateral Action Is Ideological",
    subtitle: "Strategic Visibility & Instrument Choice",
    description:
      "Presidents strategically pair ideological directives with less visible instruments like memoranda to minimize political costs.",
  },
  {
    number: 2,
    title: "Unilateral Actions: Continuous Cost Constraint Model and Policy Displacement",
    subtitle: "Policy Displacement & Anchored Embedding Scaling",
    description:
      "Introduces a measure of policy displacement using AES to locate directives and statutes in a common ideological space.",
  },
  {
    number: 3,
    title: "Unilateral Actions and Electoral Responsiveness",
    subtitle: "Swing-State Targeting",
    description:
      "Tests whether presidents tailor directives to electorally pivotal constituencies, particularly during election years.",
  },
];

export default function Dissertation() {
  return (
    <section id="dissertation" className="py-20">
      <h3 className="mb-6 text-2xl font-semibold text-slate-200">Dissertation</h3>

      <h4 className="text-lg font-semibold text-slate-100">
        The Ideological Content of Presidential Unilateral Action
      </h4>

      <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-200">
        A three-paper dissertation developing a unified, content-focused theory
        of presidential unilateral action. Presidents strategically calibrate the
        ideological character, magnitude, and electoral targeting of directives
        to manage institutional constraints and maximize political returns.
      </p>

      {/* Three Papers */}
      <div className="mt-8 space-y-6">
        {PAPERS.map((paper) => (
          <div
            key={paper.number}
            className="border-l-2 border-slate-700 pl-4 transition-all duration-300 hover:border-cyan-400/50 hover:bg-cyan-400/[0.03]"
          >
            <p className="text-sm text-slate-500">Paper {paper.number}</p>
            <h4 className="mt-1 font-semibold text-slate-200">
              {paper.title}
            </h4>
            <p className="text-base text-cyan-400/70">{paper.subtitle}</p>
            <p className="mt-1 text-base text-slate-400">{paper.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
