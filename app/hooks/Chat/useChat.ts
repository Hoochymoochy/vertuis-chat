import { useCallback, useEffect, useState } from "react";
import { getAllChat } from "@/app/lib/chat";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export interface Chat {
  id: string;
  title: string;
}

export function useChats(userId: string | null) {
  const [chats, setChats] = useState<Chat[]>([]);
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (!userId) return;
    getAllChat(userId).then(setChats);
  }, [userId]);


  return {
    chats,
    newChat: () => router.push(`/${locale}/chat`),
    openChat: (id: string) =>
      router.push(`/${locale}/chat/${id}`),
  };
}
