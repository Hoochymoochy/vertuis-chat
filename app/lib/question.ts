"use client";

interface LegalSummaryResponse {
  summary: string[];
  answer: {
    summary: string;
    urls: string[];
  };
}

export default async function question(question: string): Promise<string> {
  const response = await fetch("https://a43pxnbhbeaefk-4000.proxy.runpod.net/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: question }),
  });
  const data = await response.json();

  return data.answer.summary;
}
