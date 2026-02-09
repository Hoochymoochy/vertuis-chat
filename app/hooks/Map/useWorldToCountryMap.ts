'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import {
  setState as saveState,
  getState,
} from '@/app/lib/user'


export function useWorldToCountryMap(setOpenMap: (open: boolean) => void) {
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)


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


        // Load saved country and state
        const state = await getState(user.id)

        if (state) {
          setSelectedState(state)
        }
      } catch (err) {
        console.error('Failed to load map state:', err)
      }
    }

    loadUserState()
  }, [])

  // Handle state/province selection
  const handleStateClick = async (stateName: string) => {
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

  // Get fill color for states
  const getStateFillColor = (name: string): string => {
    return selectedState === name ? '#FFD700' : '#1a1a1a'
  }

  return {
    selectedState,
    hoveredRegion,
    setHoveredRegion,
    handleStateClick,
    getStateFillColor,
  }
}