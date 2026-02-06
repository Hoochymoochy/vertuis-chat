import { useState } from "react";
import { useLocale } from "next-intl";
import useInitialChat from "@/app/hooks/Chat/useInitialChat";

export function useChatController(userId: string) {
  const locale = useLocale();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { isLoading, failed, startChat } = useInitialChat(userId);

  const handleSubmit = async (message: string) => {
    setIsSubmitted(true);
    await startChat(message, locale);
  };

  return {
    isSubmitted,
    isLoading,
    failed,
    handleSubmit,
  };
}
