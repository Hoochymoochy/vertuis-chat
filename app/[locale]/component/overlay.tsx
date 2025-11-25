import { AnimatePresence, motion } from "framer-motion";

type OverlayProps = {
  isDragging: boolean;
};

export default function Overlay({ isDragging }: OverlayProps) {
  return (
    <AnimatePresence>
      {isDragging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-md z-30 flex items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 150, damping: 18 }}
            className="bg-linear-to-br from-gold/15 to-gold/5 border border-gold/30 p-8 max-w-md text-center shadow-2xl rounded-xl"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-gold/20 border-t-gold shadow-[0_0_25px_rgba(255,215,0,0.2)]"
            />
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Drop Your File
            </h2>
            <p className="text-gold/80 text-sm">
              Release to upload your document
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}