"use client";
import { getLanguage } from "@/app/lib/user";
import { supabase } from "./supabaseClient";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function question(
  question: string,
  chatId: string,
  onToken: (token: string) => void
) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!user) return;

  const language = await getLanguage(user.id);

  const body = JSON.stringify({
    message: question,
    chat_id: chatId,
    language: language || "en",
  });

  const response = await fetch(`${backendUrl}/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  if (!response.body) throw new Error("No response body");

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let done = false;
  let buffer = "";

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    buffer += decoder.decode(value || new Uint8Array(), { stream: true });

    // Split by lines (SSE sends lines like "data: <token>")
    const lines = buffer.split("\n");
    
    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].replace(/^data:\s*/, "").trim();
      if (!line) continue;

      if (line === "[DONE]") {
        done = true;
        break;
      }

      if (line.startsWith("[ERROR:")) {
        throw new Error(line);
      }

      // Backend sends raw tokens, not JSON
      onToken(line);
    }
    
    // Keep the last incomplete line in buffer
    buffer = lines[lines.length - 1];
  }
}

export default question;