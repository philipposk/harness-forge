import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    // /api/data is fetched by the page itself, so crawlers need it to render the wizard.
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://harness.6x7.gr/sitemap.xml",
    host: "https://harness.6x7.gr",
  };
}
