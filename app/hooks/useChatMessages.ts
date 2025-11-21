import { useEffect, useState, useRef } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { getAllMessage } from "@/app/lib/chat";

export default function useChatMessages(chatId: string | null) {
  const [messages, setMessages] = useState<any[]>([]);
  const hasLoadedInitial = useRef(false);

  const deduplicateMessages = (msgs: any[]) => {
    const seen = new Set();
    return msgs.filter(msg => {
      if (seen.has(msg.id)) return false;
      seen.add(msg.id);
      return true;
    }).sort((a, b) => 
      new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
    );
  };

  useEffect(() => {
    if (!chatId) return;

    if (!hasLoadedInitial.current) {
      getAllMessage(chatId).then(msgs => {
        setMessages(deduplicateMessages(msgs || []));
        hasLoadedInitial.current = true;
      });
    }

    const channel = supabase
      .channel(`chat_${chatId}`)
      .on(
        "postgres_changes",
        { 
          event: "INSERT",
          schema: "public", 
          table: "messages", 
          filter: `chat_id=eq.${chatId}` 
        },
        (payload) => {
          const newMsg = {
            id: payload.new.id,
            sender: payload.new.sender,
            message: payload.new.message,
            created_at: payload.new.created_at,
            file_path: payload.new.file_path,
            file_name: payload.new.file_name
          };

          setMessages((prev) => {
            const existingIndex = prev.findIndex(m => m.id === newMsg.id);
            if (existingIndex !== -1) return prev;
            
            const filtered = prev.filter(m => {
              const isTemp = String(m.id).startsWith('temp-');
              if (!isTemp) return true;
              
              const matchesContent = m.message === newMsg.message;
              const matchesSender = m.sender === newMsg.sender;
              return !(matchesContent && matchesSender);
            });
            
            const updated = [...filtered, newMsg];
            return deduplicateMessages(updated);
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  return { messages, setMessages, deduplicateMessages };
}