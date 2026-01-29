import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { supabase } from "@/app/lib/supabaseClient";

import { useSidebarUI } from "../Ui/useSidebarUI";
import { useAuth } from "../Auth/useAuth";
import { useUserPreferences } from "../Setting/useUserPreferences";
import { useChats } from "../Chat/useChat";

import { useMapUI } from "../Ui/useMapUI";

export function useSidebar() {
  const ui = useSidebarUI();
  const mapUI = useMapUI();
  const { userId } = useAuth();
  const prefs = useUserPreferences(userId);
  const chats = useChats(userId);

  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (pathname.includes("/chat")) ui.setActiveSection("chat");
    else if (pathname.includes("/case")) ui.setActiveSection("case");
    else if (pathname.includes("/settings")) ui.setActiveSection("settings");
    else ui.setActiveSection("home");
  }, [pathname]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push(`/${locale}/login`);
  };

  return {
    ...ui,
    ...prefs,
    ...chats,
    ...mapUI,
    handleLogout: logout,
  };
}
