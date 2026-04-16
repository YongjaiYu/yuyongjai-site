import type { Metadata } from "next";
import KoreanDecrees from "@/components/playground/KoreanDecrees";

export const metadata: Metadata = {
  title: "Korean Presidential Decree Explorer — Yongjai Yu",
  description:
    "Explore 44,345 amendments to Korean presidential decrees (대통령령) from 1988 to March 2026. Filter by president, ministry, and amendment type.",
  openGraph: {
    title: "Korean Presidential Decree Explorer",
    description:
      "44,345 amendments to Korean presidential decrees. Search by name, president, ministry, and type.",
    type: "website",
    siteName: "Yongjai Yu",
  },
  twitter: {
    card: "summary_large_image",
    title: "Korean Presidential Decree Explorer",
    description:
      "44,345 amendments to Korean presidential decrees (대통령령) from 1988 to March 2026.",
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

export default function KoreanDecreesPage() {
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
            Korean Decree Explorer
          </h1>
          <p className="mt-3 max-w-2xl font-sans text-base leading-relaxed text-slate-400">
            Explore 44,345 amendments to Korean presidential decrees
            (대통령령) across nine administrations, from 1988 to March 2026.
            Data sourced from the Korea Legislation Research Institute.
          </p>
        </header>
        <KoreanDecrees />
        <footer className="mt-16 border-t border-slate-800 pt-6 font-sans text-xs text-slate-600">
          <p>
            Data: 법제처 국가법령정보센터 (law.go.kr). Public records
            compiled for research purposes.
          </p>
        </footer>
      </div>
    </main>
  );
}
