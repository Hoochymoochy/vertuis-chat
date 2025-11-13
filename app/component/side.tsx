"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllChat } from "@/app/lib/chat";
import { useRouter } from "next/navigation";
import { setLanguage, getCountry, getState, getLanguage } from "@/app/lib/user";
import { supabase } from "../lib/supabaseClient";

interface Chat {
  id: string;
  title: string;
}

type SideProps = {
  setOpenMap: (open: boolean) => void;
};

export default function Side({ setOpenMap }: SideProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [lang, setSelectedLang] = useState("en");
  const [country, setSelectedCountry] = useState<string | null>("World");
  const [state, setSelectedState] = useState<string | null>("N/A");
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "pt", name: "Português", flag: "🇧🇷" },
  ];

  const currentLanguage = languages.find((l) => l.code === lang) || languages[0];

  // Fetch user session and chats
  useEffect(() => {
    const fetchChatsAndUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (!user) return;

        setUserId(user.id);

        const chatData = await getAllChat(user.id);
        setChats(chatData);

        const [fetchedCountry, fetchedState, fetchedLang] = await Promise.all([
          getCountry(user.id),
          getState(user.id),
          getLanguage(user.id),
        ]);

        setSelectedCountry(fetchedCountry ?? "World");
        setSelectedState(fetchedState ?? "N/A");
        setSelectedLang(fetchedLang ?? "en");
      } catch (err) {
        console.error("Error fetching user or chat data:", err);
        setSelectedCountry("World");
        setSelectedState("N/A");
        setSelectedLang("en");
      }
    };

    fetchChatsAndUser();
  }, []);

  // Listen for map/location updates
  useEffect(() => {
    const handleStorageChange = async () => {
      if (!userId) return;
      const [fetchedCountry, fetchedState] = await Promise.all([getCountry(userId), getState(userId)]);
      setSelectedCountry(fetchedCountry ?? "World");
      setSelectedState(fetchedState ?? "N/A");
    };

    window.addEventListener("locationUpdated", handleStorageChange);
    return () => window.removeEventListener("locationUpdated", handleStorageChange);
  }, [userId]);

  const handleLanguageChange = async (langCode: string) => {
    setSelectedLang(langCode);
    if (userId) await setLanguage(userId, langCode);
    setIsLangOpen(false);
  };

  const newChat = () => router.push("/");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleChatClick = (id: string) => router.push(`/${id}`);

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 bg-black/60 backdrop-blur-sm border border-gold/30 p-2 hover:bg-black/70 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
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
            className="w-full bg-gradient-to-r from-gold/20 to-gold/10 hover:from-gold/30 hover:to-gold/20 border border-gold/30 px-4 py-3 text-white font-medium transition-all duration-200 flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Chat
          </motion.button>
        </div>

        {/* Chats List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gold/30 scrollbar-track-transparent hover:scrollbar-thumb-gold/50">
          <div className="p-4">
            <h3 className="text-gold text-xs uppercase tracking-wider font-semibold mb-3">Recent Chats</h3>
            <motion.div className="space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.2 }}>
              {chats.map((chat, index) => (
                <motion.div
                  onClick={() => handleChatClick(chat.id)}
                  key={chat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 25 }}
                  whileHover={{ scale: 1.02, x: 4, transition: { type: "spring", stiffness: 400, damping: 20 } }}
                  whileTap={{ scale: 0.98 }}
                  className="group cursor-pointer hover:bg-gold/10 transition-all duration-200 p-3 border border-transparent hover:border-gold/20"
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

        {/* Map Section */}
        <div className="p-4 border-t border-gold/20">
          <motion.button
            onClick={() => setOpenMap(true)}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-gold/10 to-gold/5 hover:from-gold/20 hover:to-gold/10 border border-gold/30 hover:border-gold/40 px-4 py-3 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent" initial={{ x: "-100%" }} whileHover={{ x: "100%" }} transition={{ duration: 0.6, ease: "easeInOut" }} />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gold text-xs uppercase tracking-wider font-semibold">Jurisdiction</span>
              </div>
              <div className="text-white text-sm"><span className="text-gold/80">Country:</span> {country || "Global"}</div>
              <div className="text-white text-sm"><span className="text-gold/80">State:</span> {state || "N/A"}</div>
              <div className="mt-2 text-xs text-gold/60 group-hover:text-gold/80 transition-colors">Click to change location →</div>
            </div>
          </motion.button>
        </div>

        {/* Footer - Language & Logout */}
        <div className="p-4 border-t border-gold/20 space-y-3">
          {/* Language Selector */}
          <div className="relative">
            <motion.button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-gold/10 to-gold/5 hover:from-gold/20 hover:to-gold/10 border border-gold/30 hover:border-gold/40 px-4 py-2.5 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{currentLanguage.flag}</span>
                  <span className="text-white text-sm font-medium">{currentLanguage.name}</span>
                </div>
                <motion.svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" animate={{ rotate: isLangOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </div>
            </motion.button>

            <AnimatePresence>
              {isLangOpen && (
                <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.2 }} className="absolute bottom-full left-0 right-0 mb-2 bg-black/90 backdrop-blur-lg border border-gold/30 rounded-lg overflow-hidden shadow-xl">
                  {languages.map((language, index) => (
                    <motion.button key={language.code} onClick={() => handleLanguageChange(language.code)} className={`w-full px-4 py-3 text-left transition-all duration-200 flex items-center gap-3 ${lang === language.code ? "bg-gold/20 text-gold" : "text-white hover:bg-gold/10"}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} whileHover={{ x: 4 }}>
                      <span className="text-2xl">{language.flag}</span>
                      <span className="text-sm font-medium">{language.name}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Logout */}
          <motion.button onClick={handleLogout} className="w-full group relative overflow-hidden bg-gradient-to-r from-red-950/40 to-red-900/40 hover:from-red-900/60 hover:to-red-800/60 border border-red-500/30 hover:border-red-500/50 px-4 py-2.5 transition-all duration-300" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <div className="relative flex items-center justify-center gap-2">
              <span className="text-white text-sm font-medium group-hover:text-red-100 transition-colors">Logout</span>
            </div>
          </motion.button>
        </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
