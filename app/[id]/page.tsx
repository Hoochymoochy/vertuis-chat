"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, Transition } from "framer-motion";
import ChatBubble from "@/app/component/bubble";
import Image from "next/image";
import Side from "@/app/component/side";
import question from "@/app/lib/question";
import { getAllMessage, addMessage } from "@/app/lib/chat";
import { useRouter, useParams } from "next/navigation";
import Map from "@/app/component/map";
export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [openMap, setOpenMap] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedState, setState] = useState<string | null>(null);



  const params = useParams();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasProcessedFirstMessage = useRef(false);

  const smoothSpring: Transition = { type: "spring", stiffness: 70, damping: 18 };
  const easeOutFade: Transition = { duration: 0.6, ease: "easeOut" };

  const onCountrySlected = (country: string) => {
    setSelectedCountry(country)
  }

  const onStateSelected = (state: string) => {
    setState(state)
  }
  

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check login
  useEffect(() => {
    const checkLogin = async () => {
      const user_id = localStorage.getItem("user_id");
      if (!user_id) {
        router.push("/login");
        return;
      }
      setUserId(user_id);
    };
    checkLogin();
  }, [router]);

  // Handle input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value);

  // Load messages for the chat ID from URL
  useEffect(() => {
    const initializeChat = async () => {
      const currentChatId = params.id as string;
      if (!currentChatId || hasProcessedFirstMessage.current) return;
      
      setChatId(currentChatId);

      // Load existing messages
      const data = await getAllMessage(currentChatId);
      setMessages(data);

      // Check if this is a new chat with a first message to process
      const firstMsg = localStorage.getItem("first_message");
      
      if (data.length === 0 && firstMsg && !hasProcessedFirstMessage.current) {
        hasProcessedFirstMessage.current = true;
        
        // Add user message
        const userMsg = { sender: "user", message: firstMsg, id: Date.now() };
        await addMessage(currentChatId, "user", firstMsg);
        setMessages([userMsg]);

        // Trigger AI response
        await triggerAIResponse(firstMsg, currentChatId);

        // Clean up
        localStorage.removeItem("first_message");
      }

      setIsInitialized(true);
    };

    initializeChat();
  }, [params.id]);

  // Clean, standalone flow for AI trigger
  const triggerAIResponse = async (msg: string, chatId: string) => {
    setIsLoading(true);
    setFailed(false);
    let aiMessage = "";

    // Add loading bubble immediately
    const loadingMsg = { sender: "ai", message: "...", id: "ai-loading" };
    setMessages(prev => [...prev, loadingMsg]);

    try {
      await question(msg, chatId, (token: string) => {
        aiMessage += token;
        setMessages(prev => {
          const withoutLoading = prev.filter(m => m.id !== "ai-loading" && m.id !== "ai-temp");
          return [...withoutLoading, { sender: "ai", message: aiMessage, id: "ai-temp" }];
        });
      });

      // Replace temp message with final saved version
      await addMessage(chatId, "ai", aiMessage);
      const finalId = Date.now();
      setMessages(prev => {
        const withoutTemp = prev.filter(m => m.id !== "ai-temp" && m.id !== "ai-loading");
        return [...withoutTemp, { sender: "ai", message: aiMessage, id: finalId }];
      });
    } catch (err) {
      console.error("AI response failed:", err);
      setFailed(true);
      // Remove temp AI message on failure
      setMessages(prev => prev.filter(m => m.id !== "ai-temp" && m.id !== "ai-loading"));
    } finally {
      setIsLoading(false);
    }
  };

  // Send message & stream AI
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(selectedCountry, selectedState);
    if (!message.trim() || !chatId || isLoading) return;

    setIsLoading(true);
    setFailed(false);

    const userMessage = message;
    setMessage(""); // Clear input immediately for better UX

    try {
      // Step 1: Add user message AND loading bubble together
      const userMsg = { sender: "user", message: userMessage, id: Date.now() };
      const loadingMsg = { sender: "ai", message: "...", id: "ai-loading" };
      setMessages(prev => [...prev, userMsg, loadingMsg]);
      await addMessage(chatId, "user", userMessage);

      // Step 2: Stream AI response
      let aiMessage = "";
      await question(userMessage, chatId, (token: string) => {
        aiMessage += token;

        setMessages(prev => {
          // Remove loading and old streaming AI bubble
          const withoutLoading = prev.filter(m => m.id !== "ai-loading" && m.id !== "ai-temp");
          return [...withoutLoading, { sender: "ai", message: aiMessage, id: "ai-temp" }];
        });
      });

      // Step 3: Save final AI message and replace temp
      await addMessage(chatId, "ai", aiMessage);
      const finalId = Date.now();
      setMessages(prev => {
        const withoutTemp = prev.filter(m => m.id !== "ai-temp" && m.id !== "ai-loading");
        return [...withoutTemp, { sender: "ai", message: aiMessage, id: finalId }];
      });

    } catch (err) {
      console.error("Failed to send message:", err);
      setFailed(true);
      // Remove temp AI message on failure
      setMessages(prev => prev.filter(m => m.id !== "ai-temp" && m.id !== "ai-loading"));
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state until initialized
  if (!isInitialized) {
    return (
      <div className="bg-marble bg-cover bg-no-repeat bg-center min-h-screen w-full flex items-center justify-center">
        <motion.div
          className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"
          aria-label="Loading"
        />
      </div>
    );
  }

  const hasMessages = messages.length > 0;

  return (
    <div
      className="bg-marble bg-cover bg-no-repeat bg-center min-h-screen w-full flex flex-col px-4 py-6 relative overflow-hidden"
    >
      <Side setOpenMap={setOpenMap}/>
      <Map openMap={openMap} setOpenMap={setOpenMap}/>
      {/* Logo - Fixed at top */}
      <div className="flex justify-center items-center pt-6 pb-4">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-white tracking-wide">
          Veritus
        </h1>
      </div>

      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col items-center w-full pb-12">
        {/* Messages Container */}
        {hasMessages && (
          <div className="flex-1 w-full max-w-4xl mx-auto pt-4 pb-24 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "user" ? (
                    <div className="max-w-xs bg-gold/20 backdrop-blur-sm border border-gold/30 rounded-2xl px-4 py-3">
                      <p className="text-white text-sm">{msg.message}</p>
                    </div>
                  ) : msg.message === "..." ? (
                    <div className="max-w-xs bg-black/60 backdrop-blur-sm border border-gold/30 rounded-2xl px-4 py-3">
                      <motion.p
                        className="text-gold text-sm"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        ...
                      </motion.p>
                    </div>
                  ) : (
                    <ChatBubble message={msg.message} />
                  )}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Error Message */}
        {failed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <div className="max-w-xs bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-2xl px-4 py-3">
              <p className="text-red-200 text-sm">
                Failed to send message. Please try again.
              </p>
            </div>
          </motion.div>
        )}

        {/* Input */}
        <div className="w-full max-w-sm z-20 mt-auto">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={hasMessages ? "Continue chat..." : "Start chat..."}
                value={message}
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-xl bg-black/60 text-white placeholder-gold border border-gold focus:outline-none focus:ring-2 focus:ring-gold transition backdrop-blur-sm disabled:opacity-50"
                onChange={handleInputChange}
              />
              <button
                type="submit"
                disabled={isLoading || !message.trim()}
                className="bg-gold hover:bg-gold/80 p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                {isLoading ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                    aria-label="Loading"
                  />
                ) : (
                  <Image src="/upload.png" alt="Send" width={24} height={24} />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      

    </div>
  );
}