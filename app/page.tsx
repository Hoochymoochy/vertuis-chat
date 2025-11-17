"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, Transition } from "framer-motion";
import Image from "next/image";
import Side from "@/app/component/side";
import { addChat } from "@/app/lib/chat";
import { useRouter } from "next/navigation";
import Map from "@/app/component/map";
import { supabase } from "./lib/supabaseClient";
import { getOnbaording } from "./lib/user";
import Spinner from "@/app/component/spinner";
import { uploadFile } from "./lib/file-upload";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Chat() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [openMap, setOpenMap] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [dragEvent, setDragEvent] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragCounter, setDragCounter] = useState(0);

  const router = useRouter();

  const smoothSpring: Transition = { type: "spring", stiffness: 70, damping: 18 };

  // Auth listener
  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT") {
          router.push("/login");
        } else if (event === "SIGNED_IN" && session) {
          setUserId(session.user.id);
        }
      }
    );

    return () => {
      subscription?.subscription?.unsubscribe?.();
    };
  }, [router]);

  // Initial login check & onboarding
  useEffect(() => {
    let mounted = true;
    const checkLogin = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;

        if (data.session?.user) {
          const user = data.session.user;
          setUserId(user.id);

          const onboarded = await getOnbaording(user.id);
          if (!onboarded) {
            setNeedsOnboarding(true);
            setOpenMap(true);
          }
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        if (mounted) setIsCheckingAuth(false);
      }
    };
    checkLogin();
    return () => { mounted = false; }
  }, [router]);

  // Listen for location updates
  useEffect(() => {
    const handleLocationUpdate = () => {
      setNeedsOnboarding(false);
    };
    
    window.addEventListener('locationUpdated', handleLocationUpdate);
    return () => window.removeEventListener('locationUpdated', handleLocationUpdate);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Need either text or file to start
    if ((!message.trim() && !file) || !userId || isLoading) return;

    setIsSubmitted(true);
    setIsLoading(true);
    setFailed(false);

    try {
      // 1) Backend health check
      const healthRes = await fetch(`${backendUrl}/health`);
      const { status } = await healthRes.json();
      if (status !== "ok") throw new Error("Backend not ready");

      // 2) If there's a file → summarize it before continuing
      let fileSummary = "";
      if (file) {
        try {
          fileSummary = await uploadFile(file, userId, "pt"); // TODO: add lang from side
        } catch (err) {
          console.error("File summary failed:", err);
          // Don't hard-fail the whole submit; just warn
          fileSummary = "[File uploaded but summary unavailable]";
        }
      }

      // 3) Construct final message
      const finalMessage = fileSummary
        ? `${message}\n\n(File Summary):\n${fileSummary}`
        : message;

      const userMsg = {
        sender: "user",
        message: finalMessage,
        id: Date.now(),
      };
      setMessages([userMsg]);

      // 4) Create chat row
      const chatTitle = finalMessage.slice(0, 50);
      const { id } = await addChat(userId, chatTitle);

      // 5) Store final message as first_message
      localStorage.setItem("first_message", finalMessage);

      // 6) Redirect
      router.push(`/${id}`);
    } catch (err) {
      console.error("Failed to start chat:", err);
      setFailed(true);
      setIsLoading(false);
    }
  };


  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    setDragEvent(true);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => {
      const newCount = prev - 1;
      if (newCount === 0) {
        setDragEvent(false);
      }
      return newCount;
    });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(0);
    setDragEvent(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      console.log("File dropped:", droppedFile);
      e.dataTransfer.clearData();
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      console.log("File selected:", selectedFile);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Spinner />
          <p className="text-gold text-sm">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[url('/marble.jpg')] bg-cover bg-center"
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* Frosted overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />

      <Side setOpenMap={setOpenMap} />
      <Map openMap={openMap} setOpenMap={setOpenMap} />

      {/* Onboarding overlay */}
      <AnimatePresence>
        {needsOnboarding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md z-30 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 150, damping: 18 }}
              className="bg-gradient-to-br from-gold/15 to-gold/5 border border-gold/30 p-8 max-w-md text-center shadow-2xl"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-gold/20 border-t-gold shadow-[0_0_25px_rgba(255,215,0,0.2)]"
              />
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome to Veritus</h2>
              <p className="text-gold/80 text-sm">
                Select your jurisdiction on the map to begin your oath.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drag and Drop Overlay */}
      {dragEvent && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-30 flex items-center justify-center">
          <div className="bg-gradient-to-br from-gold/15 to-gold/5 border border-gold/30 p-8 max-w-md text-center shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-gold/20 border-t-gold shadow-[0_0_25px_rgba(255,215,0,0.2)]" />
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Drag and Drop</h2>
            <p className="text-gold/80 text-sm">
              Drop your file to upload.
            </p>
          </div>
        </div>
      )}

      {/* Main Chat Zone */}
      <motion.div
        layout
        className={`relative flex flex-col items-center w-full transition-all duration-500 ${
          isSubmitted ? 'justify-end pb-16' : 'justify-center'
        } ${needsOnboarding ? 'pointer-events-none opacity-50' : ''}`}
      >
        {/* Logo */}
        <motion.div
          layout
          animate={{ y: isSubmitted ? '-100%' : 0 }}
          transition={smoothSpring}
          className="flex items-center justify-center mb-6"
        >
          <motion.h1
            layout
            animate={{ scale: isSubmitted ? 0.9 : 1 }}
            transition={smoothSpring}
            className="text-6xl lg:text-8xl font-serif font-bold tracking-tight drop-shadow-[0_0_25px_rgba(255,215,0,0.15)]"
          >
            <span className="text-gradient">VERITUS</span>
          </motion.h1>
        </motion.div>

        {/* Error Toast */}
        <AnimatePresence>
          {failed && (
            <motion.div
              key="error-toast"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex justify-center items-center mb-4"
            >
              <motion.div
                layout
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                className="max-w-xs bg-gold/15 backdrop-blur-sm border border-gold/30 rounded-2xl px-4 py-3 shadow-lg"
              >
                <p className="text-white text-sm text-center">
                  Message failed — try again, counselor.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Bar */}
        <motion.div layout transition={smoothSpring} className="w-full max-w-3xl z-20 px-4">
          <form onSubmit={handleSubmit} className="relative">
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
                    <div className="flex-shrink-0 w-8 h-8 bg-gold/20 rounded-lg flex items-center justify-center">
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
                      className="flex-shrink-0 w-5 h-5 rounded-full bg-gold/20 hover:bg-gold/30 flex items-center justify-center text-gold/70 hover:text-gold transition-colors text-xs"
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
              <div className="flex justify-center items-center p-3">
                {/* File Upload Button */}
                <label className="flex-shrink-0 cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileInput}
                    className="hidden"
                    disabled={isLoading || needsOnboarding}
                    accept=".pdf,.docx,.txt"
                  />
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    className={`w-8 h-8 flex items-center justify-center bg-gold/20 hover:bg-gold/30 rounded-lg transition-colors ${
                      isLoading || needsOnboarding ? 'opacity-40 cursor-not-allowed' : ''
                    }`}
                  >
                    <span className="text-gold text-lg font-light">+</span>
                  </motion.div>
                </label>

                <textarea
                  placeholder="Ask a question, cite a law, or make your case..."
                  value={message}
                  disabled={isLoading || needsOnboarding}
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
                  className="flex-1 resize-none overflow-y-auto bg-transparent border-none px-2 py-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none transition-all placeholder:text-gold/40 text-white text-[15px] "
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  type="submit"
                  disabled={isLoading || !message.trim() || needsOnboarding}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gold/25 hover:bg-gold/35 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gold/25"
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
          </form>
        </motion.div>
      </motion.div>

      {/* Tagline */}
      <AnimatePresence>
        {!isSubmitted && (
          <motion.div
            key="tagline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`z-20 text-center mt-12 space-y-1 ${needsOnboarding ? 'opacity-50' : ''}`}
          >
            <p className="text-gold text-lg sm:text-xl font-medium uppercase tracking-widest">
              AI You Can Swear By
            </p>
            <p className="text-white/70 text-xs italic">(Not legal advice)</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}