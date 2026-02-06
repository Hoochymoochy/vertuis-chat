// hooks/Input/useInputMessage.ts
import { useState } from "react"

export function useInputMessage() {
  const [message, setMessage] = useState("")

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMessage(e.target.value)

    // autosize
    e.target.style.height = "auto"
    e.target.style.height = `${Math.min(
      e.target.scrollHeight,
      200
    )}px`
  }

  const reset = () => setMessage("")

  const isEmpty = !message.trim()

  return {
    message,
    setMessage,
    handleChange,
    reset,
    isEmpty,
  }
}
