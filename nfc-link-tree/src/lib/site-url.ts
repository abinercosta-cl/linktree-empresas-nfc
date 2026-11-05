// Ordem: NEXT_PUBLIC_SITE_URL > VERCEL_URL > origem informada pelo chamador > localhost.
// No navegador, VERCEL_URL não existe; por isso o client component informa window.location.origin.
export function getSiteUrl(fallbackOrigin = "http://localhost:3000"): string {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : fallbackOrigin);

  return siteUrl.replace(/\/+$/, "");
}
