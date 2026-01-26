import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import { useSidebar }  from "./useSidebar";

export function Sidebar() {
  const sidebar = useSidebar();

  return (
    <div className="flex h-screen w-full">
      <SidebarLeft
      expandedItems={Array.from(sidebar.expandedItems)}
      toggleExpanded={sidebar.toggleExpanded}
      />

      <SidebarRight
        isCollapsed={sidebar.isCollapsed}
        toggleCollapse={sidebar.toggleCollapse}
        expandedItems={sidebar.expandedItems}
        toggleExpanded={sidebar.toggleExpanded}
      />
    </div>
  );
}
