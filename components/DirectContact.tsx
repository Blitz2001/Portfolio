"use client";

import { useId, useState } from "react";
import { freelance, site } from "@/lib/content";

const d = freelance.direct;
const field = "w-full rounded-xl border-2 border-cobalt bg-sand px-3 py-2.5 text-base text-cobalt outline-none focus-visible:outline-[3px] focus-visible:outline-offset-2";

// Work with me directly: the visitor's choices become a ready-to-send email (no form backend needed).
export function DirectContact() {
  const id = useId();
  const [type, setType] = useState(d.types[0]);
  const [timeline, setTimeline] = useState(d.timelines[3]);
  const [budget, setBudget] = useState(d.budgets[0]);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [copied, setCopied] = useState(false);

  const subject = `${type} project${name ? ` from ${name}` : ""}`;
  const body = [`Hi Arunu,`, ``, note || "[What you want to build, and for whom]", ``, `Project: ${type}`, `Timeline: ${timeline}`, `Budget: ${budget}`, ``, name ? `Thanks,\n${name}` : "Thanks"].join("\n");
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const whatsapp = site.whatsapp ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Hi Arunu, I'd like to talk about a ${type.toLowerCase()} project (${timeline.toLowerCase()}).`)}` : null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };


  return (
    <div className="grid gap-10 lg:grid-cols-[7fr_5fr] lg:gap-16">
      <form data-ui data-reveal className="grid gap-6 rounded-[28px] bg-sand-2 p-5 md:p-8" onSubmit={(e) => { e.preventDefault(); window.location.href = mailto; }}>
        <Choice group={id} label="What do you need?" options={d.types} value={type} set={setType} />
        <Choice group={id} label="When?" options={d.timelines} value={timeline} set={setTimeline} />
        <Choice group={id} label="Budget" options={d.budgets} value={budget} set={setBudget} />
        <label className="grid gap-1.5 text-[0.9375rem] font-semibold">
          Your name
          <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={field} />
        </label>
        <label className="grid gap-1.5 text-[0.9375rem] font-semibold">
          About the project
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} placeholder="What you want to build, and for whom" className={`${field} resize-y placeholder:text-cobalt-soft`} />
        </label>
        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" className="btn cursor-pointer">
            Open it as an email
          </button>
          <span className="text-[0.9375rem] text-cobalt-soft">It opens in your mail app, addressed to me.</span>
        </div>
      </form>

      <div data-reveal style={{ "--i": 1 } as React.CSSProperties} className="grid content-start gap-6">
        <p className="text-lead leading-[1.4]">{d.reply}</p>
        <div className="grid gap-3">
          <p className="font-semibold">Email</p>
          <div className="flex flex-wrap items-center gap-3">
            <a href={`mailto:${site.email}`} className="ink-link text-lead">
              {site.email}
            </a>
            <button type="button" onClick={copy} className="cursor-pointer rounded-full border-2 border-cobalt px-3 py-1 text-[0.9375rem] font-semibold transition-[background-color,transform] duration-150 hover:bg-sand-2 active:scale-[0.96]">
              <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>
        {whatsapp && (
          <div className="grid gap-3">
            <p className="font-semibold">WhatsApp</p>
            <a href={whatsapp} className="ink-link justify-self-start text-lead">
              Message me on WhatsApp
            </a>
          </div>
        )}
        <div className="grid gap-3">
          <p className="font-semibold">Prefer a marketplace?</p>
          <a href={site.fiverr} className="ink-link justify-self-start text-lead">
            Hire me on Fiverr
          </a>
        </div>
      </div>
    </div>
  );
}

function Choice({ group, label, options, value, set }: { group: string; label: string; options: readonly string[]; value: string; set: (v: string) => void }) {
  return (
    <fieldset className="grid gap-2">
      <legend className="mb-2 text-[0.9375rem] font-semibold">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o} className="cursor-pointer">
            <input type="radio" name={`${group}-${label}`} value={o} checked={value === o} onChange={() => set(o)} className="peer sr-only" />
            <span className="inline-block rounded-full border-2 border-cobalt px-3.5 py-1.5 text-[0.9375rem] font-semibold transition-colors duration-150 peer-checked:bg-cobalt peer-checked:text-sand peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-[:not(:checked)]:hover:bg-sand-2">
              {o}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
