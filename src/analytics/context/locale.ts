export function getLocaleContext() {
  const locale = document.documentElement.lang;

  return locale ? { locale } : {};
}
