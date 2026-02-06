import { useCallback, useEffect, useState } from "react";
import { getAllChats } from "@/app/lib/chat";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useSidebar } from "../Global/SidebarContext";
import { useAuth } from "../Auth/useAuth";

export interface Chat {
  id: string;
  title: string;
}

export function useChats() {
  const { isCollapsed, toggleMapCollapse } = useSidebar();
  const { userId } = useAuth()
  const [state] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (userId) {
      getAllChats(userId).then(setChats);
      console.log("Chats:", chats);
    }
  }, [userId]);

  const newChat = useCallback(() => {
    router.push(`/${locale}/chat`);
  }, [router, locale]);

  const openChat = useCallback((id: string) => {
    router.push(`/${locale}/chat/${id}`);
  }, [router, locale]);

  return {
    isCollapsed,
    chats,
    newChat,
    openChat,
    toggleMapCollapse,
    state
  };
}