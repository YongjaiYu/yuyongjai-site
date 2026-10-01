export default function Developing() {
  return (
    <section id="developing" className="site_section">
      <h2 className="section_heading">Developing</h2>

      <div className="feed">
        <article className="surface_card">
          <h3 className="font-semibold leading-snug text-slate-200">
            <a
              href="https://tecd-lab.ucr.edu/prytaneum"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 transition-colors hover:text-cyan-300 hover:underline focus-visible:underline"
            >
              Prytaneum
            </a>
          </h3>
          <p className="mt-1 text-base text-slate-400">
            Web Development Team
          </p>
          <p className="mt-1 text-base text-slate-400">
            Affiliated with{" "}
            <a
              href="https://tecd-lab.ucr.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 transition-colors hover:text-cyan-300 hover:underline focus-visible:underline"
            >
              TeCD-Lab
            </a>
            , UC Riverside
          </p>
          <p className="mt-2 font-sans text-base leading-relaxed text-slate-300">
            I contribute to the development of Prytaneum, an AI-assisted
            platform for deliberative public engagement. Developed at the
            Laboratory for Technology, Communication and Democracy, directed
            by Professor Kevin Esterling, the platform helps speakers
            understand participants&apos; ideas and perspectives at scale.
          </p>
        </article>

        <article className="surface_card">
          <h3 className="font-semibold leading-snug text-slate-200">
            LightHouse
          </h3>
          <p className="mt-1 text-base text-slate-400">Coming soon</p>
        </article>
      </div>
    </section>
  );
}
