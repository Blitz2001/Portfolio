import type { Metadata } from "next";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Shot } from "@/components/Shot";
import { ProjectRows } from "@/components/ProjectRows";
import { WorkRow } from "@/components/WorkRow";
import { getProjects } from "@/lib/projects";
import { freelance, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Freelance",
  description: "Flutter apps, React admin panels, WordPress with payments and POS systems for small businesses.",
};

export default async function Freelance() {
  const projects = await getProjects("freelance");
  return (
    <>
      <Hero title={freelance.title} lead={freelance.lead} action={{ href: site.fiverr, label: "Hire me on Fiverr" }} />

      <section className="frame section-gap bg-sand-2">
        <h2 data-reveal className="mb-10 text-section md:mb-18">What I build</h2>
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
        <h2 data-reveal className="mb-10 text-section md:mb-18">Client work</h2>
        {projects?.length ? (
          <ProjectRows projects={projects} />
        ) : (
          freelance.work.map((w) => (
            <WorkRow key={w.title} title={w.title} body={w.text} meta={w.meta}>
              <Shot label={w.image} />
            </WorkRow>
          ))
        )}
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
