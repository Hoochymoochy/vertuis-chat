import { supabase } from "./supabaseClient";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function uploadFile(file: string | Blob, userId: string, lang: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("userId", userId);
  formData.append("lang", lang);

  const res = await fetch(`${backendUrl}/summarize-file`, {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  return data.summary; // <-- string
}

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



