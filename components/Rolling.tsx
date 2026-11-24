// A number whose digits roll up to their value when its block is revealed (CSS only; see globals.css).
export function Rolling({ value }: { value: number }) {
  const digits = String(value).split("").map(Number);
  return (
    <span className="roll" role="img" aria-label={String(value)}>
      {digits.map((d, i) => (
        <span key={i} className="roll-window" aria-hidden="true">
          {/* The 0–9 stack is drawn by CSS (globals.css), so the page holds only the real number. */}
          <span className="roll-col" style={{ "--d": d, "--c": i } as React.CSSProperties} />
        </span>
      ))}
    </span>
  );
}
