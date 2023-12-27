import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { logs } from "./logs.js";
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').notNull(),
  deletedAt: timestamp('deleted_at'),
  discordUid: text('discord_uid').notNull().unique(),
  discordUsername: text('discord_username').notNull(),
  points: integer('points').notNull().default(0),
  nickName: text('nick_name'),
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(logs),
}));
