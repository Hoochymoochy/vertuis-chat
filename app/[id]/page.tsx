"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import Image from "next/image";
import ChatBubble from "@/app/component/bubble";
import Side from "@/app/component/side";
import Map from "@/app/component/map";
import question from "@/app/lib/question";
import { addMessage, getAllMessage } from "@/app/lib/chat";
import Spinner from "@/app/component/spinner";

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();

  const [user, setUser] = useState<any>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [openMap, setOpenMap] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasProcessedFirstMessage = useRef(false);
  const isProcessingAI = useRef(false);
  const pendingMessages = useRef<Set<string>>(new Set());

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check authentication and redirect if needed
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
      } else {
        router.push("/login");
      }
      setIsInitialized(true);
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else if (_event === 'SIGNED_OUT') {
        setUser(null);
        router.push("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // Setup realtime listener
  useEffect(() => {
    if (!chatId) return;

    // Initial load
    getAllMessage(chatId).then(msgs => {
      setMessages(msgs || []);
    });

    const channel = supabase
      .channel(`chat_${chatId}`)
      .on(
        "postgres_changes",
        { 
          event: "INSERT",
          schema: "public", 
          table: "messages", 
          filter: `chat_id=eq.${chatId}` 
        },
        (payload) => {
          const newMsg = {
            id: payload.new.id,
            sender: payload.new.sender,
            message: payload.new.message,
            created_at: payload.new.created_at
          };

          setMessages((prev) => {
            // Check if this message already exists
            const exists = prev.some(m => m.id === payload.new.id);
            if (exists) return prev;
            
            // Remove any pending temp message with same content
            const filtered = prev.filter(m => {
              if (m.id?.startsWith('temp-') && m.message === newMsg.message && m.sender === newMsg.sender) {
                return false;
              }
              return true;
            });
            
            // Add new message and sort by timestamp
            return [...filtered, newMsg].sort((a, b) => 
              new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
            );
          });

          // Remove from pending set
          pendingMessages.current.delete(payload.new.message);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  // Initialize chat and handle first message
  useEffect(() => {
    if (loading || !user || hasProcessedFirstMessage.current) return;

    const initChat = async () => {
      const currentChatId = params.id as string;
      if (!currentChatId) return;

      setChatId(currentChatId);
      
      // Handle first message if exists
      const firstMsg = localStorage.getItem("first_message");
      
      if (firstMsg) {
        hasProcessedFirstMessage.current = true;
        localStorage.removeItem("first_message");
        
        // Wait a bit for realtime to be ready
        await new Promise(r => setTimeout(r, 300));
        
        // Add user message immediately to UI
        const tempUserMsg = {
          id: `temp-user-${Date.now()}`,
          sender: "user",
          message: firstMsg,
          created_at: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, tempUserMsg]);
        pendingMessages.current.add(firstMsg);
        
        setIsInitialized(true);

        // Save to DB (realtime will replace temp)
        await addMessage(currentChatId, "user", firstMsg);
        
        // Small delay before AI response
        await new Promise(r => setTimeout(r, 300));
        
        // Trigger AI response
        await triggerAIResponse(firstMsg, currentChatId);
      }
    };
    initChat();
  }, [params.id, user, loading]);

  // Handle AI response with streaming
  const triggerAIResponse = async (msg: string, chatId: string) => {
    if (isProcessingAI.current) return;
    isProcessingAI.current = true;
    
    setIsLoading(true);
    setFailed(false);
    let aiMessage = "";

    // Show loading indicator
    setMessages((prev) => [...prev, { sender: "ai", message: "...", id: "ai-loading" }]);

    try {
      // Stream the response
      await question(msg, chatId, (token: string) => {
        aiMessage += token;
        setMessages((prev) => {
          const withoutTemp = prev.filter(
            (m) => m.id !== "ai-loading" && m.id !== "ai-streaming"
          );
          return [
            ...withoutTemp,
            { 
              sender: "ai", 
              message: aiMessage, 
              id: "ai-streaming",
              created_at: new Date().toISOString()
            }
          ];
        });
      });

      // Mark as pending
      pendingMessages.current.add(aiMessage);

      // Save complete AI message to DB
      await addMessage(chatId, "ai", aiMessage);

      // Keep streaming message visible until realtime confirms
      // Realtime listener will replace it with the persisted version

    } catch (err) {
      console.error("AI response failed:", err);
      setFailed(true);
      setMessages((prev) => 
        prev.filter((m) => m.id !== "ai-streaming" && m.id !== "ai-loading")
      );
    } finally {
      setIsLoading(false);
      isProcessingAI.current = false;
    }
  };

  // Handle message submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !chatId || isLoading) return;

    const userMessage = message;
    setMessage("");

    try {
      // Add message immediately to UI with temp ID
      const tempMsg = {
        id: `temp-user-${Date.now()}`,
        sender: "user",
        message: userMessage,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, tempMsg]);
      pendingMessages.current.add(userMessage);
      
      // Save to DB (realtime will replace temp message)
      await addMessage(chatId, "user", userMessage);
      
      // Small delay before AI response
      await new Promise(r => setTimeout(r, 300));
      
      // Trigger AI response
      await triggerAIResponse(userMessage, chatId);
    } catch (err) {
      console.error("Failed to send message:", err);
      setFailed(true);
    }
  };

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-marble bg-cover bg-center">
        <motion.div 
          className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" 
        />
      </div>
    );
  }

  return (
    <div className="bg-[url('/marble.jpg')] bg-cover bg-center min-h-screen w-full flex flex-col px-4 py-6 relative">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md"/>
      <Side setOpenMap={setOpenMap} />
      <Map openMap={openMap} setOpenMap={setOpenMap} />

      <div className=" relative flex justify-center items-center pt-6 pb-4">
        <h1 className="text-6xl lg:text-8xl font-serif font-bold tracking-tight drop-shadow-[0_0_25px_rgba(255,215,0,0.15)]">
            <span className="text-gradient">VERITUS</span>
        </h1>
      </div>

      <div className=" relative flex-grow flex flex-col items-center w-full pb-12">
        <div className="flex-1 w-full max-w-4xl mx-auto pt-4 pb-24 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "user" ? (
                  <div className="max-w-xs bg-gold/20 border border-gold/3 px-4 py-3">
                    <p className="text-white text-sm">{msg.message}</p>
                  </div>
                ) : msg.message === "..." ? (
                  <div className="max-w-xs bg-black/60 border border-gold/30 rounded-2xl px-4 py-3">
                    <motion.p
                      className="text-gold text-sm"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      ...
                    </motion.p>
                  </div>
                ) : (
                  <ChatBubble
                    id={msg.id}
                    message={msg.message}
                    isLast={index === messages.length - 1}
                    isStreaming={msg.id === "ai-streaming"}
                  />
                )}
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {failed && (
          <div className="max-w-xs bg-red-500/20 border border-red-500/30 rounded-2xl px-4 py-3 mb-4">
            <p className="text-red-200 text-sm">
              Failed to send message. Please try again.
            </p>
          </div>
        )}

        {/* Input Bar */}
        <div className="w-full max-w-md z-20">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-end gap-3">
              <textarea
                placeholder="Ask a question, cite a law, or make your case..."
                value={message}
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                onChange={(e) => {
                  handleInputChange(e);
                  e.target.style.height = 'auto';
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                rows={1}
                className="w-full resize-none overflow-hidden bg-gold/15 backdrop-blur-md border border-gold/30 px-4 py-3 shadow-md disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all placeholder:text-gold/50 text-white"
              />
              <button
                type="submit"
                disabled={isLoading || !message.trim()}
                className="w-14 h-12 flex items-center justify-center bg-gold/15 backdrop-blur-md border border-gold/30 rounded-full shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                {isLoading ? (
                  <Spinner />
                ) : (
                  <Image src="/up-arrow.png" alt="Send" width={25} height={20} />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}