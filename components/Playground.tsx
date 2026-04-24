export default function Playground() {
  return (
    <section id="workbench" className="py-20">
      <h2 className="mb-6 text-2xl font-semibold text-slate-100">Workbench</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-cyan-400">AES Explorer</h3>
          <p className="mt-2 font-sans text-sm leading-relaxed text-slate-400">
            Interactive visualization of 20,961 presidential directives on the
            liberal–conservative scale using Anchored Embedding Scaling.
          </p>
          <p className="mt-3 font-sans text-sm italic text-slate-500">
            Preview available upon request.
          </p>
        </div>

        <div>
          <a
            href="/workbench/poljacc"
            className="group block rounded-lg border border-slate-800 p-5 transition-colors hover:border-slate-600"
          >
            <h3 className="text-lg font-medium text-cyan-400 transition-colors group-hover:text-cyan-300">
              poljacc
            </h3>
            <p className="mt-2 font-sans text-sm leading-relaxed text-slate-400">
              Vocabulary separability diagnostic for text classification. Measure
              Jaccard overlap between classes to decide: sparse (TF-IDF) or
              dense (neural)?
            </p>
            <span className="mt-3 inline-block text-xs font-medium uppercase tracking-widest text-slate-600 transition-colors group-hover:text-slate-400">
              Try it &rarr;
            </span>
          </a>
        </div>

        <div>
          <a
            href="/workbench/korean-decrees"
            className="group block rounded-lg border border-slate-800 p-5 transition-colors hover:border-slate-600"
          >
            <h3 className="text-lg font-medium text-cyan-400 transition-colors group-hover:text-cyan-300">
              Korean Decree Explorer
            </h3>
            <p className="mt-2 font-sans text-sm leading-relaxed text-slate-400">
              Explore 44,345 amendments to Korean presidential decrees
              (대통령령) across nine administrations, from 1988 to March 2026.
              Filter by president, ministry, and amendment type.
            </p>
            <span className="mt-3 inline-block text-xs font-medium uppercase tracking-widest text-slate-600 transition-colors group-hover:text-slate-400">
              Try it &rarr;
            </span>
          </a>
        </div>

        <div>
          <a
            href="/workbench/text-polarization"
            className="group block rounded-lg border border-slate-800 p-5 transition-colors hover:border-slate-600"
          >
            <h3 className="text-lg font-medium text-cyan-400 transition-colors group-hover:text-cyan-300">
              Text Polarization
            </h3>
            <p className="mt-2 font-sans text-sm leading-relaxed text-slate-400">
              How different is the language Democrats and Republicans use on
              the floor? Eight decades of vocabulary divergence across the
              79th–119th Congress (1945–2026), with chamber splits, term
              trajectories, and era comparison.
            </p>
            <span className="mt-3 inline-block text-xs font-medium uppercase tracking-widest text-slate-600 transition-colors group-hover:text-slate-400">
              Try it &rarr;
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
