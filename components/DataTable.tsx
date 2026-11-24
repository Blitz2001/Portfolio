import type { TableRow } from "@/lib/content";

// A real table from the work itself: first column is the label, the rest are figures.
export function DataTable({ caption, columns, rows }: { caption: string; columns: string[]; rows: TableRow[] }) {
  const cell = "px-1.5 py-3 md:px-2.5";
  return (
    <div data-ui className="overflow-x-auto rounded-[28px] bg-sand-2 p-4 md:p-8">
      <table className="w-full border-collapse text-sm tabular-nums md:text-base">
        <caption className="mb-3 text-left font-semibold normal-nums">{caption}</caption>
        <thead>
          <tr className="border-b-2 border-cobalt">
            {columns.map((c, i) => (
              <th key={c} className={`${cell} py-2.5 text-sm font-semibold ${i ? "text-right" : "text-left"}`}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, row) => (
            <tr key={r.cells[0]} className={r.highlight ? "bg-cobalt font-semibold text-sand" : "border-b-2 border-cobalt"}>
              {r.cells.map((v, i) => (
                <td key={i} className={`${cell} ${i ? "text-right whitespace-nowrap" : "text-left"}`}>
                  {r.interval && i === 2 ? <Interval range={r.interval} label={v} row={row} /> : v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// A 95% interval on a 0–100% track: the bar is the interval, the dot the observed rate.
function Interval({ range: [lo, hi, at], label, row }: { range: [number, number, number]; label: string; row: number }) {
  return (
    <span className="inline-flex items-center gap-3">
      <span className="relative hidden h-2 w-24 rounded-full bg-current/15 sm:block" aria-hidden="true">
        <span
          className="interval-fill absolute inset-y-0 rounded-full bg-current/55"
          style={{ left: `${lo}%`, width: `${Math.max(hi - lo, 2)}%`, "--r": row } as React.CSSProperties}
        />
        <span className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current" style={{ left: `${at}%` }} />
      </span>
      {label}
    </span>
  );
}
