// hooks/Input/useFileUpload.ts
import { useEffect, useState } from "react"

export function useFileUpload({
  onFileUpload,
  droppedFile,
  maxFileSizeMB,
  onError,
}: {
  onFileUpload?: (file: File) => void
  droppedFile?: File | null
  maxFileSizeMB: number
  onError?: (msg: string) => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const validateFile = (file: File) => {
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      onError?.(`File exceeds ${maxFileSizeMB}MB`)
      return false
    }
    return true
  }

  const attachFile = (file: File) => {
    if (!validateFile(file)) return
    setFile(file)
    onFileUpload?.(file)
  }

  const removeFile = () => {
    setFile(null)
    setUploadProgress(0)
  }

  useEffect(() => {
    if (droppedFile) attachFile(droppedFile)
  }, [droppedFile])

  return {
    file,
    uploadProgress,
    setUploadProgress,
    attachFile,
    removeFile,
  }
}
