import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email: emailToAdd } = body;

    const dbResponse = await db.get(`user:email:${emailToAdd}`);

    const idToAdd = dbResponse;

    if (!idToAdd) {
      return new Response("Пользователь не найден", { status: 400 });
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (idToAdd === session.user.id) {
      return new Response("Вы не можете добавить чат с самим собой", {
        status: 400,
      });
    }

    const isAlredyAddedFirstToSecond = await db.sismember(
      `user:${idToAdd}:incoming_chat_requests`,
      session.user.id
    );

    if (isAlredyAddedFirstToSecond) {
      return new Response("Чат уже существует", { status: 400 });
    }

    const isAlredyAddedSecondToFirst = await db.sismember(
      `user:${session.user.id}:chats`,
      idToAdd
    );

    if (isAlredyAddedSecondToFirst) {
      return new Response("Чат уже существует", { status: 400 });
    }

    pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:incoming_chat_requests`),
      "incoming_chat_requests",
      {
        senderId: session.user.id,
        senderEmail: session.user.email,
        senderName: session.user.name,
        senderImage: session.user.image,
      }
    );

    db.sadd(`user:${idToAdd}:incoming_chat_requests`, session.user.id);

    return new Response("OK");
  } catch {
    return new Response("Internal Server Error", { status: 500 });
  }
}
