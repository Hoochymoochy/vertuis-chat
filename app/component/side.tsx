"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Profile from "@/app/component/profile";

interface Chat {
  newChat: () => void;
}

export default function Side({ newChat }: Chat) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Mock chat data - replace with your actual chat data
  const chats = [
    { id: 1, title: "Legal Contract Review", lastMessage: "Thanks for the help with...", time: "2 min ago" },
    { id: 2, title: "Business Strategy", lastMessage: "What are the key factors...", time: "1 hour ago" },
    { id: 3, title: "Investment Advice", lastMessage: "I need guidance on...", time: "3 hours ago" },
    { id: 4, title: "Tax Questions", lastMessage: "Can you explain the...", time: "Yesterday" },
    { id: 5, title: "Real Estate Law", lastMessage: "What should I know about...", time: "2 days ago" },
  ];

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 bg-black/60 backdrop-blur-sm border border-gold/30 rounded-lg p-2 hover:bg-black/70 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? (
            <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </motion.div>
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-full w-80 bg-black/80 backdrop-blur-lg border-r border-gold/20 z-40 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gold/20">
              <motion.button
                onClick={() => newChat((prev: any) => !prev)}
                className="w-full bg-gradient-to-r from-gold/20 to-gold/10 hover:from-gold/30 hover:to-gold/20 border border-gold/30 rounded-xl px-4 py-3 text-white font-medium transition-all duration-200 flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Chat
              </motion.button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gold/20">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search chats..."
                  className="w-full px-4 py-2 pl-10 rounded-lg bg-black/40 border border-gold/20 text-white placeholder-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/30 text-sm"
                />
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-gold/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Chats List */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <h3 className="text-gold text-xs uppercase tracking-wider font-semibold mb-3">Recent Chats</h3>
                <div className="space-y-2">
                  {chats.map((chat, index) => (
                    <motion.div
                      key={chat.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group cursor-pointer rounded-lg hover:bg-gold/10 transition-colors p-3 border border-transparent hover:border-gold/20"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white text-sm font-medium truncate group-hover:text-gold transition-colors">
                            {chat.title}
                          </h4>
                          <p className="text-gold/60 text-xs mt-1 truncate">
                            {chat.lastMessage}
                          </p>
                        </div>
                        <span className="text-gold/40 text-xs ml-2 flex-shrink-0">
                          {chat.time}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer with Profile */}
            <div className="p-4 border-t border-gold/20">
              <Profile />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}