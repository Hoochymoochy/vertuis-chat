import { useEffect, useRef } from "react";
import { getChatLength, getLatestMessage, getAllMessage } from "@/app/lib/chat";

export default function useFirstMessage(
  chatId: string | null,
  userId: string | null,
  isInitialized: boolean,
  triggerAIResponse: (msg: string, chatId: string, userId: string, setMessages: any, filePath?: string | null, fileName?: string | null) => Promise<void>,
  setMessages: React.Dispatch<React.SetStateAction<any[]>>
) {
  const hasProcessedFirstMessage = useRef(false);

  useEffect(() => {
    if (!chatId || !userId || !isInitialized || hasProcessedFirstMessage.current) return;

    const initChat = async () => {
      hasProcessedFirstMessage.current = true;
      const length = await getChatLength(chatId);
            
      if (length >= 1) {
        const firstMessage = await getLatestMessage(chatId);

        if (firstMessage && firstMessage.sender === 'user') {
          const allMessages = await getAllMessage(chatId);
          const hasAIResponse = allMessages.some(
            m => m.sender === 'ai' && 
            new Date(m.created_at).getTime() > new Date(firstMessage.created_at).getTime()
          );
          
          if (!hasAIResponse) {
            await triggerAIResponse(
              firstMessage.message, 
              chatId,
              userId,
              setMessages,
              firstMessage.file_path,
              firstMessage.file_name
            );
          }
        }
      }
    };
    
    initChat();
  }, [chatId, userId, isInitialized, triggerAIResponse, setMessages]);
}