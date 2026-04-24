import type { Metadata } from "next";
import TextPolarization from "@/components/playground/TextPolarization";

export const metadata: Metadata = {
  title: "Text Polarization — Yongjai Yu",
  description:
    "How different is the language Democrats and Republicans use on the floor? Explore vocabulary divergence across the 79th–119th Congress (1945–2026).",
  openGraph: {
    title: "Text Polarization: D vs R Floor Speech",
    description:
      "Vocabulary overlap between Democratic and Republican floor speeches, 79th–119th Congress.",
    type: "website",
    siteName: "Yongjai Yu",
  },
  twitter: {
    card: "summary_large_image",
    title: "Text Polarization: D vs R Floor Speech",
    description:
      "Vocabulary overlap between Democratic and Republican floor speeches, 79th–119th Congress.",
  },
};

const NAV_ITEMS = [
  { label: "About", href: "/#about" },
  { label: "Dissertation", href: "/#dissertation" },
  { label: "Research", href: "/#research" },
  { label: "Teaching", href: "/#teaching" },
  { label: "Software", href: "/#software" },
  { label: "Workbench", href: "/#workbench" },
  { label: "CV", href: "/#cv" },
];

export default function TextPolarizationPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 sm:px-8 lg:px-16">
      <nav className="fixed left-0 top-0 z-40 w-full border-b border-slate-800 bg-slate-950">
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
            Text Polarization
          </h1>
          <p className="mt-3 max-w-2xl font-sans text-base leading-relaxed text-slate-400">
            How different is the language Democrats and Republicans use on the
            floor? Eight decades of vocabulary divergence across the 79th–119th
            Congress (1945–2026), measured by Jaccard similarity and log-odds
            ratios. Chamber splits, term trajectories, and era-to-era
            comparison.
          </p>
        </header>
        <TextPolarization />
        <footer className="mt-16 border-t border-slate-800 pt-6 font-sans text-xs text-slate-600">
          <p>
            Data: Congressional Record floor speeches. 79th–96th from
            Hein-Bound (Stanford, bound edition via Gentzkow, Shapiro, Taddy
            2019); 97th–107th from Hein-Daily (same source, daily edition);
            108th–119th rebuilt from GovInfo CREC. Older bound-edition volumes
            are OCR-based and noisier than post-1981 daily editions.
          </p>
        </footer>
      </div>
    </main>
  );
}
