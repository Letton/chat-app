"use client";

import { HTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
import { Loader2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface SignOutButtonProps extends ButtonProps {}

export default function SignOutButton({
  className,
  ...props
}: SignOutButtonProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <Button
      className={cn(className)}
      {...props}
      variant="outline"
      size="icon"
      onClick={async () => {
        setIsLoading(true);
        try {
          await signOut({
            callbackUrl: "/",
          });
        } catch (err) {
          console.error(err);
        } finally {
          setTimeout(() => {
            setIsLoading(false);
          }, 3000);
        }
      }}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
    </Button>
  );
}
