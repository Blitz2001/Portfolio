export function StepList({ caption, steps }: { caption: string; steps: string[] }) {
  return (
    <div data-ui className="rounded-[28px] bg-sand-2 p-4 md:p-8">
      <p className="mb-3 font-semibold">{caption}</p>
      <ol className="grid gap-3">
        {steps.map((s) => (
          <li key={s} className="flex gap-3 border-b-2 border-cobalt pb-3 last:border-0 last:pb-0">
            <span aria-hidden="true" className="mt-2 size-2.5 shrink-0 rounded-full bg-cobalt" />
            <span>{s}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
