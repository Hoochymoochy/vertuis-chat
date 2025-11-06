"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, Transition } from "framer-motion";
import Image from "next/image";
import Side from "@/app/component/side";
import { addChat } from "@/app/lib/chat";
import { useRouter } from "next/navigation";
import Map from "@/app/component/map";
import { supabase } from "./lib/supabaseClient";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;


export default function Home() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const router = useRouter();
  const [openMap, setOpenMap] = useState(false);

  const smoothSpring: Transition = { type: "spring", stiffness: 70, damping: 18 };
  const easeOutFade: Transition = { duration: 0.6, ease: "easeOut" };

  // Check login
  useEffect(() => {
    const checkLogin = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) setUserId(data.session.user.id);
    };
    checkLogin();
  }, [router]);

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

    // Add user message to local state for animation
    const userMsg = { sender: "user", message: message, id: Date.now() };
    setMessages([userMsg]);

    try {
      const healthRes = await fetch(`${backendUrl}/health`);
      const { status } = await healthRes.json();
      if (status !== "ok") throw new Error("Backend not ready");

      // Create the chat
      const { id } = await addChat(userId, message.slice(0, 50));

      // Store first message for the chat page to handle
      localStorage.setItem("first_message", message);

      // Small delay to show the animation before routing
      setTimeout(() => {
        router.push(`/${id}`);
      }, 300);
    } catch (err) {
      console.error("Failed to start chat:", err);
      setFailed(true);
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      layout
      className="bg-marble bg-cover bg-no-repeat bg-center min-h-screen w-full flex flex-col px-4 py-6 relative overflow-hidden"
    >
      <Side setOpenMap={setOpenMap}/>
      <Map openMap={openMap} setOpenMap={setOpenMap}/>

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

        {/* Floating Error */}
        <AnimatePresence>
          {failed && (
            <motion.div
              key="error-toast"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex justify-center items-center mb-4"
            >
              <motion.div
                layout
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="max-w-xs bg-gold/20 backdrop-blur-sm border border-gold/30 rounded-2xl px-4 py-3 shadow-lg"
              >
                <p className="text-white text-sm text-center">
                  Failed to send message. Please try again.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <AnimatePresence>
          {isSubmitted && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ ...easeOutFade, delay: 0.1 }}
              className="flex-1 w-full max-w-4xl mx-auto pt-8 pb-24 overflow-y-auto"
            >
              <motion.div layout className="space-y-4">
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id || index}
                    layout
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="max-w-xs bg-gold/20 backdrop-blur-sm border border-gold/30 rounded-2xl px-4 py-3">
                      <p className="text-white text-sm">{msg.message}</p>
                    </div>
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
                className="flex-1 px-4 py-3 rounded-xl 
                bg-gold/10 text-white placeholder-gold/60 
                border border-gold/40 
                focus:outline-none focus:ring-2 focus:ring-gold 
                transition backdrop-blur-sm 
                disabled:opacity-50"
                onChange={handleInputChange}
              />
              <button
                type="submit"
                disabled={isLoading || !message.trim()}
                className="bg-gold hover:bg-gold/80 p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                aria-label="Send message"
              >
                {isLoading ? (
                  <Spinner />
                ) : (
                  <Image src="/upload.png" alt="Send" width={24} height={24} />
                )}
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

function Spinner() {
  return (
    <motion.div
      className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin"
      aria-label="Loading"
    />
  );
}