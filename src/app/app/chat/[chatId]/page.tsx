import { getServerSession } from "next-auth/next";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { messageArrayValidator } from "@/lib/validations/message";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Messages from "../Messages";
import ChatInput from "../ChatInput";

const dynamic = "force-dynamic";
const revalidate = 0;

export const metadata: Metadata = {
  title: "Чат",
};

interface ChatProps {
  params: {
    chatId: string;
  };
}

async function getChatMessages(chatId: string) {
  try {
    const result: Message[] = await db.zrange(`chat:${chatId}:messages`, 0, -1);

    const reversedDbMessages = result.reverse();

    const messages = messageArrayValidator.parse(reversedDbMessages);

    return messages;
  } catch (error) {
    notFound();
  }
}

export default async function Chat({ params }: ChatProps) {
  const { chatId } = params;

  const session = await getServerSession(authOptions);

  const { user } = session!;

  const [userId1, userId2] = chatId.split("--");

  if (user.id !== userId1 && user.id !== userId2) {
    console.log(1);

    notFound();
  }

  const chatPartnerId = user.id === userId1 ? userId2 : userId1;
  const chatPartner = (await db.get(`user:${chatPartnerId}`)) as User;

  const initialMessages = await getChatMessages(chatId);

  return (
    <section className="w-full max-h-[calc(100%)] md:max-h-full h-full max-w-xl mx-auto flex flex-col">
      <div className="flex items-center px-4 py-6 lg:px-8 border-b">
        <Avatar className="h-9 w-9">
          <AvatarImage src={chatPartner.image} alt="Avatar" />
          <AvatarFallback>{chatPartner.name?.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">{chatPartner.name}</p>
          <p className="text-sm text-muted-foreground">{chatPartner.email}</p>
        </div>
      </div>
      <div className="px-4 py-6 lg:px-8 flex-1 border-b overflow-y-hidden">
        <Messages
          chatId={chatId}
          sessionId={session!.user.id}
          initialMessages={initialMessages}
        />
      </div>
      <div className="px-4 py-6 lg:px-8">
        <ChatInput chatId={chatId} chatPartner={chatPartner} />
      </div>
    </section>
  );
}
