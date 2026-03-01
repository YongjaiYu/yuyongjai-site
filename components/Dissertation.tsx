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
      <p className="text-sm">
        <span className="text-slate-500">$</span>{" "}
        <span className="text-cyan-400">cat</span>{" "}
        <span className="text-violet-400">dissertation.md</span>
      </p>

      <h3 className="mt-6 text-lg font-semibold text-slate-100">
        The Ideological Content of Presidential Unilateral Action
      </h3>

      <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-200">
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
            className="border-l-2 border-slate-700 pl-4 transition-colors hover:border-cyan-400/50"
          >
            <p className="text-xs text-slate-500">Paper {paper.number}</p>
            <h4 className="mt-1 font-semibold text-slate-200">
              {paper.title}
            </h4>
            <p className="text-sm text-cyan-400/70">{paper.subtitle}</p>
            <p className="mt-1 text-sm text-slate-400">{paper.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
