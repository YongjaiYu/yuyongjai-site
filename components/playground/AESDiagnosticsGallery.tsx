import Image from "next/image";

type DiagnosticFigure = {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly title: string;
  readonly caption: string;
};

type DiagnosticGroup = {
  readonly label: string;
  readonly figures: readonly DiagnosticFigure[];
};

const DIAGNOSTIC_GROUPS: readonly DiagnosticGroup[] = [
  {
    label: "Validation",
    figures: [
      {
        src: "/figures/aes/aes_heldout_validation_chart.png",
        width: 1800,
        height: 931,
        title: "Held-out fit on anchor bills",
        caption:
          "Out-of-sample R² and Spearman ρ on anchor bills across nested 10-fold CV, fixed-penalty CV, and a 20% holdout test set, with robustness diagnostics spanning seed variation, leave-one-Congress-out, leave-one-issue-out, and temporal splits.",
      },
      {
        src: "/figures/aes/rollcall_auc_lollipop.png",
        width: 1800,
        height: 922,
        title: "Roll-call vote prediction",
        caption:
          "AUC in roll-call vote prediction: a NOMINATE-only baseline (0.821), the AES interaction model (0.941), and the Crosson et al. benchmark (0.960). AES closes 87% of the baseline-to-benchmark gap.",
      },
      {
        src: "/figures/aes/president_nominate_jackknife.png",
        width: 1800,
        height: 1195,
        title: "Leave-one-president-out NOMINATE correlation",
        caption:
          "Jackknife sensitivity of the president-level AES–NOMINATE correlation (full sample r = 0.597). Omitting any single president moves r between 0.543 (Reagan omitted) and 0.687 (Nixon omitted).",
      },
      {
        src: "/figures/aes/permutation_placebo.png",
        width: 1800,
        height: 832,
        title: "Permutation placebo",
        caption:
          "Placebo test permuting classification labels. The observed gap in party separation between ideological and non-ideological directives (Cohen's d = 0.405) falls far outside the central 95% of the permutation null.",
      },
    ],
  },
  {
    label: "Robustness",
    figures: [
      {
        src: "/figures/aes/form_orthogonality.jpg",
        width: 1800,
        height: 1198,
        title: "Form orthogonality",
        caption:
          "Directives and anchor bills separate cleanly on a bill–directive form axis while overlapping fully on AES. The form–ideology cosine of −0.019 indicates the scale is not driven by document form.",
      },
    ],
  },
];

export function AESDiagnosticsGallery() {
  return (
    <section className="overflow-hidden rounded border border-slate-800 bg-slate-950/40 p-5 font-sans">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-100">
          Validation &amp; Diagnostics
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
          Static exhibits from the current draft&rsquo;s validation and
          diagnostic suite. Click any figure to open it at full size.
        </p>
      </div>
      <div className="space-y-8">
        {DIAGNOSTIC_GROUPS.map((group) => (
          <div key={group.label}>
            <h3 className="mb-3 text-xs font-medium uppercase tracking-widest text-slate-500">
              {group.label}
            </h3>
            <div className="grid gap-6 sm:grid-cols-2">
              {group.figures.map((figure) => (
                <figure key={figure.src}>
                  <a
                    href={figure.src}
                    target="_blank"
                    rel="noreferrer"
                    className="block overflow-hidden rounded border border-slate-800 bg-white p-2 transition-colors hover:border-slate-600 sm:p-3"
                  >
                    <Image
                      src={figure.src}
                      alt={figure.title}
                      width={figure.width}
                      height={figure.height}
                      className="h-auto w-full"
                      loading="lazy"
                      unoptimized
                    />
                  </a>
                  <figcaption className="mt-2">
                    <p className="text-sm font-medium text-slate-300">
                      {figure.title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      {figure.caption}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
