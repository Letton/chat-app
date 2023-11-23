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
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[350px]">
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
    </div>
  );
}
