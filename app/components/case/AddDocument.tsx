import type { addDocument } from "./type";
import { X, Upload } from "lucide-react";
import { useTranslations } from "next-intl";

export function AddDocument({
  showAddDocument,
  closeAddDocumentModal,
  handleAddDocument,
  documentTitle,
  setDocumentTitle,
  file,
  isSubmitting,
  handleFileChange,
}: addDocument) {
  const t = useTranslations("Case");

  if (!showAddDocument) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg p-8 w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {t("addNewDocument")}
          </h2>
          <button
            onClick={closeAddDocumentModal}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleAddDocument} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              {t("documentTitle")}
            </label>
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder={t("documentTitlePlaceholder")}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#d4af37]/50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              {t("uploadFile")}
            </label>
            <div className="relative">
              <input
                type="file"
                onChange={(e) => handleFileChange(e)}
                accept=".pdf"
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center gap-2 w-full bg-black/50 border border-white/10 hover:border-[#d4af37]/30 rounded-lg px-4 py-8 cursor-pointer transition-all group"
              >
                <Upload className="w-5 h-5 text-[#d4af37] group-hover:scale-110 transition-transform" />
                <span className="text-white/60 group-hover:text-[#d4af37] transition-colors">
                  {file ? file.name : t("uploadInstruction")}
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-gold/70 text-sm">
              {t("or")}
            </span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={closeAddDocumentModal}
              className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-white transition-all"
              disabled={isSubmitting}
            >
              {t("cancel")}
            </button>

            <button
              type="submit"
              className="flex-1 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border border-[#d4af37]/30 rounded-lg px-4 py-3 text-[#d4af37] font-medium transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? t("adding") : t("addDocument")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
