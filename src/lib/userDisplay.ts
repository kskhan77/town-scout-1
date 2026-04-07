/** Two-letter avatar text from full name (first + last initial) or email local part. */
export function getUserInitials(
  name: string | null | undefined,
  email: string | null | undefined,
): string {
  const n = name?.trim();
  if (n) {
    const parts = n.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      const a = parts[0][0];
      const b = parts[parts.length - 1][0];
      if (a && b) return `${a}${b}`.toUpperCase();
    }
    if (parts.length === 1) {
      const w = parts[0];
      if (w.length >= 2) return w.slice(0, 2).toUpperCase();
      if (w.length === 1) return w.toUpperCase();
    }
  }
  const e = email?.trim();
  if (e) {
    const local = e.split("@")[0] ?? "";
    if (local.length >= 2) return local.slice(0, 2).toUpperCase();
    if (local.length === 1) return local.toUpperCase();
  }
  return "?";
}
