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
            setOpenMap(true); // Force open map for first-time users
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

  // Listen for location updates (when onboarding completes)
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
    if (!message.trim() || !userId || isLoading) return;

    setIsSubmitted(true);
    setIsLoading(true);

    const userMsg = { sender: "user", message: message, id: Date.now() };
    setMessages([userMsg]);

    try {
      const healthRes = await fetch(`${backendUrl}/health`);
      const { status } = await healthRes.json();
      if (status !== "ok") throw new Error("Backend not ready");

      const { id } = await addChat(userId, message.slice(0, 50));
      localStorage.setItem("first_message", message);

      setTimeout(() => {
        router.push(`/${id}`);
      }, 300);
    } catch (err) {
      console.error("Failed to start chat:", err);
      setFailed(true);
      setIsLoading(false);
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
        <motion.div layout transition={smoothSpring} className="w-full max-w-md z-20">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-end gap-3">
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
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                rows={1}
                className="w-full resize-none overflow-hidden bg-gold/15 backdrop-blur-md border border-gold/30 px-4 py-3 shadow-md disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all placeholder:text-gold/50 text-white"
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                type="submit"
                disabled={isLoading || !message.trim() || needsOnboarding}
                className="w-14 h-12 flex items-center justify-center bg-gold/15 backdrop-blur-md border border-gold/30 rounded-full shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                {isLoading ? (
                  <Spinner />
                ) : (
                  <Image src="/up-arrow.png" alt="Send" width={25} height={20} />
                )}
              </motion.button>
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

