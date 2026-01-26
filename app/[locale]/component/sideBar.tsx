import { useState } from "react";
import {
  Search,
  Dashboard,
  Task,
  Settings,
  User,
  ChevronDown,
  Home,
  ChartBar,
} from "@carbon/icons-react";

const softSpringEasing = "cubic-bezier(0.25, 1.1, 0.4, 1)";







export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleExpanded = (itemKey) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemKey)) {
        next.delete(itemKey);
      } else {
        next.add(itemKey);
      }
      return next;
    });
  };

  const menuSections = [
    {
      title: "Main",
      items: [
        { icon: <Home size={16} className="text-neutral-50" />, label: "Home", isActive: true },
        { icon: <Dashboard size={16} className="text-neutral-50" />, label: "Research" },
        { icon: <Task size={16} className="text-neutral-50" />, label: "Document Management" },
      ],
    },
  ];

  return (
    <div className="flex h-screen w-full">


      {/* Right Sidebar - Collapsible */}
      <div
        className="bg-neutral-950 border-r border-neutral-800 flex flex-col h-full transition-all duration-500 z-10"
        style={{
          width: isCollapsed ? "80px" : "280px",
          transitionTimingFunction: softSpringEasing
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 h-16 shrink-0 relative">
          <div
            className={`flex items-center gap-3 transition-opacity duration-500 ${
              isCollapsed ? "opacity-0" : "opacity-100"
            }`}
          >
            <span className="text-neutral-50 text-lg font-medium">Workspace</span>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-2 rounded-lg hover:bg-neutral-900 transition-all duration-500 ${
              isCollapsed ? "absolute left-1/2 -translate-x-1/2" : ""
            }`}
            style={{ transitionTimingFunction: softSpringEasing }}
          >
            <ChartBar size={16} className="text-neutral-50" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-4 shrink-0">
          <SearchContainer isCollapsed={isCollapsed} />
        </div>

        {/* Menu Sections */}
        <div className="flex-1 overflow-y-auto px-2">
          {menuSections.map((section, index) => (
            <MenuSection
              key={index}
              section={section}
              expandedItems={expandedItems}
              onToggleExpanded={toggleExpanded}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      </div>
    </div>
  );
}