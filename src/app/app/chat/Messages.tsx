"use client";

import { cn, toPusherKey } from "@/lib/utils";
import { Message } from "@/lib/validations/message";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { pusherClient } from "@/lib/pusher";

interface MessagesProps {
  initialMessages: Message[];
  sessionId: string;
  chatId: string;
}

export default function Messages({
  initialMessages,
  sessionId,
  chatId,
}: MessagesProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`chat:${chatId}`));

    const messageHandler = (message: Message) => {
      console.log(message);

      setMessages((prev) => [message, ...prev]);
    };

    pusherClient.bind("incoming_message", messageHandler);
    return () => {
      pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`));
      pusherClient.unbind("incoming_message", messageHandler);
    };
  }, [sessionId, chatId]);

  const scrollDownRef = useRef<HTMLDivElement | null>(null);

  const formatTimeStamp = (timestamp: number) => format(timestamp, "HH:mm");

  return (
    <div id="messages" className="h-full">
      <div className="-mr-1 flex flex-col-reverse h-full gap-2 overflow-y-auto scrollbar scrollbar-thumb-border scrollbar-thumb-rounded-full scrollbar-w-1">
        <div ref={scrollDownRef} className="hidden"></div>
        {messages.map((message, index) => {
          const isCurrentUser = message.senderId === sessionId;

          const hasNextMessageFromSameUser =
            messages[index - 1]?.senderId === messages[index].senderId;

          return (
            <div
              className="chat-message mr-1"
              key={`${message.id}-${message.timestamp}`}
            >
              <div
                className={cn("flex items-end", {
                  "justify-end": isCurrentUser,
                })}
              >
                <div
                  className={cn(
                    "max-w-xs px-4 py-2 rounded-lg text-sm font-medium flex items-end",
                    {
                      "bg-primary text-primary-foreground": isCurrentUser,
                      "bg-secondary text-secondary-foreground": !isCurrentUser,
                      "rounded-br-none":
                        !hasNextMessageFromSameUser && isCurrentUser,
                      "rounded-bl-none":
                        !hasNextMessageFromSameUser && !isCurrentUser,
                    }
                  )}
                >
                  <span className="break-all">{message.text}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {formatTimeStamp(message.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
