'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ComposableMap,
  Geographies,
  Geography,
} from '@/app/component/SimpleMapClient'
import { setCountry as saveCountry, setState as saveState, getCountry, getState } from "@/app/lib/user"
import { supabase } from '../lib/supabaseClient'
import { u } from 'framer-motion/client'

const WORLD_URL = '/countries-110m.json'
const BRAZIL_URL = '/brazil-states.geojson'
const USA_URL = '/us-states.json'

type MapView = 'world' | 'Brazil' | 'United States of America'

interface WorldToCountryMapProps {
  setOpenMap: (open: boolean) => void
}

export default function WorldToCountryMap({ setOpenMap }: WorldToCountryMapProps) {
  const [currentView, setCurrentView] = useState<MapView>('world')
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  // Load saved country and state on mount
  useEffect(() => {
    const loadSavedSelection = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      if (!user) return;
      
      setUserId(user.id);
      const savedCountry = await getCountry(user.id)
      const savedState = await getState(user.id)
      
      if (savedCountry && savedCountry !== 'World') {
        setSelectedCountry(savedCountry)
        // Only set view to country if it's brazil or usa
        if (savedCountry === 'Brazil' || savedCountry === 'United States of America') {
          setCurrentView(savedCountry as MapView)
        }
      }
      
      if (savedState && savedState !== 'N/A') {
        setSelectedState(savedState)
      }
    }
    
    loadSavedSelection()
  }, [])



const handleCountryClick = async (countryName: string) => {
  if (isTransitioning) return;
  
  const normalizedCountry = countryName === 'Brazil' ? 'Brazil' : 
                            countryName === 'United States of America' ? 'United States of America' : null;

  if (!normalizedCountry) return;

  setIsTransitioning(true);
  setHoveredRegion(null);

  await saveCountry(userId??"", normalizedCountry);
  await saveState(userId??"", 'N/A'); // Reset state
  setSelectedCountry(normalizedCountry);
  setSelectedState(null);

  // 🪄 trigger sidebar update instantly
  window.dispatchEvent(new Event('locationUpdated'));

  setTimeout(() => {
    setCurrentView(normalizedCountry as MapView);
    setIsTransitioning(false);
  }, 400);
};


const handleStateClick = async (stateName: string) => {
  if (isTransitioning) return;
  
  await saveState(userId??"", stateName);
  setSelectedState(stateName);

  // 🪄 trigger sidebar update instantly
  window.dispatchEvent(new Event('locationUpdated'));

  setTimeout(() => {
    setOpenMap(false);
  }, 300);
};

const handleBackToWorld = async () => {
  if (isTransitioning) return;

  setIsTransitioning(true);
  setHoveredRegion(null);

  await saveCountry(userId??"", 'World');
  await saveState(userId??"", 'N/A');
  setSelectedCountry(null);
  setSelectedState(null);

  // 🪄 trigger sidebar update instantly
  window.dispatchEvent(new Event('locationUpdated'));

  setTimeout(() => {
    setCurrentView('world');
    setIsTransitioning(false);
  }, 400);
};

  const getCountryFillColor = (countryName: string) => {
    const isClickable = countryName === 'Brazil' || countryName === 'United States of America'
    return isClickable ? '#FFD700' : '#1a1a1a'
  }

  const getStateFillColor = (stateName: string) => {
    return selectedState === stateName ? '#FFD700' : '#1a1a1a'
  }

  // Helper to display country name properly
  const getDisplayCountryName = () => {
    if (selectedCountry === 'Brazil') return 'Brazil'
    if (selectedCountry === 'United States of America') return 'United States of America'
    return selectedCountry
  }

  return (
    <div className="relative">
      {/* Back Button - Only show when viewing a country */}
      {currentView !== 'world' && (
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          onClick={handleBackToWorld}
          disabled={isTransitioning}
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
              Back to World
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
          {/* World Map View */}
          {currentView === 'world' && (
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
                      const countryName = geo.properties.name
                      const isClickable = countryName === 'Brazil' || countryName === 'United States of America'
                      
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onMouseEnter={() => setHoveredRegion(countryName)}
                          onMouseLeave={() => setHoveredRegion(null)}
                          onClick={() => handleCountryClick(countryName)}
                          style={{
                            default: {
                              fill: getCountryFillColor(countryName),
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

          {/* Brazil Map View */}
          {currentView === 'Brazil' && (
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

          {/* USA Map View */}
          {currentView === 'United States of America' && (
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
              {currentView === 'world'
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
            {currentView === 'world' ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-gold/80 text-xs uppercase tracking-wider font-semibold">Hovering:</span>
                  <span className="text-white text-sm font-medium">{hoveredRegion || '—'}</span>
                </div>
                <motion.div
                  animate={{ opacity: hoveredRegion ? 1 : 0.3 }}
                  className="w-2 h-2 rounded-full bg-gold"
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-gold/80 text-xs uppercase tracking-wider font-semibold">Country:</span>
                  <span className="text-white text-sm font-medium">{getDisplayCountryName()}</span>
                </div>
                <div className="h-px bg-gold/20" />
                <div className="flex items-center justify-between">
                  <span className="text-gold/80 text-xs uppercase tracking-wider font-semibold">
                    {hoveredRegion ? 'Hovering:' : selectedState ? 'Selected:' : 'State:'}
                  </span>
                  <span className="text-white text-sm font-medium">{hoveredRegion || selectedState || '—'}</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}