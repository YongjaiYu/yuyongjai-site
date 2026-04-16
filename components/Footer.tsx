export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800 py-8">
      <h3 className="mb-4 text-2xl font-semibold text-slate-100">Contact</h3>
      <div className="mb-6 space-y-2 text-sm">
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
      <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} Yongjai Yu</p>
    </footer>
  );
}
