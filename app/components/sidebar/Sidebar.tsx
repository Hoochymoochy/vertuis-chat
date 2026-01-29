// Sidebar.tsx - Pass activeSection to child components
"use client";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import { useSidebar } from "../../hooks/Global/UseSidebar";
import { SidebarContent } from "./type";
import React from "react";


export function Sidebar({ children }: { children: React.ReactNode }) {

  const sidebar = useSidebar();

  return (
    <div className="flex h-screen">
      <SidebarLeft 
      isCollapsed={sidebar.isCollapsed} 
      expandedItems={sidebar.expandedItems} 
      toggleExpanded={sidebar.toggleExpanded} 
      activeSection={sidebar.activeSection} 
      setSection={sidebar.setSection} 
      />
      {/* <SidebarRight activeSection={sidebar.activeSection} /> */}
      

      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}