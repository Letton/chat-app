"use client";

import { useEffect, useState } from "react";
import { cn, toPusherKey } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
import { Inbox } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { pusherClient } from "@/lib/pusher";

interface ChatInvitesButtonProps extends ButtonProps {
  sessionId: string;
  initialUnseenRequestCount: number;
}

export default function ChatInvitesButton({
  className,
  sessionId,
  initialUnseenRequestCount,
  ...props
}: ChatInvitesButtonProps) {
  const [unseenRequestCount, setUnseenRequestCount] = useState<number>(
    initialUnseenRequestCount
  );

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_chat_requests`)
    );
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

    const chatRequestHandler = () => {
      setUnseenRequestCount((prev) => prev + 1);
    };

    const addedChatHandler = () => {
      setUnseenRequestCount((prev) => prev - 1);
    };

    pusherClient.bind("incoming_chat_requests", chatRequestHandler);
    pusherClient.bind("new_friend", addedChatHandler);
    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_chat_requests`)
      );
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));
      pusherClient.unbind("incoming_chat_requests", chatRequestHandler);
      pusherClient.unbind("new_friend", addedChatHandler);
    };
  }, [sessionId]);

  return (
    <Button
      variant="ghost"
      className={cn(className, "w-full justify-start")}
      {...props}
      asChild
    >
      <Link href="/app/requests" prefetch={false}>
        <Inbox className="mr-2 w-4 h-4" />
        Приглашения в чат
        {unseenRequestCount > 0 && (
          <Badge className="ml-2 px-2">{unseenRequestCount}</Badge>
        )}
      </Link>
    </Button>
  );
}
