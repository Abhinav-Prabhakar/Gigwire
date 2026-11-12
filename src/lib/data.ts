import { db } from "@/db";
import { applications, bookmarks, gigs, users, venues } from "@/db/schema";
import { and, asc, desc, eq, gte, inArray, or, sql } from "drizzle-orm";

export type GigFilters = {
  q?: string;
  city?: string;
  genres?: string[];
  lineup?: string[];
  dateFrom?: string;
  dateTo?: string;
  payMin?: number;
  gigType?: string;
  experience?: string;
  perks?: string[];
  status?: string;
  sort?: string;
};

export type GigRow = {
  gig: typeof gigs.$inferSelect;
  venue: typeof venues.$inferSelect | null;
  appCount: number;
};

const appCountSql = sql<number>`(select count(*)::int from applications a where a.gig_id = gigs.id)`;

function buildWhere(f: GigFilters) {
  const conds = [];
  if (f.q) {
    const like = `%${f.q}%`;
    conds.push(
      or(
        sql`lower(gigs.title) ilike ${like}`,
        sql`lower(coalesce(gigs.description,'')) ilike ${like}`,
        sql`lower(coalesce(venues.name,'')) ilike ${like}`,
        sql`lower(gigs.city || ', ' || coalesce(gigs.state,'')) ilike ${like}`,
      ),
    );
  }
  if (f.city) conds.push(sql`gigs.city = ${f.city}`);
  if (f.dateFrom) conds.push(sql`gigs.gig_date >= ${f.dateFrom}::date`);
  if (f.dateTo) conds.push(sql`gigs.gig_date <= ${f.dateTo}::date`);
  if (f.payMin && f.payMin > 0) conds.push(sql`gigs.pay_amount >= ${f.payMin}`);
  if (f.gigType) conds.push(sql`gigs.gig_type = ${f.gigType}`);
  if (f.experience) conds.push(sql`gigs.experience = ${f.experience}`);
  if (f.status) conds.push(sql`gigs.status = ${f.status}`);
  if (f.genres?.length) {
    const list = f.genres.map((x) => sql`${x}`);
    conds.push(sql`gigs.genres && ARRAY[${sql.join(list, sql`, `)}]::text[]`);
  }
  if (f.lineup?.length) {
    const list = f.lineup.map((x) => sql`${x}`);
    conds.push(sql`gigs.lineup_needed && ARRAY[${sql.join(list, sql`, `)}]::text[]`);
  }
  if (f.perks?.includes("backline")) conds.push(sql`gigs.backline = true`);
  if (f.perks?.includes("meals")) conds.push(sql`gigs.meals = true`);
  if (f.perks?.includes("tips")) conds.push(sql`gigs.tips = true`);
  if (f.perks?.includes("engineer")) conds.push(sql`gigs.sound_engineer = true`);
  return conds;
}

export async function searchGigs(f: GigFilters, limit = 60): Promise<GigRow[]> {
  const where = buildWhere(f);
  const order =
    f.sort === "pay"
      ? sql`gigs.pay_amount DESC, gigs.gig_date ASC`
      : f.sort === "date"
        ? sql`gigs.gig_date ASC`
        : f.sort === "applications"
          ? sql`${appCountSql} DESC`
          : sql`gigs.featured DESC, gigs.gig_date ASC`;

  const rows = await db
    .select({ gig: gigs, venue: venues, appCount: appCountSql })
    .from(gigs)
    .leftJoin(venues, eq(gigs.venueId, venues.id))
    .where(where.length ? and(...where) : undefined)
    .orderBy(order, asc(gigs.id))
    .limit(limit);

  return rows.map((r) => ({ ...r, appCount: Number(r.appCount ?? 0) }));
}

export async function countGigs(f: GigFilters = {}): Promise<number> {
  const where = buildWhere(f);
  const res = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(gigs)
    .leftJoin(venues, eq(gigs.venueId, venues.id))
    .where(where.length ? and(...where) : undefined);
  return res[0]?.n ?? 0;
}

export async function getGig(id: number) {
  const rows = await db
    .select({ gig: gigs, venue: venues, appCount: appCountSql })
    .from(gigs)
    .leftJoin(venues, eq(gigs.venueId, venues.id))
    .where(eq(gigs.id, id))
    .limit(1);
  if (!rows[0]) return null;
  return { ...rows[0], appCount: Number(rows[0].appCount ?? 0) };
}

export async function getGigWithOwner(id: number) {
  const gig = await getGig(id);
  if (!gig?.venue) return gig;
  const owner = await db.select().from(users).where(eq(users.id, gig.venue.ownerId)).limit(1);
  return { ...gig, owner: owner[0] ?? null };
}

export async function getCities() {
  const res = await db
    .select({ city: gigs.city, state: gigs.state, n: sql<number>`count(*)::int` })
    .from(gigs)
    .where(sql`gigs.status in ('open','interviewing')`)
    .groupBy(gigs.city, gigs.state)
    .orderBy(asc(gigs.city));
  return res
    .filter((r) => r.city)
    .map((r) => ({ city: r.city as string, state: r.state ?? "", count: r.n }));
}

export async function getStats() {
  const res = await db
    .select({
      openGigs: sql<number>`(select count(*)::int from gigs where status in ('open','interviewing'))`,
      venues: sql<number>`(select count(*)::int from venues)`,
      musicians: sql<number>`(select count(*)::int from users where role = 'musician')`,
      paid: sql<number>`(select coalesce(sum(pay_amount),0)::int from gigs where status in ('open','interviewing'))`,
      thisWeek: sql<number>`(select count(*)::int from gigs where gig_date <= current_date + 7 and gig_date >= current_date)`,
    })
    .from(gigs)
    .limit(1);
  return res[0] ?? { openGigs: 0, venues: 0, musicians: 0, paid: 0, thisWeek: 0 };
}

export async function getFeaturedGigs(limit = 3): Promise<GigRow[]> {
  const rows = await db
    .select({ gig: gigs, venue: venues, appCount: appCountSql })
    .from(gigs)
    .leftJoin(venues, eq(gigs.venueId, venues.id))
    .where(sql`gigs.status in ('open','interviewing')`)
    .orderBy(desc(gigs.featured), asc(gigs.gigDate))
    .limit(limit);
  return rows.map((r) => ({ ...r, appCount: Number(r.appCount ?? 0) }));
}

export async function getVenueByOwner(ownerId: number) {
  const rows = await db.select().from(venues).where(eq(venues.ownerId, ownerId)).limit(1);
  return rows[0] ?? null;
}

export async function getVenueStats(venueId: number) {
  const res = await db
    .select({
      live: sql<number>`(select count(*)::int from gigs where venue_id = ${venueId} and status in ('open','interviewing'))`,
      filled: sql<number>`(select count(*)::int from gigs where venue_id = ${venueId} and status = 'filled')`,
      apps: sql<number>`(select count(*)::int from applications a join gigs g on g.id = a.gig_id where g.venue_id = ${venueId})`,
      booked: sql<number>`(select count(*)::int from applications a join gigs g on g.id = a.gig_id where g.venue_id = ${venueId} and a.status = 'accepted')`,
    })
    .from(gigs)
    .limit(1);
  return res[0] ?? { live: 0, filled: 0, apps: 0, booked: 0 };
}

export async function getVenueGigs(venueId: number): Promise<GigRow[]> {
  const rows = await db
    .select({ gig: gigs, venue: venues, appCount: appCountSql })
    .from(gigs)
    .leftJoin(venues, eq(gigs.venueId, venues.id))
    .where(eq(gigs.venueId, venueId))
    .orderBy(desc(gigs.createdAt), asc(gigs.id));
  return rows.map((r) => ({ ...r, appCount: Number(r.appCount ?? 0) }));
}

export type AppRow = {
  application: typeof applications.$inferSelect;
  musician: typeof users.$inferSelect | null;
  gig: typeof gigs.$inferSelect | null;
};

export async function getApplicationsForVenue(venueId: number): Promise<AppRow[]> {
  const rows = await db
    .select({
      application: applications,
      musician: users,
      gig: gigs,
    })
    .from(applications)
    .innerJoin(users, eq(applications.musicianId, users.id))
    .innerJoin(gigs, eq(applications.gigId, gigs.id))
    .where(eq(gigs.venueId, venueId))
    .orderBy(desc(applications.createdAt), asc(applications.id));
  return rows;
}

export async function getApplicationsForGig(gigId: number): Promise<AppRow[]> {
  const rows = await db
    .select({ application: applications, musician: users, gig: gigs })
    .from(applications)
    .innerJoin(users, eq(applications.musicianId, users.id))
    .innerJoin(gigs, eq(applications.gigId, gigs.id))
    .where(eq(applications.gigId, gigId))
    .orderBy(desc(applications.createdAt), asc(applications.id));
  return rows;
}

export async function getMusicianApplications(musicianId: number): Promise<AppRow[]> {
  const rows = await db
    .select({ application: applications, musician: users, gig: gigs })
    .from(applications)
    .innerJoin(users, eq(applications.musicianId, users.id))
    .innerJoin(gigs, eq(applications.gigId, gigs.id))
    .where(eq(applications.musicianId, musicianId))
    .orderBy(desc(gigs.gigDate), asc(applications.id));
  return rows;
}

export async function getSavedGigIds(musicianId: number): Promise<number[]> {
  const rows = await db
    .select({ gigId: bookmarks.gigId })
    .from(bookmarks)
    .where(eq(bookmarks.musicianId, musicianId));
  return rows.map((r) => r.gigId);
}

export async function getSavedGigs(musicianId: number): Promise<GigRow[]> {
  const ids = await getSavedGigIds(musicianId);
  if (!ids.length) return [];
  const rows = await db
    .select({ gig: gigs, venue: venues, appCount: appCountSql })
    .from(gigs)
    .leftJoin(venues, eq(gigs.venueId, venues.id))
    .where(inArray(gigs.id, ids))
    .orderBy(asc(gigs.gigDate));
  return rows.map((r) => ({ ...r, appCount: Number(r.appCount ?? 0) }));
}

export async function getSpotlight() {
  const bookedSql = sql<number>`(select count(*)::int from applications a where a.musician_id = users.id and a.status = 'accepted')`;
  const rows = await db
    .select({
      musician: users,
      booked: bookedSql,
      applied: sql<number>`(select count(*)::int from applications a where a.musician_id = users.id)`,
    })
    .from(users)
    .where(sql`users.role = 'musician'`)
    .orderBy(desc(bookedSql), asc(users.id))
    .limit(4);
  return rows;
}

export async function getRecentVenues(limit = 6) {
  return db.select().from(venues).orderBy(asc(venues.name)).limit(limit);
}
