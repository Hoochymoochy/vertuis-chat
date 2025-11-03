"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import ChatBubble from "@/app/component/bubble";
import Side from "@/app/component/side";
import Map from "@/app/component/map";
import question from "@/app/lib/question";
import { addMessage, getAllMessage } from "@/app/lib/chat";

export default function ChatPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const params = useParams();

  const [user, setUser] = useState<any>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [openMap, setOpenMap] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasProcessedFirstMessage = useRef(false);

  // 🧠 Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ⚙️ Check Supabase auth session
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    };
    getSession();
  }, [supabase, router]);

  // 💬 Init chat from params + Supabase fetch
  useEffect(() => {
    const init = async () => {
      const currentChatId = params.id as string;
      if (!currentChatId || hasProcessedFirstMessage.current) return;

      setChatId(currentChatId);
      const data = await getAllMessage(currentChatId);
      setMessages(data || []);

      const firstMsg = localStorage.getItem("first_message");
      if (data.length === 0 && firstMsg && !hasProcessedFirstMessage.current) {
        hasProcessedFirstMessage.current = true;
        await addMessage(currentChatId, "user", firstMsg);
        setMessages([{ sender: "user", message: firstMsg, id: Date.now() }]);
        await triggerAIResponse(firstMsg, currentChatId);
        localStorage.removeItem("first_message");
      }

      setIsInitialized(true);
    };

    init();
  }, [params.id]);

  // 🔥 Listen for realtime message updates from Supabase
  useEffect(() => {
    if (!chatId) return;
    const channel = supabase
      .channel(`chat_${chatId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages", filter: `chat_id=eq.${chatId}` },
        async () => {
          const updated = await getAllMessage(chatId);
          setMessages(updated);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, supabase]);

  // ⚙️ AI streaming logic
  const triggerAIResponse = async (msg: string, chatId: string) => {
    setIsLoading(true);
    setFailed(false);
    let aiMessage = "";

    const loadingMsg = { sender: "ai", message: "...", id: "ai-loading" };
    setMessages((prev) => [...prev, loadingMsg]);

    try {
      await question(msg, chatId, (token: string) => {
        aiMessage += token;
        setMessages((prev) => {
          const withoutLoading = prev.filter((m) => m.id !== "ai-loading" && m.id !== "ai-temp");
          return [...withoutLoading, { sender: "ai", message: aiMessage, id: "ai-temp" }];
        });
      });

      await addMessage(chatId, "ai", aiMessage);
      const finalId = Date.now();
      setMessages((prev) => {
        const withoutTemp = prev.filter((m) => m.id !== "ai-temp" && m.id !== "ai-loading");
        return [...withoutTemp, { sender: "ai", message: aiMessage, id: finalId }];
      });
    } catch (err) {
      console.error("AI response failed:", err);
      setFailed(true);
      setMessages((prev) => prev.filter((m) => m.id !== "ai-temp" && m.id !== "ai-loading"));
    } finally {
      setIsLoading(false);
    }
  };

  // 🚀 Send Message
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !chatId || isLoading) return;

    const userMessage = message;
    setMessage("");
    setIsLoading(true);
    setFailed(false);

    try {
      await addMessage(chatId, "user", userMessage);
      setMessages((prev) => [...prev, { sender: "user", message: userMessage, id: Date.now() }]);
      await triggerAIResponse(userMessage, chatId);
    } catch (err) {
      console.error("Failed to send message:", err);
      setFailed(true);
    } finally {
      setIsLoading(false);
    }
  };

  // 🌀 Loading Screen
  if (!isInitialized)
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-marble bg-cover bg-center">
        <motion.div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="bg-marble bg-cover bg-center min-h-screen w-full flex flex-col px-4 py-6 relative">
      <Side setOpenMap={setOpenMap} />
      <Map openMap={openMap} setOpenMap={setOpenMap} />

      <div className="flex justify-center items-center pt-6 pb-4">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-white tracking-wide">Veritus</h1>
      </div>

      <div className="flex-grow flex flex-col items-center w-full pb-12">
        <div className="flex-1 w-full max-w-4xl mx-auto pt-4 pb-24 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "user" ? (
                  <div className="max-w-xs bg-gold/20 border border-gold/30 rounded-2xl px-4 py-3">
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
                  <ChatBubble id={msg.id} message={msg.message} isLast={index === messages.length - 1} />
                )}
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {failed && (
          <div className="max-w-xs bg-red-500/20 border border-red-500/30 rounded-2xl px-4 py-3 mb-4">
            <p className="text-red-200 text-sm">Failed to send message. Please try again.</p>
          </div>
        )}

        <div className="w-full max-w-sm z-20 mt-auto">
          <form onSubmit={handleSubmit} className="relative flex gap-2 items-center">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl bg-black/60 text-white placeholder-gold border border-gold focus:outline-none focus:ring-2 focus:ring-gold transition disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !message.trim()}
              className="bg-gold hover:bg-gold/80 p-2 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Image src="/upload.png" alt="Send" width={24} height={24} />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
