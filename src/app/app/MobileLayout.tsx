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
import { Session } from "next-auth";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Menu, MessageCircle, Plus } from "lucide-react";
import SignOutButton from "./SignOutButton";
import ChangeThemeButton from "./ChangeThemeButton";
import ChatInvitesButton from "./ChatInvitesButton";
import ChatList from "./ChatList";

interface MobileLayoutProps {
  chats: User[];
  session: Session;
  unseenRequestCount: number;
}

export default function MobileLayout({
  chats,
  session,
  unseenRequestCount,
}: MobileLayoutProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="md:hidden border-b">
      <div className="container mx-auto py-6 flex justify-between items-center">
        <Link href="/app" className="w-fit" prefetch={false}>
          <MessageCircle className="w-8 h-8" />
        </Link>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu className="w-6 h-6"></Menu>
        </Button>
      </div>

      <Sheet open={isOpen} onOpenChange={() => setIsOpen(!setIsOpen)}>
        <SheetContent side="left" className="px-0">
          <SheetHeader>
            <SheetTitle>FastChat</SheetTitle>
          </SheetHeader>
          <div className="py-4 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="px-1 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                  Ваши чаты
                </h2>
                <ChatList sessionId={session.user.id} chats={chats} />
              </div>
              <div className="px-1 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                  Обзор
                </h2>
                <div className="space-y-1">
                  <ChatInvitesButton
                    sessionId={session.user.id}
                    initialUnseenRequestCount={unseenRequestCount}
                  />
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/app/add">
                      <Plus className="mr-2 w-4 h-4" />
                      Создать чат
                    </Link>
                  </Button>
                  <ChangeThemeButton />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={session.user.image as string | undefined} />
                  <AvatarFallback>
                    {session.user.name?.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none max-w-[100px] truncate">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-muted-foreground max-w-[100px] truncate">
                    {session.user.email}
                  </p>
                </div>
              </div>
              <SignOutButton className="w-8 h-8" />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
