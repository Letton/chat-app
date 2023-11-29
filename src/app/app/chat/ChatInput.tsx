"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2, SendHorizontal } from "lucide-react";
import { useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface ChatInputProps {
  chatId: string;
  chatPartner: User;
}

export default function ChatInput({ chatId }: ChatInputProps) {
  const [input, setInput] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    if (!input) return;

    setIsLoading(true);

    try {
      await axios.post("/api/message/send", { text: input, chatId });
      setInput("");
      textareaRef.current?.focus();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center">
      <TextareaAutosize
        className="resize-none flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        maxRows={5}
        ref={textareaRef}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button size="icon" className="ml-2 h-[38px] " disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <SendHorizontal className="h-4 w-4" onClick={sendMessage} />
        )}
      </Button>
    </div>
  );
}
