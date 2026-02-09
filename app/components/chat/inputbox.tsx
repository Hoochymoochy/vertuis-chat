"use client"

import { motion, AnimatePresence, Transition } from "framer-motion"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { InputBoxProps } from "./type"

import { useInputMessage } from "@/app/hooks/Input/useInputMessage"


export default function InputBox({
  onSubmit,
  isLoading = false,
  disabled = false,
}: InputBoxProps) {
  const t = useTranslations("InputBox")

  const {
    message,
    handleChange,
    reset,
    isEmpty,
  } = useInputMessage()


  const handleSubmit = () => {
    if (disabled || isLoading) return
    if (isEmpty) return

    onSubmit(message)
    reset()
  }

  const smoothSpring: Transition = {
    type: "spring",
    stiffness: 70,
    damping: 18,
  }

  const canSubmit = !disabled && !isLoading && !isEmpty

  return (
    <motion.div
      layout
      transition={smoothSpring}
      className="w-full max-w-3xl mx-auto px-4 relative z-20"
    >
      <div className="bg-gold/15 border border-gold/30 rounded-3xl overflow-hidden backdrop-blur-md">

        {/* Input row */}
        <div className="flex items-center p-3 gap-2">

          <textarea
            value={message}
            onChange={handleChange}
            placeholder={t("placeholder")}
            disabled={disabled || isLoading }
            rows={1}
            className="flex-1 bg-transparent resize-none focus:outline-none text-white"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
          />

          <motion.button
            onClick={handleSubmit}
            disabled={!canSubmit}
            animate={canSubmit ? { scale: 1.05 } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors
              ${
                canSubmit
                  ? "bg-gold/40 hover:bg-gold/50 ring-1 ring-gold/40"
                  : "bg-gold/20 opacity-50 cursor-not-allowed"
              }
            `}
          >
            {isLoading ? (
              <div className="w-4 h-4 animate-spin border-2 border-gold border-t-transparent rounded-full" />
            ) : (
              <Image src="/up-arrow.png" alt="Send" width={16} height={16} />
            )}
          </motion.button>
        </div>
      </div>


    </motion.div>
  )
}
