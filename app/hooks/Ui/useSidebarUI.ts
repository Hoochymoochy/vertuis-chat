import { useCallback, useState } from "react";

export function useSidebarUI() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState("home");

  const toggleCollapse = useCallback(() => {
    setIsCollapsed(v => !v);
  }, []);

  const toggleExpanded = useCallback((key: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }, []);

  return {
    isCollapsed,
    expandedItems,
    toggleExpanded,
    toggleCollapse,
    activeSection,
    setActiveSection,
  };
}
