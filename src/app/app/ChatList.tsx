"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { chatHrefConstructor, toPusherKey } from "@/lib/utils";
import { pusherClient } from "@/lib/pusher";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { ToastAction } from "@/components/ui/toast";

interface ChatListProps {
  sessionId: string;
  chats: User[];
}

interface ExtendedMessage extends Message {
  senderName: string;
  senderImage: string;
}

export default function ChatList({ sessionId, chats }: ChatListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
  const [friends, setFriends] = useState<User[]>(chats);
  const { toast } = useToast();
  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`));
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

    const newFriendHandler = (newFriend: User) => {
      setFriends((prev) => [...prev, newFriend]);
    };

    const chatHandler = (message: ExtendedMessage) => {
      const shouldNotify =
        pathname !==
        `/app/chat/${chatHrefConstructor(sessionId, message.senderId)}`;

      if (!shouldNotify) return;

      toast({
        title: message.senderName,
        description:
          message.text.length > 15
            ? message.text.slice(0, 15) + "..."
            : message.text,
        action: (
          <ToastAction
            altText="Перейти к сообщению"
            onClick={() =>
              router.push(
                `/app/chat/${chatHrefConstructor(sessionId, message.senderId)}`
              )
            }
          >
            Открыть
          </ToastAction>
        ),
      });

      setUnseenMessages((prev) => [...prev, message]);
    };

    pusherClient.bind("new_message", chatHandler);
    pusherClient.bind("new_friend", newFriendHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`));
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));
      pusherClient.unbind("new_message", chatHandler);
      pusherClient.unbind("new_friend", newFriendHandler);
    };
  }, [pathname, toast, sessionId, router]);

  useEffect(() => {
    if (pathname?.includes("chat")) {
      setUnseenMessages((prev) => {
        return prev.filter((msg) => !pathname.includes(msg.senderId));
      });
    }
  }, [pathname]);

  return (
    <div className="space-y-1 max-h-64 overflow-y-auto scrollbar scrollbar-thumb-border scrollbar-thumb-rounded-full scrollbar-w-1">
      {friends.length > 0 ? (
        friends.sort().map((chat) => {
          const unseenMessagesCount = unseenMessages.filter((unseenMsg) => {
            return unseenMsg.senderId === chat.id;
          }).length;
          return (
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
              key={chat.id}
            >
              <Link
                href={`/app/chat/${chatHrefConstructor(sessionId, chat.id)}`}
                prefetch={false}
              >
                <Avatar className="mr-2 w-6 h-6">
                  <AvatarImage src={chat.image} />
                  <AvatarFallback>{chat.name?.substring(0, 2)}</AvatarFallback>
                </Avatar>
                {chat.name}
                {unseenMessagesCount > 0 && (
                  <Badge className="ml-2 px-2">{unseenMessagesCount}</Badge>
                )}
              </Link>
            </Button>
          );
        })
      ) : (
        <div className="px-4 py-2 text-muted-foreground text-sm">
          У вас пока нет чатов
        </div>
      )}
    </div>
  );
}
