import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AddChatForm from "./AddChatForm";

export const metadata: Metadata = {
  title: "Создать чат",
};

export default async function AddChat() {
  return (
    <section className="w-full h-full px-4 py-6 lg:px-8 flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Создать чат</CardTitle>
          <CardDescription>
            Укажите email пользователя, с которым хотите начать общаться
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddChatForm />
        </CardContent>
      </Card>
    </section>
  );
}
