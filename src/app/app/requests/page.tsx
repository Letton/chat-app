import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import IncomingChatRequests from "./IncomingChatRequests";

export const metadata: Metadata = {
  title: "Приглашения в чат",
};

export default async function ChatRequsts() {
  const session = await getServerSession(authOptions);

  const incomingSenderIds = (await db.smembers(
    `user:${session!.user.id}:incoming_chat_requests`
  )) as string[];

  const incomingChatRequests = await Promise.all(
    incomingSenderIds.map(async (senderId) => {
      const sender = (await db.get(`user:${senderId}`)) as User;
      return {
        senderId,
        senderName: sender.name,
        senderEmail: sender.email,
        senderImage: sender.image,
      };
    })
  );

  return (
    <section className="w-full h-full px-4 py-6 lg:px-8 flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Приглашения в чат</CardTitle>
          <CardDescription>
            Примите приглашение в чат и начните общаться прямо сейчас ✨
          </CardDescription>
        </CardHeader>
        <CardContent>
          <IncomingChatRequests
            incomingChatRequests={incomingChatRequests}
            sessionId={session!.user.id}
          />
        </CardContent>
      </Card>
    </section>
  );
}
