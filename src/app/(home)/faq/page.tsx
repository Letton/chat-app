import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "FAQ | FastChat",
};

export default async function FAQ() {
  return (
    <section className="flex items-center justify-center min-h-full container mx-auto overflow-x-hidden relative">
      <div className="w-full max-w-xl">
        <h1 className="text-xl font-bold tracking-tighter md:text-3xl mb-8">
          Часто задаваемые вопросы:
        </h1>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              Что нужно для того, чтобы начать пользоваться чатом?
            </AccordionTrigger>
            <AccordionContent>
              Ничего лишнего - требуется только аккаунт Google для
              аутентификации.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              На каком фреймворке построен чат?
            </AccordionTrigger>
            <AccordionContent>Чат разработан на Next.js.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Какова стабильность работы?</AccordionTrigger>
            <AccordionContent>
              Чат обладает высокой стабильностью и скоростью работы и благодаря
              использованию Next.js.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>
              Поддерживает ли чат обмен сообщениями в реальном времени?
            </AccordionTrigger>
            <AccordionContent>
              Да, чат поддерживает обмен сообщениями в реальном времени.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>
              Как начать чат с другим пользователем?
            </AccordionTrigger>
            <AccordionContent>
              Для начала чата необходимо отправить приглашение выбранному
              человеку, указам его email.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6">
            <AccordionTrigger>
              Есть ли у чата уведомления в реальном времени?
            </AccordionTrigger>
            <AccordionContent>
              Да, чат предоставляет уведомления в реальном времени.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-7">
            <AccordionTrigger>
              Поддерживается ли форматирование сообщений в чате?
            </AccordionTrigger>
            <AccordionContent>
              Да, чат поддерживает форматирование сообщений на основе MarkDown.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
