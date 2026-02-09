import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export function useChatInit(userId: string) {
  const locale = useLocale();
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleSubmit = async (message: string) => {
    if (!message.trim() || !userId || isLoading) return;

    setIsSubmitted(true);
    setIsLoading(true);
    setFailed(false);

    try {
      const healthRes = await fetch(`${backendUrl}/health`);
      const { status } = await healthRes.json();
      if (status !== "ok") throw new Error("Backend not ready");

      // Create chat via backend
      const response = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, title: message.slice(0, 50) }),
      });

      if (!response.ok) throw new Error("Failed to create chat");
      
      const { id } = await response.json();
      
      // Add user message
      await fetch(`${backendUrl}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          chat_id: id, 
          message: message 
        }),
      });
      
      router.push(`/${locale}/chat/${id}`);
    } catch (err) {
      console.error("Failed to start chat:", err);
      setFailed(true);
      setIsLoading(false);
    }
  };

  return {
    isSubmitted,
    isLoading,
    failed,
    handleSubmit,
  };
}