// SidebarRight.tsx - Enhanced with chat section support
import { ChartBar } from "@carbon/icons-react";
import { 
  casebarSections, 
  chatbarSections, 
  homebarSections,
  settingsbarSections
} from "./menu.config";
import { MenuSection } from "./MenuSection";
import { SearchContainer } from "./SearchContainer";
import { ChatSection } from "./chat/ChatSection";
import { CaseSection } from "./case/CaseSection";
import { SettingSection } from "./setting/SettingSection";
import { HomeSection } from "./home/page";
import { SIDEBAR, ANIMATION } from "./sidebar.constants";
import { SidebarRightProps } from "./type";

export default function SidebarRight({
  isCollapsed,
  toggleCollapse,
  expandedItems,
  toggleExpanded,
  activeSection,
  setSubSection,
  // Chat-specific props
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
}: SidebarRightProps) {
  // Map section types to their corresponding menu configurations
  const sectionMap = {
    home: homebarSections,
    chat: chatbarSections,
    case: casebarSections,
    settings: settingsbarSections,
  };

  const currentSections = sectionMap[activeSection as keyof typeof sectionMap] || homebarSections;

  // Get title based on active section
  const sectionTitles = {
    home: "Home",
    chat: "Chat",
    case: "Cases",
    settings: "Settings",
  };

  const currentTitle = sectionTitles[activeSection as keyof typeof sectionTitles] || "Workspace";

  // When in chat section, render the chat-specific UI
  const isChatSection = activeSection === "chat";

  const isCaseSection = activeSection === "case";

  const isSettingsSection = activeSection === "settings";

  const isHomeSection = activeSection === "home";

  return (
    <aside
      className="bg-neutral-950 border-r border-gold-20 flex flex-col h-screen z-10 transition-all"
      style={{
        width: isCollapsed
          ? `${SIDEBAR.COLLAPSED_WIDTH}px`
          : `${SIDEBAR.EXPANDED_WIDTH}px`,
        transitionDuration: `${ANIMATION.DURATION}ms`,
        transitionTimingFunction: ANIMATION.EASING,
      }}
    >
      {/* Header */}
      <header className="relative flex items-center justify-between h-16 p-4 shrink-0">
        <div
          className={`transition-opacity ${
            isCollapsed ? "opacity-0" : "opacity-100"
          }`}
          style={{
            transitionDuration: `${ANIMATION.DURATION}ms`,
          }}
        >
          <span className="text-lg font-medium text-gold">
            {currentTitle}
          </span>
        </div>

        <button
          onClick={toggleCollapse}
          className={`
            p-2 rounded-lg hover:bg-neutral-900 transition-all
            ${isCollapsed ? "absolute left-1/2 -translate-x-1/2" : ""}
          `}
          style={{
            transitionDuration: `${ANIMATION.DURATION}ms`,
            transitionTimingFunction: ANIMATION.EASING,
          }}
          aria-label="Toggle sidebar"
        >
          <ChartBar size={16} className="text-gold" />
        </button>
      </header>

      {/* Search */}
      <div className="px-4 pb-4 shrink-0">
        <SearchContainer isCollapsed={isCollapsed} />
      </div>
      {isChatSection && (
        // Chat-specific layout
        <ChatSection
          isCollapsed={isCollapsed}
          chats={chats || []}
          onNewChat={onNewChat || (() => {})}
          onChatClick={onChatClick || (() => {})}
          onOpenMap={onOpenMap || (() => {})}
          onLogout={onLogout || (() => {})}
          country={country || "World"}
          state={state || "N/A"}
          lang={lang || "en"}
          isLangOpen={isLangOpen || false}
          onToggleLang={onToggleLang || (() => {})}
          onLanguageChange={onLanguageChange || (() => {})}
          t={t || ((key: string) => key)}
        />
      ) }
      
      {
        isCaseSection && (
        <CaseSection
          isCollapsed={isCollapsed} 
          chats={chats || []}
          onNewChat={onNewChat || (() => {})}
          onChatClick={onChatClick || (() => {})}
          onOpenMap={onOpenMap || (() => {})}
          onLogout={onLogout || (() => {})}
          country={country || "World"}
          state={state || "N/A"}
          lang={lang || "en"}
          isLangOpen={isLangOpen || false}
          onToggleLang={onToggleLang || (() => {})}
          onLanguageChange={onLanguageChange || (() => {})}
          t={t || ((key: string) => key)}
        />
        )
      } {
        isSettingsSection && (
        <SettingSection
          isCollapsed={isCollapsed}     
          chats={chats || []}
          onNewChat={onNewChat || (() => {})}
          onChatClick={onChatClick || (() => {})}
          onOpenMap={onOpenMap || (() => {})}
          onLogout={onLogout || (() => {})}
          country={country || "World"}
          state={state || "N/A"}
          lang={lang || "en"}
          isLangOpen={isLangOpen || false}
          onToggleLang={onToggleLang || (() => {})}
          onLanguageChange={onLanguageChange || (() => {})}
          t={t || ((key: string) => key)}
        />
        )
      } {
        isHomeSection && (
        <HomeSection
          isCollapsed={isCollapsed}     
          chats={chats || []}
          onNewChat={onNewChat || (() => {})}
          onChatClick={onChatClick || (() => {})}
          onOpenMap={onOpenMap || (() => {})}
          onLogout={onLogout || (() => {})}
          country={country || "World"}
          state={state || "N/A"}
          lang={lang || "en"}
          isLangOpen={isLangOpen || false}
          onToggleLang={onToggleLang || (() => {})}
          onLanguageChange={onLanguageChange || (() => {})}
          t={t || ((key: string) => key)}
        />
        )
      }
    </aside>
  );
}
