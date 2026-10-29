import { site } from "@/lib/content";
import { FitName } from "./FitName";

export function Contact({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <section id="contact" className="frame section-gap overflow-hidden bg-cobalt text-sand">
      <h2 className="mb-10 max-w-[16ch] text-section md:mb-18">{title}</h2>
      <ul className="flex flex-wrap items-center gap-x-10 gap-y-4 text-xl">
        <li>
          <a href={`mailto:${site.email}`} className="ink-link">
            {site.email}
          </a>
        </li>
        <li>
          <a href={site.github} className="ink-link">
            {site.githubLabel}
          </a>
        </li>
        <li>
          <a href={site.linkedin} className="ink-link">
            LinkedIn
          </a>
        </li>
        {children}
        <li>
          <a href={site.cv} className="btn btn-inverse">
            Download CV
          </a>
        </li>
      </ul>
      <div>
        <FitName>{site.name}</FitName>
      </div>
    </section>
  );
}
