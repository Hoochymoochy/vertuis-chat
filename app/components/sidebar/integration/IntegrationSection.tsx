import { useSidebar } from "../../../hooks/Global/SidebarContext";

export function IntegrationSection() {
  const { isCollapsed } = useSidebar();

  if (isCollapsed) {
    return null;
  }

  return <div className="flex flex-col h-full" />;
}
