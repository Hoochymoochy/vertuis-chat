"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import ChatBubble from "../../../../components/chat/bubble";
import Map from "../../../../components/chat/map";
import InputBox from "../../../../components/chat/inputbox";
import { useAuth } from "@/app/hooks/Auth/useAuth";
import useChatMessages from "@/app/hooks/Chat/useChatMessages";
import useAIResponse from "@/app/hooks/Chat/useAIResponse";
import useFirstMessage from "@/app/hooks/Chat/useFirstMessage";
import useChatSubmit from "@/app/hooks/Chat/useChatSubmit";

export default function ChatPage() {
  const t = useTranslations("ChatPage");
  const tChat = useTranslations("Chat");
  const params = useParams();
  const [chatId, setChatId] = useState<string | null>(null);
  const [openMap, setOpenMap] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { user, userId, isCheckingAuth } = useAuth();
  const { messages, setMessages, deduplicateMessages } = useChatMessages(chatId);
  const { isLoading, failed, setFailed, triggerAIResponse } = useAIResponse();
  const { handleSubmit } = useChatSubmit(
    chatId,
    userId,
    isLoading,
    setMessages,
    triggerAIResponse,
    setFailed
  );

  useEffect(() => {
    if (params.id) {
      setChatId(params.id as string);
    }
  }, [params.id]);

  useFirstMessage(
    chatId,
    userId,
    !isCheckingAuth,
    triggerAIResponse,
    setMessages
  );

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[url('/marble.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md"/>
        <motion.div 
          className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin relative z-10" 
        />
      </div>
    );
  }

  return (
    <div className="bg-[url('/marble.jpg')] bg-cover bg-center bg-no-repeat bg-fixed min-h-screen w-full flex flex-col px-4 py-6 relative">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md"/>
      <Map openMap={openMap} setOpenMap={setOpenMap} />

      <div className="relative flex justify-center items-center pt-6 pb-4">
        <h1 className="text-6xl lg:text-8xl font-serif font-bold tracking-tight drop-shadow-[0_0_25px_rgba(255,215,0,0.15)]">
          <span className="text-gradient">VERITUS</span>
        </h1>
      </div>

      <div className="relative grow flex flex-col items-center w-full pb-12">
        <div className="flex-1 min-h-0 w-full max-w-4xl mx-auto pt-4 pb-24 overflow-y-auto">
          <div className="space-y-4">
            {deduplicateMessages(messages).map((msg, index) => {
              const uniqueKey = msg.id ? `${msg.id}` : `msg-${index}-${msg.created_at}`;
              
              return (
                <motion.div
                  key={uniqueKey}
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
                      isStreaming={String(msg.id).startsWith('temp-ai-')}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {failed && (
          <div className="max-w-xs bg-red-500/20 border border-red-500/30 rounded-2xl px-4 py-3 mb-4">
            <p className="text-red-200 text-sm">
              {t("failedMessage")}
            </p>
          </div>
        )}

        <InputBox
          onSubmit={handleSubmit}
          isLoading={isLoading}
          disabled={false}
          placeholder={tChat("placeholder")}
          showFileUpload={false}
        />
      </div>
      
      <div ref={messagesEndRef} />
    </div>
  );
}