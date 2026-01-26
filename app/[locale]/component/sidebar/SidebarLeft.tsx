// SidebarLeft.tsx - Handle section clicks with Settings at bottom
import { sidebarSections } from "./menu.config";
import { MenuSection } from "./MenuSection";
import Avatar from "./Avatar";
import { SidebarLeftProps } from "./type";

export default function SidebarLeft({
  expandedItems,
  toggleExpanded,
  activeSection,
  setSection,
}: SidebarLeftProps) {
  // Separate settings section from main sections
  const mainSections = sidebarSections.filter(section => section.title !== "Settings");
  const settingsSection = sidebarSections.find(section => section.title === "Settings");

  return (
    <div
      className="bg-neutral-950 border-r border-neutral-800 flex flex-col h-full z-10"
      style={{ width: "80px" }}
    >
      {/* Main sections */}
      <div className="flex-1 overflow-y-auto px-2 pt-4">
        {mainSections.map((section) => (
          <MenuSection
            key={section.title}
            section={section}
            expandedItems={expandedItems}
            onToggleExpanded={toggleExpanded}
            isCollapsed
            onSectionChange={setSection}
            activeSection={activeSection}
          />
        ))}
      </div>

      {/* Bottom section with Settings and Avatar */}
      <div className="border-t border-neutral-800 shrink-0">
        {settingsSection && (
          <div className="px-2 pt-4">
            <MenuSection
              key={settingsSection.title}
              section={settingsSection}
              expandedItems={expandedItems}
              onToggleExpanded={toggleExpanded}
              isCollapsed
              onSectionChange={setSection}
              activeSection={activeSection}
            />
          </div>
        )}
        
        <div className="p-4 flex flex-col gap-4 items-center">
          <Avatar />
        </div>
      </div>
    </div>
  );
}