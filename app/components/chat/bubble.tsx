"use client"

import React, { useState, useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import { ThumbsUp, ThumbsDown, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { giveFeedback } from "@/app/lib/feedback"

// Core feedback logic — properly awaits the backend call
const getFeedback = async (
  message_id: string,
  type: "up" | "down",
  message: string,
  reason?: string
) => {
  try {
    await giveFeedback(message_id, type, message, reason)
  } catch (err) {
    console.error("Feedback submission failed:", err)
  }
}

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

  // Smoothly update message during streaming
  useEffect(() => {
    if (isStreaming) {
      // Use requestAnimationFrame for smooth updates
      const timeoutId = setTimeout(() => {
        setDisplayMessage(message)
      }, 0)
      return () => clearTimeout(timeoutId)
    } else {
      setDisplayMessage(message)
    }
  }, [message, isStreaming])

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
      await getFeedback(id, feedback, message, reason)
      setTimeout(() => setShowReasons(false), 1200)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkipReason = async () => {
    if (!feedback || isSubmitting) return
    setIsSubmitting(true)
    try {
      await getFeedback(id, feedback, message)
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

  // URL → Markdown link converter
  const linkify = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    return text.replace(urlRegex, (url) => `[${url}](${url})`)
  }

  const reasons = feedback === "down" ? NEGATIVE_REASONS : POSITIVE_REASONS

  return (
    <div className="flex flex-col items-start space-y-3">
      {/* 💬 Chat message bubble with smooth transitions */}
      <div
        ref={bubbleRef}
        className="bg-black/60 border border-gold/30 px-4 py-3 shadow-lg max-w-xl w-auto transition-all duration-100 ease-out"
        style={{
          minWidth: '100px',
          maxWidth: '100%',
        }}
      >
        <div className="overflow-hidden">
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => (
                <a
                  {...props}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold underline hover:text-gold/80 transition-colors"
                />
              ),
              p: ({ children }) => (
                <p className="text-white text-sm leading-relaxed mb-2 last:mb-0">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="text-white text-sm space-y-1 ml-4 mb-2 list-disc">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="text-white text-sm space-y-1 ml-4 mb-2 list-decimal">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-white text-sm">{children}</li>
              ),
              strong: ({ children }) => (
                <strong className="text-gold font-semibold">{children}</strong>
              ),
              code: ({ children }) => (
                <code className="bg-gold/10 text-gold px-1.5 py-0.5 rounded text-xs font-mono">
                  {children}
                </code>
              ),
            }}
          >
            {linkify(displayMessage || "I'm ready to help you with anything you need!")}
          </ReactMarkdown>
        </div>
      </div>

      {/* ⚡ Feedback UI - only show when not streaming */}
      {isLast && !isStreaming && (
        <div className="flex flex-col items-start space-y-2 pl-2">
          {!selectedReason && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleInitialFeedback("up")}
                disabled={feedback !== null}
                className={`p-1.5 transition-all ${
                  feedback === "up"
                    ? "bg-gold/30 text-gold scale-110"
                    : feedback === "down"
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-gold/20 text-white/70 hover:text-gold hover:scale-105"
                }`}
              >
                <ThumbsUp size={16} fill={feedback === "up" ? "currentColor" : "none"} />
              </button>
              <button
                onClick={() => handleInitialFeedback("down")}
                disabled={feedback !== null}
                className={`p-1.5 transition-all ${
                  feedback === "down"
                    ? "bg-red-500/30 text-red-400 scale-110"
                    : feedback === "up"
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-red-500/20 text-white/70 hover:text-red-400 hover:scale-105"
                }`}
              >
                <ThumbsDown size={16} fill={feedback === "down" ? "currentColor" : "none"} />
              </button>

              {feedback && showReasons && (
                <button
                  onClick={handleCancel}
                  className="p-1.5 hover:bg-white/10 text-white/50 hover:text-white/70 transition-all ml-1"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          )}

          {showReasons && !selectedReason && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="bg-black/80 backdrop-blur-sm border border-gold/20 p-3 shadow-xl">
                <p className="text-white/70 text-xs mb-2">
                  {feedback === "up" ? t("whatHelpful") : t("whatWrong")} {t("optional")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {reasons.map((reason) => (
                    <button
                      key={reason}
                      onClick={() => handleReasonSelect(reason)}
                      disabled={isSubmitting}
                      className={`px-3 py-1.5 text-xs transition-all ${
                        feedback === "up"
                          ? "bg-gold/10 text-gold border border-gold/30 hover:bg-gold/20 hover:scale-105"
                          : "bg-red-500/10 text-red-300 border border-red-500/30 hover:bg-red-500/20 hover:scale-105"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleSkipReason}
                  disabled={isSubmitting}
                  className="mt-2 text-xs text-white/50 hover:text-white/70 transition-colors underline"
                >
                  {t("skip")}
                </button>
              </div>
            </div>
          )}

          {selectedReason && (
            <div className="animate-in fade-in duration-300">
              <div className="bg-gold/10 border border-gold/30 rounded-lg px-3 py-2">
                <p className="text-gold text-xs">
                  ✓ {t("thanksFeedback")} <span className="font-medium">{selectedReason}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}