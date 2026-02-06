"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, Transition } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Map from "../../../components/chat/map";
import InputBox from "../../../components/chat/inputbox";
import { useAuth } from "@/app/hooks/Auth/useAuth";
import useInitialChat from "@/app/hooks/Chat/useInitialChat";
import { Tagline } from "@/app/components/chat/Tagline";
import { useSidebar } from "@/app/hooks/Global/SidebarContext";

export default function Chat() {
  const t = useTranslations("Chat");
  const locale = useLocale();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { isMapCollapsed, toggleMapCollapse, isCollapsed } = useSidebar();

  const { userId, isCheckingAuth, needsOnboarding } = useAuth();
  const { isLoading, failed, startChat } = useInitialChat(userId);

  const smoothSpring: Transition = { 
    type: "spring", 
    stiffness: 80, 
    damping: 20,
    mass: 0.8
  };

  const handleSubmit = async (message: string) => {
    setIsSubmitted(true);
    await startChat(message, locale);
  };

  useEffect(() => {
    if (needsOnboarding) {
      toggleMapCollapse();
    }
  }, [needsOnboarding]);

  return (
    <div className="relative flex flex-col h-screen z-0">      
      
      <Map openMap={isMapCollapsed} setOpenMap={toggleMapCollapse} needsOnboarding={needsOnboarding} />

      <motion.div
        layout
        className={`relative flex flex-col items-center w-full max-w-4xl mx-auto px-4 sm:px-6 transition-all duration-700 ease-out ${
          isSubmitted 
            ? 'justify-start pt-16 pb-8 min-h-screen' 
            : 'justify-center min-h-screen'
        } ${needsOnboarding ? 'pointer-events-none opacity-40' : ''}`}
      >
        <motion.div
          layout
          animate={{ 
            y: isSubmitted ? 0 : 0,
            scale: isSubmitted ? 0.75 : 1
          }}
          transition={smoothSpring}
          className={`flex items-center justify-center mb-8 ${
            isSubmitted ? 'mt-0' : 'mt-0'
          }`}
        >
          <motion.h1
            layout
            className="relative text-7xl sm:text-8xl lg:text-9xl font-serif font-bold tracking-tight"
            style={{
              textShadow: '0 0 40px rgba(255, 215, 0, 0.2), 0 0 80px rgba(255, 215, 0, 0.1)'
            }}
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-gradient inline-block"
            >
              VERITUS
            </motion.span>
            
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/10 to-gold/0 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"
              aria-hidden="true"
            />
          </motion.h1>
        </motion.div>

        <AnimatePresence mode="wait">
          {failed && (
            <motion.div
              key="error-toast"
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="flex justify-center items-center mb-6 w-full"
            >
              <motion.div
                layout
                className="max-w-md w-full bg-gradient-to-br from-red-500/15 via-red-600/10 to-red-500/15 backdrop-blur-md border border-red-400/30 rounded-xl px-5 py-4 shadow-[0_8px_32px_rgba(239,68,68,0.15)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  <p className="text-white/90 text-sm font-medium">
                    {t("errorMessage")}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          layout
          className="w-full max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <InputBox
            onSubmit={handleSubmit}
            isLoading={isLoading}
            disabled={needsOnboarding}
            placeholder={t("placeholder")}
            showFileUpload={false}
          />
        </motion.div>
      </motion.div>

      <Tagline
        needsOnboarding={needsOnboarding}
        isSubmitted={isSubmitted}
        t={t}
        isCollapsed={isCollapsed}
      />
    </div>
  );
}