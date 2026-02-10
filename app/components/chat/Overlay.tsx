import { AnimatePresence, motion } from "framer-motion";
import { useSidebar } from "@/app/hooks/Global/SidebarContext";

export function Overlay() {
    const { isCollapsed, toggleCollapse } = useSidebar();
    return (
        <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleCollapse()}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          />
        )}
      </AnimatePresence>
    )
}