import { AnimatePresence, motion } from "framer-motion"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"
import { useWorldToCountryMap } from "@/app/hooks/Map/useWorldToCountryMap"
import { MapProps } from "./type"

const BRAZIL_URL = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson"

export default function Map({ openMap, setOpenMap }: MapProps) {
  const {
    selectedState,
    hoveredRegion,
    setHoveredRegion,
    handleStateClick,
    getStateFillColor,
  } = useWorldToCountryMap(setOpenMap)

  // Detect mobile Safari
  const isMobileSafari = typeof window !== 'undefined' && 
    /iPhone|iPad|iPod/.test(navigator.userAgent) && 
    ('MSStream' in window);
    
  return (
    <AnimatePresence mode="wait">
      {openMap && (
        <motion.div
          key="map-popup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className={`fixed inset-0 z-50 flex items-center justify-center ${
            isMobileSafari ? 'bg-black/85' : 'bg-black/70 backdrop-blur-md'
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpenMap(false)
          }}
          style={{
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
              duration: isMobileSafari ? 0.2 : 0.3,
              ease: [0.16, 1, 0.3, 1],
              ...(isMobileSafari ? {} : { layout: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } })
            }}
            className="relative bg-black/80 border border-gold/40 shadow-xl p-6 max-w-5xl w-full mx-4 overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
            style={{
              WebkitOverflowScrolling: 'touch',
              WebkitTransform: 'translateZ(0)',
              transform: 'translateZ(0)',
              willChange: 'transform, opacity'
            }}
          >
            <div className="relative">
              {/* Info Cards */}
              <div className="flex flex-col items-center justify-center gap-3 mt-5">
                {/* Instruction Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="w-full max-w-md bg-black/60 backdrop-blur-lg border border-gold/30 px-5 py-3.5 relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-linear-to-r from-transparent via-gold/5 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="relative flex items-start gap-3">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <svg 
                        className="w-5 h-5 text-gold mt-0.5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                      </svg>
                    </motion.div>
                    <p className="text-gold/90 text-sm leading-relaxed">
                      Choose your state
                    </p>
                  </div>
                </motion.div>

                {/* Status Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="w-full max-w-md bg-linear-to-r from-gold/20 to-gold/10 backdrop-blur-lg border border-gold/40 px-5 py-3 relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="relative">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-gold/80 text-xs uppercase tracking-wider font-semibold">
                          {hoveredRegion 
                            ? 'Hovering:' 
                            : selectedState 
                            ? 'Selected:' 
                            : 'State:'}
                        </span>
                        <span className="text-white text-sm font-medium">
                          {hoveredRegion || selectedState || '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Close Button */}
              <motion.button
                onClick={() => setOpenMap(false)}
                className="absolute top-1 right-1 z-10 bg-black/60 backdrop-blur-sm border border-gold/30 px-3 py-2 transition-all group hover:bg-black/70 hover:border-red-500/50 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-xl transition-colors text-gold group-hover:text-red-400">
                  ✕
                </span>
              </motion.button>

              {/* Map Container */}
              <div className="relative w-full" style={{ minHeight: '400px' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key="brazil"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
                    className="w-full flex justify-center relative"
                    style={{ 
                      minHeight: '500px',
                      WebkitTransform: 'translateZ(0)',
                      transform: 'translateZ(0)'
                    }}
                  >
                    <ComposableMap
                      projection="geoMercator"
                      projectionConfig={{ scale: 650, center: [-52, -14] }}
                      width={800}
                      height={500}
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxWidth: '800px',
                        display: 'block'
                      }}
                    >
                      <Geographies geography={BRAZIL_URL}>
                        {({ geographies }) =>
                          geographies.map((geo) => {
                            const stateName = geo.properties.name

                            return (
                              <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                onMouseEnter={() => setHoveredRegion(stateName)}
                                onMouseLeave={() => setHoveredRegion(null)}
                                onClick={() => handleStateClick(stateName)}
                                style={{
                                  default: {
                                    fill: getStateFillColor(stateName),
                                    stroke: '#555',
                                    strokeWidth: 0.8,
                                    outline: 'none',
                                    transition: 'all 0.3s ease'
                                  },
                                  hover: {
                                    fill: '#FFD700',
                                    stroke: '#FFA500',
                                    strokeWidth: 1.2,
                                    outline: 'none',
                                    cursor: 'pointer',
                                    filter: 'brightness(1.1)'
                                  },
                                  pressed: {
                                    fill: '#FFA500',
                                    stroke: '#FF8C00',
                                    strokeWidth: 1.2,
                                    outline: 'none'
                                  }
                                }}
                              />
                            )
                          })
                        }
                      </Geographies>
                    </ComposableMap>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence> 
  )
}