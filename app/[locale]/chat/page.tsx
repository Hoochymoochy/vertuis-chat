"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, Transition } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Side from "@/app/[locale]/component/global/side";
import Map from "@/app/[locale]/component/chat/map";
import Spinner from "@/app/[locale]/component/global/spinner";
import InputBox from "@/app/[locale]/component/chat/inputbox";
import useAuth from "@/app/hooks/useAuth";
import useInitialChat from "@/app/hooks/useInitialChat";
import useFileDrop from "@/app/hooks/useFileDrop";
import Overlay from "@/app/[locale]/component/chat/overlay";

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

  const smoothSpring: Transition = { type: "spring", stiffness: 70, damping: 18 };

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Spinner />
          <p className="text-gold text-sm">{t("verifyingAuth")}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[url('/marble.jpg')] bg-cover bg-center"
      {...dragHandlers}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />
      <Overlay isDragging={isDragging} />
      <Side setOpenMap={setOpenMap} />
      <Map openMap={openMap} setOpenMap={setOpenMap} needsOnboarding={needsOnboarding} />

      {/* Onboarding overlay */}
      <AnimatePresence>
        {needsOnboarding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md z-30 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 150, damping: 18 }}
              className="bg-linear-to-br from-gold/15 to-gold/5 border border-gold/30 p-8 max-w-md text-center shadow-2xl"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-gold/20 border-t-gold shadow-[0_0_25px_rgba(255,215,0,0.2)]"
              />
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                {t("welcomeTitle")}
              </h2>
              <p className="text-gold/80 text-sm">
                {t("welcomeMessage")}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Zone */}
      <motion.div
        layout
        className={`relative flex flex-col items-center w-full transition-all duration-500 ${
          isSubmitted ? 'justify-end pb-16' : 'justify-center'
        } ${needsOnboarding ? 'pointer-events-none opacity-50' : ''}`}
      >
        {/* Logo */}
        <motion.div
          layout
          animate={{ y: isSubmitted ? '-100%' : 0 }}
          transition={smoothSpring}
          className="flex items-center justify-center mb-6"
        >
          <motion.h1
            layout
            animate={{ scale: isSubmitted ? 0.9 : 1 }}
            transition={smoothSpring}
            className="text-6xl lg:text-8xl font-serif font-bold tracking-tight drop-shadow-[0_0_25px_rgba(255,215,0,0.15)]"
          >
            <span className="text-gradient">VERITUS</span>
          </motion.h1>
        </motion.div>

        {/* Error Toast */}
        <AnimatePresence>
          {failed && (
            <motion.div
              key="error-toast"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex justify-center items-center mb-4"
            >
              <motion.div
                layout
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                className="max-w-xs bg-gold/15 backdrop-blur-sm border border-gold/30 rounded-2xl px-4 py-3 shadow-lg"
              >
                <p className="text-white text-sm text-center">
                  {t("errorMessage")}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Bar */}
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

      {/* Tagline */}
      <AnimatePresence>
        {!isSubmitted && (
          <motion.div
            key="tagline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`z-20 text-center mt-12 space-y-1 ${needsOnboarding ? 'opacity-50' : ''}`}
          >
            <p className="text-gold text-lg sm:text-xl font-medium uppercase tracking-widest">
              {t("tagline")}
            </p>
            <p className="text-white/70 text-xs italic">{t("disclaimer")}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}