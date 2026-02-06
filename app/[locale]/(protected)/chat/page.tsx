"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

import Map from "../../../components/chat/Map";
import InputBox from "../../../components/chat/InputBox";
import { Tagline } from "@/app/components/chat/Tagline";

import { useSidebar } from "@/app/hooks/Global/SidebarContext";

import { useChatController } from "../../../hooks/Chat/useChatController";
import { useChatAnimations } from "../../../hooks/Chat/useChatAnimations";

export default function Chat() {
  const t = useTranslations("Chat");

  const { isMapCollapsed, toggleMapCollapse, isCollapsed, userId } = useSidebar();

  const { isSubmitted, isLoading, failed, handleSubmit } = useChatController(userId);

  const { smoothSpring } = useChatAnimations();

  return (
    <div className="relative flex flex-col h-screen z-0">
      <Map
        openMap={isMapCollapsed}
        setOpenMap={toggleMapCollapse}
      />

      <motion.div
        layout
        className={`relative flex flex-col items-center w-full max-w-4xl mx-auto px-4 sm:px-6 transition-all duration-700 ease-out ${
          isSubmitted
            ? "justify-start pt-16 pb-8 min-h-screen"
            : "justify-center min-h-screen"
                }`}
        >
        {/* Title */}
        <motion.div
          layout
          animate={{ scale: isSubmitted ? 0.75 : 1 }}
          transition={smoothSpring}
          className="flex items-center justify-center mb-8"
        >
          <motion.h1 className="text-7xl sm:text-8xl lg:text-9xl font-serif font-bold tracking-tight text-gradient">
            VERITUS
          </motion.h1>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {failed && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <p className="text-red-400 text-sm">
                {t("errorMessage")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input */}
        <div className="w-full max-w-3xl">
          <InputBox
            onSubmit={handleSubmit}
            isLoading={isLoading}
            placeholder={t("placeholder")}
            showFileUpload={false}
          />
        </div>
      </motion.div>

      <Tagline
        isSubmitted={isSubmitted}
        t={t}
        isCollapsed={isCollapsed}
      />
    </div>
  );
}
