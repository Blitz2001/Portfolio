"use client";

import { useEffect } from "react";

// Logs a visit once per browser session when the page is opened from a tracking link (/?ref=ryzera).
export function RefTracker() {
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref")?.trim().toLowerCase();
    if (!ref || !/^[a-z0-9][a-z0-9_-]{0,39}$/.test(ref)) return;
    const key = `ref-logged:${ref}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // Storage can be blocked; logging twice is fine.
    }
    const body = JSON.stringify({ ref, path: window.location.pathname });
    if (!navigator.sendBeacon?.("/api/visit", new Blob([body], { type: "application/json" }))) {
      fetch("/api/visit", { method: "POST", body, headers: { "content-type": "application/json" }, keepalive: true }).catch(() => {});
    }
  }, []);
  return null;
}
