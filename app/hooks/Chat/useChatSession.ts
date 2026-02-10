"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/app/hooks/Auth/useAuth";
import { getMessages } from "@/app/lib/message";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

type ChatMessage = {
  id: string;
  sender: "user" | "ai";
  message: string;
  created_at: string;
};

export function useChatSession() {
  const params = useParams();
  const { userId } = useAuth();

  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const isProcessingAI = useRef(false);
  const hasTriggeredFirstAI = useRef(false);

  /* ---------------------------------------------
   * Load chat id from route
   * -------------------------------------------*/
  useEffect(() => {
    if (params.id) {
      setChatId(params.id as string);
    }
  }, [params.id]);

  /* ---------------------------------------------
   * Load messages when chat changes
   * -------------------------------------------*/
  useEffect(() => {
    if (!chatId) return;

    getMessages(chatId)
      .then(setMessages)
      .catch(err => {
        console.error("Failed to load messages:", err);
      });
  }, [chatId]);

  /* ---------------------------------------------
   * Auto-trigger AI response for first message
   * -------------------------------------------*/
  useEffect(() => {
    if (
      chatId &&
      messages.length === 1 &&
      messages[0].sender === "user" &&
      !hasTriggeredFirstAI.current &&
      !isProcessingAI.current
    ) {
      hasTriggeredFirstAI.current = true;
      handleAIResponse(messages[0].message);
    }
  }, [chatId, messages]);

  /* ---------------------------------------------
   * Save user message
   * -------------------------------------------*/
  const saveMessage = async (message: string, chatId: string) => {
    const res = await fetch(`${backendUrl}/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to save message");
    }

    return res.json();
  };

  /* ---------------------------------------------
   * Stream AI response
   * -------------------------------------------*/
  const handleAIResponse = async (userMessage: string) => {
    if (!chatId || isProcessingAI.current) return;

    isProcessingAI.current = true;
    setIsLoading(true);
    setFailed(false);

    const streamingId = `temp-ai-${Date.now()}`;
    let aiMessage = "";

    // AI loading placeholder
    setMessages(prev => [
      ...prev,
      {
        id: streamingId,
        sender: "ai",
        message: "...",
        created_at: new Date().toISOString(),
      },
    ]);

    try {
      const res = await fetch(`${backendUrl}/process-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          message: userMessage,
          language: "en",
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error("AI response failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;

          const token = line.replace("data: ", "");

          if (token === "[DONE]") {
            break;
          }

          if (token.startsWith("[ERROR")) {
            throw new Error(token);
          }

          aiMessage += token;

          setMessages(prev =>
            prev.map(m =>
              m.id === streamingId
                ? { ...m, message: aiMessage }
                : m
            )
          );
        }
      }
    } catch (err) {
      console.error("AI streaming failed:", err);
      setFailed(true);
      setMessages(prev => prev.filter(m => m.id !== streamingId));
    } finally {
      isProcessingAI.current = false;
      setIsLoading(false);

      if (chatId) {
        const updated = await getMessages(chatId);
        setMessages(updated);
      }
    }
  };

  /* ---------------------------------------------
   * Handle user submit
   * -------------------------------------------*/
  const handleSubmit = async (message: string) => {
    if (!message.trim() || !chatId || !userId || isLoading) return;

    const userMessage = message.trim();
    const tempId = `temp-user-${Date.now()}`;

    // optimistic user message
    setMessages(prev => [
      ...prev,
      {
        id: tempId,
        sender: "user",
        message: userMessage,
        created_at: new Date().toISOString(),
      },
    ]);

    try {
      await saveMessage(userMessage, chatId);

      const updated = await getMessages(chatId);
      setMessages(updated);

      await handleAIResponse(userMessage);
    } catch (err) {
      console.error("Message submit failed:", err);
      setMessages(prev => prev.filter(m => m.id !== tempId));
    }
  };

  return {
    chatId,
    messages,
    isLoading,
    failed,
    handleSubmit,
  };
}