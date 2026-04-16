export default function Software() {
  return (
    <section id="software" className="py-20">
      <h3 className="mb-6 text-2xl font-semibold text-slate-100">Software</h3>

      <div>
        <a
          href="https://github.com/YongjaiYu/poljacc"
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-medium text-cyan-400 transition-colors hover:text-cyan-300 hover:underline"
        >
          poljacc
        </a>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Vocabulary separability diagnostics for text classification.
          <br />
          Companion package for Oh and Yu (2026), &ldquo;When Sparse Beats
          Dense: Vocabulary Separability and Model Selection in Political Text
          Analysis.&rdquo;
        </p>
      </div>
    </section>
  );
}
