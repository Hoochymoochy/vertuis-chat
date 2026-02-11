// ChatSection.tsx - Chat-specific content for SidebarRight
import { motion } from "framer-motion";
import { Chat as ChatIcon } from "@carbon/icons-react";
import { ANIMATION } from "../sidebar.constants";
import { AddButton } from "../Button";
import { useChats } from "@/app/hooks/Chat/useChat";
import { useTranslations } from "next-intl";

export function ChatSection() {
  const { isCollapsed, chats, newChat, openChat, toggleMapCollapse, state } = useChats();
  const t = useTranslations("Sidebar");

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
        <AddButton onClick={newChat} isCollapsed={isCollapsed} label={t("chat")} />
      </div>

      {/* Chat List */}
      <div
        className={`flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent
          ${isCollapsed ? "px-1" : "px-2"}`}
      >
        {!isCollapsed && (
          <div className="px-2 mb-2">
            <h3 className="text-gold text-xs uppercase tracking-wider font-semibold">
              {t("recentChats")}
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
    </div>
  );
}