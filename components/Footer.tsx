export default function Footer() {
  return (
    <footer className="site_section pb-8">
      <h2 className="section_heading">Contact</h2>
      <div className="cluster mb-6 text-sm">
        <p>
          <a
            href="mailto:yongjai.yu@email.ucr.edu"
            className="text-slate-400 transition-colors hover:text-cyan-400"
          >
            yongjai.yu@email.ucr.edu
          </a>
        </p>
        <p>
          <a
            href="https://github.com/YongjaiYu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 transition-colors hover:text-cyan-400"
          >
            github.com/YongjaiYu
          </a>
        </p>
      </div>
      <p className="text-sm text-slate-500">
        &copy; {new Date().getFullYear()} Yongjai Yu
      </p>
    </footer>
  );
}
