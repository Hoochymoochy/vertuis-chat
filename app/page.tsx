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

export default function Home() {
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
  const easeOutFade: Transition = { duration: 0.6, ease: "easeOut" };

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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[url('/marble.jpg')] bg-cover bg-center"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <Side setOpenMap={setOpenMap} />
      <Map openMap={openMap} setOpenMap={setOpenMap} />

      {/* Onboarding Overlay - Blocks interaction until complete */}
      <AnimatePresence>
        {needsOnboarding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm z-30 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-gold/20 to-gold/10 border-2 border-gold/40 rounded-2xl p-8 max-w-md text-center shadow-2xl"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-gold/30 border-t-gold"
              />
              <h2 className="text-2xl font-bold text-white mb-2">Welcome to Veritus!</h2>
              <p className="text-gold/80 text-sm">
                Select your jurisdiction from the map to get started
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <motion.div
        layout
        className={`relative flex flex-col items-center w-full ${
          isSubmitted ? "justify-end pb-12" : "justify-center"
        } ${needsOnboarding ? 'pointer-events-none opacity-50' : ''}`}
      >
        {/* Logo */}
        <motion.div
          layout
          animate={{ y: isSubmitted ? "-100%" : 0 }}
          transition={smoothSpring}
          className="flex justify-center items-center z-10 mb-4"
        >
          <motion.h1
            layout
            animate={{ scale: isSubmitted ? 0.9 : 1 }}
            transition={smoothSpring}
            className="text-5xl sm:text-6xl font-extrabold text-white tracking-wide"
          >
            Veritus
          </motion.h1>
        </motion.div>

        {/* Floating Error */}
        <AnimatePresence>
          {failed && (
            <motion.div
              key="error-toast"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex justify-center items-center mb-4"
            >
              <motion.div
                layout
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="max-w-xs bg-gold/20 backdrop-blur-sm border border-gold/30 rounded-2xl px-4 py-3 shadow-lg"
              >
                <p className="text-white text-sm text-center">
                  Failed to send message. Please try again.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input */}
        <motion.div layout transition={smoothSpring} className="w-full max-w-sm z-20">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Start chat..."
                value={message}
                disabled={isLoading || needsOnboarding}
                className="flex-1 px-4 py-3 rounded-xl 
                  bg-gold/10 text-white placeholder-gold/60 
                  border border-gold/40 
                  focus:outline-none focus:ring-2 focus:ring-gold 
                  transition backdrop-blur-sm 
                  disabled:opacity-50"
                onChange={handleInputChange}
              />
              <button
                type="submit"
                disabled={isLoading || !message.trim() || needsOnboarding}
                className="bg-gold hover:bg-gold/80 p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                aria-label="Send message"
              >
                {isLoading ? (
                  <Spinner />
                ) : (
                  <Image src="/upload.png" alt="Send" width={24} height={24} />
                )}
              </button>
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
            transition={easeOutFade}
            className={`text-center mt-10 ${needsOnboarding ? 'opacity-50' : ''}`}
          >
            <p className="text-gold text-base sm:text-lg font-medium uppercase tracking-widest">
              AI You Can Swear By
            </p>
            <p className="text-white text-xs italic mt-1">(Not legal advice)</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

