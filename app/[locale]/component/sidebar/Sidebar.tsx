// Sidebar.tsx - Pass activeSection to child components
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import { useSidebar } from "./useSidebar";

export function Sidebar() {
  const sidebar = useSidebar();

  return (
    <div className="flex h-screen w-full">
      <SidebarLeft
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
      />
    </div>
  );
}