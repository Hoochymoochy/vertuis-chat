import { useState } from "react";
import { useRouter } from "next/navigation";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function useInitialChat(userId: string | null) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const startChat = async (message: string, locale: string) => {
    if (!message.trim() || !userId || isLoading) return;

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
          sender: 'user', 
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

  return { isLoading, failed, startChat };
}