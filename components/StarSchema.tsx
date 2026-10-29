import { warehouse } from "@/lib/content";

function Table({ name, tag, cols, fact, className = "" }: { name: string; tag?: string; cols: string[]; fact?: boolean; className?: string }) {
  return (
    <div
      className={`flex flex-col rounded-xl border-2 border-cobalt p-3 ${fact ? "justify-center bg-cobalt text-sand" : "bg-sand"} ${className}`}
    >
      <b className="mb-2 flex flex-wrap items-center gap-1.5 text-base font-extrabold tracking-[-0.03em]">
        {name}
        {tag && (
          <span className={`rounded-full px-1.5 py-px text-xs font-semibold tracking-normal ${fact ? "bg-sand text-cobalt" : "bg-cobalt text-sand"}`}>
            {tag}
          </span>
        )}
      </b>
      {cols.map((c) => (
        <span key={c}>{c}</span>
      ))}
    </div>
  );
}

export function StarSchema() {
  const t = warehouse.tables;
  return (
    <div
      data-ui
      role="img"
      aria-label="Star schema: FactSales joined to DimArticle, DimCustomer (SCD type 2) and DimDate, with a FactFulfilment accumulating snapshot"
      className="grid grid-cols-2 gap-3.5 rounded-[28px] bg-sand-2 p-4 text-sm leading-[1.35] [grid-template-areas:'f_f'_'a_c'_'d_s'] md:grid-cols-[1fr_1.15fr_1fr] md:p-8 md:[grid-template-areas:'a_f_c'_'d_f_s']"
    >
      <Table name="DimArticle" cols={t.article} className="[grid-area:a]" />
      <Table name="FactSales" cols={t.sales} fact className="[grid-area:f]" />
      <Table name="DimCustomer" tag="SCD2" cols={t.customer} className="[grid-area:c]" />
      <Table name="DimDate" cols={t.date} className="[grid-area:d]" />
      <Table name="FactFulfilment" tag="accumulating" cols={t.fulfilment} className="[grid-area:s]" />
    </div>
  );
}
