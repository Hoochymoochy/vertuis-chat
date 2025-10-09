"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Profile from "@/app/component/profile";
import { getAllChat } from "@/app/lib/chat";
import { useRouter } from "next/navigation";

interface Chat {
  id: string;
  title: string;
}

export default function Side() {
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const router = useRouter();
  
  useEffect(() => {
    const fetchChats = async () => {
      const user_id = localStorage.getItem("user_id");
      const data = await getAllChat(user_id ?? "");
      console.log(data);
      setChats(data);
    };
    fetchChats();
  }, []);

  const newChat = () => {
    router.push("/");
  }

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    router.push("/login");
  }

  const handleChatClick = (id: string) => {
    router.push(`/${id}`);
  }

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
            <div className="p-6 border-b border-gold/20 mt-12">
              <motion.button
                onClick={newChat}
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
            {/* <div className="p-4 border-b border-gold/20">
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
            </div> */}

            {/* Chats List */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gold/30 scrollbar-track-transparent hover:scrollbar-thumb-gold/50">
              <div className="p-4">
                <h3 className="text-gold text-xs uppercase tracking-wider font-semibold mb-3">Recent Chats</h3>
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  {chats.map((chat, index) => (
                    <motion.div
                      onClick={() => handleChatClick(chat.id)}
                      key={chat.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: index * 0.05,
                        type: "spring",
                        stiffness: 300,
                        damping: 25
                      }}
                      whileHover={{ 
                        scale: 1.02,
                        x: 4,
                        transition: { type: "spring", stiffness: 400, damping: 20 }
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="group cursor-pointer rounded-lg hover:bg-gold/10 transition-all duration-200 p-3 border border-transparent hover:border-gold/20"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white text-sm font-medium truncate group-hover:text-gold transition-colors">
                            {chat.title}
                          </h4>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Footer with Profile */}
            <div className="p-4 border-t border-gold/20 space-y-3">
              <Profile />
              <motion.button
                onClick={handleLogout}
                className="w-full group relative overflow-hidden rounded-lg bg-gradient-to-r from-red-950/40 to-red-900/40 hover:from-red-900/60 hover:to-red-800/60 border border-red-500/30 hover:border-red-500/50 px-4 py-2.5 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
                <div className="relative flex items-center justify-center gap-2">
                  <motion.svg
                    className="w-4 h-4 text-red-400 group-hover:text-red-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    whileHover={{ rotate: 15 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </motion.svg>
                  <span className="text-white text-sm font-medium group-hover:text-red-100 transition-colors">
                    Logout
                  </span>
                </div>
              </motion.button>
            </div>

            
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}