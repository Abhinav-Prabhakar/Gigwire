export const GENRES = [
  "Jazz",
  "Soul / Funk",
  "Blues",
  "Cover Band",
  "Originals",
  "Latin",
  "Folk / Acoustic",
  "Rock / Indie",
  "Country",
  "Reggae",
  "Classical",
  "Hip-Hop / R&B",
  "DJ Set",
  "Gospel / Choir",
  "Bluegrass",
  "Karaoke Host",
];

export const LINEUP = [
  "Solo act",
  "Duo",
  "Trio",
  "4-piece band",
  "5+ piece band",
  "Horns",
  "Singer",
  "Pianist / Keys",
  "Guitarist",
  "Bassist",
  "Drummer",
  "DJ",
  "Opening act",
];

export const PAY_UNITS: Record<string, string> = {
  flat: "flat",
  hour: "/hr",
  set: "/set",
};

export function formatPay(amount: number, unit: string) {
  const value = `$${amount.toLocaleString("en-US")}`;
  if (unit === "hour") return `${value}/hr`;
  if (unit === "set") return `${value}/set`;
  return `${value} flat`;
}

export function formatGigDate(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  return {
    weekday: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: d.toLocaleDateString("en-US", { day: "2-digit" }),
    long: d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    short: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  };
}

export function relativeDay(iso: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(`${iso}T00:00:00`);
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return "TONIGHT";
  if (diff === 1) return "TOMORROW";
  if (diff < 0) return "PASSED";
  if (diff <= 7) return `IN ${diff} DAYS`;
  if (diff <= 14) return "NEXT WEEK";
  return `IN ${Math.round(diff / 7)} WEEKS`;
}

export function timeRange(start?: string | null, end?: string | null) {
  if (!start) return "Time TBD";
  return end ? `${start} – ${end}` : `${start}`;
}

export function splitList(value: string): string[] {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}
