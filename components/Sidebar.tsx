"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

const NAV_ITEMS = [
  { label: "about", href: "#about" },
  { label: "dissertation", href: "#dissertation" },
  { label: "research", href: "#research" },
  { label: "teaching", href: "#teaching" },
  { label: "cv", href: "#cv" },
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
    <aside className="relative px-4 py-8 lg:fixed lg:left-0 lg:top-0 lg:flex lg:h-screen lg:w-[45%] lg:items-center lg:justify-center lg:px-12">
      {/* Terminal Window */}
      <div className="mx-auto w-full max-w-md rounded-lg border border-slate-700/50 bg-slate-900/80">
        {/* Title Bar */}
        <div className="flex items-center gap-2 border-b border-slate-700/50 px-4 py-3">
          <div className="h-3 w-3 rounded-full bg-red-500/70" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
          <div className="h-3 w-3 rounded-full bg-green-500/70" />
          <span className="ml-2 text-xs text-slate-500">
            yongjai.yu@email.ucr.edu ~ zsh
          </span>
        </div>

        {/* Terminal Content */}
        <div className="p-6">
          {/* Profile Photo */}
          <div className="mb-5 flex items-center gap-4">
            <Image
              src="/profile.jpg"
              alt="Yongjai Yu"
              width={80}
              height={80}
              className="rounded-full ring-2 ring-slate-700"
              priority
            />
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Yongjai Yu</h1>
              <p className="text-xs text-slate-500">Political Scientist</p>
            </div>
          </div>

          {/* Info as key-value */}
          <div className="mb-6 space-y-1 text-sm">
            <p>
              <span className="text-slate-500">role</span>
              <span className="text-slate-600"> = </span>
              <span className="text-green-400">&quot;Ph.D. Student&quot;</span>
            </p>
            <p>
              <span className="text-slate-500">dept</span>
              <span className="text-slate-600"> = </span>
              <span className="text-green-400">&quot;Political Science&quot;</span>
            </p>
            <p>
              <span className="text-slate-500">univ</span>
              <span className="text-slate-600"> = </span>
              <span className="text-green-400">&quot;UC Riverside&quot;</span>
            </p>
            <p>
              <span className="text-slate-500">focus</span>
              <span className="text-slate-600"> = </span>
              <span className="text-amber-300">[</span>
              <span className="text-green-400">&quot;presidency&quot;</span>
              <span className="text-slate-600">, </span>
              <span className="text-green-400">&quot;executive power&quot;</span>
              <span className="text-slate-600">, </span>
              <span className="text-green-400">&quot;computational methods&quot;</span>
              <span className="text-amber-300">]</span>
            </p>
          </div>

          {/* Navigation — command style */}
          <nav className="hidden lg:block">
            <div className="mb-2 text-xs text-slate-600">
              ── navigation ──
            </div>
            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.href.slice(1);
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className={`group flex items-center text-sm transition-colors ${
                        isActive
                          ? "text-cyan-400"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      <span className={isActive ? "text-cyan-400" : "text-slate-600"}>
                        &gt;{" "}
                      </span>
                      {item.label}
                      {isActive && (
                        <span className="animate-blink ml-0.5 text-cyan-400">
                          ▌
                        </span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Social links as terminal output */}
          <div className="mt-6 border-t border-slate-700/50 pt-4">
            <div className="flex items-center gap-4">
              <a
                href="mailto:yongjai.yu@email.ucr.edu"
                className="text-slate-500 transition-colors hover:text-cyan-400"
                aria-label="Email"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-slate-500 transition-colors hover:text-cyan-400"
                aria-label="GitHub"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-slate-500 transition-colors hover:text-cyan-400"
                aria-label="Google Scholar"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
