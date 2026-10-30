import { achievements, timeline } from "@/lib/content";

// About → "Path so far" (newest first), and achievements once there are any.
export function Timeline() {
  return (
    <div className="mt-12">
      <h3 data-reveal className="mb-6 text-title">
        Path so far
      </h3>
      <ol className="grid gap-7">
        {timeline.map((t, i) => (
          <li key={t.title} data-reveal style={{ "--i": i } as React.CSSProperties} className="grid gap-x-8 gap-y-1 sm:grid-cols-[9rem_1fr]">
            <p className="pt-0.5 font-semibold text-cobalt-soft tabular-nums">{t.when}</p>
            <div>
              <p className="font-semibold">{t.title}</p>
              <p className="text-[0.9375rem] text-cobalt-soft">{t.where}</p>
              <p className="mt-1 max-w-[56ch]">{t.detail}</p>
            </div>
          </li>
        ))}
      </ol>
      {achievements.length > 0 && (
        <>
          <h3 data-reveal className="mt-12 mb-6 text-title">
            Achievements
          </h3>
          <ul className="grid gap-4">
            {achievements.map((a) => (
              <li key={a.title} data-reveal className="grid gap-x-8 sm:grid-cols-[9rem_1fr]">
                <p className="font-semibold text-cobalt-soft">{a.when}</p>
                <p>
                  {a.link ? (
                    <a href={a.link} className="ink-link font-semibold">
                      {a.title}
                    </a>
                  ) : (
                    <span className="font-semibold">{a.title}</span>
                  )}
                  , {a.by}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
