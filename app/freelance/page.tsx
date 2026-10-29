import type { Metadata } from "next";
import { Contact } from "@/components/Contact";
import { Shot } from "@/components/Shot";
import { WorkRow } from "@/components/WorkRow";
import { freelance, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Freelance",
  description: "Flutter apps, React admin panels, WordPress with payments and POS systems for small businesses.",
};

export default function Freelance() {
  return (
    <>
      <section className="frame pt-10 pb-20 md:pt-28 md:pb-32">
        <div className="grid items-end gap-x-16 md:grid-cols-[7fr_5fr]">
          <h1 className="text-display md:row-span-2">{freelance.title}</h1>
          <p className="mt-8 max-w-[44ch] text-lead leading-[1.45] md:mt-0">{freelance.lead}</p>
          <a href={site.fiverr} className="btn mt-8 justify-self-start">
            Hire me on Fiverr
          </a>
        </div>
      </section>

      <section className="frame section-gap bg-sand-2">
        <h2 className="mb-10 text-section md:mb-18">What I build</h2>
        <dl className="grid gap-x-16 gap-y-10 md:grid-cols-2">
          {freelance.services.map((s) => (
            <div key={s.name}>
              <dt className="mb-2 text-title font-extrabold tracking-[-0.05em] leading-[0.95]">{s.name}</dt>
              <dd className="max-w-[44ch]">{s.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="frame section-gap">
        <h2 className="mb-10 text-section md:mb-18">Client work</h2>
        {freelance.work.map((w) => (
          <WorkRow key={w.title} title={w.title} body={w.text} meta={w.meta}>
            <Shot label={w.image} />
          </WorkRow>
        ))}
      </section>

      <section className="frame section-gap">
        <div className="grid gap-6 md:grid-cols-[5fr_7fr] md:gap-16">
          <h2 className="text-section">How to hire me</h2>
          <ol className="list-inside list-decimal space-y-5 text-lead leading-[1.4] marker:font-extrabold">
            {freelance.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>
      </section>

      <Contact title="Tell me about your project.">
        <li>
          <a href={site.fiverr} className="ink-link">
            Fiverr
          </a>
        </li>
      </Contact>
    </>
  );
}
