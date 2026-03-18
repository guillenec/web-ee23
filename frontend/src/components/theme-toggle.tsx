"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useState, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "ee23_theme";

function resolveInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

function subscribeTheme() {
  return () => {};
}

function getClientThemeSnapshot(): Theme {
  const current = document.documentElement.dataset.theme;
  if (current === "light" || current === "dark") return current;
  return resolveInitialTheme();
}

function getServerThemeSnapshot(): Theme {
  return "light";
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const snapshotTheme = useSyncExternalStore(
    subscribeTheme,
    getClientThemeSnapshot,
    getServerThemeSnapshot,
  );
  const [overrideTheme, setOverrideTheme] = useState<Theme | null>(null);
  const theme = overrideTheme ?? snapshotTheme;

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setOverrideTheme(next);
    applyTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`fixed right-4 bottom-4 z-[70] inline-flex h-12 w-12 items-center justify-center rounded-full border border-brand-dark/20 bg-surface/95 text-brand-dark shadow-[0_10px_24px_rgba(0,0,0,0.18)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-brand-dark hover:text-white sm:right-6 sm:bottom-6 ${className}`}
      aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {theme === "dark" ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
    </button>
  );
}
