import { ChevronDown } from "@carbon/icons-react";
import { ANIMATION } from "./sidebar.constants";
import { MenuItemProps } from "./type";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";



export function MenuItem({
  item,
  onToggle,
  onItemClick,
  isCollapsed,
  setSubSection
}: MenuItemProps) {
  const Icon = item.icon;
  const locale = useLocale();
  const router = useRouter();
  

  const handleClick = () => {
    if (item.hasDropdown && onToggle) {
      onToggle();
    } else if (onItemClick) {
      onItemClick();
    }
  };

  return (
    <div
      className={`relative shrink-0 transition-all ${
        isCollapsed ? "w-full flex justify-center" : "w-full"
      }`}
      style={{
        transitionDuration: `${ANIMATION.DURATION}ms`,
        transitionTimingFunction: ANIMATION.EASING,
      }}
    >
      <div
        onClick={handleClick}
        title={isCollapsed ? item.label : undefined}
        className={`
          select-none cursor-pointer rounded-lg flex items-center relative my-0.5
          transition-all
          ${item.isActive ? "bg-neutral-900" : "hover:bg-neutral-900"}
          ${isCollapsed
            ? "w-10 h-10 justify-center p-4"
            : "w-full h-10 px-4 py-2"}
        `}
        style={{
          transitionDuration: `${ANIMATION.DURATION}ms`,
          transitionTimingFunction: ANIMATION.EASING,
        }}
      >
        {/* Icon */}
        <button
          className="flex items-center justify-center shrink-0"
          onClick={() => {
            if (item.route) {
              router.push(`/${locale}/${item.route}`);
            }
          }}
        >
          <Icon size={16} className="text-neutral-50" />
        </button>

        {/* Label */}
        <div
          className={`
            flex-1 overflow-hidden transition-opacity
            ${isCollapsed ? "opacity-0 w-0" : "opacity-100 ml-3"}
          `}
          style={{
            transitionDuration: `${ANIMATION.DURATION}ms`,
            transitionTimingFunction: ANIMATION.EASING,
          }}
        >
          <span className="text-sm text-neutral-50 truncate">
            {item.label}
          </span>
        </div>

        {/* Dropdown Chevron */}
        {item.hasDropdown && (
          <div
            className={`
              shrink-0 transition-opacity
              ${isCollapsed ? "opacity-0 w-0" : "opacity-100 ml-2"}
            `}
          >
            <ChevronDown
              size={16}
              className="text-neutral-50 transition-transform"
              style={{
                transitionDuration: `${ANIMATION.DURATION}ms`,
                transitionTimingFunction: ANIMATION.EASING,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
