import { useState, useRef } from "react";
import question from "@/app/lib/question";
import { uploadFileSSE } from "@/app/lib/file-upload";
import { addMessage, getPublicUrl } from "@/app/lib/chat";

export default function useAIResponse() {
  const [isLoading, setIsLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const isProcessingAI = useRef(false);

  const triggerAIResponse = async (
    msg: string,
    chatId: string,
    userId: string,
    setMessages: React.Dispatch<React.SetStateAction<any[]>>,
    filePath?: string | null,
    fileName?: string | null
  ) => {
    if (isProcessingAI.current) return;
    isProcessingAI.current = true;
    
    setIsLoading(true);
    setFailed(false);
    let aiMessage = "";
    const streamingId = `temp-ai-${Date.now()}`;

    // Show loading indicator
    setMessages((prev) => [...prev, { 
      sender: "ai", 
      message: "...", 
      id: streamingId,
      created_at: new Date().toISOString()
    }]);

    try {
      const handleToken = (token: string) => {
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
      };

      if (filePath && fileName) {
        const fileUrl = await getPublicUrl(filePath);
        const downloadRes = await fetch(fileUrl);
        const blob = await downloadRes.blob();
        const file = new File([blob], fileName, { type: blob.type });
        await uploadFileSSE(file, userId, "en", handleToken);
      } else {
        await question(msg, chatId, handleToken);
      }

      await addMessage(chatId, "ai", aiMessage);
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