import { MaskedTitle } from "./MaskedTitle";

// The first screen of every page: the title across the full measure, then the one sentence and the action.
export function Hero({ title, lead, action, children }: { title: string; lead: string; action?: { href: string; label: string }; children?: React.ReactNode }) {
  return (
    <section className="frame pt-10 pb-20 md:pt-24 md:pb-32">
      <MaskedTitle text={title} className="text-display" />
      <div className="mt-8 flex flex-col items-start gap-8 md:mt-12">
        <p data-reveal style={{ "--i": 5 } as React.CSSProperties} className="max-w-[46ch] text-lead leading-[1.45]">
          {lead}
        </p>
        {action && (
          <a data-reveal style={{ "--i": 6 } as React.CSSProperties} href={action.href} className="btn">
            {action.label}
          </a>
        )}
      </div>
      {children}
    </section>
  );
}
