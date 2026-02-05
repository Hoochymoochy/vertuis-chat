import { useState } from "react";
import { useRouter } from "next/navigation";
import { addChat } from "@/app/lib/chat";
import { addMessage } from "@/app/lib/message";
import { uploadFileSupabase } from "@/app/lib/file-upload";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function useInitialChat(userId: string | null) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const startChat = async (message: string, locale: string, file?: File | null) => {
    if ((!message.trim() && !file) || !userId || isLoading) return;

    setIsLoading(true);
    setFailed(false);

    try {
      const healthRes = await fetch(`${backendUrl}/health`);
      const { status } = await healthRes.json();
      if (status !== "ok") throw new Error("Backend not ready");

      if (file) {
        const { id } = await addChat(userId, file.name.slice(0, 50));
        const filePath = await uploadFileSupabase(file, id);
        if (filePath === null) throw new Error("File upload failed");
        await addMessage(id, "user", "Summarizing your file..." , filePath, file.name);
        router.push(`/${locale}/chat/${id}`);
      } else {
        const { id } = await addChat(userId, message.slice(0, 50));
        await addMessage(id, "user", message);
        router.push(`/${locale}/chat/${id}`);
      }
    } catch (err) {
      console.error("Failed to start chat:", err);
      setFailed(true);
      setIsLoading(false);
    }
  };

  return { isLoading, failed, startChat };
}