import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id: idToDeny } = body;

    const session = await getServerSession(authOptions);

    if (!session) return new Response("Unauthorized", { status: 401 });

    await db.srem(`user:${session.user.id}:incoming_chat_requests`, idToDeny);

    return new Response("OK");
  } catch {
    return new Response("Internal Server Error", { status: 500 });
  }
}
