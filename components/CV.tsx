export default function CV() {
  return (
    <section id="cv" className="py-20">
      <h3 className="mb-6 text-2xl font-semibold text-slate-200">CV</h3>

      <a
        href="/cv.pdf"
        download
        className="text-base text-cyan-400 transition-colors hover:text-cyan-300 hover:underline"
      >
        Download full CV (PDF) &rarr;
      </a>
    </section>
  );
}
