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

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const text = decoder.decode(value);

    text
      .split("\n\n")
      .filter((line) => line.startsWith("data: "))
      .forEach((line) => {
        const json = JSON.parse(line.replace("data: ", ""));
        onToken(json.token);
      });
  }
};
