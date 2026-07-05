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
    <section id="dissertation" className="site_section">
      <h2 className="section_heading">Dissertation</h2>

      <div className="content_limiter">
        <h3 className="text-xl font-semibold leading-snug text-slate-100">
          Strategic Unilateralism and Presidential Policy Choice
        </h3>

        <h4 className="section_kicker mt-8 mb-4">
          Overview
        </h4>

        <p className="font-sans text-base leading-relaxed text-slate-300">
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
      </div>

      {/* Three Chapters */}
      <div className="feed mt-8">
        {CHAPTERS.map((chapter) => (
          <article
            key={chapter.number}
            className="surface_card grid gap-3 sm:grid-cols-[5.5rem_minmax(0,1fr)]"
          >
            <p className="text-sm font-medium text-slate-500">
              Chapter {chapter.number}
            </p>
            <div className="min-w-0">
              <h4 className="font-semibold leading-snug text-slate-200">
                {chapter.title}
              </h4>
              <p className="mt-1 text-base text-cyan-400/75">{chapter.subtitle}</p>
              <p className="mt-2 font-sans text-base leading-relaxed text-slate-400">
                {chapter.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
