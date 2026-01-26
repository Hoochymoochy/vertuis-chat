import { ChartBar } from "@carbon/icons-react";
import { menuSections } from "./menu.config";
import { MenuSection } from "./MenuSection";
import { SearchContainer } from "./SearchContainer";
import { SIDEBAR, ANIMATION } from "./sidebar.constants";
import { SidebarRightProps } from "./type";

export default function SidebarRight({
  isCollapsed,
  toggleCollapse,
  expandedItems,
  toggleExpanded,
}: SidebarRightProps) {
  return (
    <aside
      className="bg-neutral-950 border-r border-neutral-800 flex flex-col h-full z-10 transition-all"
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
          <span className="text-lg font-medium text-neutral-50">
            Workspace
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
          <ChartBar size={16} className="text-neutral-50" />
        </button>
      </header>

      {/* Search */}
      <div className="px-4 pb-4 shrink-0">
        <SearchContainer isCollapsed={isCollapsed} />
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-2">
        {menuSections.map((section) => (
          <MenuSection
            key={section.title}
            section={section}
            expandedItems={expandedItems}
            onToggleExpanded={toggleExpanded}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>
    </aside>
  );
}
