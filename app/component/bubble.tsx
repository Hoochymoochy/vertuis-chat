"use client"

import React, { useState } from "react"
import ReactMarkdown from "react-markdown"
import { ThumbsUp, ThumbsDown, X } from "lucide-react"
import { motion } from "framer-motion"

// Mock feedback function for demo
const getFeedback = async (type: string, message: string, reason?: string) => {
  console.log("Feedback:", type, message, reason)
  return Promise.resolve()
}

const NEGATIVE_REASONS = [
  "Off-topic",
  "Outdated law",
  "Unclear explanation",
  "Missing citation",
  "Inaccurate information"
]

const POSITIVE_REASONS = [
  "Perfect answer",
  "Clear explanation",
  "Helpful citations",
  "Comprehensive"
]

export default function ChatBubble({
  message,
  isLast = false,
  isStreaming = false,
}: {
  message: string
  isLast?: boolean
  isStreaming?: boolean
}) {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null)
  const [showReasons, setShowReasons] = useState(false)
  const [selectedReason, setSelectedReason] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInitialFeedback = (type: "up" | "down") => {
    if (feedback) return
    setFeedback(type)
    setShowReasons(true)
  }

  const handleReasonSelect = async (reason: string) => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    setSelectedReason(reason)
    
    try {
      await getFeedback(feedback!, message, reason)
      setTimeout(() => setShowReasons(false), 1500)
    } catch (err) {
      console.error("Feedback failed:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkipReason = async () => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    
    try {
      await getFeedback(feedback!, message)
      setShowReasons(false)
    } catch (err) {
      console.error("Feedback failed:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setFeedback(null)
    setShowReasons(false)
    setSelectedReason(null)
  }

  const reasons = feedback === "down" ? NEGATIVE_REASONS : POSITIVE_REASONS

  return (
    <div className="flex flex-col items-start space-y-3">
      {/* Message Bubble */}
      <div className="bg-black/60 backdrop-blur-sm border border-gold/30 rounded-2xl px-4 py-3 shadow-lg max-w-xl">
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
          {message || "I'm ready to help you with anything you need!"}
        </ReactMarkdown>
      </div>

      {/* Feedback Section */}
      {isLast && (
        <div className="flex flex-col items-start space-y-2 pl-2">
          {/* Thumbs Up/Down Buttons */}
          {!selectedReason && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleInitialFeedback("up")}
                disabled={feedback !== null}
                className={`p-1.5 rounded-full transition-all ${
                  feedback === "up"
                    ? "bg-gold/30 text-gold scale-110"
                    : feedback === "down"
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-gold/20 text-white/70 hover:text-gold hover:scale-105"
                }`}
                aria-label="Good response"
              >
                <ThumbsUp size={16} fill={feedback === "up" ? "currentColor" : "none"} />
              </button>
              <button
                onClick={() => handleInitialFeedback("down")}
                disabled={feedback !== null}
                className={`p-1.5 rounded-full transition-all ${
                  feedback === "down"
                    ? "bg-red-500/30 text-red-400 scale-110"
                    : feedback === "up"
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-red-500/20 text-white/70 hover:text-red-400 hover:scale-105"
                }`}
                aria-label="Bad response"
              >
                <ThumbsDown size={16} fill={feedback === "down" ? "currentColor" : "none"} />
              </button>
              
              {feedback && showReasons && (
                <button
                  onClick={handleCancel}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white/70 transition-all ml-1"
                  aria-label="Cancel feedback"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          )}

          {/* Reason Selection */}
          {showReasons && !selectedReason && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="bg-black/80 backdrop-blur-sm border border-gold/20 rounded-xl p-3 shadow-xl">
                <p className="text-white/70 text-xs mb-2">
                  {feedback === "up" ? "What made this helpful?" : "What went wrong?"} (optional)
                </p>
                <div className="flex flex-wrap gap-2">
                  {reasons.map((reason) => (
                    <button
                      key={reason}
                      onClick={() => handleReasonSelect(reason)}
                      disabled={isSubmitting}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
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
                  Skip
                </button>
              </div>
            </div>
          )}

          {/* Confirmation Message */}
          {selectedReason && (
            <div className="animate-in fade-in duration-300">
              <div className="bg-gold/10 border border-gold/30 rounded-lg px-3 py-2">
                <p className="text-gold text-xs">
                  ✓ Thanks for your feedback: <span className="font-medium">{selectedReason}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}