import { motion, AnimatePresence } from "framer-motion";
import { 
  casebarSections, 
  chatbarSections, 
  documentsbarSections,
  settingsbarSections
} from "./menu.config";
import { ChatSection } from "./chat/ChatSection";
import { CaseSection } from "./case/CaseSection";
import { DocumentSection } from "./case/DocumentSection"
import { SettingSection } from "./setting/SettingSection";
import { SIDEBAR, ANIMATION } from "./sidebar.constants";
import { useSidebar } from "../../hooks/Global/SidebarContext";
import { useTranslations } from "next-intl";


export default function SidebarRight() {
  const { activeSection, isCollapsed, toggleCollapse } = useSidebar();
  const t = useTranslations("Sidebar");

  const SECTION_CONFIG = {
    chat: {
      title: t("chat"),
      sections: chatbarSections,
      Component: ChatSection,
    },
    case: {
      title: t("case"),
      sections: casebarSections,
      Component: CaseSection,
    },
    settings: {
      title: t("settings"),
      sections: settingsbarSections,
      Component: SettingSection,
    },
    documents: {
      title: t("documents"),
      sections: documentsbarSections,
      Component: DocumentSection
    }
  } as const;
  
  const currentConfig = SECTION_CONFIG[activeSection as keyof typeof SECTION_CONFIG] || SECTION_CONFIG.chat;
  const SectionComponent = currentConfig.Component;

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
                className="text-6xl font-serif font-bold tracking-tight"
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
          className="z-50 bg-black/60 backdrop-blur-sm border border-gold/30 p-2 hover:bg-black/70 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div animate={{ rotate: isCollapsed ? 90 : 0 }} transition={{ duration: 0.2 }}>
            {!isCollapsed ? (
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
      </header>
      
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
          <SectionComponent />
        </motion.div>
      </AnimatePresence>
    </motion.aside>
  );
}