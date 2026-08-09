// hooks/Chat/useChatFeedback.ts
import { useState } from "react"
import { addFeedback } from "../../lib/feedback"

type FeedbackType = "up" | "down"

export function useChatFeedback(
  messageId: string,
  message: string
) {
  const [feedback, setFeedback] = useState<FeedbackType | null>(null)
  const [showReasons, setShowReasons] = useState(false)
  const [selectedReason, setSelectedReason] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitFeedback = async (
    type: FeedbackType,
    reason?: string
  ) => {
    try {
      await addFeedback(messageId, type, message, reason)
    } catch (err) {
      console.error("Feedback submission failed:", err)
    }
  }

  const startFeedback = (type: FeedbackType) => {
    if (feedback) return
    setFeedback(type)
    setShowReasons(true)
  }

  const selectReason = async (reason: string) => {
    if (!feedback || isSubmitting) return
    setIsSubmitting(true)
    setSelectedReason(reason)

    await submitFeedback(feedback, reason)
    setTimeout(() => setShowReasons(false), 1200)
    setIsSubmitting(false)
  }

  const skipReason = async () => {
    if (!feedback || isSubmitting) return
    setIsSubmitting(true)

    await submitFeedback(feedback)
    setShowReasons(false)
    setIsSubmitting(false)
  }

  const reset = () => {
    setFeedback(null)
    setShowReasons(false)
    setSelectedReason(null)
  }

  return {
    feedback,
    showReasons,
    selectedReason,
    isSubmitting,
    startFeedback,
    selectReason,
    skipReason,
    reset,
  }
}
