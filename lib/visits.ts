import { neon } from "@neondatabase/serverless";

// Visits from tracking links (/?ref=ryzera) live in one small Postgres table.
// Set DATABASE_URL (Vercel → Storage → Neon) to turn it on; without it visits are only logged.

export type Visit = { ref: string; path: string; country: string | null; city: string | null; at: string };
export type RefSummary = { ref: string; visits: number; first: string; last: string };

export const REF_PATTERN = /^[a-z0-9][a-z0-9_-]{0,39}$/i;

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
export const visitsReady = Boolean(sql);

let ready: Promise<unknown> | null = null;
function ensureTable() {
  if (!sql) return null;
  ready ??= sql`CREATE TABLE IF NOT EXISTS visits (
    id bigserial PRIMARY KEY,
    ref text NOT NULL,
    path text NOT NULL,
    country text,
    city text,
    user_agent text,
    at timestamptz NOT NULL DEFAULT now()
  )`;
  return ready;
}

export async function recordVisit(v: { ref: string; path: string; country: string | null; city: string | null; userAgent: string | null }) {
  if (!sql) {
    console.info("visit (no DATABASE_URL, not stored)", v.ref, v.path);
    return false;
  }
  await ensureTable();
  await sql`INSERT INTO visits (ref, path, country, city, user_agent) VALUES (${v.ref}, ${v.path}, ${v.country}, ${v.city}, ${v.userAgent})`;
  return true;
}

export async function readVisits(): Promise<{ summary: RefSummary[]; recent: Visit[] }> {
  if (!sql) return { summary: [], recent: [] };
  await ensureTable();
  const summary = (await sql`SELECT ref, count(*)::int AS visits, min(at) AS first, max(at) AS last FROM visits GROUP BY ref ORDER BY max(at) DESC`) as RefSummary[];
  const recent = (await sql`SELECT ref, path, country, city, at FROM visits ORDER BY at DESC LIMIT 200`) as Visit[];
  return { summary, recent };
}
