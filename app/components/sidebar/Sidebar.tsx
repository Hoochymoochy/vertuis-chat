// Sidebar.tsx - Pass activeSection to child components
"use client";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import { useSidebar } from "../../hooks/Global/UseSidebar";
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
      
      <SidebarRight activeSection={sidebar.activeSection} 
      isCollapsed={sidebar.isCollapsed}
      toggleCollapse={sidebar.toggleCollapse}
      onChatClick={sidebar.onChatClick}
      onNewChat={sidebar.newChat}
      chats={sidebar.chats}
      onAddCase={sidebar.toggleAddCase}
      onOpenMap={sidebar.onOpenMap}
      onLogout={sidebar.onLogout}
      country={sidebar.country}
      state={sidebar.state}
      lang={sidebar.lang}
      isLangOpen={sidebar.isLangOpen}
      onToggleLang={sidebar.onToggleLang}
      onLanguageChange={sidebar.onLanguageChange}
      t={sidebar.t}
      handleBack={sidebar.handleBack}
      selectedDoc={sidebar.selectedDoc}
      setShowAddDocument={sidebar.setShowAddDocument}
      setSelectedDoc={sidebar.setSelectedDoc}
      />
      

      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}