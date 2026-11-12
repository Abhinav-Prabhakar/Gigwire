import {
  boolean,
  date,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: text("role").notNull().default("musician"), // musician | venue
    city: text("city"),
    state: text("state"),
    headline: text("headline"),
    bio: text("bio"),
    instruments: text("instruments").array().notNull().default([]),
    genres: text("genres").array().notNull().default([]),
    links: text("links"),
    avatarUrl: text("avatar_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("users_email_idx").on(t.email)],
);

export const venues = pgTable("venues", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  tagline: text("tagline"),
  description: text("description"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  capacity: integer("capacity"),
  genres: text("genres").array().notNull().default([]),
  coverUrl: text("cover_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const gigs = pgTable("gigs", {
  id: serial("id").primaryKey(),
  venueId: integer("venue_id")
    .notNull()
    .references(() => venues.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  requirements: text("requirements"),
  gigDate: date("gig_date").notNull(),
  startTime: text("start_time"),
  endTime: text("end_time"),
  payAmount: integer("pay_amount").notNull().default(300),
  payUnit: text("pay_unit").notNull().default("flat"), // flat | hour | set
  payNote: text("pay_note"),
  setsCount: integer("sets_count").notNull().default(2),
  gigType: text("gig_type").notNull().default("one_off"), // one_off | residency | sub | opener
  genres: text("genres").array().notNull().default([]),
  lineupNeeded: text("lineup_needed").array().notNull().default([]),
  experience: text("experience").notNull().default("any"), // any | pro | beginner_ok
  backline: boolean("backline").notNull().default(false),
  meals: boolean("meals").notNull().default(false),
  tips: boolean("tips").notNull().default(false),
  soundEngineer: boolean("sound_engineer").notNull().default(false),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  status: text("status").notNull().default("open"), // open | interviewing | filled | closed
  featured: boolean("featured").notNull().default(false),
  spots: integer("spots").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const applications = pgTable(
  "applications",
  {
    id: serial("id").primaryKey(),
    gigId: integer("gig_id")
      .notNull()
      .references(() => gigs.id, { onDelete: "cascade" }),
    musicianId: integer("musician_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    pitch: text("pitch"),
    lineup: text("lineup"),
    links: text("links"),
    status: text("status").notNull().default("pending"), // pending | viewed | accepted | declined | withdrawn
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("applications_gig_musician_idx").on(t.gigId, t.musicianId)],
);

export const bookmarks = pgTable(
  "bookmarks",
  {
    id: serial("id").primaryKey(),
    musicianId: integer("musician_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    gigId: integer("gig_id")
      .notNull()
      .references(() => gigs.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("bookmarks_musician_gig_idx").on(t.musicianId, t.gigId)],
);

export type User = typeof users.$inferSelect;
export type Venue = typeof venues.$inferSelect;
export type Gig = typeof gigs.$inferSelect;
export type Application = typeof applications.$inferSelect;
