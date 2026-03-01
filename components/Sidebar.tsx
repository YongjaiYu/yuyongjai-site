"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Dissertation", href: "#dissertation" },
  { label: "Research", href: "#research" },
  { label: "Teaching", href: "#teaching" },
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
    <aside className="relative px-4 py-8 lg:fixed lg:left-0 lg:top-0 lg:flex lg:h-screen lg:w-[38%] lg:items-center lg:justify-center lg:px-10">
      <div className="mx-auto w-full max-w-sm">
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
        </div>

        {/* Tagline */}
        <p className="mb-6 text-lg leading-relaxed text-slate-400">
          Ph.D. Student in Political Science at UC Riverside.
        </p>

        {/* Research Tree */}
        <div className="mb-8 text-sm leading-relaxed text-slate-600">
          <p>├── <span className="text-emerald-400">presidential-power/</span></p>
          <p>│   ├── <span className="text-blue-400">unilateral-actions/</span></p>
          <p>│   └── <span className="text-blue-400">continuous-cost-constraint/</span></p>
          <p>├── <span className="text-emerald-400">computational-methods/</span></p>
          <p>│   ├── <span className="text-blue-400">llm-classification/</span></p>
          <p>│   ├── <span className="text-blue-400">aes/</span></p>
          <p>│   └── <span className="text-blue-400">multimodal-analysis/</span></p>
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
                    className={`group flex items-center text-base transition-colors ${
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
        </nav>

        {/* Email */}
        <div className="mt-6 pt-4">
          <a
            href="mailto:yongjai.yu@email.ucr.edu"
            className="text-sm text-slate-500 transition-colors hover:text-cyan-400"
          >
            yongjai.yu@email.ucr.edu
          </a>
        </div>
      </div>
    </aside>
  );
}
