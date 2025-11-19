import { supabase } from "./supabaseClient";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const uploadFileSSE = async (
  file: string | Blob,
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

  if (!res.ok) throw new Error("upload failed");
  if (!res.body) throw new Error("empty body");
};

export const uploadFileSupabase = async (file: File, chatId: string) => {
  const filePath = `${chatId}/${file.name}`;

  console.log("Uploading file:", filePath);

  const { data, error } = await supabase.storage
    .from("files")
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
    .from("your_bucket")
    .getPublicUrl(path);

  return data.publicUrl;
};