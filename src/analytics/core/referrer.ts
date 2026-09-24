export function normalizeReferrer(value: string | undefined): string | null {
  if (!value) return null;

  const hostname = value.toLowerCase();
  if (hostname.length > 253 || !/^[a-z0-9.-]+$/.test(hostname)) return null;
  if (hostname.startsWith(".") || hostname.endsWith(".") || hostname.includes("..")) {
    return null;
  }

  return hostname;
}
