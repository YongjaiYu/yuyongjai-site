"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Dissertation", href: "#dissertation" },
  { label: "Research", href: "#research" },
  { label: "Teaching", href: "#teaching" },
  { label: "Software", href: "#software" },
  { label: "CV", href: "#cv" },
] as const;

export default function Sidebar() {
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -70% 0px" }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    // Detect bottom of page → activate last section
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 100) {
        setActiveSection("cv");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    },
    []
  );

  return (
    <aside className="relative px-4 py-8 lg:fixed lg:left-0 lg:top-0 lg:flex lg:h-screen lg:w-[38%] lg:justify-center lg:px-10">
      <div className="mx-auto w-full max-w-sm lg:my-auto">
        {/* Profile */}
        <div className="mb-6">
          <Image
            src="/profile.jpg"
            alt="Yongjai Yu"
            width={120}
            height={120}
            className="rounded-full ring-2 ring-slate-700"
            priority
          />
          <h1 className="mt-5 text-4xl font-bold text-slate-100">Yongjai Yu</h1>
          <p className="mt-2 text-base text-slate-400">Ph.D. Student at UCR</p>
        </div>

        {/* Tagline */}
        <p className="mb-6 text-base leading-relaxed text-slate-400">
          I study how presidents use unilateral action to pursue policy
          under institutional constraint, and I develop computational
          methods to measure policy content at scale.
        </p>

        {/* Research Tree */}
        <div className="mb-6 text-sm leading-snug text-slate-600">
          <p>├── <span className="text-emerald-400">presidential-power/</span></p>
          <p>│   ├── <span className="text-blue-400">unilateral-actions/</span></p>
          <p>│   └── <span className="text-blue-400">cost-constrained-model/</span></p>
          <p>├── <span className="text-emerald-400">computational-methods/</span></p>
          <p>│   ├── <span className="text-blue-400">anchored-embedding-scaling/</span></p>
          <p>│   ├── <span className="text-blue-400">llm-classification/</span></p>
          <p>│   └── <span className="text-blue-400">agent-based-model/</span></p>
          <p>├── <span className="text-emerald-400">digital-twins/</span></p>
          <p>│   └── <span className="text-blue-400">digital-twins-confounder/</span></p>
          <p>└── <span className="text-emerald-400">political-communication/</span></p>
          <p>{'\u00A0\u00A0\u00A0\u00A0'}└── <span className="text-blue-400">pol.me/</span></p>
        </div>

        {/* Navigation */}
        <nav className="mt-8 hidden lg:block">
          <ul className="space-y-2">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`group flex items-center text-xs font-medium uppercase tracking-widest transition-colors ${
                      isActive
                        ? "text-slate-100"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    <span
                      className={`mr-3 inline-block h-px transition-all ${
                        isActive
                          ? "w-8 bg-slate-100"
                          : "w-4 bg-slate-600 group-hover:w-6 group-hover:bg-slate-400"
                      }`}
                    />
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 flex gap-6 text-slate-100">
            <a
              href="mailto:yongjai.yu@email.ucr.edu"
              aria-label="Email"
              className="transition-colors hover:text-cyan-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </a>
            <a
              href="https://github.com/YongjaiYu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="transition-colors hover:text-cyan-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
            </a>
          </div>
        </nav>

      </div>
    </aside>
  );
}
