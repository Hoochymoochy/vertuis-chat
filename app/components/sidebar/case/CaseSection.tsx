import { ANIMATION } from "../sidebar.constants";
import { AddButton } from "../Button";
import { useSidebar } from "../../../hooks/Global/SidebarContext";

export function CaseSection() {
  const { isCollapsed, toggleAddCase } = useSidebar();

  return (
    <div className="flex flex-col h-full">
      {/* Add Case Button */}
      <div
        className={`shrink-0 transition-all ${
          isCollapsed ? "p-2" : "p-4"
        }`}
        style={{
          transitionDuration: `${ANIMATION.DURATION}ms`,
          transitionTimingFunction: ANIMATION.EASING,
        }}
      >
        <AddButton onClick={toggleAddCase} isCollapsed={isCollapsed} label="Case" />
      </div>
    </div>
  );
}