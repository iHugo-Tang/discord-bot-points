import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';

export const logs = pgTable('logs', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').notNull(),
  deletedAt: timestamp('deleted_at'),
  desc: text('desc').notNull().default(''),
  type: integer('type').notNull().default(1),
  points: integer('points').notNull().default(0),
  uid: integer('uid'),
});

export const logsRelations = relations(logs, ({ one }) => ({
  user: one(users, {
    fields: [logs.uid],
    references: [users.id],
  }),
}));
