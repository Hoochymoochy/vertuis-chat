'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ComposableMap,
  Geographies,
  Geography,
} from '@/app/component/SimpleMapClient'


const WORLD_URL = '/countries-110m.json'
const BRAZIL_URL = '/brazil-states.geojson'
const USA_URL = '/us-states.json'

export default function WorldToCountryMap({onCountrySlected, onStateSelected, setOpenMap, slectedCountry, slectedState}: 
  { onCountrySlected: (country: string) => void, 
    onStateSelected: (state: string) => void,
    setOpenMap: (open: boolean) => void,
    slectedCountry: string,
    slectedState: string
  }) {

  const [hovered, setHovered] = useState<string | null>(null)
  const [isZooming, setIsZooming] = useState(false)

  const handleCountryClick = (country: string) => {
    if (country === 'Brazil' || country === 'United States of America') {
      setHovered('')
      setIsZooming(true)
      setTimeout(() => {
        if (country === 'Brazil') onCountrySlected('brazil')
        if (country === 'United States of America') onCountrySlected('usa')
        setIsZooming(false)
      }, 400)
    }
  }

  const handleBack = () => {
    setIsZooming(true)
    setTimeout(() => {
      onCountrySlected('world')
      setIsZooming(false)
    }, 400)
  }

  const getCountryFill = (name: string) => {
    if (name === 'Brazil' || name === 'United States of America') {
      return '#FFD700' // Gold for clickable countries
    }
    return '#1a1a1a' // Dark for others
  }

  return (
    <div className="relative">
      {/* Back Button */}
      {slectedCountry !== 'world' && (
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          onClick={handleBack}
          disabled={isZooming}
          className="absolute top-4 left-10 z-10 bg-black/60 backdrop-blur-sm border border-gold/30 rounded-lg px-4 py-2 hover:bg-black/70 hover:border-gold/50 transition-all disabled:opacity-50 group"
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center gap-2">
            <motion.span
              className="text-gold text-xl"
              whileHover={{ x: -3 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              ←
            </motion.span>
            <span className="text-gold text-sm font-medium group-hover:text-white transition-colors">
              Back
            </span>
          </div>
        </motion.button>
      )}

      {/* Close Button */}
      <motion.button
        onClick={() => setOpenMap(false)}
        className="absolute top-4 right-10 z-10 bg-black/60 backdrop-blur-sm border border-gold/30 rounded-lg px-3 py-2 hover:bg-black/70 hover:border-red-500/50 transition-all group"
        whileHover={{ scale: 1.05, rotate: 90 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-gold text-xl group-hover:text-red-400 transition-colors">
          ✕
        </span>
      </motion.button>

      {/* Map Container */}
      <div className="">
        <AnimatePresence mode="wait">
          {slectedCountry === 'world' && (
            <motion.div
              key="world"
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.43, 0.13, 0.23, 0.96]
              }}
              className="w-full flex justify-center"
            >
              <ComposableMap 
                projection="geoMercator"
                projectionConfig={{ scale: 120, center: [0, 20] }}
                width={800}
                height={400}
              >
                <Geographies geography={WORLD_URL}>
                  {({ geographies }: any) =>
                    geographies.map((geo: any) => {
                      const name = geo.properties.name
                      const isClickable = name === 'Brazil' || name === 'United States of America'
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onMouseEnter={() => setHovered(name)}
                          onMouseLeave={() => setHovered(null)}
                          onClick={() => handleCountryClick(name)}
                          style={{
                            default: {
                              fill: getCountryFill(name),
                              stroke: isClickable ? '#FFD700' : '#444',
                              strokeWidth: isClickable ? 1 : 0.5,
                              outline: 'none',
                              transition: 'all 0.3s ease',
                            },
                            hover: {
                              fill: isClickable ? '#FFA500' : '#2a2a2a',
                              stroke: isClickable ? '#FFA500' : '#555',
                              strokeWidth: isClickable ? 1.5 : 0.5,
                              outline: 'none',
                              cursor: isClickable ? 'pointer' : 'default',
                              filter: isClickable ? 'brightness(1.2)' : 'none',
                            },
                            pressed: { 
                              fill: isClickable ? '#FF8C00' : '#2a2a2a',
                              stroke: '#FFA500',
                              strokeWidth: 1.5,
                              outline: 'none' 
                            },
                          }}
                        />
                      )
                    })
                  }
                </Geographies>
              </ComposableMap>
            </motion.div>
          )}

          {slectedCountry === 'brazil' && (
            <motion.div
              key="brazil"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.43, 0.13, 0.23, 0.96]
              }}
              className="w-full flex justify-center"
            >
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{ scale: 650, center: [-52, -14] }}
                width={800}
                height={500}
              >
                <Geographies geography={BRAZIL_URL}>
                  {({ geographies }: any) =>
                    geographies.map((geo: any) => {
                      const name = geo.properties.name
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onMouseEnter={() => setHovered(name)}
                          onMouseLeave={() => setHovered(null)}
                          onClick={() => onStateSelected(name)}
                          style={{
                            default: { 
                              fill: slectedState === name ? '#FFD700' : '#1a1a1a', 
                              stroke: '#555',
                              strokeWidth: 0.8,
                              outline: 'none',
                              transition: 'all 0.3s ease',
                            },
                            hover: {
                              fill: '#FFD700',
                              stroke: '#FFA500',
                              strokeWidth: 1.2,
                              outline: 'none',
                              cursor: 'pointer',
                              filter: 'brightness(1.1)',
                            },
                            pressed: { 
                              fill: '#FFA500', 
                              stroke: '#FF8C00',
                              strokeWidth: 1.2,
                              outline: 'none' 
                            },
                          }}
                        />
                      )
                    })
                  }
                </Geographies>
              </ComposableMap>
            </motion.div>
          )}

          {slectedCountry === 'usa' && (
            <motion.div
              key="usa"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.43, 0.13, 0.23, 0.96]
              }}
              className="w-full flex justify-center"
            >
              <ComposableMap
                projection="geoAlbersUsa"
                projectionConfig={{ scale: 800 }}
                width={800}
                height={500}
              >
                <Geographies geography={USA_URL}>
                  {({ geographies }: any) =>
                    geographies.map((geo: any) => {
                      const name = geo.properties.name
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onMouseEnter={() => setHovered(name)}
                          onMouseLeave={() => setHovered(null)}
                          onClick={() => onStateSelected(name)}
                          style={{
                            default: { 
                              fill: slectedState === name ? '#FFD700' : '#1a1a1a', 
                              stroke: '#555',
                              strokeWidth: 0.8,
                              outline: 'none',
                              transition: 'all 0.3s ease',
                            },
                            hover: {
                              fill: '#FFD700',
                              stroke: '#FFA500',
                              strokeWidth: 1.2,
                              outline: 'none',
                              cursor: 'pointer',
                              filter: 'brightness(1.1)',
                            },
                            pressed: { 
                              fill: '#FFA500', 
                              stroke: '#FF8C00',
                              strokeWidth: 1.2,
                              outline: 'none' 
                            },
                          }}
                        />
                      )
                    })
                  }
                </Geographies>
              </ComposableMap>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Info Cards */}
      <div className="flex flex-col items-center justify-center gap-3 mt-5">
        {/* Instruction Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-md bg-black/60 backdrop-blur-lg border border-gold/30 rounded-xl px-5 py-3.5 relative overflow-hidden group"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <div className="relative flex items-start gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <svg className="w-5 h-5 text-gold mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>
            <p className="text-gold/90 text-sm leading-relaxed">
              {slectedCountry === 'world'
                ? 'Brazil and USA are highlighted in gold — click to zoom in and explore states'
                : 'Click on any state to select it as your jurisdiction'}
            </p>
          </div>
        </motion.div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-md bg-gradient-to-r from-gold/20 to-gold/10 backdrop-blur-lg border border-gold/40 rounded-xl px-5 py-3 relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <div className="relative">
            {slectedCountry === 'world' ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-gold/80 text-xs uppercase tracking-wider font-semibold">Hovering:</span>
                  <span className="text-white text-sm font-medium">{hovered || '—'}</span>
                </div>
                <motion.div
                  animate={{ opacity: hovered ? 1 : 0.3 }}
                  className="w-2 h-2 rounded-full bg-gold"
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-gold/80 text-xs uppercase tracking-wider font-semibold">Country:</span>
                  <span className="text-white text-sm font-medium capitalize">{slectedCountry}</span>
                </div>
                <div className="h-px bg-gold/20" />
                <div className="flex items-center justify-between">
                  <span className="text-gold/80 text-xs uppercase tracking-wider font-semibold">
                    {hovered ? 'Hovering:' : slectedState ? 'Selected:' : 'State:'}
                  </span>
                  <span className="text-white text-sm font-medium">{hovered || slectedState || '—'}</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}