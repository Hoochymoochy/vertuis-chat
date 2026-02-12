import { ANIMATION } from "../sidebar.constants";
import { AddButton } from "../Button";
import { useSidebar } from "../../../hooks/Global/SidebarContext";
import { useTranslations } from "next-intl";

export function CaseSection() {
  const { isCollapsed, toggleAddCase } = useSidebar();
  const t = useTranslations("Sidebar");

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
        <AddButton onClick={toggleAddCase} isCollapsed={isCollapsed} label={t("case")} />
      </div>
    </div>
  );
}