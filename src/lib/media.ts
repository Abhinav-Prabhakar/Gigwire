// Photography (Pexels) used across the collage layouts.
const px = (id: number, w = 900, h = 1100) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

export const PHOTOS = {
  duoVocal: px(6173859, 800, 1000),
  jazzBand: px(9419224, 1000, 700),
  crowdGuitar: px(6174060, 900, 1100),
  clubBand: px(9419405, 1000, 700),
  singerMoody: px(9419374, 900, 1100),
  guitaristCozy: px(6173836, 800, 1000),
  nightclub: px(6173832, 1000, 700),
  sax: px(5650536, 800, 1000),
  rooftopSax: px(7503248, 900, 1100),
  streetBand: px(13350740, 1000, 700),
  bandTogether: px(9419244, 1000, 700),
  floorInstruments: px(18496909, 900, 1100),
  smokyStudio: px(10175905, 1000, 700),
  guitarsConcert: px(5650532, 800, 1000),
  neonCocktails: px(11478913, 1200, 800),
  barRed: px(20723853, 1200, 800),
  barNeon: px(11468997, 1200, 800),
  barBetter: px(17119947, 1200, 800),
  barKatowice: px(38082102, 1200, 800),
  barDreams: px(29373549, 1200, 800),
};

export const AVATARS = {
  delia: px(5650536, 400, 400),
  marco: px(6173836, 400, 400),
  priya: px(7503248, 400, 400),
  catalina: px(9419405, 400, 400),
};
