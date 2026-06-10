const CHAPTERS = [
  {
    number: 1,
    title:
      "Measuring the Ideological Content of Presidential Directives Using Anchored Embedding Scaling",
    subtitle: "Classification and AES",
    description:
      "This chapter develops a classification scheme for unilateral actions and estimates the ideological positions of presidential directives. It classifies directives by policy content and instrument, then uses anchored embedding scaling to locate them in liberal-conservative policy space.",
  },
  {
    number: 2,
    title:
      "Recovering the Status Quo for Unilateral Directives and Estimating Policy Displacement",
    subtitle: "Status Quo and Policy Displacement",
    description:
      "This chapter recovers the policy status quo from which presidents depart when they act unilaterally. It develops a pipeline for identifying the relevant status quo against which presidential directives can be interpreted as policy movement. Using anchored embedding scaling, the chapter estimates the policy displacement produced by unilateral actions.",
  },
  {
    number: 3,
    title: "A Cost-Constrained Model of Unilateral Action",
    subtitle: "Theory and Institutional Constraint",
    description:
      "This chapter develops a cost-constrained model of unilateral action. It tests the theoretical prediction that presidents are likely to move policy toward the veto pivot, while arguing that presidents may stop short of this constraint boundary when institutional costs become sufficiently high. The chapter examines why presidents limit the policy displacement of unilateral actions even when unilateral authority allows them to move policy on their own.",
  },
];

export default function Dissertation() {
  return (
    <section id="dissertation" className="py-20">
      <h2 className="mb-6 text-2xl font-semibold text-slate-100">Dissertation</h2>

      <h4 className="text-lg font-semibold text-slate-100">
        Strategic Unilateralism and Presidential Policy Choice
      </h4>

      <h4 className="mt-8 mb-4 text-sm font-medium uppercase tracking-widest text-slate-500">
        Overview
      </h4>

      <p className="max-w-xl text-base font-sans leading-relaxed text-slate-300">
        This dissertation examines how presidents calibrate the content of
        unilateral actions to manage institutional constraints and maximize
        political benefits. The first chapter proposes a new measurement
        framework, anchored embedding scaling (AES), to estimate the locations
        of unilateral actions within the liberal-conservative policy space. The
        second chapter recovers the inherited policy status quo for each
        directive and estimates the policy displacement produced by unilateral
        actions using AES. The third chapter extends existing models of
        unilateral action by proposing a cost-constrained model of presidential
        policy choice.
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
            <p className="mt-1 font-sans text-base text-slate-400">{chapter.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
