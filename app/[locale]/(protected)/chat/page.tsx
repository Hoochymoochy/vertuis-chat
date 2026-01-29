"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, Transition } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Sidebar } from "../../../components/sidebar/Sidebar";
import Map from "../../../components/chat/map";
import Spinner from "../../../components/global/spinner";
import InputBox from "../../../components/chat/inputbox";
import useAuth from "@/app/hooks/Auth/useAuth";
import useInitialChat from "@/app/hooks/Chat/useInitialChat";
import useFileDrop from "@/app/hooks/Case/useFileDrop";
import Overlay from "../../../components/chat/overlay";

export default function Chat() {
  const t = useTranslations("Chat");
  const locale = useLocale();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openMap, setOpenMap] = useState(false);
  
  const { userId, isCheckingAuth, needsOnboarding } = useAuth();
  const { isLoading, failed, startChat } = useInitialChat(userId);
  
  const { isDragging, droppedFile, dragHandlers, clearDroppedFile } = useFileDrop({
    acceptedFileTypes: ['.pdf', '.docx', '.txt'],
    maxFileSize: 10,
    onError: (message) => alert(message),
  });

  const smoothSpring: Transition = { 
    type: "spring", 
    stiffness: 80, 
    damping: 20,
    mass: 0.8
  };

  const handleSubmit = async (message: string, file?: File | null) => {
    setIsSubmitted(true);
    await startChat(message, locale, file);
    clearDroppedFile();
  };

  useEffect(() => {
    if (needsOnboarding) {
      setOpenMap(true);
    }
  }, [needsOnboarding]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
        <div className="flex flex-col items-center gap-6">
          <Spinner />
          <p className="text-gold/80 text-sm tracking-wide">{t("verifyingAuth")}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className="relative min-h-screen flex flex-col items-center overflow-hidden bg-[url('/marble.jpg')] bg-cover bg-center"
      {...dragHandlers}
    >
      {/* Enhanced background overlay with better depth */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70 backdrop-blur-sm"
      />
      
      {/* Subtle vignette effect */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/40 pointer-events-none" />
      
      <Overlay isDragging={isDragging} />
      <Map openMap={openMap} setOpenMap={setOpenMap} needsOnboarding={needsOnboarding} />

      {/* Enhanced Onboarding overlay */}
      <AnimatePresence>
        {needsOnboarding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl z-30 flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ 
                type: 'spring', 
                stiffness: 100, 
                damping: 20,
                delay: 0.1 
              }}
              className="relative bg-gradient-to-br from-gold/10 via-transparent to-gold/5 border border-gold/20 rounded-2xl p-10 max-w-lg w-full text-center shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_80px_rgba(255,215,0,0.08)]"
            >
              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-gold/30 rounded-tl-2xl" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-gold/30 rounded-br-2xl" />
              
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 mx-auto mb-8 rounded-full border-[3px] border-gold/15 border-t-gold/60 shadow-[0_0_30px_rgba(255,215,0,0.15),inset_0_0_20px_rgba(255,215,0,0.05)]"
              />
              
              <h2 className="text-4xl font-serif font-bold text-white mb-4 tracking-tight">
                {t("welcomeTitle")}
              </h2>
              
              <p className="text-gold/70 text-base leading-relaxed max-w-md mx-auto">
                {t("welcomeMessage")}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Container with improved layout */}
      <motion.div
        layout
        className={`relative flex flex-col items-center w-full max-w-4xl mx-auto px-4 sm:px-6 transition-all duration-700 ease-out ${
          isSubmitted 
            ? 'justify-start pt-16 pb-8 min-h-screen' 
            : 'justify-center min-h-screen'
        } ${needsOnboarding ? 'pointer-events-none opacity-40' : ''}`}
      >
        {/* Logo with enhanced animations */}
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
            
            {/* Subtle glow effect on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/10 to-gold/0 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"
              aria-hidden="true"
            />
          </motion.h1>
        </motion.div>

        {/* Improved Error Toast */}
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

        {/* Enhanced Input Box with better spacing */}
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
            filePlaceholder={t("filePlaceholder")}
            acceptedFileTypes=".pdf,.docx,.txt"
            showFileUpload={true}
            maxFileSize={10}
            droppedFile={droppedFile}
          />
        </motion.div>
      </motion.div>

      {/* Enhanced Tagline with better typography */}
      <AnimatePresence>
        {!isSubmitted && (
          <motion.div
            key="tagline"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.8, 
              ease: [0.4, 0, 0.2, 1],
              delay: 0.4 
            }}
            className={`fixed bottom-8 left-0 right-0 z-10 text-center px-4 space-y-2 ${
              needsOnboarding ? 'opacity-30' : ''
            }`}
          >
            <p className="text-gold/90 text-base sm:text-lg font-medium uppercase tracking-[0.25em] drop-shadow-lg">
              {t("tagline")}
            </p>
            <p className="text-white/50 text-xs sm:text-sm italic tracking-wide">
              {t("disclaimer")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}