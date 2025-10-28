"use client";
import { getLanguage, getCountry, getState } from "@/app/lib/user";

export async function question(question: string, id: string, onToken: (token: string) => void) {
  const response = await fetch("http://localhost:4000/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: question, id, lang:  getLanguage(), country: getCountry(), state: getState() }),
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

    // Split by lines (SSE sends lines like data: {...})
    const lines = buffer.split("\n").filter(Boolean);
    for (let line of lines) {
      line = line.replace(/^data:\s*/, "").trim();
      if (!line) continue;

      if (line === "[DONE]") return;

      try {
        const json = JSON.parse(line);
        if (json.token) onToken(json.token); // send each token up
      } catch {
        // ignore partial lines
      }
    }
    buffer = "";
  }
}

export default question;