"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { supabase } from "@/app/lib/supabaseClient";
import { getCountry, getState, getLanguage, setLanguage } from "@/app/lib/user";
import { getAllChat } from "@/app/lib/chat";
import { Case } from "@/app/components/case/type";

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
  navigateToSection: (route: string) => void;

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

  // Cases & Documents
  selectedCase: Case | null;
  setSelectCase: (selectedCase: Case | null) => void;
  setCases: (cases: Case[]) => void;
  documents: any[];
  selectDoc: string;
  setSelectDoc: (doc: string) => void;
  setShowAddDocument: () => void;
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
  // Modal states
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingDocument, setIsAddingDocument] = useState(false);
  
  // Active section
  const [activeSection, setActiveSection] = useState("home");

  // Sidebar UI
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Map UI
  const [isMapCollapsed, setIsMapCollapsed] = useState(false);

  // User preferences
  const [lang, setLang] = useState("en");
  const [country, setCountry] = useState<string | null>("World");
  const [state, setState] = useState<string | null>("N/A");
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Chats
  const [chats, setChats] = useState<Chat[]>([]);

  // Cases & Documents
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectDoc, setSelectDoc] = useState("");

  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  // Update active section based on pathname
  useEffect(() => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    
    if (pathWithoutLocale.startsWith("/chat")) {
      setActiveSection("chat");
    } 
    else if (pathWithoutLocale.match(/^\/case\/[^/]+/)) {
      setActiveSection("documents");
    } 
    else if (pathWithoutLocale === "/case") {
      setActiveSection("case");
    } 
    else if (pathWithoutLocale.startsWith("/settings")) {
      setActiveSection("settings");
    } 
    else {
      setActiveSection("home");
    }
  }, [pathname, locale]);

  // Load user preferences
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

  // Load chats
  useEffect(() => {
    if (!userId) return;
    getAllChat(userId).then(setChats);
  }, [userId]);

  // Modal actions
  const toggleAddCase = useCallback(() => setIsAdding((v) => !v), []);
  const closeAddCase = useCallback(() => setIsAdding(false), []);
  const toggleAddDocument = useCallback(() => setIsAddingDocument((v) => !v), []);

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
  const openMap = useCallback(() => setIsMapOpen(true), []);
  const closeMap = useCallback(() => setIsMapOpen(false), []);

  // User preferences actions
  const changeLanguage = useCallback(async (code: string) => {
    setLang(code);
    if (userId) await setLanguage(userId, code);
    setIsLangOpen(false);
    router.refresh();
  }, [userId, router]);

  // Navigation actions
  const navigateToSection = useCallback((route: string) => {
    router.push(`/${locale}${route}`);
  }, [router, locale]);

  // Chat actions
  const newChat = useCallback(() => {
    router.push(`/${locale}/chat`);
  }, [router, locale]);

  const openChat = useCallback((id: string) => {
    router.push(`/${locale}/chat/${id}`);
  }, [router, locale]);

  // Case & Document actions
  const setSelectCase = useCallback((caseItem: Case | null) => {
    setSelectedCase(caseItem);
  }, []);

  const handleSetCases = useCallback((newCases: Case[]) => {
    setCases(newCases);
  }, []);

  const setSelectDocHandler = useCallback((doc: string) => {
    setSelectDoc(doc);
  }, []);

  const setShowAddDocument = useCallback(() => {
    setIsAddingDocument(true);
  }, []);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

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
        navigateToSection,
        
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
        
        // Cases & Documents
        selectedCase,
        setSelectCase,
        setCases: handleSetCases,
        documents,
        selectDoc,
        setSelectDoc: setSelectDocHandler,
        setShowAddDocument,
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