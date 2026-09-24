export function getReferrerContext() {
  if (!document.referrer) return {};

  try {
    const url = new URL(document.referrer);
    if (url.protocol !== "https:" && url.protocol !== "http:") return {};
    return { referrer: url.hostname.toLowerCase() };
  } catch {
    return {};
  }
}
