"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatBubble from "@/app/component/bubble";
import Image from "next/image";
import Side from "@/app/component/side";

export default function Home() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (message.trim()) {
      setIsSubmitted(true);
      console.log("Message submitted:", message);
    }
  };

  return (
    <div className="bg-marble bg-cover bg-no-repeat bg-center min-h-screen w-full flex flex-col px-4 py-6 relative overflow-hidden">
      
      
      {/* Logo - moves to top when submitted */}
      <motion.div
        animate={{
          position: isSubmitted ? "absolute" : "static",
          top: isSubmitted ? "2rem" : "auto",
          left: isSubmitted ? "50%" : "auto",
          x: isSubmitted ? "-50%" : "0",
        }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="flex justify-center items-center z-10"
      >
        <motion.h1
          animate={{ 
            scale: isSubmitted ? 0.5 : 1
          }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-5xl sm:text-6xl font-extrabold text-white tracking-wide"
        >
          Veritus
        </motion.h1>
      </motion.div>

      {/* Main Content Area */}
      <div className={`flex-grow flex flex-col items-center w-full transition-all duration-700 ease-out ${isSubmitted ? 'justify-end pb-12' : 'justify-center'}`}>
        
        {/* Input Field - slides to bottom when submitted */}
        <motion.div
          animate={{
            y: isSubmitted ? "1450%" : 0,
            marginTop: isSubmitted ? "auto" : "0",
            scale: isSubmitted ? 0.95 : 1,
          }}
          transition={{ type: "spring", stiffness: 80, damping: 18 }}
          className="w-full max-w-sm z-20"
        >
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Start chat..."
                value={message}
                className="flex-1 px-4 py-3 rounded-xl bg-black/60 text-white placeholder-gold border border-gold focus:outline-none focus:ring-2 focus:ring-gold transition backdrop-blur-sm"
                onChange={handleInputChange}
              />
              <button 
                type="submit"
                className="bg-gold hover:bg-gold/80 p-2 rounded-full transition-colors"
                aria-label="Send message"
              >
                <Image 
                  src="/upload.png"
                  alt="Send"
                  width={24}
                  height={24}
                />
              </button>
            </div>
          </form>
        </motion.div>


        {/* Chat Messages Area - only show when submitted */}
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex-1 w-full max-w-4xl mx-auto pt-8 pb-24 overflow-y-auto"
          >
            <div className="space-y-4">
              {/* User message */}
              <div className="flex justify-end">
                <div className="max-w-xs bg-gold/20 backdrop-blur-sm border border-gold/30 rounded-2xl px-4 py-3">
                  <p className="text-white text-sm">{message}</p>
                </div>
              </div>
              
              {/* AI response */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="flex justify-start"
              >
                <ChatBubble message="I received your message! How can I help you today?" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Tagline - fades away whensubmitted */}
      <AnimatePresence>
        {!isSubmitted && (
          <motion.div
            key="tagline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
            className="text-center mt-10"
          >
            <p className="text-gold text-base sm:text-lg font-medium uppercase tracking-widest">
              AI You Can Swear By
            </p>
            <p className="text-white text-xs italic mt-1">
              (Not legal advice)
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}