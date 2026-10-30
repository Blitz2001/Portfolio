import Image from "next/image";
import { Contact } from "@/components/Contact";
import { DataTable } from "@/components/DataTable";
import { ExtractorLab } from "@/components/ExtractorLab";
import { NowSection } from "@/components/NowSection";
import { Timeline } from "@/components/Timeline";
import { Hero } from "@/components/Hero";
import { Pipeline } from "@/components/Pipeline";
import { StarSchema } from "@/components/StarSchema";
import { ProjectRows } from "@/components/ProjectRows";
import { Rolling } from "@/components/Rolling";
import { WorkRow } from "@/components/WorkRow";
import { getProjects } from "@/lib/projects";
import { about, bank, hero, redteam, warehouse } from "@/lib/content";

export default async function HireMe() {
  const extra = await getProjects("hire");
  return (
    <>
      <Hero title={hero.title} lead={hero.lead} action={{ href: "#contact", label: "Email me" }}>
        <Pipeline />
      </Hero>

      <NowSection />

      <section id="inside" className="frame scroll-mt-8 pb-[clamp(80px,10vw,160px)]">
        <div className="mb-10 grid gap-6 md:mb-14 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <h2 data-reveal className="text-section">
            Inside my part
          </h2>
          <p data-reveal style={{ "--i": 1 } as React.CSSProperties} className="max-w-[52ch] self-end text-lead leading-[1.4]">
            The two rules that decide what my Entity Extractor reports, running in your browser. Try your own names.
          </p>
        </div>
        <ExtractorLab />
      </section>

      <section id="work" className="frame section-gap">
        <h2 data-reveal className="mb-10 text-section md:mb-18">
          More work
        </h2>
        <WorkRow
          {...redteam}
          extra={
            <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6">
              {redteam.figures.map((f) => (
                <div key={f.label} className="flex flex-col-reverse">
                  <dt className="mt-1 text-[0.9375rem] text-cobalt-soft">{f.label}</dt>
                  <dd className="text-title font-extrabold tracking-[-0.05em] tabular-nums">
                    <Rolling value={f.value} />
                  </dd>
                </div>
              ))}
            </dl>
          }
        >
          <DataTable {...redteam} />
        </WorkRow>
        <WorkRow {...warehouse}>
          <StarSchema />
        </WorkRow>
        <WorkRow {...bank}>
          <DataTable {...bank} />
        </WorkRow>
        {extra && <ProjectRows projects={extra} />}
      </section>

      <section id="about" className="frame section-gap">
        <h2 data-reveal className="mb-10 text-section md:mb-18">
          About
        </h2>
        <div className="grid gap-10 md:grid-cols-[5fr_7fr] md:gap-16">
          <Image
            data-reveal
            src="/arunu.webp"
            alt="Arunu Sampath in a white shirt, in the lobby of SLIIT"
            width={780}
            height={850}
            sizes="(min-width: 768px) 38vw, 100vw"
            className="aspect-[78/85] w-full rounded-[28px] object-cover"
          />
          <div>
            <p data-reveal className="max-w-[34ch] text-lead leading-[1.4]">
              {about.lead}
            </p>
            <dl className="mt-10 grid gap-x-10 gap-y-7 sm:grid-cols-2">
              {about.skills.map((s, i) => (
                <div key={s.group} data-reveal style={{ "--i": i + 1 } as React.CSSProperties}>
                  <dt className="mb-1 font-semibold">{s.group}</dt>
                  <dd>{s.items}</dd>
                </div>
              ))}
            </dl>
            <Timeline />
          </div>
        </div>
      </section>

      <Contact title="Let’s talk about an internship." />
    </>
  );
}
