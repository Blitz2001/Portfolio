export function WorkRow({
  title,
  body,
  meta,
  link,
  children,
}: {
  title: string;
  body: string;
  meta: string;
  link?: string;
  children: React.ReactNode;
}) {
  return (
    <article className="grid items-start gap-6 md:grid-cols-[5fr_7fr] md:gap-16 [&+&]:mt-18 md:[&+&]:mt-30">
      <div>
        <h3 className="mb-5 text-title">{title}</h3>
        <p>{body}</p>
        <p className="mt-4 text-[0.9375rem] text-cobalt-soft">
          {meta}
          {link && (
            <>
              {" · "}
              <a href={link} className="ink-link">
                Code
              </a>
            </>
          )}
        </p>
      </div>
      {children}
    </article>
  );
}
