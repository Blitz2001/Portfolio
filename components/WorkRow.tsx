export function WorkRow({
  title,
  body,
  meta,
  link,
  live,
  children,
}: {
  title: string;
  body: string;
  meta: string;
  link?: string;
  live?: string;
  children: React.ReactNode;
}) {
  return (
    <article className="grid items-start gap-6 lg:grid-cols-[5fr_7fr] lg:gap-16 [&+&]:mt-18 md:[&+&]:mt-30">
      <div data-reveal>
        <h3 className="mb-5 text-title">{title}</h3>
        <p className="max-w-[60ch]">{body}</p>
        <p className="mt-4 text-[0.9375rem] text-cobalt-soft">
          {meta}
          {link && link !== "#" && (
            <>
              {meta && " · "}
              <a href={link} className="ink-link">
                Code
              </a>
            </>
          )}
          {live && (
            <>
              {" · "}
              <a href={live} className="ink-link">
                Live
              </a>
            </>
          )}
        </p>
      </div>
      <div data-reveal style={{ "--i": 1 } as React.CSSProperties}>
        {children}
      </div>
    </article>
  );
}
