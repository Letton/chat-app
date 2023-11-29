import { db } from "@/lib/db";

export const getChatsByUserId = async (userId: string) => {
  const chatsIds = (await db.smembers(`user:${userId}:chats`)) as string[];

  const chat = await Promise.all(
    chatsIds.map(async (chatId) => {
      const chat = (await db.get(`user:${chatId}`)) as User;
      return chat;
    })
  );

  return chat;
};
