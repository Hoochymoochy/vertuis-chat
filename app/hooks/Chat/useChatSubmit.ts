import { useState } from "react";
import { addMessage, uploadFileToStorage } from "@/app/lib/chat";

export default function useChatSubmit(
  chatId: string | null,
  userId: string | null,
  isLoading: boolean,
  setMessages: React.Dispatch<React.SetStateAction<any[]>>,
  triggerAIResponse: (msg: string, chatId: string, userId: string, setMessages: any, filePath?: string | null, fileName?: string | null) => Promise<void>,
  setFailed: (failed: boolean) => void
) {
  const handleSubmit = async (message: string, file?: File | null) => {
    if ((!message.trim() && !file) || !chatId || !userId || isLoading) return;

    const userMessage = message.trim();
    let uploadedFilePath: string | null = null;
    let uploadedFileName: string | null = null;
    let tempMsg: any = null;

    try {
      if (file) {
        const { path } = await uploadFileToStorage(file, userId);
        uploadedFilePath = path;
        uploadedFileName = file.name;
      }

      const tempId = `temp-user-${Date.now()}`;
      const displayMessage = userMessage || `Summarizing your file...`;
      tempMsg = {
        id: tempId,
        sender: "user",
        message: displayMessage,
        created_at: new Date().toISOString(),
        file_path: uploadedFilePath,
        file_name: uploadedFileName
      };
      setMessages(prev => [...prev, tempMsg]);
      
      await addMessage(chatId, "user", displayMessage, uploadedFilePath ?? "", uploadedFileName ?? "");
      await new Promise(r => setTimeout(r, 400));
      
      await triggerAIResponse(userMessage, chatId, userId, setMessages, uploadedFilePath, uploadedFileName);
    } catch (err) {
      console.error("Failed to send message:", err);
      setFailed(true);
      if (tempMsg) {
        setMessages((prev) => prev.filter(m => m.id !== tempMsg.id));
      }
    }
  };

  return { handleSubmit };
}