"use client";

interface LegalSummaryResponse {
  summary: {
    summary: string;
    url: string[];
  };
}

export default async function question(question: string): Promise<LegalSummaryResponse> {
  const response = await fetch("http://192.168.1.188:4000/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: question }),
  });
  const data = await response.json();

  // const response = {
  //   summary: {
  //     summary: "summary",
  //     url: ["url"],
  //   },
  // };

  return data;
}
