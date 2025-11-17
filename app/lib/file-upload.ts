const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const sendFile = async (file: string | Blob, onToken: (arg0: any) => void) => {
  const form = new FormData();
  form.append("file", file);
  form.append("chat_id", "abc123");
  form.append("lang", "en");

  const res = await fetch(`${backendUrl}/upload-summary`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) throw new Error("upload failed");

  // Start reading SSE
  if (!res.body) throw new Error("body wsa empty");
  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);

    chunk
      .split("\n\n")
      .filter((line) => line.startsWith("data: "))
      .forEach((line) => {
        const json = JSON.parse(line.replace("data: ", ""));
        onToken(json.token);
      });
  }
};
