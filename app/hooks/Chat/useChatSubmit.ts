import { useState } from "react";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function useChatSubmit(
  chatId: string | null,
  userId: string | null,
  isLoading: boolean,
  setMessages: React.Dispatch<React.SetStateAction<any[]>>,
  triggerAIResponse: (msg: string, chatId: string, setMessages: any) => Promise<void>,
  setFailed: (failed: boolean) => void
) {
  const handleSubmit = async (message: string) => {
    if (!message.trim() || !chatId || !userId || isLoading) return;

    const userMessage = message.trim();
    const tempId = `temp-user-${Date.now()}`;

    try {
      // Add temp message to UI
      const tempMsg = {
        id: tempId,
        sender: "user",
        message: userMessage,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, tempMsg]);
      
      // Send message to backend
      await fetch(`${backendUrl}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          chat_id: chatId, 
          message: userMessage 
        }),
      });

      await new Promise(r => setTimeout(r, 400));
      
      // Trigger AI response
      await triggerAIResponse(userMessage, chatId, setMessages);
    } catch (err) {
      console.error("Failed to send message:", err);
      setFailed(true);
      setMessages((prev) => prev.filter(m => m.id !== tempId));
    }
  };

  return { handleSubmit };
}