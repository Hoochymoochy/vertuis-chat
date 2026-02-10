"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";

import { InputBox } from "@/app/components/chat/InputBox";
import { ChatMessageRenderer } from "../../../../components/chat/LoadingMessage";

import { useChatSession } from "@/app/hooks/Chat/useChatSession";
import { useAutoScroll } from "@/app/hooks/Chat/useAutoScroll";
import { Overlay } from "@/app/components/chat/Overlay";

export default function ChatPage() {
  const t = useTranslations("ChatPage");
  const tChat = useTranslations("Chat");

  const bottomRef = useRef<HTMLDivElement>(null);

  const { isLoading, failed, handleSubmit, messages } = useChatSession();

  useAutoScroll(bottomRef, [messages]);

  return (
    <div className="relative flex flex-col h-screen z-0 px-4 py-6">
      
      <Overlay />
      <header className="relative flex justify-center pt-6 pb-4">
        <h1 className="text-6xl lg:text-8xl font-serif font-bold tracking-tight">
          <span className="text-gradient">VERITUS</span>
        </h1>
      </header>

      <main className="relative flex-1 flex flex-col items-center pb-12">
        <div className="flex-1 min-h-0 w-full max-w-4xl mx-auto pt-4 pb-24 overflow-y-auto">
          <ChatMessageRenderer messages={messages} />
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
        />
      </main>
    </div>
  );
}
