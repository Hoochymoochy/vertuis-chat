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
import { getOnbaording, setOnbaording } from '@/app/lib/user'

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
  const [isOnboarding, setIsOnboarding] = useState(false)
  const [hasSelectedCountry, setHasSelectedCountry] = useState(false)

  // Add error boundary for map rendering
  const [mapError, setMapError] = useState<string | null>(null)
  const [componentMounted, setComponentMounted] = useState(false)

  // Track component mount
  useEffect(() => {
    console.log('🎯 [MOUNT] WorldToCountryMap component mounted')
    console.log('🎯 [MOUNT] Window dimensions:', window.innerWidth, 'x', window.innerHeight)
    console.log('🎯 [MOUNT] Device pixel ratio:', window.devicePixelRatio)
    setComponentMounted(true)
    return () => {
      console.log('🎯 [UNMOUNT] WorldToCountryMap component unmounted')
    }
  }, [])

  // Load saved country and state on mount
  useEffect(() => {
    console.log('🗺️ [MAP INIT] Component mounting...')
    console.log('🌐 [BROWSER] User agent:', navigator.userAgent)
    console.log('🌐 [BROWSER] Language:', navigator.language)
    console.log('🌐 [BROWSER] Online:', navigator.onLine)
    
    const loadSavedSelection = async () => {
      try {
        console.log('🔐 [AUTH] Fetching user from Supabase...')
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('❌ [AUTH ERROR]', error)
          throw error;
        }
        
        if (!user) {
          console.warn('⚠️ [AUTH] No user found')
          return;
        }
        
        console.log('✅ [AUTH] User authenticated:', user.id)
        setUserId(user.id);
        
        console.log('📋 [ONBOARDING] Checking onboarding status...')
        const onboarded = await getOnbaording(user.id)
        console.log('📋 [ONBOARDING] Status:', onboarded)
        
        // If not onboarded, this is their first time
        if (!onboarded) {
          console.log('🆕 [ONBOARDING] First time user - showing onboarding')
          setIsOnboarding(true)
          return
        }
        
        console.log('💾 [STORAGE] Loading saved country...')
        const savedCountry = await getCountry(user.id)
        console.log('💾 [STORAGE] Saved country:', savedCountry)
        
        console.log('💾 [STORAGE] Loading saved state...')
        const savedState = await getState(user.id)
        console.log('💾 [STORAGE] Saved state:', savedState)
        
        if (savedCountry && savedCountry !== 'World') {
          console.log('🌍 [MAP] Setting country to:', savedCountry)
          setSelectedCountry(savedCountry)
          if (savedCountry === 'Brazil' || savedCountry === 'United States of America') {
            console.log('🗺️ [MAP] Switching to country view:', savedCountry)
            setCurrentView(savedCountry as MapView)
          }
        }
        
        if (savedState && savedState !== 'N/A') {
          console.log('📍 [MAP] Setting state to:', savedState)
          setSelectedState(savedState)
        }
        
        console.log('✅ [INIT] Load complete')
      } catch (err) {
        console.error('❌ [INIT ERROR] Failed to load saved selection:', err)
      }
    }
    
    loadSavedSelection()
  }, [])

  // Log when view changes
  useEffect(() => {
    console.log('🔄 [VIEW CHANGE] Current view:', currentView)
    console.log('🔄 [VIEW CHANGE] Map URL:', 
      currentView === 'world' ? WORLD_URL :
      currentView === 'Brazil' ? BRAZIL_URL :
      currentView === 'United States of America' ? USA_URL : 'unknown'
    )
  }, [currentView])

  const handleCountryClick = async (countryName: string) => {
    console.log('🖱️ [CLICK] Country clicked:', countryName)
    
    if (isTransitioning) {
      console.log('⏳ [CLICK] Ignored - transition in progress')
      return;
    }
    
    const normalizedCountry = countryName === 'Brazil' ? 'Brazil' : 
                              countryName === 'United States of America' ? 'United States of America' : null;

    if (!normalizedCountry) {
      console.log('❌ [CLICK] Country not supported:', countryName)
      return;
    }

    console.log('✅ [CLICK] Valid country:', normalizedCountry)
    setIsTransitioning(true);
    setHoveredRegion(null);

    try {
      console.log('💾 [SAVE] Saving country:', normalizedCountry)
      await saveCountry(userId??"", normalizedCountry);
      
      console.log('💾 [SAVE] Resetting state to N/A')
      await saveState(userId??"", 'N/A');
      
      setSelectedCountry(normalizedCountry);
      setSelectedState(null);
      setHasSelectedCountry(true);

      // Complete onboarding if this is first time
      if (isOnboarding) {
        console.log('🎓 [ONBOARDING] Completing onboarding')
        await setOnbaording(userId??"", true);
        setIsOnboarding(false);
      }

      console.log('📢 [EVENT] Dispatching locationUpdated event')
      window.dispatchEvent(new Event('locationUpdated'));

      console.log('⏱️ [TRANSITION] Waiting 400ms before view change')
      setTimeout(() => {
        console.log('🔄 [TRANSITION] Changing view to:', normalizedCountry)
        setCurrentView(normalizedCountry as MapView);
        setIsTransitioning(false);
      }, 400);
    } catch (err) {
      console.error('❌ [SAVE ERROR] Failed to save country:', err)
      setIsTransitioning(false);
    }
  };

  const handleStateClick = async (stateName: string) => {
    console.log('🖱️ [CLICK] State clicked:', stateName)
    
    if (isTransitioning) {
      console.log('⏳ [CLICK] Ignored - transition in progress')
      return;
    }
    
    try {
      console.log('💾 [SAVE] Saving state:', stateName)
      await saveState(userId??"", stateName);
      setSelectedState(stateName);

      console.log('📢 [EVENT] Dispatching locationUpdated event')
      window.dispatchEvent(new Event('locationUpdated'));

      console.log('⏱️ [CLOSE] Closing map in 300ms')
      setTimeout(() => {
        console.log('🚪 [CLOSE] Closing map')
        setOpenMap(false);
      }, 300);
    } catch (err) {
      console.error('❌ [SAVE ERROR] Failed to save state:', err)
    }
  };

  const handleBackToWorld = async () => {
    console.log('🔙 [BACK] Back to world clicked')
    
    if (isTransitioning) {
      console.log('⏳ [BACK] Ignored - transition in progress')
      return;
    }

    setIsTransitioning(true);
    setHoveredRegion(null);

    setSelectedCountry(null);
    setSelectedState(null);
    setHasSelectedCountry(false);

    console.log('📢 [EVENT] Dispatching locationUpdated event')
    window.dispatchEvent(new Event('locationUpdated'));

    console.log('⏱️ [TRANSITION] Waiting 400ms before view change')
    setTimeout(() => {
      console.log('🔄 [TRANSITION] Changing view to: world')
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

  const getDisplayCountryName = () => {
    if (selectedCountry === 'Brazil') return 'Brazil'
    if (selectedCountry === 'United States of America') return 'United States of America'
    return selectedCountry
  }

  const canCloseMap = !isOnboarding || hasSelectedCountry;

  return (
    <div className="relative">
      {/* Debug Info - visible on screen */}
      {!componentMounted && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-yellow-500/80 text-black px-4 py-2 z-50 text-sm font-bold">
          Component not fully mounted yet...
        </div>
      )}
      
      {componentMounted && currentView === 'world' && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-green-500/80 text-white px-4 py-2 z-50 text-xs">
          ✓ Mounted | View: {currentView} | Online: {navigator.onLine ? 'Yes' : 'No'}
        </div>
      )}
      
      {/* Back Button */}
      {currentView !== 'world' && (
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          onClick={handleBackToWorld}
          disabled={isTransitioning}
          className="absolute top-1 left-1 z-10 bg-black/60 backdrop-blur-sm border border-gold/30 px-4 py-2 hover:bg-black/70 hover:border-gold/50 transition-all disabled:opacity-50 group"
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

      {/* Close Button - Only enabled after onboarding */}
      <motion.button
        onClick={() => canCloseMap && setOpenMap(false)}
        disabled={!canCloseMap}
        className={`absolute top-1 right-1 z-10 bg-black/60 backdrop-blur-sm border border-gold/30 px-3 py-2 transition-all group ${
          canCloseMap 
            ? 'hover:bg-black/70 hover:border-red-500/50 cursor-pointer' 
            : 'opacity-30 cursor-not-allowed'
        }`}
        whileHover={canCloseMap ? { scale: 1.05, rotate: 90 } : {}}
        whileTap={canCloseMap ? { scale: 0.95 } : {}}
      >
        <span className={`text-xl transition-colors ${
          canCloseMap ? 'text-gold group-hover:text-red-400' : 'text-gray-500'
        }`}>
          ✕
        </span>
      </motion.button>

      {/* Map Container */}
      <div className="">
        {/* Error display */}
        {mapError && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 mb-4">
            <strong>Map Error:</strong> {mapError}
          </div>
        )}
        
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
              onAnimationStart={() => console.log('🎬 [ANIMATION] World map animation started')}
              onAnimationComplete={() => console.log('✅ [ANIMATION] World map animation complete')}
            >
              <ComposableMap 
                projection="geoMercator"
                projectionConfig={{ scale: 120, center: [0, 20] }}
                width={800}
                height={400}
              >
                <Geographies geography={WORLD_URL}>
                  {({ geographies }: any) => {
                    console.log('🗺️ [GEOGRAPHIES] World map loaded:', geographies?.length, 'countries')
                    console.log('🗺️ [GEOGRAPHIES] Geographies is array?', Array.isArray(geographies))
                    console.log('🗺️ [GEOGRAPHIES] Type:', typeof geographies)
                    
                    if (!geographies || geographies.length === 0) {
                      console.error('❌ [GEOGRAPHIES] No countries found in world map!')
                      setMapError('World map data is empty')
                      return null
                    }
                    
                    return geographies.map((geo: any, index: number) => {
                      if (index === 0) {
                        console.log('🗺️ [SAMPLE] First country:', geo.properties)
                      }
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
                  }}
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
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="w-full flex justify-center"
            onAnimationStart={() => console.log('🎬 [ANIMATION] Brazil map animation started')}
            onAnimationComplete={() => console.log('✅ [ANIMATION] Brazil map animation complete')}
          >
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 650, center: [-52, -14] }}
              width={800}
              height={500}
            >
          <Geographies geography={BRAZIL_URL}>
            {({ geographies }: any) => {
              console.log('🗺️ [GEOGRAPHIES] Brazil map loaded:', geographies?.length, 'states')
              console.log('🗺️ [GEOGRAPHIES] Brazil - is array?', Array.isArray(geographies))
              
              if (!geographies || geographies.length === 0) {
                console.error('❌ [GEOGRAPHIES] No states found in Brazil map!')
                setMapError('Brazil map data is empty')
                return null
              }
              if (geographies && geographies.length > 0) {
                console.log('🗺️ [SAMPLE] First Brazil state:', geographies[0].properties)
              }
              return geographies.map((geo: any) => {
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
            }}
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
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="w-full flex justify-center"
            onAnimationStart={() => console.log('🎬 [ANIMATION] USA map animation started')}
            onAnimationComplete={() => console.log('✅ [ANIMATION] USA map animation complete')}
          >
            <ComposableMap
              projection="geoAlbersUsa"
              projectionConfig={{ scale: 800 }}
              width={800}
              height={500}
            >
              <Geographies geography={USA_URL}>
                {({ geographies }: any) => {
                  console.log('🗺️ [GEOGRAPHIES] USA map loaded:', geographies?.length, 'states')
                  console.log('🗺️ [GEOGRAPHIES] USA - is array?', Array.isArray(geographies))
                  
                  if (!geographies || geographies.length === 0) {
                    console.error('❌ [GEOGRAPHIES] No states found in USA map!')
                    setMapError('USA map data is empty')
                    return null
                  }
                  if (geographies && geographies.length > 0) {
                    console.log('🗺️ [SAMPLE] First USA state:', geographies[0].properties)
                  }
                  return geographies.map((geo: any) => {
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
                }}
              </Geographies>
            </ComposableMap>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
      
      {/* Info Cards */}
      <div className="flex flex-col items-center justify-center gap-3 mt-5">
        {/* Onboarding Instruction */}
        {isOnboarding && !hasSelectedCountry && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-gradient-to-r from-gold/30 to-gold/20 backdrop-blur-lg border-2 border-gold/50 px-5 py-4 relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <div className="relative flex items-center justify-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </motion.div>
              <p className="text-white text-base font-semibold">
                Please select a country to get started
              </p>
            </div>
          </motion.div>
        )}

        {/* Instruction Card */}
        {!isOnboarding && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-md bg-black/60 backdrop-blur-lg border border-gold/30 px-5 py-3.5 relative overflow-hidden group"
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
                  ? 'Choose a country to get started'
                  : 'Federal data is active. Select a state to help us prioritize which regions to expand first'}
              </p>
            </div>
          </motion.div>
        )}

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-md bg-gradient-to-r from-gold/20 to-gold/10 backdrop-blur-lg border border-gold/40 px-5 py-3 relative overflow-hidden"
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