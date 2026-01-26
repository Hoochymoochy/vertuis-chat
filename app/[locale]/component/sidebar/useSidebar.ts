// useSidebar.ts - Update to manage active section
import { useCallback, useState } from "react";

export function useSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState<string>("home"); // Add this

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

  const setSection = useCallback((section: string) => {
    setActiveSection(section);
  }, []);

  return {
    isCollapsed,
    toggleCollapse,
    expandedItems,
    toggleExpanded,
    activeSection,
    setSection,
  };
}