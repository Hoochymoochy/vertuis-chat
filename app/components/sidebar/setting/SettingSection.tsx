// ChatSection.tsx - Chat-specific content for SidebarRight
import { motion } from "framer-motion";
import { ANIMATION } from "../sidebar.constants";
import { useSidebar } from "../../../hooks/Global/SidebarContext";

export function SettingSection() {
  const { 
    isCollapsed, 
    handleLogout
  } = useSidebar();

  const t = (key: string) => key;

  if (isCollapsed) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      <div
        className={`shrink-0 transition-all ${
          isCollapsed ? "p-2" : "p-4"
        }`}
        style={{
          transitionDuration: `${ANIMATION.DURATION}ms`,
          transitionTimingFunction: ANIMATION.EASING,
        }}
      >
          <motion.button onClick={handleLogout} className="w-full group relative overflow-hidden bg-linear-to-r from-red-950/40 to-red-900/40 hover:from-red-900/60 hover:to-red-800/60 border border-red-500/30 hover:border-red-500/50 px-4 py-2.5 transition-all duration-300" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <div className="relative flex items-center justify-center gap-2">
              <span className="text-white text-sm font-medium group-hover:text-red-100 transition-colors">{t("logout")}</span>
            </div>
          </motion.button>
      </div>
    </div>
  );
}