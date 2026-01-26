import { useState, useEffect } from "react";
import { AnimatePresence, motion, Transition } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";

type InputBoxProps = {
  onFileUpload?: (file: File) => void;
  onSubmit: (message: string, file?: File | null) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  filePlaceholder?: string;
  acceptedFileTypes?: string;
  showFileUpload?: boolean;
  maxFileSize?: number; // in MB
  droppedFile?: File | null; // File dropped from parent
};

export default function InputBox({
  onFileUpload,
  onSubmit,
  isLoading = false,
  disabled = false,
  placeholder,
  filePlaceholder,
  acceptedFileTypes = ".pdf,.docx,.txt",
  showFileUpload = true,
  maxFileSize = 10,
  droppedFile,
}: InputBoxProps) {
  const t = useTranslations("InputBox");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileOptions, setFileOptions] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Use translations as default if props not provided
  const effectivePlaceholder = placeholder || t("placeholder");
  const effectiveFilePlaceholder = filePlaceholder || t("filePlaceholder");

  // Handle dropped file from parent component
  useEffect(() => {
    if (droppedFile) {
      setFile(droppedFile);
      if (onFileUpload) {
        onFileUpload(droppedFile);
      }
    }
  }, [droppedFile, onFileUpload]);

  const smoothSpring: Transition = { type: "spring", stiffness: 70, damping: 18 };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file size
    if (selectedFile.size > maxFileSize * 1024 * 1024) {
      alert(`${t("fileSizeError")} ${maxFileSize}MB`);
      return;
    }

    setFile(selectedFile);
    if (onFileUpload) {
      onFileUpload(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
  };

  const openFileOptions = () => {
    if (!disabled && !isLoading) {
      setFileOptions(true);
    }
  };

  const closeFileOptions = () => {
    setFileOptions(false);
  };

  const handleSubmit = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    
    if (isLoading || disabled) return;
    if (!message.trim() && !file) return;

    onSubmit(message, file);
    
    // Reset form
    setMessage("");
    setFile(null);
    setUploadProgress(0);
  };

  const Spinner = () => (
    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gold border-t-transparent" />
  );

  return (
    <motion.div layout transition={smoothSpring} className="w-full max-w-3xl z-20 px-4 relative">
      <div className="relative">
        <div className="relative bg-gold/15 backdrop-blur-md border border-gold/30 rounded-3xl shadow-lg overflow-hidden">
          {/* File Preview Inside Input */}
          {file && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 pt-3 pb-2 border-b border-gold/20"
            >
              <div className="flex items-center gap-2 bg-gold/10 rounded-lg px-3 py-2">
                <div className="shrink-0 w-8 h-8 bg-gold/20 rounded-lg flex items-center justify-center">
                  <span className="text-gold text-xs">📄</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium truncate">
                    {file.name}
                  </p>
                  <p className="text-gold/60 text-[10px]">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={removeFile}
                  type="button"
                  className="shrink-0 w-5 h-5 rounded-full bg-gold/20 hover:bg-gold/30 flex items-center justify-center text-gold/70 hover:text-gold transition-colors text-xs"
                  aria-label="Remove file"
                >
                  ✕
                </button>
              </div>
              {uploadProgress > 0 && (
                <div className="w-full bg-gold/20 rounded-full h-1 mt-2">
                  <div
                    className="bg-gold h-1 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </motion.div>
          )}

          {/* Textarea and Button Row */}
          <div className="flex justify-center items-center p-3 relative">
            {/* File Upload Button */}
            {showFileUpload && (
              <div className="shrink-0 relative">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={openFileOptions}
                  type="button"
                  className={`
                    w-8 h-8 flex items-center justify-center 
                    bg-gold/20 hover:bg-gold/30 
                    rounded-lg transition-colors
                    ${isLoading || disabled ? 'opacity-40 cursor-not-allowed' : ''}
                  `}
                  disabled={isLoading || disabled}
                >
                  <span className="text-gold text-lg font-light">+</span>
                </motion.button>
              </div>
            )}

            <textarea
              placeholder={file ? effectiveFilePlaceholder : effectivePlaceholder}
              value={message}
              disabled={isLoading || disabled || (file !== null)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              onChange={(e) => {
                handleInputChange(e);
                e.target.style.height = "auto";
                const newHeight = Math.min(e.target.scrollHeight, 200);
                e.target.style.height = `${newHeight}px`;
              }}
              rows={1}
              style={{ maxHeight: "200px" }}
              className="flex-1 resize-none overflow-y-auto bg-transparent border-none px-2 py-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none transition-all placeholder:text-gold/40 text-white text-[15px]"
            />

            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || (!message.trim() && !file) || disabled}
              className="shrink-0 w-8 h-8 flex items-center justify-center bg-gold/25 hover:bg-gold/35 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gold/25"
              aria-label="Send message"
            >
              {isLoading ? (
                <div className="w-4 h-4">
                  <Spinner />
                </div>
              ) : (
                <Image src="/up-arrow.png" alt="Send" width={16} height={16} className="opacity-90" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* File Options Dropdown */}
      <AnimatePresence>
        {fileOptions && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ type: "spring", stiffness: 180, damping: 16 }}
            className="absolute mb-2 z-50 bg-gold/10 border border-gold/30 rounded-xl shadow-xl p-3 w-48 backdrop-blur-lg"
          >
            <p className="text-white text-sm font-medium mb-2 text-center">
              {t("fileOptions")}
            </p>

            <label className="block cursor-pointer">
              <input
                type="file"
                className="hidden"
                disabled={isLoading || disabled}
                accept={acceptedFileTypes}
                onChange={(e) => {
                  handleFileInput(e);
                  closeFileOptions();
                }}
              />

              <div className="flex items-center gap-2 p-2 rounded-lg bg-gold/20 hover:bg-gold/30 transition-colors">
                <span className="text-xl">📁</span>
                <span className="text-white text-sm">{t("summarizeFile")}</span>
              </div>
            </label>

            <button
              onClick={closeFileOptions}
              className="mt-2 w-full text-center text-gold/70 hover:text-gold text-xs"
            >
              {t("cancel")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}