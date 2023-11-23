import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";

export default async function Home() {
  await db.set("hello", "hello");

  return (
    <main className="flex justify-around items-center h-screen">
      <Button>Button</Button>
      <form
        action={async () => {
          "use server";
        }}
      >
        <Button>Sign In</Button>
      </form>
    </main>
  );
}
