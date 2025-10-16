'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ComposableMap,
  Geographies,
  Geography,
} from '@/app/component/SimpleMapClient'
import { on } from 'events'
import { s, select } from 'framer-motion/client'
import { count } from 'console'

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
    <div className="position-absolute">

    {/* Back Button */}
    {slectedCountry !== 'world' && (
      <motion.button
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        onClick={handleBack}
        disabled={isZooming}
        className="absolute top-4 left-10 text-gold hover:text-white transition disabled:opacity-50 text-3xl"
      >
        ←
      </motion.button>
    )}

    {/* Close Button */}
    <button
      onClick={() => setOpenMap(false)}
      className="absolute top-4 right-10 text-gold hover:text-white transition text-3xl"
    >
      ✕
    </button>



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
                ease: [0.43, 0.13, 0.23, 0.96] // Custom easing for smooth zoom
              }}
              className="w-full flex justify-center"
            >
              <ComposableMap projection="geoMercator">
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
                projectionConfig={{ scale: 700, center: [-52, -15] }}
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
                              stroke: '#FFD700',
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
                projection="geoMercator"
                projectionConfig={{ scale: 600, center: [-98, 38] }}
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
                              fill: '#1a1a1a', 
                              stroke: '#FFD700',
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
      
      {/* Instruction Box */}
      <div className="flex flex-col items-center justify-center gap-3 mt-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-md bg-black/60 backdrop-blur-sm border border-gold/30 rounded-xl px-4 py-3"
        >
          <p className="text-gold text-sm text-center">
            {slectedCountry === 'world'
              ? 'Brazil and USA are highlighted in gold — click to zoom in'
              : 'Click on a region to select it'}
          </p>
        </motion.div>

        {/* Status Box */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-md bg-gold/20 backdrop-blur-sm border border-gold/30 rounded-xl px-4 py-2 text-center"
        >
          {slectedCountry === 'world' ? (
            <p className="text-white text-sm font-medium">
              Country Hover: {hovered || '—'}
            </p>
          ) : slectedState ? (
            <p className="text-white text-sm font-medium">
              Country: {slectedCountry} — State: {hovered || slectedState}
            </p>
          ) : (
            <p className="text-white text-sm font-medium">
              Country: {slectedCountry} — State: {hovered || '—'}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  )
}