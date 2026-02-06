// hooks/Chat/useChatSession.ts
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/app/hooks/Auth/useAuth";
import useChatMessages from "@/app/hooks/Chat/useChatMessages";
import useAIResponse from "@/app/hooks/Chat/useAIResponse";
import useFirstMessage from "@/app/hooks/Chat/useFirstMessage";
import useChatSubmit from "@/app/hooks/Chat/useChatSubmit";

export function useChatSession() {
  const params = useParams();
  const { userId, isCheckingAuth } = useAuth();

  const [chatId, setChatId] = useState<string | null>(null);

  const { messages, setMessages, deduplicateMessages } =
    useChatMessages(chatId);

  const {
    isLoading,
    failed,
    setFailed,
    triggerAIResponse,
  } = useAIResponse();

  const { handleSubmit } = useChatSubmit(
    chatId,
    userId,
    isLoading,
    setMessages,
    triggerAIResponse,
    setFailed
  );

  useEffect(() => {
    if (params.id) {
      setChatId(params.id as string);
    }
  }, [params.id]);

  useFirstMessage(
    chatId,
    userId,
    !isCheckingAuth,
    triggerAIResponse,
    setMessages
  );

  return {
    chatId,
    messages,
    deduplicatedMessages: deduplicateMessages(messages),
    isLoading,
    failed,
    handleSubmit,
    isCheckingAuth,
  };
}
