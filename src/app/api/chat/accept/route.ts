import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id: idToAdd } = body;

    const session = await getServerSession(authOptions);

    if (!session) return new Response("Unauthorized", { status: 401 });

    const isAlreadyHaveChat = await db.sismember(
      `user:${session.user.id}:chats`,
      idToAdd
    );

    if (isAlreadyHaveChat)
      return new Response("Already added", { status: 400 });

    const hasChatRequest = await db.sismember(
      `user:${session.user.id}:incoming_chat_requests`,
      idToAdd
    );

    if (!hasChatRequest)
      return new Response("No chat request", { status: 400 });

    const [user, friend] = (await Promise.all([
      db.get(`user:${session.user.id}`),
      db.get(`user:${idToAdd}`),
    ])) as [User, User];

    await pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:friends`),
      "new_friend",
      user
    );

    await pusherServer.trigger(
      toPusherKey(`user:${session.user.id}:friends`),
      "new_friend",
      friend
    );

    await db.sadd(`user:${session.user.id}:chats`, idToAdd);

    await db.sadd(`user:${idToAdd}:chats`, session.user.id);

    await db.srem(`user:${session.user.id}:incoming_chat_requests`, idToAdd);

    return new Response("OK");
  } catch (error) {
    console.log(error);

    return new Response("Internal Server Error", { status: 500 });
  }
}
