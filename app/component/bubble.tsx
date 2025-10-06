"use client"

import React from "react"
import ReactMarkdown from "react-markdown"

export default function ChatBubble({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-start">
      <div className="bg-gradient-to-r from-gold/20 to-gold/10 backdrop-blur-sm border border-gold/30 rounded-2xl px-4 py-3 shadow-lg">
        <ReactMarkdown
          components={{
            a: ({ node, ...props }) => (
              <a
                {...props}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline hover:text-gold/80 transition"
              />
            ),
            p: ({ children }) => (
              <p className="text-white text-sm leading-relaxed mb-2 last:mb-0">
                {children}
              </p>
            ),
          }}
        >
          {message || "I'm ready to help you with anything you need!"}
        </ReactMarkdown>
      </div>
    </div>
  )
}
