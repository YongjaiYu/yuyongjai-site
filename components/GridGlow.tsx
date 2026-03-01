"use client";

import { useEffect, useRef } from "react";

export default function GridGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (ref.current) {
        ref.current.style.setProperty("--gx", `${e.clientX}px`);
        ref.current.style.setProperty("--gy", `${e.clientY}px`);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-10"
      style={{
        backgroundImage: [
          "linear-gradient(rgba(148,163,184,0.3) 1px, transparent 1px)",
          "linear-gradient(90deg, rgba(148,163,184,0.3) 1px, transparent 1px)",
        ].join(", "),
        backgroundSize: "48px 48px",
        maskImage:
          "radial-gradient(180px circle at var(--gx, -999px) var(--gy, -999px), black, transparent)",
        WebkitMaskImage:
          "radial-gradient(180px circle at var(--gx, -999px) var(--gy, -999px), black, transparent)",
      }}
    />
  );
}
