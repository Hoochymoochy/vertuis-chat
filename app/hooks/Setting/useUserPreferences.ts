import { useCallback, useEffect, useState } from "react";
import { getCountry, getState, getLanguage, setLanguage } from "@/app/lib/user";
import { useRouter } from "next/navigation";

export function useUserPreferences(userId: string | null) {
  const [lang, setLang] = useState("en");
  const [country, setCountry] = useState<string | null>("World");
  const [state, setState] = useState<string | null>("N/A");
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const router = useRouter();

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

  const changeLanguage = useCallback(async (code: string) => {
    setLang(code);
    if (userId) await setLanguage(userId, code);
    setIsLangOpen(false);
    router.refresh();
  }, [userId, router]);

  return {
    lang,
    country,
    state,
    isLangOpen,
    setIsLangOpen,
    isMapOpen,
    openMap: () => setIsMapOpen(true),
    closeMap: () => setIsMapOpen(false),
    changeLanguage,
  };
}
