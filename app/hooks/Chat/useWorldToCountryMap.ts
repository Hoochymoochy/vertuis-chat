'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import {
  setCountry as saveCountry,
  setState as saveState,
  getCountry,
  getState,
  getOnbaording,
  setOnbaording,
} from '@/app/lib/user'

export type MapView = 'world' | 'Brazil' | 'United States of America'

export function useWorldToCountryMap(setOpenMap: (open: boolean) => void) {
  const [currentView, setCurrentView] = useState<MapView>('world')
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [isOnboarding, setIsOnboarding] = useState(false)
  const [hasSelectedCountry, setHasSelectedCountry] = useState(false)

  // Load saved state on mount
  useEffect(() => {
    const loadUserState = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error || !user) {
          console.error('Failed to get user:', error)
          return
        }

        setUserId(user.id)

        // Check if user has completed onboarding
        const onboarded = await getOnbaording(user.id)
        if (!onboarded) {
          setIsOnboarding(true)
          return
        }

        // Load saved country and state
        const [country, state] = await Promise.all([
          getCountry(user.id),
          getState(user.id)
        ])

        if (country && country !== 'World') {
          setSelectedCountry(country)
          if (country === 'Brazil' || country === 'United States of America') {
            setCurrentView(country as MapView)
          }
        }

        if (state && state !== 'N/A') {
          setSelectedState(state)
        }
      } catch (err) {
        console.error('Failed to load map state:', err)
      }
    }

    loadUserState()
  }, [])

  // Handle country selection
  const handleCountryClick = async (countryName: string) => {
    if (isTransitioning) return

    // Only Brazil and USA are clickable
    if (countryName !== 'Brazil' && countryName !== 'United States of America') {
      return
    }

    setIsTransitioning(true)
    setHoveredRegion(null)

    try {
      if (!userId) {
        throw new Error('User ID not available')
      }

      // Save country selection and reset state
      await Promise.all([
        saveCountry(userId, countryName),
        saveState(userId, 'N/A')
      ])

      setSelectedCountry(countryName)
      setSelectedState(null)
      setHasSelectedCountry(true)

      // Complete onboarding if this is first selection
      if (isOnboarding) {
        await setOnbaording(userId, true)
        setIsOnboarding(false)
      }

      // Dispatch event for other components
      window.dispatchEvent(new Event('locationUpdated'))

      // Transition to country view
      setTimeout(() => {
        setCurrentView(countryName as MapView)
        setIsTransitioning(false)
      }, 400)
    } catch (err) {
      console.error('Failed to save country:', err)
      setIsTransitioning(false)
    }
  }

  // Handle state/province selection
  const handleStateClick = async (stateName: string) => {
    if (isTransitioning) return

    try {
      if (!userId) {
        throw new Error('User ID not available')
      }

      await saveState(userId, stateName)
      setSelectedState(stateName)

      // Dispatch event for other components
      window.dispatchEvent(new Event('locationUpdated'))

      // Close map after brief delay
      setTimeout(() => {
        setOpenMap(false)
      }, 300)
    } catch (err) {
      console.error('Failed to save state:', err)
    }
  }

  // Return to world view
  const handleBackToWorld = async () => {
    if (isTransitioning) return

    setIsTransitioning(true)
    setHoveredRegion(null)
    setSelectedCountry(null)
    setSelectedState(null)
    setHasSelectedCountry(false)

    try {
      if (userId) {
        await Promise.all([
          saveCountry(userId, 'World'),
          saveState(userId, 'N/A')
        ])
      }

      // Dispatch event for other components
      window.dispatchEvent(new Event('locationUpdated'))

      setTimeout(() => {
        setCurrentView('world')
        setIsTransitioning(false)
      }, 400)
    } catch (err) {
      console.error('Failed to reset location:', err)
      setIsTransitioning(false)
    }
  }

  // Get fill color for countries on world map
  const getCountryFillColor = (name: string): string => {
    const isClickable = name === 'Brazil' || name === 'United States of America'
    return isClickable ? '#FFD700' : '#1a1a1a'
  }

  // Get fill color for states
  const getStateFillColor = (name: string): string => {
    return selectedState === name ? '#FFD700' : '#1a1a1a'
  }

  // User can close map only after selecting a country (or if not in onboarding)
  const canCloseMap = !isOnboarding || hasSelectedCountry

  return {
    // State
    currentView,
    selectedCountry,
    selectedState,
    hoveredRegion,
    isOnboarding,
    canCloseMap,

    // Setters
    setHoveredRegion,

    // Handlers
    handleCountryClick,
    handleStateClick,
    handleBackToWorld,

    // Utilities
    getCountryFillColor,
    getStateFillColor,
  }
}