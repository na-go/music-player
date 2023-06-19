import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const tracks = sqliteTable('tracks', {
  id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
  name: text('name').notNull(),
  url: text('url').notNull(),
}, (track) => ({
  nameIdx: uniqueIndex('nameIdx').on(track.name),
  urlIdx: uniqueIndex('urlIdx').on(track.url),
}))
