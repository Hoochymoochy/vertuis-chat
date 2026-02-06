// hooks/Chat/useFeedbackReasons.ts
import { useTranslations } from "next-intl"

export function useFeedbackReasons(feedback: "up" | "down" | null) {
  const t = useTranslations("ChatBubble")

  const positive = [
    t("perfectAnswer"),
    t("clearExplanation"),
    t("helpfulCitations"),
    t("comprehensive"),
  ]

  const negative = [
    t("offTopic"),
    t("outdatedLaw"),
    t("unclearExplanation"),
    t("missingCitation"),
    t("inaccurateInfo"),
  ]

  return feedback === "down" ? negative : positive
}
