// useSidebar.ts - Enhanced with chat functionality
import { useCallback, useEffect, useState } from "react";
import { getAllChat } from "@/app/lib/chat";
import { getCountry, getState, getLanguage, setLanguage } from "@/app/lib/user";
import { supabase } from "@/app/lib/supabaseClient";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";


export interface Chat {
  id: string;
  title: string;
  created_at?: string;
  updated_at?: string;
}

export function useSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState<string>("home");
  
  // Chat-specific state
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [lang, setSelectedLang] = useState("en");
  const [country, setSelectedCountry] = useState<string | null>("World");
  const [state, setSelectedState] = useState<string | null>("N/A");
  const [userId, setUserId] = useState<string | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();

  // Fetch user session and chats
  useEffect(() => {
    const fetchChatsAndUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (!user) return;

        setUserId(user.id);

        const chatData = await getAllChat(user.id);
        setChats(chatData);

        const [fetchedCountry, fetchedState, fetchedLang] = await Promise.all([
          getCountry(user.id),
          getState(user.id),
          getLanguage(user.id),
        ]);

        setSelectedCountry(fetchedCountry ?? "World");
        setSelectedState(fetchedState ?? "N/A");
        setSelectedLang(fetchedLang ?? "en");
      } catch (err) {
        console.error("Error fetching user or chat data:", err);
        setSelectedCountry("World");
        setSelectedState("N/A");
        setSelectedLang("en");
      }
    };

    fetchChatsAndUser();
  }, []);

  // Listen for map/location updates
  useEffect(() => {
    const handleStorageChange = async () => {
      if (!userId) return;
      const [fetchedCountry, fetchedState] = await Promise.all([
        getCountry(userId),
        getState(userId)
      ]);
      setSelectedCountry(fetchedCountry ?? "World");
      setSelectedState(fetchedState ?? "N/A");
    };

    window.addEventListener("locationUpdated", handleStorageChange);
    return () => window.removeEventListener("locationUpdated", handleStorageChange);
  }, [userId]);

  // Auto-detect active section based on pathname
  useEffect(() => {
    if (pathname.includes("/chat")) {
      setActiveSection("chat");
    } else if (pathname.includes("/case")) {
      setActiveSection("case");
    } else if (pathname.includes("/settings")) {
      setActiveSection("settings");
    } else {
      setActiveSection("home");
    }
  }, [pathname]);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed(v => !v);
  }, []);

  const toggleExpanded = useCallback((key: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }, []);

  const setSection = useCallback((section: string) => {
    setActiveSection(section);
    console.log("Section set to:", section);
  }, []);

  const setSubSection = useCallback((subSection: string) => {
    console.log("Subsection set to:", subSection);
  }, []);

  const handleLanguageChange = useCallback(async (langCode: string) => {
    setSelectedLang(langCode);
    if (userId) await setLanguage(userId, langCode);
    setIsLangOpen(false);
    // Optionally reload or trigger language change
    router.refresh();
  }, [userId, router]);

  const newChat = useCallback(() => {
    router.push(`/${locale}/chat`);
  }, [router, locale]);

  const handleChatClick = useCallback((id: string) => {
    router.push(`/${locale}/chat/${id}`);
  }, [router, locale]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    router.push(`/${locale}/login`);
  }, [router, locale]);

  const openMap = useCallback(() => {
    setIsMapOpen(true);
  }, []);

  const closeMap = useCallback(() => {
    setIsMapOpen(false);
  }, []);

  return {
    // Original sidebar state
    isCollapsed,
    toggleCollapse,
    expandedItems,
    toggleExpanded,
    activeSection,
    setSection,
    setSubSection,
    
    // Chat-specific state and handlers
    chats,
    userId,
    lang,
    setIsLangOpen,
    isLangOpen,
    country,
    state,
    handleLanguageChange,
    newChat,
    handleChatClick,
    handleLogout,
    isMapOpen,
    openMap,
    closeMap,
  };
}
