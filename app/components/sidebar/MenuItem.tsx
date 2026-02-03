import { motion, AnimatePresence } from "framer-motion";
import { ANIMATION } from "./sidebar.constants";
import { useSidebar } from "@/app/hooks/Global/SidebarContext";

interface MenuItemProps {
  item: {
    id: string;
    label: string;
    icon: any;
    route?: string;
    sectionType?: string;
    hasDropdown?: boolean;
  };
  isCollapsed: boolean;
  onToggle?: () => void;
}

export function MenuItem({ item, onToggle, isCollapsed }: MenuItemProps) {
  const Icon = item.icon;
  const { activeSection, navigateToSection } = useSidebar();

  // Dynamically determine if this item is active
  const isActive = item.sectionType === activeSection;

  const handleClick = () => {
    // Handle dropdown toggle if applicable
    if (item.hasDropdown && onToggle) {
      onToggle();
    }
    
    // Handle navigation if route exists
    if (item.route) {
      navigateToSection(item.route);
    }
  };

  return (
    <motion.div
      className="flex shrink-0"
      animate={{
        width: isCollapsed ? "100%" : "100%",
        justifyContent: isCollapsed ? "center" : "flex-start"
      }}
      transition={{
        duration: ANIMATION.DURATION / 1000,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      <motion.button
        onClick={handleClick}
        title={isCollapsed ? item.label : undefined}
        className={`
          select-none cursor-pointer rounded-lg flex items-center relative my-0.5
          ${isActive ? "bg-neutral-900 border border-gold-20" : "hover:bg-neutral-900"} 
        `}
        animate={{
          width: isCollapsed ? "40px" : "100%",
          height: "40px",
          justifyContent: isCollapsed ? "center" : "flex-start",
          paddingLeft: isCollapsed ? "16px" : "16px",
          paddingRight: isCollapsed ? "16px" : "16px"
        }}
        transition={{
          duration: ANIMATION.DURATION / 1000,
          ease: [0.4, 0, 0.2, 1]
        }}
      >
        {/* Icon */}
        <motion.div
          className="flex items-center justify-center shrink-0"
          animate={{
            scale: isCollapsed ? 0.83 : 1
          }}
          transition={{
            duration: ANIMATION.DURATION / 1000,
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          <Icon size={24} className="text-gold" />
        </motion.div>

        {/* Label */}
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              className="flex-1 overflow-hidden ml-3"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{
                duration: ANIMATION.DURATION / 1000,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
              <span className="text-sm text-neutral-50 truncate">
                {item.label}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}