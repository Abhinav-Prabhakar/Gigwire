export const SITE = {
  name: "GIGWIRE",
  shortName: "GIGWIRE",
  tagline: "Somebody's bar needs a band tonight",
  description:
    "India's handmade gig board. Bars, cafés and taprooms post live music vacancies with the pay stated up front. Musicians apply with a one-sheet and get paid on the night. No agents, no commission.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  repo: "https://github.com/Abhinav-Prabhakar/Gigwire",
  author: "Abhinav Prabhakar",
  locale: "en_IN",
  country: "India",
} as const;

/** Prefix a public asset with the GitHub Pages base path. */
export const asset = (path: string) => `${SITE.basePath}${path}`;

/** Absolute URL for a route, including the GitHub Pages base path. */
export const pageUrl = (path = "/") => `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
