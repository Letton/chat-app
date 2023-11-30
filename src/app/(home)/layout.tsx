import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="border-b">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <Link href="/" className="w-fit" prefetch={false}>
            <MessageCircle className="w-8 h-8" />
          </Link>
          <nav>
            <ul className="flex justify-between gap-4 items-center">
              <li>
                <Button variant="link" asChild>
                  <Link href="/faq">FAQ</Link>
                </Button>
              </li>
              <li>
                <Button asChild>
                  <Link href="/auth/signin">Вход</Link>
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="h-[calc(100vh-73px)]">{children}</main>
      <footer className="border-t">
        <div className="container mx-auto py-4 text-muted-foreground text-sm flex justify-between">
          <p>
            Обратная связь:{" "}
            <Link href="https://t.me/Letton" className="underline">
              @Letton
            </Link>
          </p>
          <p>©{new Date().getFullYear()} Все права защищены</p>
        </div>
      </footer>
    </>
  );
}
