import { menuSections } from "./menu.config";
import  { MenuSection }  from "./MenuSection";
import { Settings } from "@carbon/icons-react";
import Avatar  from "./Avatar";
import { SidebarLeftProps } from "./type";

export default function SidebarLeft({
  expandedItems,
  toggleExpanded,
}: SidebarLeftProps) {
  return (
    <div
      className="bg-neutral-950 border-r border-neutral-800 flex flex-col h-full z-10"
      style={{ width: "80px" }}
    >
      <div className="flex-1 overflow-y-auto px-2 pt-4">
        {menuSections.map((section) => (
          <MenuSection
            key={section.title}
            section={section}
            expandedItems={expandedItems}
            onToggleExpanded={toggleExpanded}
            isCollapsed
          />
        ))}
      </div>

      <div className="p-4 border-t border-neutral-800 shrink-0 flex flex-col gap-4 items-center">
        <Settings
          size={16}
          className="text-neutral-400 hover:text-neutral-50 cursor-pointer"
        />
        <Avatar />
      </div>
    </div>
  );
}
