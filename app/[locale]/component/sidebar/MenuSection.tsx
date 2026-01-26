import { MenuItem } from "./MenuItem";
import { ANIMATION } from "./sidebar.constants";
import { MenuSectionProps } from "./type";

export function MenuSection({
  section,
  expandedItems,
  onToggleExpanded,
  isCollapsed,
}: MenuSectionProps) {
  return (
    <div className="flex flex-col w-full">
      {/* Section Header */}
      <div
        className={`overflow-hidden transition-all ${
          isCollapsed ? "h-0 opacity-0" : "h-10 opacity-100"
        }`}
        style={{
          transitionDuration: `${ANIMATION.DURATION}ms`,
          transitionTimingFunction: ANIMATION.EASING,
        }}
      >
        <div className="h-10 flex items-center px-4">
          <p className="text-sm text-neutral-400">
            {section.title}
          </p>
        </div>
      </div>

      {/* Items */}
      {section.items.map((item) => {
        const key = `${section.title}:${item.id}`;
        return (
          <MenuItem
            key={key}
            item={item}
            isCollapsed={isCollapsed}
            onToggle={() => onToggleExpanded(key)}
            onItemClick={() => onToggleExpanded(key)}
          />
        );
      })}
    </div>
  );
}
