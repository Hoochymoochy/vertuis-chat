"use client"

import { motion, AnimatePresence, Transition } from "framer-motion"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { InputBoxProps } from "./type"

import { useInputMessage } from "@/app/hooks/Input/useInputMessage"
import { useFileUpload } from "@/app/hooks/Input/useFileUpload"
import { useFileOptions } from "@/app/hooks/Input/useFileOptions"


export default function InputBox({
  onSubmit,
  isLoading = false,
  disabled = false,
  placeholder,
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

  return (
    <motion.div
      layout
      transition={smoothSpring}
      className="w-full max-w-3xl mx-auto px-4 relative z-20"
    >
      <div className="bg-gold/15 border border-gold/30 rounded-3xl overflow-hidden backdrop-blur-md">

        {/* Input row */}
        <div className="flex items-center p-3 gap-2">
          {showFileUpload && (
            <button
              onClick={openOptions}
              disabled={disabled || isLoading}
              className="w-8 h-8 bg-gold/20 rounded-lg"
            >
              +
            </button>
          )}

          <textarea
            value={message}
            onChange={handleChange}
            placeholder={
              file
                ? filePlaceholder || t("filePlaceholder")
                : placeholder || t("placeholder")
            }
            disabled={disabled || isLoading || !!file}
            rows={1}
            className="flex-1 bg-transparent resize-none focus:outline-none text-white"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
          />

          <button
            onClick={handleSubmit}
            disabled={disabled || isLoading || (isEmpty && !file)}
            className="w-8 h-8 bg-gold/25 rounded-lg"
          >
            {isLoading ? (
              <div className="w-4 h-4 animate-spin border-2 border-gold border-t-transparent rounded-full" />
            ) : (
              <Image src="/up-arrow.png" alt="Send" width={16} height={16} />
            )}
          </button>
        </div>
      </div>

      {/* File options */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute z-50 bg-gold/10 border border-gold/30 rounded-xl p-3 w-48"
          >
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept={acceptedFileTypes}
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) attachFile(f)
                  closeOptions()
                }}
              />
              <div className="p-2 bg-gold/20 rounded-lg">
                {t("summarizeFile")}
              </div>
            </label>

            <button
              onClick={closeOptions}
              className="mt-2 text-xs text-gold/70"
            >
              {t("cancel")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
