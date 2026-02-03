import { AnimatePresence, motion } from "framer-motion";

type Props = {
  needsOnboarding: boolean;
  isSubmitted: boolean;
  t: (key: string) => string;
  isCollapsed: boolean;
};

export function Tagline({ needsOnboarding, isSubmitted, t, isCollapsed }: Props) {
  return (
    <AnimatePresence>
      {!isSubmitted && (
        <motion.div
          key="tagline"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.4 }}
          className={`relative mx-auto z-10 text-center px-4 space-y-2 ${
            needsOnboarding ? 'opacity-30' : ''
          }`}
        >
          <motion.div
            animate={{
              x: isCollapsed ? 0 : 0
            }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <p className="text-gold/90 text-base sm:text-lg font-medium uppercase tracking-[0.25em] drop-shadow-lg">
              {t("tagline")}
            </p>
            <p className="text-white/50 text-xs sm:text-sm italic tracking-wide">
              {t("disclaimer")}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}