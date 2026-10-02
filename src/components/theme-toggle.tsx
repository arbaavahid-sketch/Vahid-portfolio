"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import { t, type Locale } from "@/lib/i18n";

type Theme = "light" | "dark";

const EVENT = "themechange";

/**
 * The theme lives on the document, not in React state: the stylesheet follows
 * the OS setting from the first paint, and an explicit choice is an attribute
 * on <html>. So this reads it as external state rather than mirroring it.
 */
function subscribe(onChange: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    mq.removeEventListener("change", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

function getSnapshot(): Theme {
  const stamped = document.documentElement.dataset.theme;
  if (stamped === "dark" || stamped === "light") return stamped;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** The server cannot know the viewer's setting; the stylesheet covers it. */
const getServerSnapshot = (): Theme => "light";

function readStored(): Theme | null {
  try {
    const v = localStorage.getItem("theme");
    return v === "dark" || v === "light" ? v : null;
  } catch {
    // Private mode or blocked storage — fall back to the OS setting.
    return null;
  }
}

export function ThemeToggle({ locale }: { locale: Locale }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Replay a previously saved choice onto the document once, on mount.
  useEffect(() => {
    const stored = readStored();
    if (stored && document.documentElement.dataset.theme !== stored) {
      document.documentElement.dataset.theme = stored;
      window.dispatchEvent(new Event(EVENT));
    }
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // The choice just does not persist.
    }
    window.dispatchEvent(new Event(EVENT));
  }

  const dark = theme === "dark";
  const label = t(locale, dark ? "themeToLight" : "themeToDark");

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      className="inline-flex size-9 items-center justify-center rounded-lg border border-line bg-surface text-ink-2 hover:text-ink"
      title={label}
    >
      {dark ? <Moon size={16} aria-hidden /> : <Sun size={16} aria-hidden />}
      <span className="sr-only">{label}</span>
    </button>
  );
}
