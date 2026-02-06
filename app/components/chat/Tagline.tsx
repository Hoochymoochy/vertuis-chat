import { AnimatePresence, motion } from "framer-motion";
import { TaglineProps } from "./type";

export function Tagline({ needsOnboarding, isSubmitted, t, isCollapsed }: TaglineProps) {
  return (
    <AnimatePresence>
      {!isSubmitted && (
        <motion.div
          key="tagline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.4 }}
          className={`
            relative bottom-20 left-1/2 -translate-x-1/2
            z-20 flex flex-col items-center text-center
            ${needsOnboarding ? 'opacity-30' : ''}
          `}
        >
          <p className="text-gold/90 text-xs sm:text-sm font-medium uppercase tracking-[0.35em] drop-shadow-lg">
            {t("tagline")}
          </p>
          <p className="text-white/50 text-[10px] sm:text-xs italic tracking-wide mt-1">
            {t("disclaimer")}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
