import { ANIMATION } from "../sidebar.constants";
import { CaseSectionProps } from "../type";
import { AddButton } from "../Button";

export function CaseSection({
  isCollapsed,
  onAddCase,
}: CaseSectionProps) {

  return (
    <div className="flex flex-col h-full">
      {/* New Chat Button */}
      <div
        className={`shrink-0 transition-all ${
          isCollapsed ? "p-2" : "p-4"
        }`}
        style={{
          transitionDuration: `${ANIMATION.DURATION}ms`,
          transitionTimingFunction: ANIMATION.EASING,
        }}
      >
        <AddButton onClick={() => onAddCase()} isCollapsed={isCollapsed} label="Case" />

      </div>
    </div>
  );
}
