// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
  bigint,
  mysqlTableCreator,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `listen-to_${name}`);

//export const posts = mysqlTable(
//  "post",
//  {
//    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
//    name: varchar("name", { length: 256 }),
//    createdAt: timestamp("created_at")
//      .default(sql`CURRENT_TIMESTAMP`)
//      .notNull(),
//    updatedAt: timestamp("updatedAt").onUpdateNow(),
//  },
//  (example) => ({
//    nameIndex: index("name_idx").on(example.name),
//  })
//);

export const users = mysqlTable(
    "users",
    {
        id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
        userSlug: varchar("userSlug", { length: 256 }).notNull(),
        playlistId: varchar("playlistId", {length:256}).notNull()
    }
)

export const pendingSong = mysqlTable(
    "pending-add",
    {
        id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
        userSlug: varchar("userSlug", { length: 256 }).notNull(),
        songURI: varchar("songURI", { length: 256 }).notNull()
    }
)


export const inList = mysqlTable(
    "in-list",
    {
        id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
        userSlug: varchar("userSlug", { length: 256 }).notNull(),
        songURI: varchar("songURI", { length: 256 }).notNull()
    }
)

export const likedSongs = mysqlTable(
    "liked-songs",
    {
        id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
        userSlug: varchar("userSlug", { length: 256 }).notNull(),
        songURI: varchar("songURI", { length: 256 }).notNull()
    }
)

export const dislikedSongs = mysqlTable(
    "disliked-songs",
    {
        id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
        userSlug: varchar("userSlug", { length: 256 }).notNull(),
        songURI: varchar("songURI", { length: 256 }).notNull()
    }
)

export const unjudgedSongs= mysqlTable(
    "unjudged-songs",
    {
        id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
        userSlug: varchar("userSlug", { length: 256 }).notNull(),
        songURI: varchar("songURI", { length: 256 }).notNull()
    }
)
