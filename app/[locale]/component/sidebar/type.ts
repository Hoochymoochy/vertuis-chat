// type.ts - Update your types to include the new props
export interface SidebarLeftProps {
  expandedItems: string[];
  toggleExpanded: (key: string) => void;
  activeSection: string;
  setSection: (section: string) => void;
}

export interface SidebarRightProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  expandedItems: Set<string>;
  toggleExpanded: (key: string) => void;
  activeSection: string;
}

export interface MenuSectionProps {
  section: {
    title: string;
    items: MenuItem[];
  };
  expandedItems: string[] | Set<string>;
  onToggleExpanded: (key: string) => void;
  isCollapsed: boolean;
  onSectionChange?: (section: string) => void;
  activeSection?: string;
}

export interface MenuItem {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  isActive?: boolean;
  id: number;
  hasDropdown?: boolean;
  sectionType?: string;
}

export interface MenuItemProps {
  item: MenuItem;
  onToggle?: () => void;
  onItemClick?: () => void;
  isCollapsed: boolean;
}