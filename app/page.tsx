import { Contact } from "@/components/Contact";
import { ModelTable } from "@/components/ModelTable";
import { Pipeline } from "@/components/Pipeline";
import { StarSchema } from "@/components/StarSchema";
import { WorkRow } from "@/components/WorkRow";
import { about, bank, hero, warehouse } from "@/lib/content";

export default function HireMe() {
  return (
    <>
      <section className="frame pt-10 pb-20 md:pt-28 md:pb-40">
        <div className="grid items-end gap-x-16 md:grid-cols-[7fr_5fr]">
          <h1 className="text-display md:row-span-2">{hero.title}</h1>
          <p className="mt-8 max-w-[44ch] text-lead leading-[1.45] md:mt-0">{hero.lead}</p>
          <a href="#contact" className="btn mt-8 justify-self-start">
            Email me
          </a>
        </div>
        <Pipeline />
      </section>

      <section className="frame section-gap">
        <h2 className="mb-10 text-section md:mb-18">More work</h2>
        <WorkRow {...warehouse}>
          <StarSchema />
        </WorkRow>
        <WorkRow {...bank}>
          <ModelTable />
        </WorkRow>
      </section>

      <section className="frame section-gap">
        <h2 className="mb-10 text-section md:mb-18">About</h2>
        <div className="grid gap-6 md:grid-cols-[5fr_7fr] md:gap-16">
          <p className="text-[clamp(1.375rem,2vw,1.875rem)] leading-[1.35]">{about.lead}</p>
          <dl className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {about.skills.map((s) => (
              <div key={s.group}>
                <dt className="mb-1 font-semibold">{s.group}</dt>
                <dd>{s.items}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Contact title="Let’s talk about an internship." />
    </>
  );
}
