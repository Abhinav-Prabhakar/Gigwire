export const GENRES = [
  "Bollywood",
  "Sufi / Qawwali",
  "Ghazal",
  "Carnatic",
  "Hindustani",
  "Jazz",
  "Blues",
  "Soul / Funk",
  "Folk / Acoustic",
  "Rock / Indie",
  "Pop / Cover",
  "Hip-Hop / R&B",
  "EDM / House",
  "DJ Set",
  "Latin",
  "Gospel / Choir",
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
  "Percussion",
  "DJ",
  "Opening act",
  "Backing vocals",
];

/** Cities the board is live in — used in the footer and meta copy. */
export const CITIES = ["Mumbai", "Bengaluru", "New Delhi", "Anjuna", "Pune", "Kolkata"];

export const PAY_UNITS: Record<string, string> = {
  flat: "flat",
  hour: "/hr",
  set: "/set",
};

export function formatPay(amount: number, unit: string) {
  const value = `₹${amount.toLocaleString("en-IN")}`;
  if (unit === "hour") return `${value}/hr`;
  if (unit === "set") return `${value}/set`;
  return `${value} flat`;
}

/** Compact rupee figure for tight spaces: ₹8k, ₹1.4L, ₹1.2Cr. */
export function formatPayShort(amount: number) {
  const trim = (n: number) => n.toFixed(1).replace(/\.0$/, "");
  if (amount >= 10000000) return `₹${trim(amount / 10000000)}Cr`;
  if (amount >= 100000) return `₹${trim(amount / 100000)}L`;
  if (amount >= 1000) return `₹${trim(amount / 1000)}k`;
  return `₹${amount}`;
}

export function formatGigDate(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  return {
    weekday: d.toLocaleDateString("en-IN", { weekday: "short" }).toUpperCase(),
    month: d.toLocaleDateString("en-IN", { month: "short" }).toUpperCase(),
    day: d.toLocaleDateString("en-IN", { day: "2-digit" }),
    long: d.toLocaleDateString("en-IN", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    short: d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
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
