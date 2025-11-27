import { AnimatePresence, motion } from "framer-motion"
import WorldToCountryMap from "./jurisdiction"

type MapProps = {
    openMap: boolean;
    needsOnboarding?: boolean;
    setOpenMap: (open: boolean) => void;
};

export default function Map({openMap, setOpenMap}: MapProps) {
    return(
    <AnimatePresence mode="wait">
      {openMap && (
        <motion.div
          key="map-popup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
            onClick={(e) => {
         if (e.target === e.currentTarget) setOpenMap(false)
        }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ 
              duration: 0.3, 
              ease: [0.16, 1, 0.3, 1],
              layout: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
            }}
            className="relative bg-black/80 border border-gold/40 shadow-xl p-6 max-w-5xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <WorldToCountryMap
              setOpenMap={setOpenMap}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence> 
    )
}