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

export function CaseSection({
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

    </div>
  );
}
