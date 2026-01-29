// SidebarLeft.tsx - Handle section clicks with Settings at bottom
import { sidebarSections } from "./menu.config";
import { MenuSection } from "./MenuSection";
import Avatar from "./Avatar";
import { SidebarLeftProps } from "./type";

export default function SidebarLeft({
  isCollapsed,
  expandedItems,
  toggleExpanded,
  activeSection,
  setSection,
  pathroute
}: SidebarLeftProps) {
  // Separate settings section from main sections
  const mainSections = sidebarSections.filter(section => section.title !== "Settings");
  const settingsSection = sidebarSections.find(section => section.title === "Settings");

  if (isCollapsed) {
    return null;
  }

  return (
    <div
      className="bg-neutral-950 border-r border-gold-20 flex flex-col h-screen  z-10"
      style={{ width: "80px" }}
    >
      {/* Main sections */}
      <div className="flex-1 overflow-y-auto px-2 pt-20">
        {mainSections.map((section) => (
          <MenuSection
            key={section.title}
            section={section}
            expandedItems={expandedItems}
            onToggleExpanded={toggleExpanded}
            isCollapsed
            onSectionChange={setSection}
            activeSection={activeSection}
            pathroute={pathroute}
          />
        ))}
      </div>

      {/* Bottom section with Settings and Avatar */}
      <div className="border-t border-gold-20 shrink-0 pb-2">
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
              pathroute={pathroute}
            />
          </div>
        )}
      </div>
    </div>
  );
}