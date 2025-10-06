"use client";

interface LegalSummaryResponse {
  summary: string[];
  answer: {
    summary: string;
    urls: string[];
  };
}

export default async function question(question: string, id: string): Promise<string> {
  const response = await fetch("http://localhost:4000/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: question,
      id: id
     }),
  });
  const data = await response.json();

  return data.answer.summary;
}
