import { bank } from "@/lib/content";

export function ModelTable() {
  return (
    <div data-ui className="overflow-x-auto rounded-[28px] bg-sand-2 p-4 md:p-8">
      <table className="w-full border-collapse text-sm tabular-nums md:text-base">
        <caption className="mb-3 text-left font-semibold">{bank.caption}</caption>
        <thead>
          <tr className="border-b-2 border-cobalt">
            <th className="px-1.5 py-2.5 text-left text-sm font-semibold md:px-2.5">Model</th>
            {bank.columns.map((c) => (
              <th key={c} className="px-1.5 py-2.5 text-right text-sm font-semibold md:px-2.5">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bank.rows.map((r) => (
            <tr key={r.model} className={r.picked ? "bg-cobalt font-semibold text-sand" : "border-b-2 border-cobalt"}>
              <td className="px-1.5 py-3 md:px-2.5">{r.model}</td>
              {r.values.map((v, i) => (
                <td key={i} className="px-1.5 py-3 text-right md:px-2.5">
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
