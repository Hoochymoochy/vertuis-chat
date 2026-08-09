// hooks/Input/useFileOptions.ts
import { useState } from "react"

export function useFileOptions(disabled: boolean) {
  const [open, setOpen] = useState(false)

  const openOptions = () => {
    if (!disabled) setOpen(true)
  }

  const closeOptions = () => setOpen(false)

  return {
    open,
    openOptions,
    closeOptions,
  }
}
