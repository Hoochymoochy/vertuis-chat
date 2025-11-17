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

