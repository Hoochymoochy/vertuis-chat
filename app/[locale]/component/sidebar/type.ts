
export interface SidebarLeftProps {
    expandedItems: string[];
    toggleExpanded: (item: string) => void;
}

export interface SidebarRightProps {
    isCollapsed: boolean;
    toggleCollapse: () => void;
    expandedItems: Set<string>;
    toggleExpanded: (key: string) => void;
  }

export interface MenuSectionProps {
    key?: string;
    section: {
      title: string;
      items: {
        id: string;
        label: string;
        icon: React.ElementType;
      }[];
    };
    expandedItems: Set<string>;
    onToggleExpanded: (key: string) => void;
    isCollapsed: boolean;
  }

  export interface MenuItemProps {
    item: {
      icon: React.ElementType;
      hasDropdown: boolean;
      label: string;
      id: string;
      isActive: boolean;
    };
    isExpanded: boolean;
    onToggleExpanded: () => void;
    onItemClick: () => void;
    isCollapsed: boolean;
    onToggle: () => void;
  }
  