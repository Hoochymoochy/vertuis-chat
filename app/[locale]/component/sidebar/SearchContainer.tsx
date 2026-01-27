"use client";
import { useState } from "react";
import { Search } from "@carbon/icons-react";
import { ANIMATION } from "./sidebar.constants";

export function SearchContainer({ isCollapsed = false }) {
  const [searchValue, setSearchValue] = useState("");

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
        className={`bg-black h-10 relative rounded-lg flex items-center transition-all ${
          isCollapsed ? "w-10 min-w-10 justify-center" : "w-full"
        }`}
        style={{
          transitionDuration: `${ANIMATION.DURATION}ms`,
          transitionTimingFunction: ANIMATION.EASING,
        }}
      >
        <div
          className={`flex items-center justify-center shrink-0 transition-all ${
            isCollapsed ? "p-1" : "px-1"
          }`}
          style={{
            transitionDuration: `${ANIMATION.DURATION}ms`,
            transitionTimingFunction: ANIMATION.EASING,
          }}
        >
          <div className="size-8 flex items-center justify-center">
            <Search size={16} className="text-neutral-50" />
          </div>
        </div>

        {/* Input */}
        <div
          className={`flex-1 min-h-px min-w-px relative transition-opacity overflow-hidden ${
            isCollapsed ? "opacity-0 w-0" : "opacity-100"
          }`}
          style={{
            transitionDuration: `${ANIMATION.DURATION}ms`,
            transitionTimingFunction: ANIMATION.EASING,
          }}
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
