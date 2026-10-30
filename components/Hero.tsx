import { MaskedTitle } from "./MaskedTitle";

// The first screen of every page: the title across the full measure, then the one sentence and the action.
type Action = { href: string; label: string };

export function Hero({ title, lead, action, secondary, children }: { title: string; lead: string; action?: Action; secondary?: Action; children?: React.ReactNode }) {
  return (
    <section className="frame pt-10 pb-20 md:pt-24 md:pb-32">
      <MaskedTitle text={title} className="text-display" />
      <div className="mt-8 flex flex-col items-start gap-8 md:mt-12">
        <p data-reveal style={{ "--i": 5 } as React.CSSProperties} className="max-w-[46ch] text-lead leading-[1.45]">
          {lead}
        </p>
        {(action || secondary) && (
          <div data-reveal style={{ "--i": 6 } as React.CSSProperties} className="flex flex-wrap gap-3">
            {action && (
              <a href={action.href} className="btn">
                {action.label}
              </a>
            )}
            {secondary && (
              <a href={secondary.href} className="btn btn-outline">
                {secondary.label}
              </a>
            )}
          </div>
        )}
      </div>
      {children}
    </section>
  );
}
