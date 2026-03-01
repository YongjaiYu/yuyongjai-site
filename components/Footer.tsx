export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800 py-8">
      <p className="text-xs text-slate-600">
        <span className="text-slate-500">$</span>{" "}
        <span className="text-slate-600">echo</span>{" "}
        <span className="text-slate-500">
          &quot;&copy; {new Date().getFullYear()} Yongjai Yu&quot;
        </span>
      </p>
    </footer>
  );
}
