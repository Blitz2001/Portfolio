import type { Metadata } from "next";
import { headers } from "next/headers";
import { authorised } from "@/lib/auth";
import { readVisits, visitsReady } from "@/lib/visits";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

// Shown in Sri Lanka time.
const when = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Colombo", dateStyle: "medium", timeStyle: "short", hourCycle: "h23" }).format(new Date(iso));

export default async function Admin() {
  // The proxy guards this route; check again here in case the matcher ever changes.
  const password = process.env.ADMIN_PASSWORD;
  if (!password || !authorised((await headers()).get("authorization"), password)) return null;

  const { summary, recent } = await readVisits();
  const cell = "px-2 py-2.5 text-left align-top";
  return (
    <main className="frame section-gap">
      <h1 className="text-section">Tracking links</h1>
      <p className="mt-6 max-w-[60ch] text-lead">
        Send a link like <b>arunusampath.me/?ref=ryzera</b> with each application. Every first visit from that link shows up here. Times are Sri Lanka time.
      </p>
      {!visitsReady && <p className="mt-6 rounded-[22px] bg-sand-2 p-5">Not connected: add a Neon Postgres database in Vercel so DATABASE_URL is set, then redeploy.</p>}

      <h2 className="mt-16 mb-6 text-title">By link</h2>
      {summary.length ? (
        <div className="overflow-x-auto rounded-[28px] bg-sand-2 p-4 md:p-8">
          <table className="w-full border-collapse tabular-nums">
            <thead>
              <tr className="border-b-2 border-cobalt text-sm">
                <th className={cell}>Ref</th>
                <th className={cell}>Visits</th>
                <th className={cell}>First</th>
                <th className={cell}>Last</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((r) => (
                <tr key={r.ref} className="border-b-2 border-cobalt">
                  <td className={`${cell} font-semibold`}>{r.ref}</td>
                  <td className={cell}>{r.visits}</td>
                  <td className={cell}>{when(r.first)}</td>
                  <td className={cell}>{when(r.last)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No visits yet.</p>
      )}

      <h2 className="mt-16 mb-6 text-title">Latest visits</h2>
      {recent.length ? (
        <div className="overflow-x-auto rounded-[28px] bg-sand-2 p-4 md:p-8">
          <table className="w-full border-collapse tabular-nums">
            <thead>
              <tr className="border-b-2 border-cobalt text-sm">
                <th className={cell}>When</th>
                <th className={cell}>Ref</th>
                <th className={cell}>Page</th>
                <th className={cell}>From</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((v, i) => (
                <tr key={i} className="border-b-2 border-cobalt">
                  <td className={`${cell} whitespace-nowrap`}>{when(v.at)}</td>
                  <td className={`${cell} font-semibold`}>{v.ref}</td>
                  <td className={cell}>{v.path}</td>
                  <td className={cell}>{[v.city, v.country].filter(Boolean).join(", ") || "Unknown"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Nothing logged yet.</p>
      )}
    </main>
  );
}
