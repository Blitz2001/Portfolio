// The Entity Extractor's own rules, as documented for the viva (extract.py):
// normalize() strips the possessive before punctuation, then spaces and a leading article;
// canonical_id() is {prefix}_{first 12 hex digits of SHA-1("TYPE:normalized")};
// _confidence() = min(0.6 + 0.15·(sources − 1) + 0.02·mentions, 0.97);
// _corroborated(): below 10 records keep everything, else need 2+ sources or 3+ mentions.

export const TYPE_PREFIX = { PERSON: "per", ORG: "org", LOCATION: "loc", EVENT: "evt" } as const;
export type EntityTypeKey = keyof typeof TYPE_PREFIX;

export function normalize(name: string) {
  let n = name.toLowerCase();
  n = n.replace(/['’]s\b/g, ""); // possessive first, or "lanka's" would become "lankas"
  n = n.replace(/[^\p{L}\p{N}_\s]/gu, "");
  n = n.replace(/\s+/g, " ").trim();
  return n.replace(/^(the|a|an)\s+/, "").trim();
}

export async function canonicalId(type: string, normalized: string) {
  const bytes = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(`${type}:${normalized}`));
  const hex12 = [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 12); // taste-skill-ignore: hex byte padding
  const prefix = TYPE_PREFIX[type as EntityTypeKey] ?? type.toLowerCase().slice(0, 3);
  return `${prefix}_${hex12}`;
}

export const confidence = (sources: number, mentions: number) =>
  Math.round(Math.min(0.6 + 0.15 * (sources - 1) + 0.02 * mentions, 0.97) * 100) / 100;

/** _corroborated(): below 10 records keep everything; otherwise an entity needs 2+ sources or 3+ mentions. */
export const corroborated = (records: number, sources: number, mentions: number) =>
  records < 10 || sources >= 2 || mentions >= 3;
