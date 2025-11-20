"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import ChatBubble from "@/app/component/bubble";
import Side from "@/app/component/side";
import Map from "@/app/component/map";
import InputBox from "@/app/component/inputbox";
import useAuth  from "@/app/hooks/useAuth";
import useChatMessages from "@/app/hooks/useChatMessages";
import useAIResponse from "@/app/hooks/useAIResponse";
import useFirstMessage from "@/app/hooks/useFirstMessage";
import useChatSubmit from "@/app/hooks/useChatSubmit";

export default function ChatPage() {
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

  // Initialize chat ID from params
  useEffect(() => {
    if (params.id) {
      setChatId(params.id as string);
    }
  }, [params.id]);

  // Handle first message auto-response
  useFirstMessage(
    chatId,
    userId,
    !isCheckingAuth,
    triggerAIResponse,
    setMessages
  );

  // Auto-scroll to bottom
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
      <Side setOpenMap={setOpenMap} />
      <Map openMap={openMap} setOpenMap={setOpenMap} />

      {/* Header */}
      <div className="relative flex justify-center items-center pt-6 pb-4">
        <h1 className="text-6xl lg:text-8xl font-serif font-bold tracking-tight drop-shadow-[0_0_25px_rgba(255,215,0,0.15)]">
          <span className="text-gradient">VERITUS</span>
        </h1>
      </div>

      {/* Main Content */}
      <div className="relative grow flex flex-col items-center w-full pb-12">
        {/* Messages Container */}
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
                      {msg.file_name && (
                        <div className="text-xs text-gold/70 mb-1 flex items-center gap-1">
                          📎 {msg.file_name}
                        </div>
                      )}
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

        {/* Error Message */}
        {failed && (
          <div className="max-w-xs bg-red-500/20 border border-red-500/30 rounded-2xl px-4 py-3 mb-4">
            <p className="text-red-200 text-sm">
              Failed to send message. Please try again.
            </p>
          </div>
        )}

        {/* Input Box */}
        <InputBox
          onSubmit={handleSubmit}
          isLoading={isLoading}
          disabled={false}
          placeholder="Ask a question, cite a law, or make your case..."
          filePlaceholder="Press enter to continue..."
          acceptedFileTypes=".pdf,.docx,.txt"
          showFileUpload={true}
          maxFileSize={10}
        />
      </div>
      
      {/* Auto-scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
}