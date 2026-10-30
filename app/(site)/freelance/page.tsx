import type { Metadata } from "next";
import { Contact } from "@/components/Contact";
import { DirectContact } from "@/components/DirectContact";
import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Tilt } from "@/components/motion/Tilt";
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
      <Hero title={freelance.title} lead={freelance.lead} action={{ href: site.fiverr, label: "Hire me on Fiverr" }} secondary={{ href: "#direct", label: "Contact me directly" }} />

      <section className="frame pb-[clamp(80px,10vw,160px)]">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
          <h2 data-reveal className="text-title">
            Logos and brand identities
          </h2>
          <Link href="/lab" className="ink-link font-semibold">
            See all eleven in the Lab
          </Link>
        </div>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {["morgij", "code-bel", "reelweave", "wavix"].map((slug, i) => (
            <li key={slug} data-reveal style={{ "--i": i } as React.CSSProperties}>
              <Tilt className="group overflow-hidden rounded-[20px]">
              <Image
                src={`/lab/${slug}.webp`}
                alt={`${slug.replace(/-/g, " ")} logo mockup`}
                width={800}
                height={600}
                sizes="(min-width: 768px) 25vw, 50vw"
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.06]"
              />
              </Tilt>
            </li>
          ))}
        </ul>
      </section>

      <section className="frame section-gap bg-sand-2">
        <h2 data-reveal className="mb-10 text-section md:mb-18">What I build</h2>
        <dl className="grid gap-4 md:grid-cols-2">
          {freelance.services.map((s, i) => (
            <div key={s.name} data-reveal style={{ "--i": i } as React.CSSProperties}>
              <Tilt className="h-full rounded-[28px] bg-sand p-6 md:p-9">
                <dt className="mb-3 text-title leading-[0.95] font-extrabold tracking-[-0.05em]">{s.name}</dt>
                <dd className="max-w-[44ch]">{s.text}</dd>
              </Tilt>
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

      <section id="direct" className="frame section-gap scroll-mt-8">
        <div className="mb-10 grid gap-6 md:mb-14 lg:grid-cols-[7fr_5fr] lg:gap-16">
          <h2 data-reveal className="text-section">
            {freelance.direct.title}
          </h2>
          <p data-reveal style={{ "--i": 1 } as React.CSSProperties} className="max-w-[44ch] self-end text-lead leading-[1.4]">
            {freelance.direct.lead}
          </p>
        </div>
        <DirectContact />
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
