import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} — live music gigs across India`,
    short_name: SITE.shortName,
    description: SITE.description,
    start_url: `${SITE.basePath}/`,
    scope: `${SITE.basePath}/`,
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#f1e4cd",
    theme_color: "#171310",
    lang: "en-IN",
    dir: "ltr",
    categories: ["music", "entertainment", "business"],
    icons: [
      {
        src: `${SITE.basePath}/icon-192.png`,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `${SITE.basePath}/icon-512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `${SITE.basePath}/icon-512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: `${SITE.basePath}/icon.svg`,
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
    shortcuts: [
      {
        name: "The gig board",
        short_name: "Gigs",
        description: "Every open night on the wire",
        url: `${SITE.basePath}/gigs/`,
        icons: [{ src: `${SITE.basePath}/icon-192.png`, sizes: "192x192" }],
      },
      {
        name: "Post a night",
        short_name: "Post",
        description: "Write a flyer for your room",
        url: `${SITE.basePath}/post/`,
        icons: [{ src: `${SITE.basePath}/icon-192.png`, sizes: "192x192" }],
      },
    ],
  };
}
