// ChatSection.tsx - Chat-specific content for SidebarRight
import { motion } from "framer-motion";
import { Chat as ChatIcon } from "@carbon/icons-react";
import { ANIMATION } from "../sidebar.constants";
import { AddButton } from "../Button";
import { useChats } from "@/app/hooks/Chat/useChat";

export function ChatSection() {
  const { isCollapsed, chats, newChat, openChat, toggleMapCollapse, state } = useChats();

  // Translation function - you can implement this based on your i18n setup
  const t = (key: string) => key;

  if (isCollapsed) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      {/* New Chat Button */}
      <div
        className={`shrink-0 transition-all ${
          isCollapsed ? "p-2" : "p-4"
        }`}
        style={{
          transitionDuration: `${ANIMATION.DURATION}ms`,
          transitionTimingFunction: ANIMATION.EASING,
        }}
      >
        <AddButton onClick={newChat} isCollapsed={isCollapsed} label="Chat" />
      </div>

      {/* Chat List */}
      <div
        className={`flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent
          ${isCollapsed ? "px-1" : "px-2"}`}
      >
        {!isCollapsed && (
          <div className="px-2 mb-2">
            <h3 className="text-gold text-xs uppercase tracking-wider font-semibold">
              {t("recent Chats")}
            </h3>
          </div>
        )}

        <motion.div
          className="space-y-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {chats.map((chat, index) => (
            <motion.div
              onClick={() => openChat(chat.id)}
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

      {/* Jurisdiction Section */}
      {/* <div className="p-4 border-t border-gold/20">
        <motion.button
          onClick={toggleMapCollapse}
          className="w-full group relative overflow-hidden bg-linear-to-r from-gold/10 to-gold/5 hover:from-gold/20 hover:to-gold/10 border border-gold/30 hover:border-gold/40 px-4 py-3 transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div 
            className="absolute inset-0 bg-linear-to-r from-transparent via-gold/10 to-transparent" 
            initial={{ x: "-100%" }} 
            whileHover={{ x: "100%" }} 
            transition={{ duration: 0.6, ease: "easeInOut" }} 
          />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-gold text-xs uppercase tracking-wider font-semibold">
                {t("jurisdiction")}
              </span>
            </div>
            <div className="text-white text-sm">
              <span className="text-gold/80">{t("state")}:</span> {state || "N/A"}
            </div>
            <div className="mt-2 text-xs text-gold/60 group-hover:text-gold/80 transition-colors">
              {t("clickToChange")}
            </div>
          </div>
        </motion.button>
      </div> */}
    </div>
  );
}