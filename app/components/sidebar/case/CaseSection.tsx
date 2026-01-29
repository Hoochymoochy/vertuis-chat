// ChatSection.tsx - Chat-specific content for SidebarRight
import { motion, AnimatePresence } from "framer-motion";
import { Add, Chat as ChatIcon, Location, Logout, Language } from "@carbon/icons-react";
import { ANIMATION } from "../sidebar.constants";
import { Chat } from "../useSidebar";
import { Case } from "@/app/[locale]/(protected)/case/page";
import { CaseSectionProps } from "./type";
import { AddButton } from "../Button";

export function CaseSection({
  isCollapsed,
  onNewChat,
  t,
}: CaseSectionProps) {

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
        <AddButton onClick={onNewChat} isCollapsed={isCollapsed} label="Case" />

        {/* <motion.button
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
        </motion.button> */}
      </div>
    </div>
  );
}
