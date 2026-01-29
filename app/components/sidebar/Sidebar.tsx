// Sidebar.tsx - Pass activeSection to child components
"use client";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import { useSidebar } from "./useSidebar";
import { SidebarContent } from "./type";


export function Sidebar({ children }: { children: SidebarContent }) {

  const sidebar = useSidebar();

  return (
    <div className="flex h-screen">
      <SidebarLeft
        isCollapsed={sidebar.isCollapsed}
        expandedItems={Array.from(sidebar.expandedItems)}
        toggleExpanded={sidebar.toggleExpanded}
        activeSection={sidebar.activeSection}
        setSection={sidebar.setSection}
      />

      <SidebarRight
        isCollapsed={sidebar.isCollapsed}
        toggleCollapse={sidebar.toggleCollapse}
        expandedItems={sidebar.expandedItems}
        toggleExpanded={sidebar.toggleExpanded}
        activeSection={sidebar.activeSection}
        setSubSection={sidebar.setSubSection}
      />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}