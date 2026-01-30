import { BorderBottom, ChevronDownOutline } from "@carbon/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  casebarSections, 
  chatbarSections, 
  homebarSections,
  settingsbarSections
} from "./menu.config";
import { ChatSection } from "./chat/ChatSection";
import { CaseSection } from "./case/CaseSection";
import { SettingSection } from "./setting/SettingSection";
import { HomeSection } from "./home/page";
import { SearchContainer } from "./SearchContainer";
import { SIDEBAR, ANIMATION } from "./sidebar.constants";
import { SidebarRightProps } from "./type";

// Section configuration mapping
const SECTION_CONFIG = {
  home: {
    title: "Home",
    sections: homebarSections,
    Component: HomeSection,
  },
  chat: {
    title: "Chat",
    sections: chatbarSections,
    Component: ChatSection,
  },
  case: {
    title: "Cases",
    sections: casebarSections,
    Component: CaseSection,
  },
  settings: {
    title: "Settings",
    sections: settingsbarSections,
    Component: SettingSection,
  },
} as const;

export default function SidebarRight({
  isCollapsed,
  toggleCollapse,
  expandedItems,
  toggleExpanded,
  activeSection,
  setSubSection,
  chats = [],
  onNewChat = () => {},
  onChatClick = () => {},
  onOpenMap = () => {},
  onLogout = () => {},
  country = "World",
  state = "N/A",
  lang = "en",
  isLangOpen = false,
  onToggleLang = () => {},
  onLanguageChange = () => {},
  t = (key: string) => key,
}: SidebarRightProps) {
  const currentConfig = SECTION_CONFIG[activeSection as keyof typeof SECTION_CONFIG] || SECTION_CONFIG.home;
  const SectionComponent = currentConfig.Component;

  // Common props for all section components
  const sectionProps = {
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
  };

  return (
    <motion.aside
      className="bg-neutral-950 border-r border-gold-20 flex flex-col h-screen z-10"
      initial={false}
      animate={{
        width: isCollapsed ? SIDEBAR.COLLAPSED_WIDTH : SIDEBAR.EXPANDED_WIDTH,
      }}
      transition={{
        duration: ANIMATION.DURATION / 1000,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      {/* Header */}
        <header
          className={`relative flex items-center justify-between h-16 p-4 pt-2 shrink-0
            ${!isCollapsed ? "border-b border-gold-20" : "border-none"}
          `}
        >
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{
                duration: ANIMATION.DURATION / 1000,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <motion.h1
                className="relative text-7xl sm:text-8xl lg:text-5xl font-serif font-bold tracking-tight"
                style={{
                  textShadow: '0 0 40px rgba(255, 215, 0, 0.2), 0 0 80px rgba(255, 215, 0, 0.1)'
                }}
              >
                <motion.span
                  key={currentConfig.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-gradient inline-block"
                >
                  {currentConfig.title}
                </motion.span>
                
                {/* Subtle glow effect */}
                <motion.div
                  className="absolute inset-0 bg-linear-to-r from-gold/0 via-gold/10 to-gold/0 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"
                  aria-hidden="true"
                />
              </motion.h1>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={toggleCollapse}
          className="p-2 rounded-lg hover:bg-neutral-900 transition-all relative "
          animate={{
            left: isCollapsed ? "50%" : "0%",
            x: isCollapsed ? "-50%" : 0,
            marginLeft: isCollapsed ? 0 : "-0.5rem",
          }}
          transition={{
            duration: ANIMATION.DURATION / 1000,
            ease: [0.4, 0, 0.2, 1],
          }}
          aria-label="Toggle sidebar"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronDownOutline size={24} className={`text-gold
            ${!isCollapsed ? "rotate-90" : "rotate-270"}`}/>
        </motion.button>
      </header>

      {/* Search */}
      {/* <div className="px-4 pb-4 shrink-0">
        <SearchContainer isCollapsed={isCollapsed} />
      </div> */}
      
      {/* Dynamic Section Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{
            duration: ANIMATION.DURATION / 1000,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="flex-1 overflow-hidden mt-10"
        >
          <SectionComponent {...sectionProps} />
        </motion.div>
      </AnimatePresence>
    </motion.aside>
  );
}