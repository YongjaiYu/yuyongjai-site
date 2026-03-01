const METHODS = [
  "Large Language Models",
  "Bayesian Statistics",
  "Causal Inference",
  "Machine Learning",
  "Multimodal Analysis",
  "Text Analysis",
];

const LANGUAGES = ["R", "Python"];

export default function CV() {
  return (
    <section id="cv" className="py-20">
      <p className="text-sm">
        <span className="text-slate-500">$</span>{" "}
        <span className="text-cyan-400">open</span>{" "}
        <span className="text-pink-400">cv.pdf</span>
      </p>

      {/* Methods & Tools */}
      <div className="mt-8">
        <h3 className="mb-4 text-xs font-medium uppercase tracking-widest text-slate-500">
          Methods
        </h3>
        <p className="text-sm leading-relaxed text-slate-200">
          {METHODS.join(" \u00B7 ")}
        </p>
      </div>

      <div className="mt-6">
        <h3 className="mb-4 text-xs font-medium uppercase tracking-widest text-slate-500">
          Programming
        </h3>
        <p className="text-sm text-slate-400">
          {LANGUAGES.map((lang, index) => (
            <span key={lang}>
              <span className="font-mono text-slate-300">{lang}</span>
              {index < LANGUAGES.length - 1 && (
                <span className="text-slate-600"> / </span>
              )}
            </span>
          ))}
        </p>
      </div>

      {/* Download Link */}
      <div className="mt-10">
        <a
          href="/cv.pdf"
          download
          className="text-sm text-cyan-400 transition-colors hover:text-cyan-300 hover:underline"
        >
          Download full CV (PDF) &rarr;
        </a>
      </div>
    </section>
  );
}
