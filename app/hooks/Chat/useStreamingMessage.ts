// hooks/Chat/useStreamingMessage.ts
import { useEffect, useState } from "react"

export function useStreamingMessage(
  message: string,
  isStreaming: boolean
) {
  const [displayMessage, setDisplayMessage] = useState(message)

  useEffect(() => {
    if (isStreaming) {
      const timeout = setTimeout(() => {
        setDisplayMessage(message)
      }, 0)

      return () => clearTimeout(timeout)
    }

    setDisplayMessage(message)
  }, [message, isStreaming])

  return displayMessage
}
