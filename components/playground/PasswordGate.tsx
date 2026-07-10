"use client";

import { useState, useCallback } from "react";

// Owner code always works. Event code (for the PolMeth 2026 poster QR) works
// only through 2026-07-17 23:59:59 Michigan time (EDT), then reverts to owner-only.
const OWNER_CODE = "aes2026";
const EVENT_CODE = "polmeth2026";
const EVENT_EXPIRES = new Date("2026-07-17T23:59:59-04:00").getTime();

function codeAccepted(raw: string): boolean {
  const v = raw.trim().toLowerCase();
  if (v === OWNER_CODE) return true;
  if (v === EVENT_CODE && Date.now() <= EVENT_EXPIRES) return true;
  return false;
}

export default function PasswordGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (codeAccepted(input)) {
        setUnlocked(true);
        setError(false);
      } else {
        setError(true);
      }
    },
    [input]
  );

  if (unlocked) return <>{children}</>;

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-slate-800 p-8 text-center"
      >
        <div className="mb-4 text-4xl text-slate-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <h2 className="mb-2 text-lg font-semibold text-slate-200">
          Restricted Access
        </h2>
        <p className="mb-6 font-sans text-sm text-slate-500">
          This page contains unpublished research data.
          <br />
          Enter the access code to continue.
        </p>
        <input
          type="password"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError(false);
          }}
          placeholder="Access code"
          className="mb-3 w-full rounded border border-slate-700 bg-slate-900 px-4 py-2 text-center text-sm text-slate-200 placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
          autoFocus
        />
        {error && (
          <p className="mb-3 text-xs text-red-400">Incorrect access code</p>
        )}
        <button
          type="submit"
          className="w-full rounded bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-700"
        >
          Enter
        </button>
      </form>
    </div>
  );
}
