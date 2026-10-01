const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.CF_PAGES_URL ||
  "https://shreenemane.pages.dev";

export const dynamic = "force-static";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
