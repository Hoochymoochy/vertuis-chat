import { supabase } from "./supabaseClient";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const uploadFileSSE = async (
  file: File,
  userId: string,
  lang: string,
  onToken: (token: string) => void
): Promise<void> => {
  const form = new FormData();
  form.append("file", file);
  form.append("user_id", userId);
  form.append("lang", lang);

  const res = await fetch(`${backendUrl}/summarize-file`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Upload failed:", res.status, errorText);
    throw new Error(`Upload failed: ${res.status}`);
  }
  
  if (!res.body) {
    throw new Error("No response body");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          
          // Handle completion signal
          if (data === '[DONE]') {
            return;
          }
          
          try {
            const parsed = JSON.parse(data);
            
            // Handle error from backend
            if (parsed.error) {
              throw new Error(parsed.error);
            }
            
            // Handle token
            if (parsed.token) {
              onToken(parsed.token);
            }
          } catch (e) {
            // If it's not JSON, might be plain text token
            if (data && !data.includes('{')) {
              onToken(data);
            } else {
              console.error("JSON parse error:", e);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Stream reading error:", error);
    throw error;
  } finally {
    reader.releaseLock();
  }
};
export const uploadFileSupabase = async (file: File, chatId: string) => {
  const filePath = `${chatId}/${file.name}`;

  console.log("Uploading file:", filePath);

  const { data, error } = await supabase.storage
    .from("chat-files")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false
    });

  if (error) {
    console.error("Upload error:", error);
    return null;
  }

  return data.path;
};

export const getPublicUrl = (path: string) => {
  const { data } = supabase.storage
    .from("chat-files")
    .getPublicUrl(path);

  return data.publicUrl;
};