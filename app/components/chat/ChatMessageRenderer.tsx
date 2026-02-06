// components/chat/ChatMessageRenderer.tsx
import { motion } from "framer-motion";
import ChatBubble from "./bubble";

export function ChatMessageRenderer({ messages }: { messages: any[] }) {
  return (
    <div className="space-y-4">
      {messages.map((msg, index) => {
        const key = msg.id
          ? String(msg.id)
          : `msg-${index}-${msg.created_at}`;

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "user" ? (
              <div className="max-w-xs bg-gold/20 border border-gold/30 px-4 py-3 rounded-lg">
                <p className="text-white text-sm">{msg.message}</p>
              </div>
            ) : msg.message === "..." ? (
              <div className="max-w-xs bg-black/60 border border-gold/30 rounded-2xl px-4 py-3">
                <motion.p
                  className="text-gold text-sm"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ...
                </motion.p>
              </div>
            ) : (
              <ChatBubble
                id={msg.id}
                message={msg.message}
                isLast={index === messages.length - 1}
                isStreaming={String(msg.id).startsWith("temp-ai-")}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
