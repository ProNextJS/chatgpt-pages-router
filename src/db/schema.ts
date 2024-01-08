import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  userEmail: varchar("userEmail", { length: 255 }).notNull(),
  name: text("name").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const chatRelations = relations(chats, ({ many }) => ({
  messages: many(messages),
}));

export type Chat = typeof chats.$inferSelect;

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chatId")
    .references(() => chats.id)
    .notNull(),
  role: varchar("role", { length: 32 }).notNull(),
  content: text("content").notNull(),
});

export const messageRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
}));

export type Message = typeof messages.$inferSelect;
