// Sidebar.tsx - Pass activeSection to child components
"use client";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import { useSidebar } from "../../hooks/Global/SidebarContext";
import React from "react";


export function Sidebar({ children }: { children: React.ReactNode }) {

  const sidebar = useSidebar();

  return (
    <div className="flex h-screen">
      <SidebarLeft {...sidebar}/>
      <SidebarRight {...sidebar}/>

      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}