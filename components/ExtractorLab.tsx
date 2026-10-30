"use client";

import { useEffect, useId, useState } from "react";

// The Entity Extractor's own rules, as documented for the viva (extract.py):
// normalize() strips the possessive before punctuation, then spaces and a leading article;
// canonical_id() is the first 12 hex digits of SHA-1("TYPE:normalized");
// _confidence() = min(0.6 + 0.15·(sources − 1) + 0.02·mentions, 0.97);
// _corroborated(): below 10 records keep everything, else need 2+ sources or 3+ mentions.

const TYPES = [
  { value: "PERSON", label: "Person" },
  { value: "ORG", label: "Organisation" },
  { value: "LOCATION", label: "Location" },
  { value: "EVENT", label: "Event" },
];

export function normalize(name: string) {
  let n = name.toLowerCase();
  n = n.replace(/['’]s\b/g, ""); // possessive first, or "lanka's" would become "lankas"
  n = n.replace(/[^\p{L}\p{N}_\s]/gu, "");
  n = n.replace(/\s+/g, " ").trim();
  return n.replace(/^(the|a|an)\s+/, "").trim();
}

async function canonicalId(type: string, normalized: string) {
  const bytes = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(`${type}:${normalized}`));
  // taste-skill-ignore: padStart builds hex bytes, not "01 / 02" numbering
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 12);
}

export const confidence = (sources: number, mentions: number) => Math.round(Math.min(0.6 + 0.15 * (sources - 1) + 0.02 * mentions, 0.97) * 100) / 100;

const field = "w-full rounded-xl border-2 border-cobalt bg-sand px-3 py-2.5 text-base font-semibold text-cobalt outline-none focus-visible:outline-[3px] focus-visible:outline-offset-2";

export function ExtractorLab() {
  const id = useId();
  const [type, setType] = useState("ORG");
  const [a, setA] = useState("the Sri Lanka Air Force's");
  const [b, setB] = useState("Sri Lanka Air Force");
  const [ids, setIds] = useState<[string, string] | null>(null);
  const [sources, setSources] = useState(2);
  const [mentions, setMentions] = useState(3);
  const [big, setBig] = useState(true);

  const na = normalize(a);
  const nb = normalize(b);
  useEffect(() => {
    let live = true;
    Promise.all([canonicalId(type, na), canonicalId(type, nb)])
      .then((pair) => live && setIds(pair))
      .catch(() => live && setIds(null));
    return () => {
      live = false;
    };
  }, [type, na, nb]);

  const same = na.length > 0 && na === nb;
  const score = confidence(sources, Math.max(mentions, sources));
  const kept = !big || sources >= 2 || mentions >= 3;

  return (
    <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
      <section data-ui data-reveal aria-labelledby={`${id}-same`} className="rounded-[28px] bg-sand-2 p-5 md:p-8">
        <h3 id={`${id}-same`} className="text-title">
          Same entity?
        </h3>
        <p className="mt-3 max-w-[48ch]">Two mentions become one entity when their type and normalised name hash to the same ID.</p>
        <div className="mt-6 grid gap-4">
          <label className="grid gap-1.5 text-[0.9375rem] font-semibold">
            Type
            <select value={type} onChange={(e) => setType(e.target.value)} className={field}>
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          {(
            [
              ["First mention", a, setA, na, ids?.[0]],
              ["Second mention", b, setB, nb, ids?.[1]],
            ] as const
          ).map(([label, value, set, norm, hash]) => (
            <div key={label} className="grid gap-1.5">
              <label className="grid gap-1.5 text-[0.9375rem] font-semibold">
                {label}
                <input value={value} onChange={(e) => set(e.target.value)} maxLength={80} spellCheck={false} className={field} />
              </label>
              <p className="text-[0.9375rem] text-cobalt-soft">
                normalised “{norm || "…"}” · ID <span className="tabular-nums">{hash ?? "…"}</span>
              </p>
            </div>
          ))}
        </div>
        <p aria-live="polite" className={`mt-6 rounded-2xl px-4 py-3 text-lead font-extrabold tracking-[-0.03em] transition-colors duration-200 ${same ? "bg-cobalt text-sand" : "bg-sand"}`}>
          {same ? "One entity: their evidence merges." : "Two separate entities."}
        </p>
      </section>

      <section data-ui data-reveal style={{ "--i": 1 } as React.CSSProperties} aria-labelledby={`${id}-conf`} className="rounded-[28px] bg-sand-2 p-5 md:p-8">
        <h3 id={`${id}-conf`} className="text-title">
          How sure?
        </h3>
        <p className="mt-3 max-w-[48ch]">Confidence grows with independent sources far more than with repetition, and never reaches 1.</p>
        <div className="mt-6 grid gap-5">
          <Slider label="Distinct sources" value={sources} min={1} max={6} onChange={(v) => { setSources(v); setMentions((m) => Math.max(m, v)); }} />
          <Slider label="Mentions in total" value={Math.max(mentions, sources)} min={sources} max={20} onChange={setMentions} />
          <label className="flex cursor-pointer items-center gap-3 text-[0.9375rem] font-semibold">
            <input type="checkbox" checked={big} onChange={(e) => setBig(e.target.checked)} className="size-5 accent-[var(--color-cobalt)]" />
            The bundle has 10 or more records
          </label>
        </div>
        <div aria-live="polite" className="mt-6 rounded-2xl bg-sand px-4 py-4">
          <p className="flex items-baseline justify-between gap-4">
            <span className="text-[3rem] leading-none font-extrabold tracking-[-0.05em]">{kept ? score.toFixed(2) : "dropped"}</span>
            <span className="text-right text-[0.9375rem] text-cobalt-soft">
              0.6 + 0.15 × {sources - 1} + 0.02 × {Math.max(mentions, sources)}
              {score === 0.97 ? ", capped at 0.97" : ""}
            </span>
          </p>
          <div className="mt-3 h-2.5 rounded-full bg-cobalt/15" aria-hidden="true">
            <div className="h-full origin-left rounded-full bg-cobalt transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]" style={{ transform: `scaleX(${kept ? score : 0})` }} />
          </div>
          <p className="mt-3 text-[0.9375rem]">
            {kept
              ? big
                ? "Kept: it clears the corroboration floor."
                : "Kept: under 10 records nothing is filtered."
              : "Dropped as noise: in a large bundle an entity needs 2+ sources or 3+ mentions."}
          </p>
        </div>
      </section>
    </div>
  );
}

function Slider({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <label className="grid gap-2 text-[0.9375rem] font-semibold">
      <span className="flex justify-between">
        {label}
        <span className="tabular-nums">{value}</span>
      </span>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[var(--color-cobalt)]" />
    </label>
  );
}
