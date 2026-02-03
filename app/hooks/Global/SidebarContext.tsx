"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { supabase } from "@/app/lib/supabaseClient";
import { getCountry, getState, getLanguage, setLanguage } from "@/app/lib/user";
import { getAllChat } from "@/app/lib/chat";

export interface Chat {
  id: string;
  title: string;
}

type SidebarContextType = {
  // Modal states
  isAdding: boolean;
  isAddingDocument: boolean;
  toggleAddCase: () => void;
  toggleAddDocument: () => void;
  closeAddCase: () => void;

  // Active section
  activeSection: string;
  setActiveSection: (section: string) => void;

  // Sidebar UI
  isCollapsed: boolean;
  toggleCollapse: () => void;
  expandedItems: Set<string>;
  toggleExpanded: (key: string) => void;

  // Map UI
  isMapCollapsed: boolean;
  toggleMapCollapse: () => void;

  // User preferences
  lang: string;
  country: string | null;
  state: string | null;
  isLangOpen: boolean;
  setIsLangOpen: (open: boolean) => void;
  isMapOpen: boolean;
  openMap: () => void;
  closeMap: () => void;
  changeLanguage: (code: string) => void;

  // Chats
  chats: Chat[];
  newChat: () => void;
  openChat: (id: string) => void;

  // Documents
  castItem: string;
  documents: any[];
  selectDoc: string;
  setShowAddDocument: () => void;
  setSelectDoc: (doc: string) => void;
  handleBack: () => void;

  // Auth
  userId: string | null;
  handleLogout: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ 
  children,
  userId 
}: { 
  children: ReactNode;
  userId: string | null;
}) {
  // Modal state (from useAddCase)
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingDocument, setIsAddingDocument] = useState(false);
  // Active section (from useSidebarUI)
  const [activeSection, setActiveSection] = useState("home");

  // Sidebar UI (from useSidebarUI)
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Map UI (from useMapUI)
  const [isMapCollapsed, setIsMapCollapsed] = useState(false);

  // User preferences (from useUserPreferences)
  const [lang, setLang] = useState("en");
  const [country, setCountry] = useState<string | null>("World");
  const [state, setState] = useState<string | null>("N/A");
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Chats (from useChats)
  const [chats, setChats] = useState<Chat[]>([]);

  // Documents (from useDocuments)
  const [castItem, setCastItem] = useState("");
  const [documents, setDocuments] = useState([]);
  const [selectDoc, setSelectDoc] = useState("");

  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  // Update active section based on pathname (from useSidebar)
  useEffect(() => {
    // Remove locale prefix for cleaner matching
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    
    if (pathWithoutLocale.startsWith("/chat")) {
      setActiveSection("chat");
    } 
    // Check for /case/[id] BEFORE checking for /case
    else if (pathWithoutLocale.match(/^\/case\/[^/]+/)) {
      setActiveSection("documents");  // ✅ /case/123 → documents
    } 
    else if (pathWithoutLocale === "/case") {
      setActiveSection("case");  // ✅ /case → case list
    } 
    else if (pathWithoutLocale.startsWith("/settings")) {
      setActiveSection("settings");
    } 
    else {
      setActiveSection("home");
    }
  }, [pathname, locale]);

  // Load user preferences (from useUserPreferences)
  useEffect(() => {
    if (!userId) return;

    Promise.all([
      getCountry(userId),
      getState(userId),
      getLanguage(userId),
    ]).then(([c, s, l]) => {
      setCountry(c ?? "World");
      setState(s ?? "N/A");
      setLang(l ?? "en");
    });
  }, [userId]);

  // Load chats (from useChats)
  useEffect(() => {
    if (!userId) return;
    getAllChat(userId).then(setChats);
  }, [userId]);

  // Modal actions
  const toggleAddCase = useCallback(() => setIsAdding((v) => !v), []);
  const closeAddCase = useCallback(() => setIsAdding(false), []);

  const toggleAddDocument = useCallback(() => setIsAddingDocument((v) => !v), []);
  const closeAddDocument = useCallback(() => setIsAddingDocument(false), []);

  // Sidebar UI actions
  const toggleCollapse = useCallback(() => setIsCollapsed((v) => !v), []);
  
  const toggleExpanded = useCallback((key: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }, []);

  // Map UI actions
  const toggleMapCollapse = useCallback(() => setIsMapCollapsed((v) => !v), []);

  // User preferences actions
  const openMap = useCallback(() => setIsMapOpen(true), []);
  const closeMap = useCallback(() => setIsMapOpen(false), []);
  
  const changeLanguage = useCallback(async (code: string) => {
    setLang(code);
    if (userId) await setLanguage(userId, code);
    setIsLangOpen(false);
    router.refresh();
  }, [userId, router]);

  // Chat actions
  const newChat = useCallback(() => {
    router.push(`/${locale}/chat`);
    console.log("New chat");
  }, [router, locale]);

  const openChat = useCallback((id: string) => {
    router.push(`/${locale}/chat/${id}`);
  }, [router, locale]);

  // Document actions
  const handleBack = useCallback(() => {
    // Implement your back logic here
  }, []);

  const setShowAddDocument = useCallback(() => {
    // Implement your add document logic here
  }, []);

  const setSelectDocHandler = useCallback((doc: string) => {
    setSelectDoc(doc);
  }, []);

  // Auth actions
  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    router.push(`/${locale}/login`);
  }, [router, locale]);

  return (
    <SidebarContext.Provider
      value={{
        // Modal
        isAdding,
        toggleAddCase,
        closeAddCase,
        isAddingDocument,
        toggleAddDocument,
        
        
        // Active section
        activeSection,
        setActiveSection,
        
        // Sidebar UI
        isCollapsed,
        toggleCollapse,
        expandedItems,
        toggleExpanded,
        
        // Map UI
        isMapCollapsed,
        toggleMapCollapse,
        
        // User preferences
        lang,
        country,
        state,
        isLangOpen,
        setIsLangOpen,
        isMapOpen,
        openMap,
        closeMap,
        changeLanguage,
        
        // Chats
        chats,
        newChat,
        openChat,
        
        
        // Documents
        castItem,
        documents,
        selectDoc,
        setShowAddDocument,
        setSelectDoc: setSelectDocHandler,
        handleBack,
        
        // Auth
        userId,
        handleLogout,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used inside SidebarProvider");
  }
  return context;
}