"use client";

import { use, useEffect, useState } from "react";
import { motion, AnimatePresence, Transition } from "framer-motion";
import ChatBubble from "@/app/component/bubble";
import Image from "next/image";
import Side from "@/app/component/side";
import question from "@/app/lib/question";
import { getAllMessage, addMessage, addChat } from "@/app/lib/chat";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const smoothSpring: Transition = { type: "spring", stiffness: 70, damping: 18 };
  const easeOutFade: Transition = { duration: 0.6, ease: "easeOut" };

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      // Get user ID from localStorage
      const user_id = localStorage.getItem("user_id");
      if (!user_id) {
        console.error("No user ID found");
        return;
      }
      setUserId(user_id);
    };

    initializeData();
  }, []);

  const checkLogin = async () => {
    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
      router.push("/login");
      return;
    }
    setUserId(user_id);
  };

    useEffect(() => {
    checkLogin();
  }, [userId]);

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  // Send a message
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!message.trim() || !userId || isLoading) return;
    setIsSubmitted(true);
    setIsLoading(true);

    try {
      let currentChatId = await addChat(userId, message.slice(0, 50));
      const response = await question(message);

      await addMessage(currentChatId.id, "user", message);
      await addMessage(currentChatId.id, "ai", response.summary.summary);

      router.push(`/${currentChatId.id}`);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally { 
      setIsLoading(false);
    }
  };

  function handleNewChat(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <motion.div
      layout
      className="bg-marble bg-cover bg-no-repeat bg-center min-h-screen w-full flex flex-col px-4 py-6 relative overflow-hidden"
    >
      <Side/>

      {/* Main Chat Area */}
      <motion.div
        layout
        className={`flex-grow flex flex-col items-center w-full ${
          isSubmitted ? "justify-end pb-12" : "justify-center"
        }`}
      >
        {/* Logo */}
        <motion.div
          layout
          animate={{ y: isSubmitted ? "-100%" : 0 }}
          transition={smoothSpring}
          className="flex justify-center items-center z-10 mb-4"
        >
          <motion.h1
            layout
            animate={{ scale: isSubmitted ? 0.9 : 1 }}
            transition={smoothSpring}
            className="text-5xl sm:text-6xl font-extrabold text-white tracking-wide"
          >
            Veritus
          </motion.h1>
        </motion.div>

        {/* Messages */}
        <AnimatePresence>
          {isSubmitted && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ ...easeOutFade, delay: 0.3 }}
              className="flex-1 w-full max-w-4xl mx-auto pt-8 pb-24 overflow-y-auto"
            >
              <motion.div layout className="space-y-4">
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id || index}
                    layout
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.sender === "user" ? (
                      <div className="max-w-xs bg-gold/20 backdrop-blur-sm border border-gold/30 rounded-2xl px-4 py-3">
                        <p className="text-white text-sm">{msg.message}</p>
                      </div>
                    ) : (
                      <ChatBubble message={msg.message} />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input */}
        <motion.div layout transition={smoothSpring} className="w-full max-w-sm z-20">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Start chat..."
                value={message}
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-xl bg-black/60 text-white placeholder-gold border border-gold focus:outline-none focus:ring-2 focus:ring-gold transition backdrop-blur-sm disabled:opacity-50"
                onChange={handleInputChange}
              />
              <button
                type="submit"
                disabled={isLoading || !message.trim()}
                className="bg-gold hover:bg-gold/80 p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Image src="/upload.png" alt="Send" width={24} height={24} />
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>

      {/* Tagline */}
      <AnimatePresence>
        {!isSubmitted && (
          <motion.div
            key="tagline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={easeOutFade}
            className="text-center mt-10"
          >
            <p className="text-gold text-base sm:text-lg font-medium uppercase tracking-widest">
              AI You Can Swear By
            </p>
            <p className="text-white text-xs italic mt-1">(Not legal advice)</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}