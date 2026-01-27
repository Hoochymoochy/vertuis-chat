// type.ts - Enhanced type definitions with chat support
import { ComponentType } from "react";
import { Chat } from "./useSidebar";
import { ReactNode } from "react";

export interface SidebarContent {
  children: ReactNode;
}
export interface MenuItem {
  id: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  hasDropdown?: boolean;
  sectionType?: string;
  isActive?: boolean;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export interface MenuItemProps {
  item: MenuItem;
  onToggle?: () => void;
  onItemClick?: () => void;
  isCollapsed: boolean;
  setSubSection?: (subSection: string) => void;
}

export interface MenuSectionProps {
  section: MenuSection;
  onToggleExpanded: (key: string) => void;
  isCollapsed: boolean;
  onSectionChange?: (section: string) => void;
  activeSection?: string;
  setSubSection?: (subSection: string) => void;
  expandedItems: Set<string>;
}

export interface SidebarRightProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  expandedItems: Set<string>;
  toggleExpanded: (key: string) => void;
  activeSection: string;
  setSubSection: (subSection: string) => void;
  
  // Chat-specific props
  chats?: Chat[];
  onNewChat?: () => void;
  onChatClick?: (id: string) => void;
  onOpenMap?: () => void;
  onLogout?: () => void;
  country?: string | null;
  state?: string | null;
  lang?: string;
  isLangOpen?: boolean;
  onToggleLang?: () => void;
  onLanguageChange?: (langCode: string) => void;
  t?: (key: string) => string;
}

export interface SidebarLeftProps {
  expandedItems: string[];
  toggleExpanded: (key: string) => void;
  activeSection: string;
  setSection: (section: string) => void;
}

export interface SearchContainerProps {
  isCollapsed: boolean;
}
