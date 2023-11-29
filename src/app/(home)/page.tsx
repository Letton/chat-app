import { Button } from "@/components/ui/button";
import { MessagesSquare } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  return (
    <section className="flex items-center justify-center h-full container mx-auto overflow-x-hidden relative">
      <div className="absolute -z-50 top-[10%] left-[50%] w-[450px] h-[350px] blur-3xl rotate-45 bg-white opacity-10 rounded-full" />
      <div className="absolute -z-50 top-[55%] left-[5%] sm:left-[25%] w-[350px] h-[150px] blur-3xl -rotate-12 bg-white opacity-10 rounded-full" />
      <div className="space-y-6">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1] max-w-xl text-center mx-auto">
          FastChat - Скорость и Безопасность в Каждом Сообщении
        </h1>
        <p className="text-md text-muted-foreground sm:text-xl text-center mx-auto max-w-[750px]">
          Быстро, безопасно, без ограничений. Все что вам нужно - это аккаунт
          Google, для того, чтобы аунтефицироваться. Регистрация не требуется.
        </p>
        <div className="mx-auto flex justify-center gap-6 flex-col sm:flex-row">
          <Button asChild className="font-bold">
            <Link href="/app">
              <MessagesSquare className="mr-2" />
              Начать общение
            </Link>
          </Button>
          <Button variant="outline" asChild className="font-bold">
            <Link href="/faq">Узнать подробнее</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
