// Live "Latest on GitHub": the owner's public repositories, most recently pushed first.
// Unauthenticated (60 requests an hour per server); the page caches it for an hour. Set GITHUB_TOKEN
// to raise the limit. Any failure returns null and the list is simply left out.

export type RepoActivity = { name: string; description: string | null; language: string | null; pushedAt: string; url: string; stars: number };

type ApiRepo = { name: string; description: string | null; language: string | null; pushed_at: string; html_url: string; stargazers_count: number; fork: boolean; archived: boolean };

export function toActivity(repos: ApiRepo[], limit = 4): RepoActivity[] {
  return repos
    .filter((r) => !r.fork && !r.archived)
    .sort((a, b) => Date.parse(b.pushed_at) - Date.parse(a.pushed_at))
    .slice(0, limit)
    .map((r) => ({ name: r.name, description: r.description, language: r.language, pushedAt: r.pushed_at, url: r.html_url, stars: r.stargazers_count }));
}

export async function getGithubActivity(user: string): Promise<RepoActivity[] | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=30&type=owner`, {
      headers: {
        Accept: "application/vnd.github+json",
        ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const repos = (await res.json()) as ApiRepo[];
    return Array.isArray(repos) ? toActivity(repos) : null;
  } catch {
    return null;
  }
}

/** "3 days ago", in plain words. */
export function ago(iso: string, now = Date.now()) {
  const minutes = Math.round((now - Date.parse(iso)) / 60000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (minutes < 60) return rtf.format(-minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (hours < 24) return rtf.format(-hours, "hour");
  const days = Math.round(hours / 24);
  if (days < 30) return rtf.format(-days, "day");
  const months = Math.round(days / 30);
  if (months < 12) return rtf.format(-months, "month");
  return rtf.format(-Math.round(months / 12), "year");
}
