import type { Metadata } from "next";
import AESExplorer from "@/components/playground/AESExplorer";
import PasswordGate from "@/components/playground/PasswordGate";

export const metadata: Metadata = {
  title: "AES Explorer — Yongjai Yu",
  description:
    "Explore 24,625 presidential directives on a liberal–conservative scale. Interactive visualization using Anchored Embedding Scaling (AES).",
  openGraph: {
    title: "AES Explorer",
    description:
      "Explore 24,625 presidential directives on a liberal–conservative scale. Filter by president, ideology, and directive type.",
    type: "website",
    siteName: "Yongjai Yu",
    images: [
      {
        url: "/og/aes-explorer.png",
        width: 1200,
        height: 630,
        alt: "AES Explorer — Presidential directive ideological positions scatter plot",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AES Explorer — Yongjai Yu",
    description:
      "Explore 24,625 presidential directives on a liberal–conservative scale.",
    images: ["/og/aes-explorer.png"],
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

export default function AESExplorerPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 sm:px-8 lg:px-16">
      <nav className="fixed left-0 top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:gap-6 sm:px-8 lg:px-16">
          <a
            href="/"
            className="shrink-0 whitespace-nowrap text-sm font-bold text-slate-100 transition-colors hover:text-cyan-400"
          >
            Yongjai Yu
          </a>
          <div className="flex min-w-0 gap-4 overflow-x-auto">
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
            AES Explorer
          </h1>
          <p className="mt-3 max-w-2xl font-sans text-base leading-relaxed text-slate-400">
            Presidential directives positioned on a liberal–conservative scale
            using Anchored Embedding Scaling. Each dot is an executive order,
            proclamation, or memorandum. Hover to see details.
          </p>
        </header>
        <PasswordGate>
          <AESExplorer />
          <footer className="mt-16 border-t border-slate-800 pt-6 font-sans text-xs text-slate-600">
            <p>
              Data from Yu (2026), &ldquo;Measuring Policy Displacement in
              Presidential Directives.&rdquo;
            </p>
            <p className="mt-1">
              Score range: liberal (&minus;1.75) to conservative (+2.26).
              1789&ndash;2026, N&nbsp;=&nbsp;24,625.
            </p>
            <p className="mt-1">
              Ideological positions are anchored using bill-level ideal points
              from Crosson et al. (2025) plus Kim-calibrated anchors.
            </p>
          </footer>
        </PasswordGate>
      </div>
    </main>
  );
}
