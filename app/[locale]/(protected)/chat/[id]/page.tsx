"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import Map from "../../../../components/chat/map";
import InputBox from "../../../../components/chat/inputbox";
import { ChatMessageRenderer } from "../../../../components/chat/ChatMessageRenderer";

import { useChatSession } from "@/app/hooks/Chat/useChatSession";
import { useAutoScroll } from "@/app/hooks/Chat/useAutoScroll";

export default function ChatPage() {
  const t = useTranslations("ChatPage");
  const tChat = useTranslations("Chat");

  const [openMap, setOpenMap] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { deduplicatedMessages, isLoading, failed, handleSubmit, isCheckingAuth } = useChatSession();

  useAutoScroll(bottomRef, [deduplicatedMessages]);

  return (
    <div className="bg-[url('/marble.jpg')] bg-cover bg-fixed min-h-screen w-full flex flex-col px-4 py-6 relative">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      <Map openMap={openMap} setOpenMap={setOpenMap} />

      <header className="relative flex justify-center pt-6 pb-4">
        <h1 className="text-6xl lg:text-8xl font-serif font-bold tracking-tight">
          <span className="text-gradient">VERITUS</span>
        </h1>
      </header>

      <main className="relative flex-1 flex flex-col items-center pb-12">
        <div className="flex-1 min-h-0 w-full max-w-4xl mx-auto pt-4 pb-24 overflow-y-auto">
          <ChatMessageRenderer messages={deduplicatedMessages} />
          <div ref={bottomRef} />
        </div>

        {failed && (
          <div className="max-w-xs bg-red-500/20 border border-red-500/30 rounded-2xl px-4 py-3 mb-4">
            <p className="text-red-200 text-sm">
              {t("failedMessage")}
            </p>
          </div>
        )}

        <InputBox
          onSubmit={handleSubmit}
          isLoading={isLoading}
          disabled={false}
          placeholder={tChat("placeholder")}
          showFileUpload={false}
        />
      </main>
    </div>
  );
}
