import type { Metadata } from "next";
import Image from "next/image";
import { Contact } from "@/components/Contact";
import { Shot } from "@/components/Shot";
import { WorkRow } from "@/components/WorkRow";
import { lab } from "@/lib/content";

export const metadata: Metadata = {
  title: "Lab",
  description: "Logo and brand work, Three.js experiments and side projects.",
};

const label = (slug: string) => slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function Lab() {
  return (
    <>
      <section className="frame pt-10 pb-20 md:pt-28 md:pb-32">
        <div className="grid items-end gap-x-16 md:grid-cols-[7fr_5fr]">
          <h1 className="text-display">{lab.title}</h1>
          <p className="mt-8 max-w-[44ch] text-lead leading-[1.45] md:mt-0">{lab.lead}</p>
        </div>
      </section>

      <section className="frame section-gap pt-0 md:pt-0">
        <h2 className="mb-10 text-section md:mb-18">Logos and brands</h2>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-6 md:gap-4">
          {lab.logos.map((slug, i) => (
            <li key={slug} className={i < 2 ? "col-span-2 md:col-span-3" : "col-span-1 md:col-span-2"}>
              <figure>
                <Image
                  src={`/lab/${slug}.webp`}
                  alt={`${label(slug)} logo mockup`}
                  width={1600}
                  height={1067}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="aspect-[3/2] w-full rounded-[20px] object-cover"
                />
                <figcaption className="mt-2 text-[0.9375rem] font-semibold">{label(slug)}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      <section className="frame section-gap bg-sand-2">
        <h2 className="mb-10 text-section md:mb-18">3D experiments</h2>
        <div className="grid gap-6 md:grid-cols-2 md:gap-10">
          {lab.experiments.map((e) => (
            <div key={e.title}>
              <Shot label={`${e.title}: live Three.js canvas`} className="bg-sand" />
              <h3 className="mt-5 text-title">{e.title}</h3>
              <p className="mt-2">{e.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="frame section-gap">
        <h2 className="mb-10 text-section md:mb-18">Side projects</h2>
        {lab.projects.map((p) => (
          <WorkRow key={p.title} title={p.title} body={p.text} meta={p.meta} link={p.link}>
            <Shot label={`[Screenshot: ${p.title}]`} />
          </WorkRow>
        ))}
      </section>

      <Contact title="Want to make something odd together?" />
    </>
  );
}
