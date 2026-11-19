import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://harness.6x7.gr/", changeFrequency: "monthly", priority: 1 }];
}
