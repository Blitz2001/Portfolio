// Stand-in for a screenshot that hasn't been supplied yet.
export function Shot({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`flex aspect-[16/10] items-center justify-center rounded-[28px] bg-sand-2 p-6 text-center text-base font-semibold text-cobalt-soft ${className}`}
    >
      {label}
    </div>
  );
}
