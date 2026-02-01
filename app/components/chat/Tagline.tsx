import { AnimatePresence, motion } from "framer-motion";

type Props = {
    needsOnboarding: boolean;
    isSubmitted: boolean;
    t: (key: string) => string;
};

export function Tagline({ needsOnboarding, isSubmitted, t }: Props) {
    return (
        <AnimatePresence>
        {!isSubmitted && (
          <motion.div
            key="tagline"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.8, 
              ease: [0.4, 0, 0.2, 1],
              delay: 0.4 
            }}
            className={`fixed bottom-8 left-0 right-0 z-10 text-center px-4 space-y-2 ${
              needsOnboarding ? 'opacity-30' : ''
            }`}
          >
            <p className="text-gold/90 text-base sm:text-lg font-medium uppercase tracking-[0.25em] drop-shadow-lg">
              {t("tagline")}
            </p>
            <p className="text-white/50 text-xs sm:text-sm italic tracking-wide">
              {t("disclaimer")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    )
}