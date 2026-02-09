// hooks/Chat/useChatSession.ts
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/app/hooks/Auth/useAuth";
import { getMessages } from "@/app/lib/message";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export function useChatSession() {
  const params = useParams();
  const { userId } = useAuth();
  
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const hasProcessedFirst = useRef(false);
  const isProcessingAI = useRef(false);

  // Load chat ID and messages
  useEffect(() => {
    if (params.id) {
      setChatId(params.id as string);
    }
  }, [params.id]);

  useEffect(() => {
    if (!chatId) return;

    getMessages(chatId).then(msgs => {
      console.log("Loaded messages:", msgs);
      setMessages(msgs);
    });
  }, [chatId]);

  // Process first message when chat loads
  useEffect(() => {
    if (!chatId || messages.length === 0 || hasProcessedFirst.current) return;
    
    // If there's only 1 message (the initial user message), process it
    if (messages.length === 1 && messages[0].sender === "user") {
      console.log("Processing first message:", messages[0].message);
      hasProcessedFirst.current = true;
      handleAIResponse(messages[0].message);
    }
  }, [chatId, messages]);

  const handleAIResponse = async (userMessage: string) => {
    if (!chatId || isProcessingAI.current) return;
    
    isProcessingAI.current = true;
    setIsLoading(true);
    setFailed(false);
    const streamingId = `temp-ai-${Date.now()}`;

    // Show loading indicator
    setMessages((prev) => [...prev, { 
      sender: "ai", 
      message: "...", 
      id: streamingId,
      created_at: new Date().toISOString()
    }]);

    try {
      const response = await fetch(`${backendUrl}/process-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          chat_id: chatId,
          language: 'en'
        }),
      });

      if (!response.ok) throw new Error('Failed to get AI response');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiMessage = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const token = line.slice(6);
              
              if (token === '[DONE]') {
                // Backend has saved the message with a real UUID
                // Reload messages to get the proper ID
                if (chatId) {
                  const updatedMessages = await getMessages(chatId);
                  setMessages(updatedMessages);
                }
                break;
              }

              if (token.startsWith('[ERROR:')) {
                throw new Error(token);
              }

              aiMessage += token;
              
              setMessages((prev) => {
                const withoutLoading = prev.filter(
                  m => !(m.message === "..." && m.id === streamingId)
                );
                
                const hasStreaming = withoutLoading.some(m => m.id === streamingId);
                if (hasStreaming) {
                  return withoutLoading.map(m => 
                    m.id === streamingId 
                      ? { ...m, message: aiMessage }
                      : m
                  );
                } else {
                  return [...withoutLoading, { 
                    sender: "ai", 
                    message: aiMessage, 
                    id: streamingId,
                    created_at: new Date().toISOString()
                  }];
                }
              });
            }
          }
        }
      }
    } catch (err) {
      console.error("AI response failed:", err);
      setFailed(true);
      setMessages((prev) => prev.filter((m) => m.id !== streamingId));
    } finally {
      setIsLoading(false);
      isProcessingAI.current = false;
    }
  };

  const handleSubmit = async (message: string) => {
    if (!message.trim() || !chatId || !userId || isLoading) return;

    const userMessage = message.trim();
    const tempId = `temp-user-${Date.now()}`;

    // Add temp message to UI immediately
    const tempMsg = {
      id: tempId,
      sender: "user",
      message: userMessage,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempMsg]);
    
    // Small delay for better UX
    await new Promise(r => setTimeout(r, 100));
    
    // Trigger AI response (backend will save user message)
    await handleAIResponse(userMessage);
  };

  return {
    chatId,
    messages,
    isLoading,
    failed,
    handleSubmit,
  };
}