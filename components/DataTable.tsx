import type { TableRow } from "@/lib/content";

// A real table from the work itself: first column is the label, the rest are figures.
export function DataTable({ caption, columns, rows }: { caption: string; columns: string[]; rows: TableRow[] }) {
  const cell = "px-1.5 py-3 md:px-2.5";
  return (
    <div data-ui className="overflow-x-auto rounded-[28px] bg-sand-2 p-4 md:p-8">
      <table className="w-full border-collapse text-sm tabular-nums md:text-base">
        <caption className="mb-3 text-left font-semibold">{caption}</caption>
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
          {rows.map((r) => (
            <tr key={r.cells[0]} className={r.highlight ? "bg-cobalt font-semibold text-sand" : "border-b-2 border-cobalt"}>
              {r.cells.map((v, i) => (
                <td key={i} className={`${cell} ${i ? "text-right whitespace-nowrap" : "text-left"}`}>
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
