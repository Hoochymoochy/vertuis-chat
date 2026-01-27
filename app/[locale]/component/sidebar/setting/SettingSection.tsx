// ChatSection.tsx - Chat-specific content for SidebarRight
import { motion, AnimatePresence } from "framer-motion";
import { Add, Chat as ChatIcon, Location, Logout, Language } from "@carbon/icons-react";
import { ANIMATION } from "../sidebar.constants";
import { Chat } from "../useSidebar";

interface ChatSectionProps {
  isCollapsed: boolean;
  chats: Chat[];
  onNewChat: () => void;
  onChatClick: (id: string) => void;
  onOpenMap: () => void;
  onLogout: () => void;
  country: string | null;
  state: string | null;
  lang: string;
  isLangOpen: boolean;
  onToggleLang: () => void;
  onLanguageChange: (langCode: string) => void;
  t: (key: string) => string;
}

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
];

export function SettingSection({
  isCollapsed,
  chats,
  onNewChat,
  onChatClick,
  onOpenMap,
  onLogout,
  country,
  state,
  lang,
  isLangOpen,
  onToggleLang,
  onLanguageChange,
  t,
}: ChatSectionProps) {
  const currentLanguage = languages.find((l) => l.code === lang) || languages[0];

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
        <motion.button
          onClick={onNewChat}
          className={`
            w-full bg-gradient-to-r from-amber-900/20 to-amber-800/10
            hover:from-amber-900/30 hover:to-amber-800/20
            border border-amber-600/30 hover:border-amber-600/50
            text-neutral-50 font-medium transition-all
            flex items-center justify-center gap-3
            ${isCollapsed ? "h-10 rounded-lg" : "h-12 rounded-lg px-4"}
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          title={isCollapsed ? t("newChat") : undefined}
        >
          <Add size={20} className="shrink-0" />
          {!isCollapsed && (
            <span className="text-sm">{t("newChat")}</span>
          )}
        </motion.button>
      </div>

      {/* Chat List */}
      <div
        className={`flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent
          ${isCollapsed ? "px-1" : "px-2"}`}
      >
        {!isCollapsed && (
          <div className="px-2 mb-2">
            <h3 className="text-amber-600 text-xs uppercase tracking-wider font-semibold">
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
            <motion.button
              key={chat.id}
              onClick={() => onChatClick(chat.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * 0.05,
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
              whileHover={{
                scale: 1.02,
                x: isCollapsed ? 0 : 4,
                transition: { type: "spring", stiffness: 400, damping: 20 },
              }}
              whileTap={{ scale: 0.98 }}
              className={`
                group w-full text-left
                hover:bg-neutral-900 transition-all
                border border-transparent hover:border-amber-600/20
                ${isCollapsed ? "p-2 rounded-lg flex justify-center" : "p-3 rounded-lg"}
              `}
              title={isCollapsed ? chat.title : undefined}
            >
              {isCollapsed ? (
                <ChatIcon size={16} className="text-neutral-50 group-hover:text-amber-500" />
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <ChatIcon size={16} className="shrink-0 text-neutral-400 group-hover:text-amber-500" />
                    <h4 className="text-neutral-50 text-sm font-medium truncate group-hover:text-amber-500 transition-colors">
                      {chat.title}
                    </h4>
                  </div>
                </div>
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Language & Logout Section */}
      <div
        className={`shrink-0 border-t border-neutral-800 space-y-2 transition-all
          ${isCollapsed ? "p-2" : "p-4"}`}
        style={{
          transitionDuration: `${ANIMATION.DURATION}ms`,
          transitionTimingFunction: ANIMATION.EASING,
        }}
      >
        {/* Language Selector */}
        <div className="relative">
          <motion.button
            onClick={onToggleLang}
            className={`
              w-full group relative overflow-hidden
              bg-gradient-to-r from-amber-900/10 to-amber-800/5
              hover:from-amber-900/20 hover:to-amber-800/10
              border border-amber-600/30 hover:border-amber-600/40
              transition-all
              ${isCollapsed ? "h-10 rounded-lg flex items-center justify-center" : "rounded-lg px-4 py-2.5"}
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            title={isCollapsed ? currentLanguage.name : undefined}
          >
            {isCollapsed ? (
              <Language size={20} className="text-amber-500" />
            ) : (
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{currentLanguage.flag}</span>
                  <span className="text-neutral-50 text-sm font-medium">
                    {currentLanguage.name}
                  </span>
                </div>
                <motion.svg
                  className="w-4 h-4 text-amber-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ rotate: isLangOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </motion.svg>
              </div>
            )}
          </motion.button>

          {!isCollapsed && (
            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full left-0 right-0 mb-2 bg-neutral-900/95 backdrop-blur-lg border border-amber-600/30 rounded-lg overflow-hidden shadow-xl"
                >
                  {languages.map((language, index) => (
                    <motion.button
                      key={language.code}
                      onClick={() => onLanguageChange(language.code)}
                      className={`
                        w-full px-4 py-3 text-left transition-all
                        flex items-center gap-3
                        ${
                          lang === language.code
                            ? "bg-amber-900/20 text-amber-500"
                            : "text-neutral-50 hover:bg-amber-900/10"
                        }
                      `}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 4 }}
                    >
                      <span className="text-2xl">{language.flag}</span>
                      <span className="text-sm font-medium">{language.name}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Logout */}
        <motion.button
          onClick={onLogout}
          className={`
            w-full group relative overflow-hidden
            bg-gradient-to-r from-red-950/40 to-red-900/40
            hover:from-red-900/60 hover:to-red-800/60
            border border-red-500/30 hover:border-red-500/50
            transition-all
            ${isCollapsed ? "h-10 rounded-lg flex items-center justify-center" : "rounded-lg px-4 py-2.5"}
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          title={isCollapsed ? t("logout") : undefined}
        >
          {isCollapsed ? (
            <Logout size={20} className="text-neutral-50" />
          ) : (
            <div className="relative flex items-center justify-center gap-2">
              <Logout size={16} />
              <span className="text-neutral-50 text-sm font-medium group-hover:text-red-100 transition-colors">
                {t("logout")}
              </span>
            </div>
          )}
        </motion.button>
      </div>
      
      </div>
    </div>
  );
}
