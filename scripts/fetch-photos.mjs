#!/usr/bin/env node
/**
 * Download the demo photography into public/photos/ so the static build is
 * self-contained (no Pexels hotlinking, works offline and on GitHub Pages).
 *
 *   node scripts/fetch-photos.mjs
 *
 * Source: Pexels (free to use, no attribution required).
 */
import { mkdir, writeFile } from "node:fs/promises";

const px = (id, w, h) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

const PHOTOS = {
  duoVocal: [6173859, 800, 1000],
  jazzBand: [9419224, 1000, 700],
  crowdGuitar: [6174060, 900, 1100],
  clubBand: [9419405, 1000, 700],
  singerMoody: [9419374, 900, 1100],
  guitaristCozy: [6173836, 800, 1000],
  nightclub: [6173832, 1000, 700],
  sax: [5650536, 800, 1000],
  rooftopSax: [7503248, 900, 1100],
  streetBand: [13350740, 1000, 700],
  bandTogether: [9419244, 1000, 700],
  floorInstruments: [18496909, 900, 1100],
  smokyStudio: [10175905, 1000, 700],
  guitarsConcert: [5650532, 800, 1000],
  neonCocktails: [11478913, 1200, 800],
  barRed: [20723853, 1200, 800],
  barNeon: [11468997, 1200, 800],
  barBetter: [17119947, 1200, 800],
  barKatowice: [38082102, 1200, 800],
  barDreams: [29373549, 1200, 800],
};

const AVATARS = {
  delia: [5650536, 400, 400],
  marco: [6173836, 400, 400],
  priya: [7503248, 400, 400],
  catalina: [9419405, 400, 400],
};

const DIR = new URL("../public/photos/", import.meta.url);

async function grab(name, [id, w, h]) {
  const res = await fetch(px(id, w, h));
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  await writeFile(new URL(`${name}.jpg`, DIR), Buffer.from(await res.arrayBuffer()));
  console.log("wrote", `public/photos/${name}.jpg`);
}

await mkdir(DIR, { recursive: true });
for (const [name, spec] of Object.entries(PHOTOS)) await grab(name, spec);
for (const [name, spec] of Object.entries(AVATARS)) await grab(`avatar-${name}`, spec);
console.log("done");
