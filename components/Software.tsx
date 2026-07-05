export default function Software() {
  return (
    <section id="software" className="site_section">
      <h2 className="section_heading">Software</h2>

      <article className="surface_card content_limiter">
        <a
          href="https://github.com/YongjaiYu/poljacc"
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-medium text-cyan-400 transition-colors hover:text-cyan-300 hover:underline"
        >
          poljacc
        </a>
        <p className="mt-2 font-sans text-sm leading-relaxed text-slate-400">
          Vocabulary separability diagnostics for text classification.
          <br />
          Companion package for Oh and Yu, &ldquo;When Sparse Beats
          Dense: Vocabulary Separability and Model Selection in Political Text
          Analysis.&rdquo;
        </p>
      </article>
    </section>
  );
}
