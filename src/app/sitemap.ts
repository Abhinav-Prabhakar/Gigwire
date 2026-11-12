import type { MetadataRoute } from "next";
import { BASE_DATASET } from "@/lib/demo/data";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

/** Static export: trailingSlash is on, so every route resolves to a folder. */
const url = (path: string) => `${SITE.url}${path === "/" ? "/" : `${path}/`}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const buildDay = process.env.NEXT_PUBLIC_BUILD_DAY ?? new Date().toISOString().slice(0, 10);

  const pages: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: buildDay, changeFrequency: "daily", priority: 1 },
    { url: url("/gigs"), lastModified: buildDay, changeFrequency: "daily", priority: 0.9 },
    { url: url("/rooms"), lastModified: buildDay, changeFrequency: "weekly", priority: 0.7 },
    { url: url("/how-it-works"), lastModified: buildDay, changeFrequency: "monthly", priority: 0.6 },
    { url: url("/signup"), lastModified: buildDay, changeFrequency: "monthly", priority: 0.5 },
    { url: url("/post"), lastModified: buildDay, changeFrequency: "monthly", priority: 0.5 },
  ];

  const gigs: MetadataRoute.Sitemap = BASE_DATASET.gigs.map((gig) => ({
    url: url(`/gigs/${gig.id}`),
    lastModified: buildDay,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...pages, ...gigs];
}
