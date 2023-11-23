import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { authOptions } from "@/lib/auth";
import { Inbox, MessageCircle, Plus } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import SignOutButton from "./SignOutButton";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) notFound();

  return (
    <>
      <main className="flex h-screen">
        <aside className="flex h-full w-full max-w-[16rem] flex-col border-r">
          <div className="py-4 flex flex-col justify-between h-full">
            <div className="space-y-4 ">
              <div className="px-3 py-2">
                <div className="px-4">
                  <Link href="/app" className="w-fit">
                    <MessageCircle className="w-8 h-8" />
                  </Link>
                </div>
              </div>
              <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                  Ваши чаты
                </h2>
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start truncate"
                  >
                    Some Username
                  </Button>
                </div>
              </div>
              <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                  Обзор
                </h2>
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start">
                    <Plus className="mr-2 w-4 h-4" />
                    Создать чат
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Inbox className="mr-2 w-4 h-4" />
                    Приглашения в чат
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-6 py-2">
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
        </aside>
        {children}
      </main>
      <Toaster />
    </>
  );
}
