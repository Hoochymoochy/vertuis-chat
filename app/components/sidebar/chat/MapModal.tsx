// MapModal.tsx - Modal for selecting jurisdiction
import { motion, AnimatePresence } from "framer-motion";
import { Close } from "@carbon/icons-react";

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  country: string | null;
  state: string | null;
  t: (key: string) => string;
}

export function MapModal({ isOpen, onClose, country, state, t }: MapModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101]
              w-[90vw] max-w-4xl max-h-[80vh]
              bg-neutral-950 border border-amber-600/30 rounded-xl shadow-2xl
              overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
              <div>
                <h2 className="text-xl font-semibold text-neutral-50">
                  {t("selectJurisdiction")}
                </h2>
                <p className="text-sm text-neutral-400 mt-1">
                  {t("selectJurisdictionDesc")}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-neutral-900 transition-colors"
              >
                <Close size={20} className="text-neutral-50" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Current Selection */}
              <div className="mb-6 p-4 bg-amber-900/10 border border-amber-600/30 rounded-lg">
                <h3 className="text-sm font-semibold text-amber-500 mb-2">
                  {t("currentSelection")}
                </h3>
                <div className="space-y-1">
                  <p className="text-neutral-50 text-sm">
                    <span className="text-amber-500/80">{t("country")}:</span>{" "}
                    {country || t("global")}
                  </p>
                  <p className="text-neutral-50 text-sm">
                    <span className="text-amber-500/80">{t("state")}:</span>{" "}
                    {state || "N/A"}
                  </p>
                </div>
              </div>

              {/* Map/Selection Interface - Placeholder */}
              <div className="border-2 border-dashed border-neutral-800 rounded-lg p-12 text-center">
                <div className="text-neutral-400 text-sm">
                  <p className="mb-2">{t("mapPlaceholder")}</p>
                  <p className="text-xs text-neutral-500">
                    {t("mapPlaceholderDesc")}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-800">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-neutral-700 text-neutral-50
                  hover:bg-neutral-900 transition-colors"
              >
                {t("cancel")}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-amber-900/30 border border-amber-600/30
                  text-neutral-50 hover:bg-amber-900/40 transition-colors"
              >
                {t("save")}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
