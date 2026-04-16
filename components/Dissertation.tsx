const CHAPTERS = [
  {
    number: 1,
    title: "Measuring Policy Displacement: Anchored Embedding Scaling and Status Quo",
    subtitle: "Measurement",
    description:
      "This paper develops a measure of policy displacement in presidential directives by placing unilateral actions in relation to the inherited statutory status quo. It provides the measurement foundation for studying how far presidents move policy through unilateral means.",
  },
  {
    number: 2,
    title: "Cost-Constrained Theory of Unilateral Action",
    subtitle: "Theory",
    description:
      "This paper develops a model in which presidents choose unilateral policy under institutional and political constraints. Rather than assuming binary costs of unilateral action, it argues that costs are continuous. Presidents stop short of their preferred policy when the political costs of displacement rise.",
  },
  {
    number: 3,
    title: "Presidential Representation with Unilateral Actions",
    subtitle: "Application",
    description:
      "This paper examines whether presidents use unilateral actions to represent national constituencies or particular groups defined by race, class, and gender. Using the ideological locations of unilateral actions estimated in Chapter 1, it studies whether the content of directives is targeted toward specific constituencies rather than the national median voter.",
  },
];

export default function Dissertation() {
  return (
    <section id="dissertation" className="py-20">
      <h3 className="mb-6 text-2xl font-semibold text-slate-200">Dissertation</h3>

      <h4 className="text-lg font-semibold text-slate-100">
        Strategic Unilateralism and Presidential Policy Choice
      </h4>

      <h3 className="mt-8 mb-4 text-sm font-medium uppercase tracking-widest text-slate-500">
        Overview
      </h3>

      <p className="max-w-xl text-base leading-relaxed text-slate-200">
        This dissertation examines how presidents calibrate the content of
        unilateral actions to manage institutional constraints and maximize
        political benefits. The first chapter proposes a new measurement
        framework to estimate the extent to which presidents move the policy
        status quo. The second chapter extends the unilateral action model,
        proposing a cost-constrained model. The third chapter studies whether
        presidents represent national constituencies through unilateral actions.
      </p>

      {/* Three Chapters */}
      <div className="mt-8 space-y-6">
        {CHAPTERS.map((chapter) => (
          <div
            key={chapter.number}
            className="border-l-2 border-slate-700 pl-4 transition-all duration-300 hover:border-cyan-400/50 hover:bg-cyan-400/[0.03]"
          >
            <p className="text-sm text-slate-500">Chapter {chapter.number}</p>
            <h4 className="mt-1 font-semibold text-slate-200">
              {chapter.title}
            </h4>
            <p className="text-base text-cyan-400/70">{chapter.subtitle}</p>
            <p className="mt-1 text-base text-slate-400">{chapter.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
