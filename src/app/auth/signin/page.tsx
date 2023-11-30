import Link from "next/link";
import UserAuthForm from "./UserAuthForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Аунтефикация | FastChat",
  description: "Войдите в приложение, используя аккаунт Google",
};

export default function AuthenticationPage() {
  return (
    <main>
      <div className="container h-screen flex items-center justify-center">
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col space-y-6 max-w-sm">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Вход в аккаунт
              </h1>
              <p className="text-sm text-muted-foreground">
                Войдите с помощью Google, чтобы начать пользоваться сервисом
              </p>
            </div>
            <UserAuthForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              Нажимая Sign In, вы соглашаетесь с нашими{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                условиями использования
              </Link>{" "}
              и{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                политикой конфиденциальности
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
