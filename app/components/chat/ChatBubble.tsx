"use client"

import React from "react"
import ReactMarkdown from "react-markdown"
import { Bubble } from "./type"
import { ThumbsUp, ThumbsDown, X } from "lucide-react"
import { useTranslations } from "next-intl"

import { useStreamingMessage } from "@/app/hooks/Chat/useStreamingMessage"
import { useChatFeedback } from "@/app/hooks/Chat/useChatFeedback"
import { useFeedbackReasons } from "@/app/hooks/Chat/useFeedbackReasons"

export default function ChatBubble({ id, message, isLast, isStreaming }: Bubble) {
  const t = useTranslations("ChatBubble")

  const displayMessage = useStreamingMessage(message, isStreaming)

  const { feedback, showReasons, selectedReason, isSubmitting, startFeedback, selectReason, skipReason, reset } = useChatFeedback(id, message)

  const reasons = useFeedbackReasons(feedback)

  const linkify = (text: string) =>
    text.replace(/(https?:\/\/[^\s]+)/g, (url) => `[${url}](${url})`)

  return (
    <div className="flex flex-col items-start space-y-3">
      {/* Message bubble */}
      <div className="bg-black/60 border border-gold/30 px-4 py-3 max-w-xl">
        <ReactMarkdown>{linkify(displayMessage)}</ReactMarkdown>
      </div>

      {/* Feedback */}
      {isLast && !isStreaming && (
        <div className="flex flex-col items-start space-y-2 pl-2">
          {!selectedReason && (
            <div className="flex items-center gap-2">
              <button onClick={() => startFeedback("up")}>
                <ThumbsUp size={16} />
              </button>
              <button onClick={() => startFeedback("down")}>
                <ThumbsDown size={16} />
              </button>

              {feedback && showReasons && (
                <button onClick={reset}>
                  <X size={16} />
                </button>
              )}
            </div>
          )}

          {showReasons && !selectedReason && (
            <div className="bg-black/80 border border-gold/20 p-3">
              <p className="text-xs mb-2">
                {feedback === "up" ? t("whatHelpful") : t("whatWrong")}{" "}
                {t("optional")}
              </p>

              <div className="flex flex-wrap gap-2">
                {reasons.map((reason) => (
                  <button
                    key={reason}
                    disabled={isSubmitting}
                    onClick={() => selectReason(reason)}
                    className="text-xs px-3 py-1"
                  >
                    {reason}
                  </button>
                ))}
              </div>

              <button
                onClick={skipReason}
                disabled={isSubmitting}
                className="text-xs underline mt-2"
              >
                {t("skip")}
              </button>
            </div>
          )}

          {selectedReason && (
            <div className="bg-gold/10 border border-gold/30 px-3 py-2">
              <p className="text-gold text-xs">
                ✓ {t("thanksFeedback")}{" "}
                <span className="font-medium">{selectedReason}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
