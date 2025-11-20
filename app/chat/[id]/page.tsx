"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import ChatBubble from "@/app/component/bubble";
import Side from "@/app/component/side";
import Map from "@/app/component/map";
import question from "@/app/lib/question";
import { uploadFileSSE } from "@/app/lib/file-upload";
import { addMessage, getAllMessage, getChatLength, getLatestMessage, uploadFileToStorage, getPublicUrl } from "@/app/lib/chat";
import InputBox from "@/app/component/inputbox";

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();

  const [user, setUser] = useState<any>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [openMap, setOpenMap] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasProcessedFirstMessage = useRef(false);
  const isProcessingAI = useRef(false);

  // Helper function to deduplicate messages
  const deduplicateMessages = (msgs: any[]) => {
    const seen = new Set();
    return msgs.filter(msg => {
      if (seen.has(msg.id)) {
        return false;
      }
      seen.add(msg.id);
      return true;
    }).sort((a, b) => 
      new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
    );
  };

  // Improved auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Check authentication
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

  const hasLoadedInitial = useRef(false);

  // Setup realtime listener
  useEffect(() => {
    if (!chatId) return;

    if (!hasLoadedInitial.current) {
      getAllMessage(chatId).then(msgs => {
        setMessages(deduplicateMessages(msgs || []));
        hasLoadedInitial.current = true;
      });
    }

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
            created_at: payload.new.created_at,
            file_path: payload.new.file_path,
            file_name: payload.new.file_name
          };

          setMessages((prev) => {
            // Check if this exact message (by ID) already exists
            const existingIndex = prev.findIndex(m => m.id === newMsg.id);
            if (existingIndex !== -1) {
              return prev;
            }
            
            // Remove temp messages that match this real message
            const filtered = prev.filter(m => {
              const isTemp = String(m.id).startsWith('temp-');
              if (!isTemp) return true;
              
              const matchesContent = m.message === newMsg.message;
              const matchesSender = m.sender === newMsg.sender;
              return !(matchesContent && matchesSender);
            });
            
            // Add new message and deduplicate
            const updated = [...filtered, newMsg];
            return deduplicateMessages(updated);
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  // Initialize chat and handle first message
  useEffect(() => {
    if (loading || !user || !isInitialized || hasProcessedFirstMessage.current) return;

    const initChat = async () => {
      const currentChatId = params.id as string;
      if (!currentChatId) return;

      setChatId(currentChatId);
      hasProcessedFirstMessage.current = true;

      const length = await getChatLength(currentChatId);
            
      if (length >= 1) {
        const firstMessage = await getLatestMessage(currentChatId);

        if (firstMessage && firstMessage.sender === 'user') {
          const allMessages = await getAllMessage(currentChatId);
          const hasAIResponse = allMessages.some(
            m => m.sender === 'ai' && 
            new Date(m.created_at).getTime() > new Date(firstMessage.created_at).getTime()
          );
          
          if (!hasAIResponse) {
            triggerAIResponse(
              firstMessage.message, 
              currentChatId, 
              firstMessage.file_path,
              firstMessage.file_name
            );
          }
        }
      }
    };
    
    initChat();
  }, [params.id, user, loading, isInitialized]);

  // Handle AI response with streaming
  const triggerAIResponse = async (
    msg: string, 
    chatId: string, 
    filePath?: string | null,
    fileName?: string | null
  ) => {
    if (isProcessingAI.current) return;
    isProcessingAI.current = true;
    
    setIsLoading(true);
    setFailed(false);
    let aiMessage = "";
    const streamingId = `temp-ai-${Date.now()}`;

    // Show loading indicator
    setMessages((prev) => [...prev, { 
      sender: "ai", 
      message: "...", 
      id: streamingId,
      created_at: new Date().toISOString()
    }]);

    try {
      // Define token handler
      const handleToken = (token: string) => {
        aiMessage += token;
        setMessages((prev) => {
          const withoutLoading = prev.filter(
            m => !(m.message === "..." && m.id === streamingId)
          );
          
          const hasStreaming = withoutLoading.some(m => m.id === streamingId);
          if (hasStreaming) {
            return withoutLoading.map(m => 
              m.id === streamingId 
                ? { ...m, message: aiMessage }
                : m
            );
          } else {
            return [...withoutLoading, { 
              sender: "ai", 
              message: aiMessage, 
              id: streamingId,
              created_at: new Date().toISOString()
            }];
          }
        });
      };

      // Handle file-based or text-based messages
      if (filePath && fileName) {
        console.log('Processing file message:', { filePath, fileName });

        const fileUrl = await getPublicUrl(filePath);
        console.log('Downloading file:', fileUrl);

        const downloadRes = await fetch(fileUrl);
        const blob = await downloadRes.blob();
        const file = new File([blob], fileName, { type: blob.type });

        await uploadFileSSE(file, user.id, "en", handleToken);
      } else {
        console.log('Processing text message:', msg);
        await question(msg, chatId, handleToken);
      }

      // Save complete AI message to DB
      await addMessage(chatId, "ai", aiMessage);

    } catch (err) {
      console.error("AI response failed:", err);
      setFailed(true);
      setMessages((prev) => prev.filter((m) => m.id !== streamingId));
    } finally {
      setIsLoading(false);
      isProcessingAI.current = false;
    }
  };

  // Handle message submission from InputBox
  const handleSubmit = async (message: string, file?: File | null) => {
    if ((!message.trim() && !file) || !chatId || isLoading) return;

    const userMessage = message.trim();
    let uploadedFilePath: string | null = null;
    let uploadedFileName: string | null = null;
    let tempMsg: any = null;

    try {
      // Upload file if present
      if (file) {
        console.log('Uploading file:', file.name);
        const { path } = await uploadFileToStorage(file, user.id);
        uploadedFilePath = path;
        uploadedFileName = file.name;
      }

      // Add temp message to UI
      const tempId = `temp-user-${Date.now()}`;
      const displayMessage = userMessage || `📎 ${uploadedFileName}`;
      tempMsg = {
        id: tempId,
        sender: "user",
        message: displayMessage,
        created_at: new Date().toISOString(),
        file_path: uploadedFilePath,
        file_name: uploadedFileName
      };
      setMessages(prev => [...prev, tempMsg]);
      
      // Save to DB (realtime will replace temp)
      await addMessage(
        chatId, 
        "user", 
        displayMessage,
        uploadedFilePath,
        uploadedFileName
      );
      
      // Wait for DB insert
      await new Promise(r => setTimeout(r, 400));
      
      // Trigger AI response
      await triggerAIResponse(
        userMessage, 
        chatId, 
        uploadedFilePath, 
        uploadedFileName
      );
    } catch (err) {
      console.error("Failed to send message:", err);
      setFailed(true);
      if (tempMsg) {
        setMessages((prev) => prev.filter(m => m.id !== tempMsg.id));
      }
    }
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
    <div className="bg-[url('/marble.jpg')] bg-cover bg-center bg-no-repeat bg-fixed min-h-screen w-full flex flex-col px-4 py-6 relative">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md"/>
      <Side setOpenMap={setOpenMap} />
      <Map openMap={openMap} setOpenMap={setOpenMap} />

      <div className="relative flex justify-center items-center pt-6 pb-4">
        <h1 className="text-6xl lg:text-8xl font-serif font-bold tracking-tight drop-shadow-[0_0_25px_rgba(255,215,0,0.15)]">
          <span className="text-gradient">VERITUS</span>
        </h1>
      </div>

      <div className="relative flex-grow flex flex-col items-center w-full pb-12">
        <div className="flex-1 min-h-0 w-full max-w-4xl mx-auto pt-4 pb-24 overflow-y-auto">
          <div className="space-y-4">
            {deduplicateMessages(messages).map((msg, index) => {
              const uniqueKey = msg.id ? `${msg.id}` : `msg-${index}-${msg.created_at}`;
              
              return (
                <motion.div
                  key={uniqueKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "user" ? (
                    <div className="max-w-xs bg-gold/20 border border-gold/30 px-4 py-3 rounded-lg">
                      {msg.file_name && (
                        <div className="text-xs text-gold/70 mb-1 flex items-center gap-1">
                          📎 {msg.file_name}
                        </div>
                      )}
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
                      isStreaming={String(msg.id).startsWith('temp-ai-')}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {failed && (
          <div className="max-w-xs bg-red-500/20 border border-red-500/30 rounded-2xl px-4 py-3 mb-4">
            <p className="text-red-200 text-sm">
              Failed to send message. Please try again.
            </p>
          </div>
        )}

        {/* Input Bar - Using InputBox Component */}
        <InputBox
          onSubmit={handleSubmit}
          isLoading={isLoading}
          disabled={false}
          placeholder="Ask a question, cite a law, or make your case..."
          filePlaceholder="Press enter to continue..."
          acceptedFileTypes=".pdf,.docx,.txt"
          showFileUpload={true}
          maxFileSize={10}
        />
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
}