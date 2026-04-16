"use client";

import { useCallback, useEffect, useState } from "react";

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Dissertation", href: "#dissertation" },
  { label: "Research", href: "#research" },
  { label: "Teaching", href: "#teaching" },
  { label: "Software", href: "#software" },
  { label: "Sandbox", href: "#sandbox" },
  { label: "CV", href: "#cv" },
] as const;

export default function MobileNav() {
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
    <nav className="sticky top-0 z-40 -mx-6 mb-10 flex flex-wrap gap-x-5 gap-y-2 border-b border-slate-800 bg-slate-950/90 px-6 pb-4 pt-4 backdrop-blur-sm lg:-mx-12 lg:px-12">
      {NAV_ITEMS.map((item) => {
        const isActive = activeSection === item.href.slice(1);
        return (
          <a
            key={item.href}
            href={item.href}
            onClick={(e) => handleNavClick(e, item.href)}
            className={`text-sm font-medium uppercase tracking-widest transition-colors ${
              isActive
                ? "text-slate-100"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
