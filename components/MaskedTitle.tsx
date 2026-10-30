// The signature move: each word rises from behind its own baseline on load. Pure CSS, so it runs
// before any JavaScript, and the words are real text with real spaces for screen readers.
export function MaskedTitle({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <h1 className={className}>
      {words.map((word, i) => (
        <span key={i}>
          <span className="mask">
            <span className="mask-word" style={{ "--w": i } as React.CSSProperties}>
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </h1>
  );
}
