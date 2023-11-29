import { getServerSession } from "next-auth/next";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getChatsByUserId } from "@/helpers/get-chats-by-user-id";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import { chatHrefConstructor } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Главная | FastChat",
};

export default async function ApplicationPage() {
  const session = await getServerSession(authOptions);

  if (!session) notFound();

  const chats = await getChatsByUserId(session.user.id);

  const chatsWithLastMessageUnsorted = await Promise.all(
    chats.map(async (chat) => {
      const [lastMessage] = (await db.zrange(
        `chat:${chatHrefConstructor(session.user.id, chat.id)}:messages`,
        -1,
        -1
      )) as Message[];

      return {
        ...chat,
        lastMessage,
      };
    })
  );

  const chatsWithLastMessage = chatsWithLastMessageUnsorted
    .sort(
      (a, b) =>
        parseInt(b.lastMessage.timestamp) - parseInt(a.lastMessage.timestamp)
    )
    .slice(0, 3);

  return (
    <section className="w-full h-full px-4 py-6 lg:px-8 flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Недавние чаты</CardTitle>
          <CardDescription>Список ваших недавних чатов</CardDescription>
        </CardHeader>
        <CardContent>
          {chatsWithLastMessage.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Здесь пока пусто...{" "}
            </p>
          ) : (
            <div className="space-y-2">
              {chatsWithLastMessage.map((chat) => (
                <Button
                  variant="outline"
                  key={chat.id}
                  className="w-full h-auto p-4"
                  asChild
                >
                  <Link
                    href={`/app/chat/${chatHrefConstructor(
                      session.user.id,
                      chat.id
                    )}`}
                    prefetch={false}
                    className="w-full flex justify-between items-center"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={chat.image} alt="Avatar" />
                          <AvatarFallback>
                            {chat.name?.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {chat.name}
                          </p>
                          <div className="text-muted-foreground text-sm">
                            <span className="font-bold">
                              {chat.lastMessage.senderId === session.user.id
                                ? "Вы: "
                                : chat.name + ": "}
                            </span>
                            {chat.lastMessage.text.length > 20
                              ? chat.lastMessage.text.slice(0, 20) + "..."
                              : chat.lastMessage.text}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <ChevronRight />
                    </div>
                  </Link>
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
