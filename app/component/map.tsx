import { AnimatePresence, motion } from "framer-motion"
import WorldToCountryMap from "./jurisdiction"

type MapProps = {
    openMap: boolean;
    needsOnboarding?: boolean;
    setOpenMap: (open: boolean) => void;
};

export default function Map({openMap, setOpenMap}: MapProps) {
    // Detect mobile Safari
    const isMobileSafari = typeof window !== 'undefined' && 
    /iPhone|iPad|iPod/.test(navigator.userAgent) && 
    ('MSStream' in window);
    
    return(
    <AnimatePresence mode="wait">
      {openMap && (
        <motion.div
          key="map-popup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          // Remove backdrop-blur on mobile Safari - it breaks SVG rendering
          className={`fixed inset-0 z-50 flex items-center justify-center ${
            isMobileSafari ? 'bg-black/85' : 'bg-black/70 backdrop-blur-md'
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpenMap(false)
          }}
          style={{
            // Force GPU acceleration and prevent Safari bugs
            WebkitTransform: 'translateZ(0)',
            transform: 'translateZ(0)',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden'
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ 
              duration: isMobileSafari ? 0.2 : 0.3, // Faster on mobile
              ease: [0.16, 1, 0.3, 1],
              // Remove layout animation on mobile Safari
              ...(isMobileSafari ? {} : { layout: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } })
            }}
            className="relative bg-black/80 border border-gold/40 shadow-xl p-6 max-w-5xl w-full mx-4 overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
            style={{
              // Additional mobile Safari fixes
              WebkitOverflowScrolling: 'touch',
              WebkitTransform: 'translateZ(0)',
              transform: 'translateZ(0)',
              willChange: 'transform, opacity'
            }}
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
}