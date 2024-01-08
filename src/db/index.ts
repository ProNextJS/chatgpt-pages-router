import { drizzle } from "drizzle-orm/node-postgres";
import { eq, desc } from "drizzle-orm";

import { Client } from "pg";

import { chats, messages, chatRelations, messageRelations } from "./schema";

const client = new Client({
  connectionString: process.env.DB_URL!,
});

const connection = drizzle(client, {
  schema: { chats, messages, chatRelations, messageRelations },
});

client.connect();

export async function getChat(chatId: number) {
  const chat = await connection.query.chats.findFirst({
    where: eq(chats.id, chatId),
  });
  if (!chat) {
    return null;
  }
  const msgs = await connection.query.messages.findMany({
    where: eq(messages.chatId, chatId),
  });
  return {
    ...chat,
    messages: msgs.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    })),
  };
}

export async function getChats(userEmail: string) {
  return await connection.query.chats.findMany({
    where: eq(chats.userEmail, userEmail),
  });
}

export async function getChatsWithMessages(userEmail: string) {
  return await connection.query.chats.findMany({
    where: eq(chats.userEmail, userEmail),
    limit: 3,
    orderBy: desc(chats.timestamp),
    with: {
      messages: true,
    },
  });
}

export async function getMessages(chatId: number) {
  return await connection.query.messages.findMany({
    where: eq(chats.id, chatId),
  });
}

export async function createChat(
  userEmail: string,
  name: string,
  msgs: {
    role: string;
    content: string;
  }[]
) {
  const chat = await connection
    .insert(chats)
    .values({ name, userEmail })
    .onConflictDoNothing()
    .returning({ insertedId: chats.id });

  for (const msg of msgs) {
    await connection
      .insert(messages)
      .values({ ...msg, chatId: chat[0].insertedId })
      .execute();
  }

  return chat[0].insertedId;
}

export async function updateChat(
  chatId: number,
  msgs: {
    role: string;
    content: string;
  }[]
) {
  await connection
    .delete(messages)
    .where(eq(messages.chatId, chatId))
    .execute();

  for (const msg of msgs) {
    await connection
      .insert(messages)
      .values({ ...msg, chatId })
      .execute();
  }
}
