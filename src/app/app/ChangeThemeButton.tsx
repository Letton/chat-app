"use client";

import { useEffect, useState } from "react";
import { cn, toPusherKey } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
import { Inbox, Moon, Sun } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { pusherClient } from "@/lib/pusher";
import { useTheme } from "next-themes";

interface ChangeThemeButtonProps extends ButtonProps {}

export default function ChangeThemeButton({
  className,
  ...props
}: ChangeThemeButtonProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <Button
      variant="ghost"
      className={cn(className, "w-full justify-start")}
      {...props}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Moon className="mr-2 w-4 h-4" />
      ) : (
        <Sun className="mr-2 w-4 h-4" />
      )}
      Сменить тему
    </Button>
  );
}
