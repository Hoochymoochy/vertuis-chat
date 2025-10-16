import { AnimatePresence, motion } from "framer-motion"
import WorldToCountryMap from "./jurisdiction"

type MapProps = {
    openMap: boolean;
    setOpenMap: (open: boolean) => void;
    selectedCountry: string;
    selectedState: string;
    onCountrySlected: (country: string) => void;
    onStateSelected: (state: string) => void;
};

export default function Map({openMap, setOpenMap, selectedCountry, selectedState, onCountrySlected, onStateSelected}: MapProps) {
  if (!openMap) {
    return null
}
    return(
    <AnimatePresence>
      {openMap && (
        <motion.div
          key="map-popup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
            onClick={(e) => {
         if (e.target === e.currentTarget) setOpenMap(false)
        }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-black/80 rounded-2xl border border-gold/40 shadow-xl p-6 max-w-5xl w-full mx-4"
            onClick={(e) => e.stopPropagation()} // prevents closing when clicking inside
          >

            <WorldToCountryMap
              onCountrySlected={onCountrySlected}
              onStateSelected={onStateSelected}
              setOpenMap={setOpenMap}
              slectedCountry={selectedCountry ?? "world"}
              slectedState={selectedState ?? ""}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence> 
    ) 
}