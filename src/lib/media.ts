import { asset } from "@/lib/site";

/**
 * Photography used across the collage layouts. Files live in public/photos/
 * so the static demo is fully self-contained (no third-party hotlinking).
 * Regenerate them with `scripts/fetch-photos.mjs`.
 */
export const PHOTOS = {
  duoVocal: asset("/photos/duoVocal.jpg"),
  jazzBand: asset("/photos/jazzBand.jpg"),
  crowdGuitar: asset("/photos/crowdGuitar.jpg"),
  clubBand: asset("/photos/clubBand.jpg"),
  singerMoody: asset("/photos/singerMoody.jpg"),
  guitaristCozy: asset("/photos/guitaristCozy.jpg"),
  nightclub: asset("/photos/nightclub.jpg"),
  sax: asset("/photos/sax.jpg"),
  rooftopSax: asset("/photos/rooftopSax.jpg"),
  streetBand: asset("/photos/streetBand.jpg"),
  bandTogether: asset("/photos/bandTogether.jpg"),
  floorInstruments: asset("/photos/floorInstruments.jpg"),
  smokyStudio: asset("/photos/smokyStudio.jpg"),
  guitarsConcert: asset("/photos/guitarsConcert.jpg"),
  neonCocktails: asset("/photos/neonCocktails.jpg"),
  barRed: asset("/photos/barRed.jpg"),
  barNeon: asset("/photos/barNeon.jpg"),
  barBetter: asset("/photos/barBetter.jpg"),
  barKatowice: asset("/photos/barKatowice.jpg"),
  barDreams: asset("/photos/barDreams.jpg"),
} as const;

export const AVATARS = {
  delia: asset("/photos/avatar-delia.jpg"),
  marco: asset("/photos/avatar-marco.jpg"),
  priya: asset("/photos/avatar-priya.jpg"),
  catalina: asset("/photos/avatar-catalina.jpg"),
} as const;
