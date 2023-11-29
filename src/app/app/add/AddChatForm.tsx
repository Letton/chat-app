"use client";

import { HTMLAttributes, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addUserValidator } from "@/lib/validations/add-user";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";

interface AddChatForm extends HTMLAttributes<HTMLFormElement> {}

type FormData = z.infer<typeof addUserValidator>;

export default function AddChatForm({ className, ...props }: AddChatForm) {
  const { toast } = useToast();

  const [isAdded, setIsAdded] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addUserValidator),
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    if (errors?.email)
      toast({
        title: "Ошибка создания чата",
        description: errors.email?.message,
      });
    if (isAdded) {
      toast({
        title: "Приглашение отправлено",
        description:
          "Дождитесь, пока собеседник примет ваше приглашение и начните общаться ✨",
      });
    }
  }, [isAdded, errors.email, toast]);

  const addChat = async (email: string) => {
    try {
      await axios.post("/api/chat/add", {
        email,
      });
      setIsAdded(true);
    } catch (err) {
      if (err instanceof AxiosError)
        return setError("email", { message: err.response?.data });

      return setError("email", { message: "Something went wrong" });
    }
  };

  const onSubmit = (data: FormData) => {
    addChat(data.email);
  };

  return (
    <form
      className={cn(className)}
      {...props}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input type="email" placeholder="Email" {...register("email")} />
        <Button type="submit">Создать</Button>
      </div>
    </form>
  );
}
