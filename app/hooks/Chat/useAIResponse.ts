import { useState, useRef } from "react";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function useAIResponse() {
  const [isLoading, setIsLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const isProcessingAI = useRef(false);

  const triggerAIResponse = async (
    msg: string,
    chatId: string,
    setMessages: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    if (isProcessingAI.current) return;
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
      const response = await fetch(`${backendUrl}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: msg,
          chat_id: chatId,
          language: 'en' // You may want to pass this as a parameter
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
                // Message is already saved by backend, just update UI
                setMessages((prev) => 
                  prev.map(m => 
                    m.id === streamingId 
                      ? { ...m, message: aiMessage }
                      : m
                  )
                );
                break;
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

  return { isLoading, failed, setFailed, triggerAIResponse };
}