"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

interface ChatRequestsProps {
  incomingChatRequests: IncomingChatRequest[];
  sessionId: string;
}

export default function ChatRequests({
  incomingChatRequests,
  sessionId,
}: ChatRequestsProps) {
  const router = useRouter();

  const [chatRequests, setChatRequests] =
    useState<IncomingChatRequest[]>(incomingChatRequests);

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_chat_requests`)
    );

    const chatRequestHandler = (incomingChatRequest: IncomingChatRequest) => {
      if (incomingChatRequest.senderId !== sessionId)
        setChatRequests((prev) => [...prev, incomingChatRequest]);
    };

    pusherClient.bind("incoming_chat_requests", chatRequestHandler);
    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_chat_requests`)
      );
      pusherClient.unbind("incoming_chat_requests", chatRequestHandler);
    };
  }, [sessionId]);

  const acceptChat = async (senderId: string) => {
    await axios.post("/api/chat/accept", { id: senderId });
    setChatRequests((prev) =>
      prev.filter((request) => request.senderId !== senderId)
    );
  };

  const denyChat = async (senderId: string) => {
    await axios.post("/api/chat/deny", { id: senderId });
    setChatRequests((prev) =>
      prev.filter((request) => request.senderId !== senderId)
    );
  };

  return (
    <div className="space-y-8">
      {chatRequests.length === 0 ? (
        <p className="text-sm text-muted-foreground">Здесь пока пусто... </p>
      ) : (
        chatRequests.map((request) => (
          <div className="flex items-center" key={request.senderId}>
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={request.senderImage as string | undefined}
                alt="Avatar"
              />
              <AvatarFallback>
                {request.senderName?.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none max-w-[120px]  truncate">
                {request.senderName}
              </p>
              <p className="text-sm text-muted-foreground max-w-[120px]  truncate">
                {request.senderEmail}
              </p>
            </div>
            <div className="ml-auto">
              <Button
                size="icon"
                className="mr-2"
                onClick={() => acceptChat(request.senderId)}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => denyChat(request.senderId)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
