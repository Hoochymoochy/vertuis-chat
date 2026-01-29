import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { supabase } from "@/app/lib/supabaseClient";

import { useSidebarUI } from "../Ui/useSidebarUI";
import { useUser } from "../Auth/useUser";
import { useUserPreferences } from "../Setting/useUserPreferences";
import { useChats } from "../Chat/useChat";

export function useSidebar() {
  const ui = useSidebarUI();
  const { user } = useUser();
  const prefs = useUserPreferences(user.id);
  const chats = useChats(user.id);

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
    user,
    handleLogout: logout,
  };
}
