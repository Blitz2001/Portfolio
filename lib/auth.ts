// HTTP Basic auth check for /admin: any username, the password in ADMIN_PASSWORD.
export function authorised(header: string | null, password: string) {
  if (!header?.startsWith("Basic ")) return false;
  let given = "";
  try {
    given = atob(header.slice(6)).split(":").slice(1).join(":");
  } catch {
    return false;
  }
  // Compare in constant time so the check doesn't leak how much of the password matched.
  const a = new TextEncoder().encode(given);
  const b = new TextEncoder().encode(password);
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  return diff === 0;
}
