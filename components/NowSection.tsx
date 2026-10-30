import { ago, getGithubActivity } from "@/lib/github";
import { getNowItems } from "@/lib/projects";
import { now, site, type NowItem } from "@/lib/content";
import { Tilt } from "./motion/Tilt";

// "Currently working on": what has my attention (from Sanity or lib/content.ts) beside what I last
// pushed to GitHub (live, cached for an hour).
export async function NowSection() {
  const [items, repos] = await Promise.all([getNowItems(), getGithubActivity(site.githubUser)]);
  const list: NowItem[] = items ?? now.items;
  return (
    <section id="now" className="frame scroll-mt-8 pb-[clamp(80px,10vw,160px)]">
      <div className="mb-10 grid gap-6 md:mb-14 lg:grid-cols-[5fr_7fr] lg:gap-16">
        <h2 data-reveal className="text-section">
          {now.title}
        </h2>
        <p data-reveal style={{ "--i": 1 } as React.CSSProperties} className="max-w-[52ch] self-end text-lead leading-[1.4]">
          {now.lead}
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[7fr_5fr] lg:gap-16">
        <ol className="grid gap-4">
          {list.map((item, i) => (
            <li key={item.title} data-reveal style={{ "--i": i } as React.CSSProperties}>
              <Tilt max={4} className="grid gap-x-8 gap-y-2 rounded-[24px] bg-sand-2 p-6 sm:grid-cols-[9rem_1fr] md:p-7">
              <div className="pt-1 text-cobalt-soft">
                <p className="flex items-center gap-2 font-semibold">
                  {i === 0 && <span className="live-dot" aria-hidden="true" />}
                  {item.status}
                </p>
                {item.since && <p className="text-[0.9375rem]">since {item.since}</p>}
              </div>
              <div>
                <h3 className="text-[clamp(1.375rem,1rem+1vw,1.875rem)] leading-[1.05]">
                  {item.link ? (
                    <a href={item.link} className="ink-link">
                      {item.title}
                    </a>
                  ) : (
                    item.title
                  )}
                </h3>
                <p className="mt-2 max-w-[56ch]">{item.detail}</p>
              </div>
              </Tilt>
            </li>
          ))}
        </ol>

        <div data-reveal style={{ "--i": 2 } as React.CSSProperties} className="self-start">
        <Tilt max={3} className="rounded-[28px] bg-cobalt p-5 text-sand md:p-8">
          <h3 className="flex items-baseline justify-between gap-4 text-lead font-extrabold tracking-[-0.03em]">
            Latest on GitHub
            <a href={site.github} className="ink-link text-[0.9375rem] font-semibold tracking-normal">
              {site.githubLabel}
            </a>
          </h3>
          {repos?.length ? (
            <ul className="mt-5 grid gap-5">
              {repos.map((r) => (
                <li key={r.name}>
                  <a href={r.url} className="ink-link font-semibold">
                    {r.name}
                  </a>
                  {r.description && <p className="mt-1 line-clamp-2 text-[0.9375rem]">{r.description}</p>}
                  <p className="mt-1 text-[0.9375rem] opacity-75">
                    {[r.language, `pushed ${ago(r.pushedAt)}`].filter(Boolean).join(" · ")}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 text-[0.9375rem]">My most recent repositories are on GitHub.</p>
          )}
          <p className="mt-6 text-[0.9375rem] opacity-75">Updated {now.updated}</p>
        </Tilt>
        </div>
      </div>
    </section>
  );
}
