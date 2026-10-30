"use client";

import { useSyncExternalStore } from "react";

const format = () =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Colombo", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date());

const subscribe = (update: () => void) => {
  const timer = setInterval(update, 15_000);
  return () => clearInterval(timer);
};

// "It's 14:32 in Colombo": a live readout so a recruiter abroad knows when I'll see their message.
export function LocalTime() {
  const time = useSyncExternalStore(subscribe, format, () => null);
  return (
    <p className="mt-8 text-[0.9375rem] opacity-80">
      {time ? (
        <>
          It’s <span className="tabular-nums">{time}</span> in Colombo (UTC+5:30).
        </>
      ) : (
        "Based in Colombo (UTC+5:30)."
      )}
    </p>
  );
}
