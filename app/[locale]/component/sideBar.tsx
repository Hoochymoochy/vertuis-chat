import { useState } from "react";
import {
  Search,
  Dashboard,
  Task,
  Folder,
  Calendar,
  UserMultiple,
  Analytics,
  DocumentAdd,
  Settings,
  User,
  ChevronDown,
  Home,
  ChartBar,
  FolderOpen,
} from "@carbon/icons-react";

const softSpringEasing = "cubic-bezier(0.25, 1.1, 0.4, 1)";

// SVG paths for the logo
const svgPaths = {
  p36880f80: "M0 0H8V5.33333H0V0Z",
  p355df480: "M16 0H24V5.33333H16V0Z",
  pfa0d600: "M8 10.6667H16V16H8V10.6667Z"
};

function InterfacesLogo() {
  return (
    <div className="aspect-[24/24] basis-0 grow min-h-px min-w-px overflow-clip relative shrink-0">
      <div className="absolute aspect-[24/16] left-0 right-0 top-1/2 translate-y-[-50%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 16">
          <g>
            <path d={svgPaths.p36880f80} fill="#FAFAFA" />
            <path d={svgPaths.p355df480} fill="#FAFAFA" />
            <path d={svgPaths.pfa0d600} fill="#FAFAFA" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Avatar() {
  return (
    <div className="bg-black relative rounded-full shrink-0 size-8">
      <div className="flex items-center justify-center size-8">
        <User size={16} className="text-neutral-50" />
      </div>
      <div className="absolute border border-neutral-800 inset-0 pointer-events-none rounded-full" />
    </div>
  );
}

function SearchContainer({ isCollapsed = false }) {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div
      className={`relative shrink-0 transition-all duration-500 ${isCollapsed ? "w-full flex justify-center" : "w-full"}`}
      style={{ transitionTimingFunction: softSpringEasing }}
    >
      <div
        className={`bg-black h-10 relative rounded-lg flex items-center transition-all duration-500 ${
          isCollapsed ? "w-10 min-w-10 justify-center" : "w-full"
        }`}
        style={{ transitionTimingFunction: softSpringEasing }}
      >
        <div className={`flex items-center justify-center shrink-0 transition-all duration-500 ${isCollapsed ? "p-1" : "px-1"}`}>
          <div className="size-8 flex items-center justify-center">
            <Search size={16} className="text-neutral-50" />
          </div>
        </div>
        <div
          className={`flex-1 min-h-px min-w-px relative transition-opacity duration-500 overflow-hidden ${
            isCollapsed ? "opacity-0 w-0" : "opacity-100"
          }`}
        >
          <div className="flex flex-col justify-center relative size-full">
            <div className="flex flex-col gap-2 items-start justify-center pl-0 pr-2 py-1 relative w-full">
              <input
                type="text"
                placeholder="Search tasks, projects..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-sm text-neutral-50 placeholder:text-neutral-400"
                tabIndex={isCollapsed ? -1 : 0}
              />
            </div>
          </div>
        </div>
        <div className="absolute border border-neutral-800 inset-0 pointer-events-none rounded-lg" />
      </div>
    </div>
  );
}

function MenuItem({ item, isExpanded, onToggle, onItemClick, isCollapsed }) {
  const handleClick = () => {
    if (item.hasDropdown && onToggle) {
      onToggle();
    } else if (onItemClick) {
      onItemClick();
    }
  };

  return (
    <div
      className={`relative shrink-0 transition-all duration-500 ${isCollapsed ? "w-full flex justify-center" : "w-full"}`}
      style={{ transitionTimingFunction: softSpringEasing }}
    >
      <div
        className={`select-none rounded-lg cursor-pointer transition-all duration-500 flex items-center relative my-0.5 ${
          item.isActive ? "bg-neutral-900" : "hover:bg-neutral-900"
        } ${isCollapsed ? "w-10 min-w-10 h-10 justify-center p-4" : "w-full h-10 px-4 py-2"}`}
        style={{ transitionTimingFunction: softSpringEasing }}
        onClick={handleClick}
        title={isCollapsed ? item.label : undefined}
      >
        <div className="flex items-center justify-center shrink-0">{item.icon}</div>
        <div
          className={`flex-1 min-h-px min-w-px relative transition-opacity duration-500 overflow-hidden ${
            isCollapsed ? "opacity-0 w-0" : "opacity-100 ml-3"
          }`}
        >
          <div className="flex flex-col justify-center relative size-full">
            <div className="text-sm text-neutral-50 truncate">{item.label}</div>
          </div>
        </div>
        {item.hasDropdown && (
          <div className={`flex items-center justify-center shrink-0 transition-opacity duration-500 ${isCollapsed ? "opacity-0 w-0" : "opacity-100 ml-2"}`}>
            <ChevronDown
              size={16}
              className="text-neutral-50 transition-transform duration-500"
              style={{
                transitionTimingFunction: softSpringEasing,
                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function SubMenuItem({ item, onItemClick }) {
  return (
    <div className="select-none w-full pl-9 pr-1 py-[1px]">
      <div
        className="h-10 w-full rounded-lg cursor-pointer transition-colors hover:bg-neutral-900 flex items-center px-3 py-1"
        onClick={onItemClick}
      >
        <div className="flex-1 min-w-0">
          <div className="text-sm text-neutral-300 truncate">{item.label}</div>
        </div>
      </div>
    </div>
  );
}

function MenuSection({ section, expandedItems, onToggleExpanded, isCollapsed }) {
  return (
    <div className="flex flex-col items-start w-full">
      <div
        className={`relative shrink-0 w-full transition-all duration-500 overflow-hidden ${
          isCollapsed ? "h-0 opacity-0" : "h-10 opacity-100"
        }`}
        style={{ transitionTimingFunction: softSpringEasing }}
      >
        <div className="flex flex-col justify-center relative size-full">
          <div className="flex flex-col h-10 items-start justify-center px-4">
            <p className="text-sm text-neutral-400 leading-5">{section.title}</p>
          </div>
        </div>
      </div>
      {section.items.map((item, index) => {
        const itemKey = `${section.title}-${index}`;
        const isExpanded = expandedItems.has(itemKey);
        return (
          <div key={itemKey} className="w-full flex flex-col">
            <MenuItem
              item={item}
              isExpanded={isExpanded}
              onToggle={() => onToggleExpanded(itemKey)}
              onItemClick={() => console.log(`Clicked ${item.label}`)}
              isCollapsed={isCollapsed}
            />
            {isExpanded && item.children && !isCollapsed && (
              <div className="flex flex-col gap-1 mb-2">
                {item.children.map((child, childIndex) => (
                  <SubMenuItem
                    key={`${itemKey}-${childIndex}`}
                    item={child}
                    onItemClick={() => console.log(`Clicked ${child.label}`)}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

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
      {/* Left Sidebar - Fixed */}
      <div
        className="bg-neutral-950 border-r border-neutral-800 flex flex-col h-full"
        style={{ width: "80px" }}
      >
        <div className="flex-1 overflow-y-auto px-2">
          {menuSections.map((section, index) => (
            <MenuSection
              key={index}
              section={section}
              expandedItems={expandedItems}
              onToggleExpanded={toggleExpanded}
              isCollapsed={true}
            />
          ))}
        </div>

        <div className="p-4 border-t border-neutral-800 shrink-0 flex flex-col gap-4 items-center">
          <Settings size={16} className="text-neutral-400 cursor-pointer hover:text-neutral-50" />
          <Avatar />
        </div>
      </div>

      {/* Right Sidebar - Collapsible */}
      <div
        className="bg-neutral-950 border-r border-neutral-800 flex flex-col h-full transition-all duration-500"
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
            <InterfacesLogo />
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