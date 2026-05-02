// Sidebar.tsx - Simplified wrapper, no prop drilling needed
"use client";
import React from "react";

import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";

export function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <SidebarLeft />
      <SidebarRight />

      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}