"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { entitySample, type SampleEntity } from "@/lib/entity-sample";
import { canonicalId, confidence, corroborated, normalize } from "@/lib/extractor";

const TYPES = [
  { value: "PERSON", label: "Person" },
  { value: "ORG", label: "Organisation" },
  { value: "LOCATION", label: "Location" },
  { value: "EVENT", label: "Event" },
] as const;

const TABS = ["What it found", "Try it", "The maths"] as const;

const field =
  "w-full rounded-xl border-2 border-cobalt bg-sand px-3 py-2.5 text-base font-semibold text-cobalt outline-none focus-visible:outline-[3px] focus-visible:outline-offset-2";

const emptySubscribe = () => () => {};
const useHydrated = () => useSyncExternalStore(emptySubscribe, () => true, () => false);

type Span = { start: number; end: number; entity: SampleEntity };

/** Finds non-overlapping exact entity matches in record text, preferring longer names first. */
function highlightRecord(text: string, entities: SampleEntity[]): ReactNode[] {
  const byLength = [...entities].sort((a, b) => b.name.length - a.name.length);
  const spans: Span[] = [];

  for (const entity of byLength) {
    let from = 0;
    while (from < text.length) {
      const idx = text.indexOf(entity.name, from);
      if (idx === -1) break;
      const end = idx + entity.name.length;
      const overlaps = spans.some((s) => idx < s.end && end > s.start);
      if (!overlaps) spans.push({ start: idx, end, entity });
      from = end;
    }
  }

  spans.sort((a, b) => a.start - b.start);
  const out: ReactNode[] = [];
  let cursor = 0;

  for (const span of spans) {
    if (span.start > cursor) out.push(text.slice(cursor, span.start));
    out.push(
      <mark key={`${span.start}-${span.entity.id}`} title={span.entity.type} className="rounded-md bg-cobalt/15 px-1 text-cobalt">
        {text.slice(span.start, span.end)}
      </mark>,
    );
    cursor = span.end;
  }

  if (cursor < text.length) out.push(text.slice(cursor));
  return out;
}

/** Tabbed interactive showcase for the Entity Extractor step: sample results, live matcher, and maths. */
export function EntityStep() {
  const uid = useId();
  const hydrated = useHydrated();
  const [tab, setTab] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [type, setType] = useState("ORG");
  const [a, setA] = useState("the Sri Lanka Air Force's");
  const [b, setB] = useState("Sri Lanka Air Force");
  const [ids, setIds] = useState<[string, string] | null>(null);
  const [sources, setSources] = useState(2);
  const [mentions, setMentions] = useState(2);

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

  const nameById = useMemo(
    () => new Map(entitySample.entities.map((e) => [e.id, e.name])),
    [],
  );

  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = -1;
    if (e.key === "ArrowRight") next = (i + 1) % TABS.length;
    else if (e.key === "ArrowLeft") next = (i + TABS.length - 1) % TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TABS.length - 1;
    if (next >= 0) {
      e.preventDefault();
      setTab(next);
      tabRefs.current[next]?.focus();
    }
  };

  const same = na.length > 0 && na === nb;
  const effectiveMentions = Math.max(mentions, sources);
  const score = confidence(sources, effectiveMentions);
  const keptInBigBundle = corroborated(10, sources, effectiveMentions);
  const ev = entitySample.evaluation;

  return (
    <div data-ui className="mt-4 rounded-[28px] bg-sand-2 p-3 md:p-3.5">
      {/* Segmented control */}
      <div role="tablist" aria-label="Entity Extractor details" className="flex w-full rounded-full bg-sand p-1 sm:inline-flex sm:w-auto">
        {TABS.map((label, i) => {
          const selected = tab === i;
          return (
            <button
              key={label}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${uid}-tab-${i}`}
              aria-selected={selected}
              aria-controls={`${uid}-panel-${i}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setTab(i)}
              onKeyDown={(e) => onTabKeyDown(e, i)}
              className={`min-h-[44px] flex-1 cursor-pointer rounded-full px-2 py-2 text-[0.875rem] font-semibold whitespace-nowrap transition-colors duration-150 sm:flex-none sm:px-4 ${
                selected ? "bg-cobalt text-sand" : "text-cobalt hover:bg-sand-2/60"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Panel 0: What it found */}
      <div
        role="tabpanel"
        id={`${uid}-panel-0`}
        aria-labelledby={`${uid}-tab-0`}
        hidden={hydrated && tab !== 0}
        className="tab-panel mt-2"
      >
        <p className="text-[0.8125rem] leading-tight text-cobalt-soft">Names are fictional, from four short test reports.</p>

        <ol className="mt-1 grid gap-0.5">
          {entitySample.records.map((r) => (
            <li
              key={r.id}
              className="flex flex-col rounded-xl bg-sand px-2.5 py-0.5 text-[0.8125rem] leading-[1.22] sm:flex-row sm:items-baseline sm:gap-x-2.5 sm:text-[0.875rem] sm:leading-[1.3]"
            >
              <span className="shrink-0 text-[0.8125rem] font-semibold text-cobalt-soft tabular-nums">{r.id}</span>
              <span>{highlightRecord(r.text, entitySample.entities)}</span>
            </li>
          ))}
        </ol>

        <dl className="mt-1.5 grid gap-0.5 sm:grid-cols-2 sm:gap-1">
          {entitySample.entities.map((e) => (
            <div
              key={e.id}
              title={`${e.evidence.length} ${e.evidence.length === 1 ? "source" : "sources"}`}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-x-2 rounded-xl bg-sand px-2.5 py-0.5"
            >
              <span className="rounded-full border-2 border-cobalt px-2 py-0.5 text-[0.8125rem] leading-none font-semibold">
                {e.type === "LOCATION" ? "PLACE" : e.type}
              </span>
              <dt className="truncate text-[0.8125rem] font-semibold sm:text-[0.875rem]">{e.name}</dt>
              <dd className="text-[0.9375rem] font-extrabold tracking-[-0.04em] tabular-nums sm:text-base">
                {e.confidence.toFixed(2)}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-1.5 grid grid-cols-3 gap-1.5 sm:gap-2">
          <div className="rounded-2xl bg-sand px-2.5 py-1 sm:px-3">
            <p className="text-title leading-none font-extrabold tracking-[-0.05em] tabular-nums">{ev.entityF1.toFixed(2)}</p>
            <p className="mt-0.5 text-[0.8125rem] leading-tight text-cobalt-soft">F1</p>
          </div>
          <div className="rounded-2xl bg-sand px-2.5 py-1 sm:px-3">
            <p className="text-title leading-none font-extrabold tracking-[-0.05em] tabular-nums">{ev.entityPrecision.toFixed(2)}</p>
            <p className="mt-0.5 text-[0.8125rem] leading-tight text-cobalt-soft">precision</p>
          </div>
          <div className="rounded-2xl bg-sand px-2.5 py-1 sm:px-3">
            <p className="text-title leading-none font-extrabold tracking-[-0.05em] tabular-nums">{ev.entityRecall.toFixed(2)}</p>
            <p className="mt-0.5 text-[0.8125rem] leading-tight text-cobalt-soft">recall</p>
          </div>
        </div>

        <p className="mt-1 text-[0.8125rem] leading-tight text-cobalt-soft">
          Entity accuracy on {ev.documents} hand-labelled documents.
        </p>
      </div>

      {/* Panel 1: Try it */}
      <div
        role="tabpanel"
        id={`${uid}-panel-1`}
        aria-labelledby={`${uid}-tab-1`}
        hidden={hydrated && tab !== 1}
        className="tab-panel mt-3"
      >
        <div className="grid gap-2.5 sm:grid-cols-[9.5rem_1fr_1fr]">
          <label className="grid gap-1 text-[0.875rem] font-semibold">
            Type
            <select value={type} onChange={(e) => setType(e.target.value)} className={field}>
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-[0.875rem] font-semibold">
            First way of writing it
            <input value={a} onChange={(e) => setA(e.target.value)} maxLength={80} spellCheck={false} className={field} />
          </label>
          <label className="grid gap-1 text-[0.875rem] font-semibold">
            Second way of writing it
            <input value={b} onChange={(e) => setB(e.target.value)} maxLength={80} spellCheck={false} className={field} />
          </label>
        </div>
        <p
          aria-live="polite"
          className={`mt-2.5 rounded-2xl px-4 py-2.5 text-lead font-extrabold tracking-[-0.03em] transition-colors duration-200 ${
            same ? "bg-cobalt text-sand" : "bg-sand"
          }`}
        >
          {same ? "Same entity: their evidence merges." : "Two different entities."}
        </p>
        <p className="mt-2 text-[0.875rem] text-cobalt-soft">
          “{na || "…"}” {same ? "=" : "≠"} “{nb || "…"}”
        </p>
      </div>

      {/* Panel 2: The maths */}
      <div
        role="tabpanel"
        id={`${uid}-panel-2`}
        aria-labelledby={`${uid}-tab-2`}
        hidden={hydrated && tab !== 2}
        className="tab-panel mt-3 grid gap-2.5 rounded-2xl bg-sand p-3.5 text-[0.875rem]"
      >
        <div className="grid gap-0.5">
          <p>
            First: “{na || "…"}” · ID <span className="tabular-nums">{ids?.[0] ?? "…"}</span>
          </p>
          <p>
            Second: “{nb || "…"}” · ID <span className="tabular-nums">{ids?.[1] ?? "…"}</span>
          </p>
        </div>

        <p className="text-cobalt-soft">
          confidence = min(0.6 + 0.15 × (sources − 1) + 0.02 × mentions, 0.97)
        </p>
        <p className="text-cobalt-soft">
          In a bundle of 10 or more records, an entity is kept only with 2+ sources or 3+ mentions.
        </p>

        <div className="grid gap-2.5 pt-0.5 sm:grid-cols-2">
          <Slider
            label="Distinct sources"
            value={sources}
            min={1}
            max={6}
            onChange={(v) => {
              setSources(v);
              setMentions((m) => Math.max(m, v));
            }}
          />
          <Slider
            label="Mentions in total"
            value={effectiveMentions}
            min={sources}
            max={20}
            onChange={setMentions}
          />
        </div>

        <p aria-live="polite" className="font-semibold">
          Live score: <span className="tabular-nums">{score.toFixed(2)}</span> ·{" "}
          {keptInBigBundle ? "kept in a 10+ record bundle" : "dropped as noise in a 10+ record bundle"}
        </p>

        <div>
          <p className="font-semibold">Links found</p>
          <ul className="mt-1 grid gap-x-4 gap-y-0.5 sm:grid-cols-2">
            {entitySample.relations.map((rel) => {
              const subj = nameById.get(rel.subject) ?? rel.subject;
              const obj = nameById.get(rel.object) ?? rel.object;
              return (
                <li key={`${rel.subject}-${rel.predicate}-${rel.object}`}>
                  <span className="font-semibold">{subj}</span> → {rel.predicate.replace(/_/g, " ")} →{" "}
                  <span className="font-semibold">{obj}</span>
                </li>
              );
            })}
          </ul>
          <p className="mt-1.5 text-[0.8125rem] text-cobalt-soft">
            Relations: precision <span className="tabular-nums">{ev.relationPrecision.toFixed(2)}</span>, recall{" "}
            <span className="tabular-nums">{ev.relationRecall.toFixed(2)}</span> on the same set.
          </p>
        </div>
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <label className="grid gap-1 text-[0.875rem] font-semibold">
      <span className="flex justify-between">
        {label}
        <span className="tabular-nums">{value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--color-cobalt)]"
      />
    </label>
  );
}
