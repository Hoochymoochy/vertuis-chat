"use client"

import React, { useState, useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import { ThumbsUp, ThumbsDown, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { addFeedback } from "../../lib/feedback"


export default function ChatBubble({
  id,
  message,
  isLast = false,
  isStreaming = false,
}: {
  id: string
  message: string
  isLast?: boolean
  isStreaming?: boolean
}) {
  const t = useTranslations("ChatBubble")

  const [feedback, setFeedback] = useState<"up" | "down" | null>(null)
  const [showReasons, setShowReasons] = useState(false)
  const [selectedReason, setSelectedReason] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [displayMessage, setDisplayMessage] = useState(message)

  const [hasFinishedStreaming, setHasFinishedStreaming] = useState(false)

  useEffect(() => {
    if (!isStreaming && message && !hasFinishedStreaming) {
      setHasFinishedStreaming(true)
    }
  }, [isStreaming, message])

  useEffect(() => {
    if (isStreaming) {
      setFeedback(null)
      setShowReasons(false)
      setSelectedReason(null)
      setHasFinishedStreaming(false)
    }
  }, [isStreaming, id])  


  const bubbleRef = useRef<HTMLDivElement>(null)

  const NEGATIVE_REASONS = [
    t("offTopic"),
    t("outdatedLaw"),
    t("unclearExplanation"),
    t("missingCitation"),
    t("inaccurateInfo"),
  ]

  const POSITIVE_REASONS = [
    t("perfectAnswer"),
    t("clearExplanation"),
    t("helpfulCitations"),
    t("comprehensive"),
  ]

  useEffect(() => {
    setDisplayMessage(message)
  }, [message])

  // Reset feedback state when message changes or when streaming starts
  useEffect(() => {
    if (isStreaming) {
      setFeedback(null)
      setShowReasons(false)
      setSelectedReason(null)
    }
  }, [isStreaming, id])

  const handleInitialFeedback = (type: "up" | "down") => {
    if (feedback) return
    setFeedback(type)
    setShowReasons(true)
  }

  const handleReasonSelect = async (reason: string) => {
    if (!feedback || isSubmitting) return
    setIsSubmitting(true)
    setSelectedReason(reason)

    try {
      await addFeedback(id, feedback, message, reason)
      setTimeout(() => setShowReasons(false), 1200)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkipReason = async () => {
    if (!feedback || isSubmitting) return
    setIsSubmitting(true)

    try {
      await addFeedback(id, feedback, message)
      setShowReasons(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setFeedback(null)
    setShowReasons(false)
    setSelectedReason(null)
  }

  const linkify = (text: string) =>
    text.replace(/(https?:\/\/[^\s]+)/g, (url) => `[${url}](${url})`)

  const reasons = feedback === "down" ? NEGATIVE_REASONS : POSITIVE_REASONS

  // Only show feedback if this is the last message AND not streaming AND not a temp message
  const shouldShowFeedback = isLast && !isStreaming && !id.startsWith("temp-")

  return (
    <div className="flex flex-col items-start space-y-3">
      {/* Message bubble */}
      <div
        ref={bubbleRef}
        className="bg-black/60 backdrop-blur-sm border border-gold/30 px-5 py-4 "
      >
        <ReactMarkdown
          components={{
            a: ({ ...props }) => (
              <a
                {...props}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline hover:text-gold/80 transition"
              />
            ),
            p: ({ children }) => (
              <p className="text-white text-sm leading-relaxed mb-3 last:mb-0">
                {children}
              </p>
            ),
            li: ({ children }) => (
              <li className="text-white/90 text-sm">{children}</li>
            ),
            strong: ({ children }) => (
              <strong className="text-gold font-semibold">{children}</strong>
            ),
            code: ({ children }) => (
              <code className="bg-gold/10 text-gold px-2 py-0.5 rounded text-xs font-mono">
                {children}
              </code>
            ),
          }}
        >
          {linkify(displayMessage || "I'm ready to help you with anything you need!")}
        </ReactMarkdown>
      </div>

      {/* Feedback */}
      {shouldShowFeedback && (
        <div className="flex flex-col items-start space-y-2 pl-2">
          {!selectedReason && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleInitialFeedback("up")}
                className="text-gold/60 hover:text-gold transition-colors"
                aria-label="Good response"
              >
                <ThumbsUp size={16} className={feedback === "up" ? "fill-gold text-gold" : ""} />
              </button>
              <button 
                onClick={() => handleInitialFeedback("down")}
                className="text-gold/60 hover:text-gold transition-colors"
                aria-label="Bad response"
              >
                <ThumbsDown size={16} className={feedback === "down" ? "fill-gold text-gold" : ""} />
              </button>

              {feedback && showReasons && (
                <button 
                  onClick={handleCancel}
                  className="text-gold/60 hover:text-gold transition-colors"
                  aria-label="Cancel feedback"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          )}

          {showReasons && !selectedReason && (
            <div className="bg-black/80 border border-gold/20 p-4">
              <p className="text-white/90 text-xs mb-3">
                {feedback === "up" ? t("whatHelpful") : t("whatWrong")} <span className="text-white/60">{t("optional")}</span>
              </p>

              <div className="flex flex-wrap gap-2">
                {reasons.map((reason) => (
                  <button
                    key={reason}
                    disabled={isSubmitting}
                    onClick={() => handleReasonSelect(reason)}
                    className="text-xs px-3 py-2 border border-gold/30 rounded-lg bg-black/40 text-white/90 hover:bg-gold/20 hover:border-gold/50 transition-colors disabled:opacity-50"
                  >
                    {reason}
                  </button>
                ))}
              </div>

              <button
                onClick={handleSkipReason}
                disabled={isSubmitting}
                className="text-xs text-gold/80 hover:text-gold underline mt-3 disabled:opacity-50"
              >
                {t("skip")}
              </button>
            </div>
          )}

          {selectedReason && (
            <div className="bg-gold/10 border border-gold/30 px-4 py-2 rounded-xl">
              <p className="text-gold text-xs">
                ✓ {t("thanksFeedback")}{" "}
                <span className="font-semibold">{selectedReason}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
