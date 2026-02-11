import { Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { documentContent } from "../case/type";
import { useTranslations } from "next-intl";

export function DocumentContent({
  selectedDoc,
  switchingTab,
  setSwitchingTab,
}: documentContent) {
  const t = useTranslations("Case");

  if (!selectedDoc) {
    return null;
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-white/10 overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-2xl font-bold text-white">
          {selectedDoc.title}
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-6 border-b border-white/10">
        <button
          onClick={() => setSwitchingTab(false)}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-medium transition-all relative ${
            !switchingTab
              ? "text-[#d4af37]"
              : "text-white/60 hover:text-white/80"
          }`}
        >
          <span>{t("originalText")}</span>
          {!switchingTab && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d4af37]" />
          )}
        </button>

        <button
          onClick={() => setSwitchingTab(true)}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-medium transition-all relative ${
            switchingTab
              ? "text-[#d4af37]"
              : "text-white/60 hover:text-white/80"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{t("aiSummary")}</span>
          {switchingTab && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d4af37]" />
          )}
        </button>
      </div>

      {/* Document Content */}
      <div className="p-6">
        {switchingTab ? (
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => (
                  <a
                    {...props}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#d4af37] underline hover:text-[#d4af37]/80 transition-colors"
                  />
                ),
                p: ({ children }) => (
                  <p className="text-white/80 leading-relaxed mb-4 last:mb-0">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="text-white/80 space-y-2 ml-6 mb-4 list-disc">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="text-white/80 space-y-2 ml-6 mb-4 list-decimal">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-white/80 leading-relaxed">
                    {children}
                  </li>
                ),
                strong: ({ children }) => (
                  <strong className="text-white font-semibold">
                    {children}
                  </strong>
                ),
                code: ({ children }) => (
                  <code className="bg-white/5 text-[#d4af37] px-2 py-0.5 rounded text-sm font-mono">
                    {children}
                  </code>
                ),
                h1: ({ children }) => (
                  <h1 className="text-white text-2xl font-bold mb-4 mt-6 first:mt-0">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-white text-xl font-semibold mb-3 mt-5 first:mt-0">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-white text-lg font-semibold mb-3 mt-4 first:mt-0">
                    {children}
                  </h3>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-[#d4af37]/30 pl-4 my-4 text-white/70 italic">
                    {children}
                  </blockquote>
                ),
                hr: () => <hr className="border-t border-white/10 my-6" />,
              }}
            >
              {selectedDoc.summary}
            </ReactMarkdown>
          </div>
        ) : (
          <div
            className="bg-black/30 overflow-hidden"
            style={{ height: "600px" }}
          >
            <iframe
              src={selectedDoc.signed_url}
              width="100%"
              height="100%"
              className="w-full h-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}
