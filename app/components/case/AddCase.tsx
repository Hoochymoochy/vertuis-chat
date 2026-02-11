import { useTranslations } from "next-intl";
import type { addCase } from "./type";
import { X } from "lucide-react";

export function AddCase({
  isAdding,
  toggleAddCase,
  handleAddCase,
  isSubmitting,
}: addCase) {
  const t = useTranslations("Case");

  if (!isAdding) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl">
        {/* Subtle animated gold glow */}
        <div className="absolute inset-0 -z-10 bg-gradient-radial from-gold/10 via-transparent to-transparent blur-inset-[1px] rounded-xl animate-gold-spin opacity-40 blur-sm" />

        {/* Modal */}
        <div className="relative bg-black/95 backdrop-blur-xl p-8 rounded-xl border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {t("createNewCase")}
              </h2>
              <p className="text-sm text-white/50 mt-1">
                {t("createSubtitle")}
              </p>
            </div>

            <button
              onClick={toggleAddCase}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleAddCase} className="space-y-6">
            {/* Case Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-white/70 mb-2"
              >
                {t("caseName")}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder={t("caseNamePlaceholder")}
                className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#d4af37]/50 transition-colors rounded"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-white/70 mb-2"
              >
                {t("description")}
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder={t("descriptionPlaceholder")}
                className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white placeholder-white/40 resize-none focus:outline-none focus:border-[#d4af37]/50 transition-colors rounded"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={toggleAddCase}
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-3 text-white transition-all rounded"
                disabled={isSubmitting}
              >
                {t("cancel")}
              </button>

              <button
                type="submit"
                className="flex-1 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border border-[#d4af37]/30 px-4 py-3 text-[#d4af37] font-medium transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] disabled:opacity-50 disabled:cursor-not-allowed rounded"
                disabled={isSubmitting}
              >
                {isSubmitting ? t("creating") : t("createCase")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
