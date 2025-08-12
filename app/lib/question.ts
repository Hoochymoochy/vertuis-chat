"use client";

import { addMessage } from "@/app/lib/chat";

interface LegalSummaryResponse {
  summary: {
    summary: string;
    url: string[];
  };
}

export default async function question(
  question: string
): Promise<LegalSummaryResponse> {
  // 1️⃣ Make sure chat_id exists
  const chat_id = localStorage.getItem("chat_id");
  if (!chat_id) throw new Error("No chat_id found");

  // 2️⃣ Save user message
  await addMessage(chat_id, "user", question);

  console.log("User message saved");

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

  // 4️⃣ Save AI message
  await addMessage(chat_id, "ai", response.summary.summary);

  console.log("AI message saved");

  return response;
}
