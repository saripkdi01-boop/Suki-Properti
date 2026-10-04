import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/properties";

const BASE = "https://sultraproperti.id";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllSlugs();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE}/properti`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE}/tentang`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE}/sumber-data`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE}/privasi`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const propertyPages: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE}/properti/${slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...propertyPages];
}
