import { addMessage } from "@/app/lib/chat";

interface LegalSummaryResponse {
  summary: {
    summary: string;
    url: string[];
  };
}

export default async function question(question: string): Promise<LegalSummaryResponse> {
  // const error = await addChat("6e539fc1-cb84-4584-a56a-1e42be88fc79", question);
  const error = await addMessage("c0e6bc33-213e-46fa-9e1a-206f8419f364", "user", question);
  if (error) throw error
  console.log("Holy molly")
  const response = await fetch("http://192.168.1.188:4000/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: question }),
  });
  const data = await response.json();
  const error2 = await addMessage("c0e6bc33-213e-46fa-9e1a-206f8419f364", "bot", data.summary.summary);
  if (error2) throw error2
  return response.json();
}
