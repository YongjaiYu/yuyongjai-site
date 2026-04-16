import type { Metadata } from "next";
import PoljaccDemo from "@/components/playground/PoljaccDemo";

export const metadata: Metadata = {
  title: "poljacc — Vocabulary Separability Diagnostic",
  description:
    "Should you use sparse or dense models for your text classification? Diagnose vocabulary separability with Jaccard overlap.",
  openGraph: {
    title: "poljacc — Vocabulary Separability Diagnostic",
    description:
      "Should you use TF-IDF or neural models? Diagnose vocabulary separability interactively.",
    type: "website",
    siteName: "Yongjai Yu",
  },
  twitter: {
    card: "summary_large_image",
    title: "poljacc — Vocabulary Separability Diagnostic",
    description:
      "Should you use TF-IDF or neural models? Diagnose vocabulary separability interactively.",
  },
};

const NAV_ITEMS = [
  { label: "About", href: "/#about" },
  { label: "Dissertation", href: "/#dissertation" },
  { label: "Research", href: "/#research" },
  { label: "Teaching", href: "/#teaching" },
  { label: "Software", href: "/#software" },
  { label: "Sandbox", href: "/#sandbox" },
  { label: "CV", href: "/#cv" },
];

export default function PoljaccPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 sm:px-8 lg:px-16">
      <nav className="fixed left-0 top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3 sm:px-8 lg:px-16">
          <a
            href="/"
            className="text-sm font-bold text-slate-100 transition-colors hover:text-cyan-400"
          >
            Yongjai Yu
          </a>
          <div className="flex gap-4 overflow-x-auto scrollbar-none">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="whitespace-nowrap text-xs font-medium uppercase tracking-widest text-slate-500 transition-colors hover:text-slate-200"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>
      <div className="mx-auto max-w-6xl pt-8">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-100 sm:text-4xl">
            poljacc
          </h1>
          <p className="mt-3 max-w-2xl font-sans text-base leading-relaxed text-slate-400">
            Vocabulary separability diagnostic for text classification. Paste
            documents from two classes to measure Jaccard overlap and get a
            model recommendation: sparse (TF-IDF) or dense (neural).
          </p>
        </header>
        <PoljaccDemo />
        <footer className="mt-16 border-t border-slate-800 pt-6 font-sans text-xs text-slate-600">
          <p>
            Companion tool for Oh and Yu (2026), &ldquo;When Sparse Beats Dense:
            Vocabulary Separability and Model Selection in Political Text
            Analysis.&rdquo;
          </p>
          <p className="mt-1">
            Install the full package:{" "}
            <code className="text-slate-400">pip install poljacc</code>
          </p>
        </footer>
      </div>
    </main>
  );
}
