"use client";

import { addMessage } from "@/app/lib/chat";

interface LegalSummaryResponse {
  summary: {
    summary: string;
    url: string[];
  };
}

export default async function question(question: string): Promise<LegalSummaryResponse> {
  // 1️⃣ Make sure chat_id exists;

  // 3️⃣ Send to AI API (placeholder right now)
  // const response = await fetch("/ask", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ query: question }),
  // });
  // const data = await response.json();

  const response = {
    summary: {
      summary: "summary",
      url: ["url"],
    },
  };

  return response;
}
