'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { CurriculumType, getCurriculumFeatures, isCurriculumOffered } from '@/lib/curriculum-system'

interface CurriculumContextType {
  schoolId: string | null
  curriculaOffered: CurriculumType[]
  primaryCurriculum: CurriculumType | null
  isLoading: boolean
  error: string | null
  
  // Methods
  isCurriculumActive: (curriculum: CurriculumType) => boolean
  isFeatureEnabled: (featureName: string) => boolean
  getCurriculumGrades: (curriculum: CurriculumType) => string[]
  setCurrentCurriculum: (curriculum: CurriculumType) => void
  getCurrentCurriculum: () => CurriculumType | null
  getAvailableFeatures: () => Record<string, boolean>
}

const CurriculumContext = createContext<CurriculumContextType | undefined>(undefined)

interface CurriculumProviderProps {
  children: React.ReactNode
  schoolId?: string
}

export function CurriculumProvider({ children, schoolId }: CurriculumProviderProps) {
  const [curriculaOffered, setCurriculaOffered] = useState<CurriculumType[]>([])
  const [primaryCurriculum, setPrimaryCurriculum] = useState<CurriculumType | null>(null)
  const [currentCurriculum, setCurrentCurriculum] = useState<CurriculumType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load curriculum data from localStorage or props
  useEffect(() => {
    const loadCurriculumData = async () => {
      try {
        setIsLoading(true)
        
        // Try to get from localStorage first (for testing)
        const storedData = localStorage.getItem('curriculumSettings')
        if (storedData) {
          const data = JSON.parse(storedData)
          setCurriculaOffered(data.curriculaOffered || ['cbc'])
          setPrimaryCurriculum(data.primaryCurriculum || 'cbc')
          setCurrentCurriculum(data.primaryCurriculum || 'cbc')
        } else if (schoolId) {
          // In production, fetch from API
          const response = await fetch(`/api/schools/${schoolId}/curriculum`)
          if (response.ok) {
            const data = await response.json()
            setCurriculaOffered(data.curriculaOffered || ['cbc'])
            setPrimaryCurriculum(data.primaryCurriculum || 'cbc')
            setCurrentCurriculum(data.primaryCurriculum || 'cbc')
          }
        } else {
          // Default to CBC for testing
          setCurriculaOffered(['cbc'])
          setPrimaryCurriculum('cbc')
          setCurrentCurriculum('cbc')
        }

        setError(null)
      } catch (err) {
        console.error('Error loading curriculum data:', err)
        setError('Failed to load curriculum configuration')
        // Fallback to CBC
        setCurriculaOffered(['cbc'])
        setPrimaryCurriculum('cbc')
        setCurrentCurriculum('cbc')
      } finally {
        setIsLoading(false)
      }
    }

    loadCurriculumData()
  }, [schoolId])

  const value: CurriculumContextType = {
    schoolId: schoolId || null,
    curriculaOffered,
    primaryCurriculum,
    isLoading,
    error,

    isCurriculumActive: (curriculum: CurriculumType) => isCurriculumOffered(curriculaOffered, curriculum),

    isFeatureEnabled: (featureName: string) => {
      if (!currentCurriculum) return false
      const features = getCurriculumFeatures(currentCurriculum)
      return features[featureName as keyof typeof features] ?? false
    },

    getCurriculumGrades: (curriculum: CurriculumType) => {
      const gradeMap: Record<CurriculumType, string[]> = {
        cbc: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'],
        kcse: ['Form 1', 'Form 2', 'Form 3', 'Form 4'],
        igcse: ['Year 10', 'Year 11'],
        ib: ['Grade 11', 'Grade 12'],
      }
      return gradeMap[curriculum] || []
    },

    setCurrentCurriculum: (curriculum: CurriculumType) => {
      if (isCurriculumOffered(curriculaOffered, curriculum)) {
        setCurrentCurriculum(curriculum)
      }
    },

    getCurrentCurriculum: () => currentCurriculum,

    getAvailableFeatures: () => {
      if (!currentCurriculum) return {}
      const features = getCurriculumFeatures(currentCurriculum)
      return Object.fromEntries(Object.entries(features).filter(([, value]) => value))
    },
  }

  return <CurriculumContext.Provider value={value}>{children}</CurriculumContext.Provider>
}

export function useCurriculum(): CurriculumContextType {
  const context = useContext(CurriculumContext)
  if (!context) {
    throw new Error('useCurriculum must be used within a CurriculumProvider')
  }
  return context
}

// Hook for checking if a specific feature is enabled
export function useFeature(featureName: string): boolean {
  const { isFeatureEnabled } = useCurriculum()
  return isFeatureEnabled(featureName)
}

// Hook for checking if a curriculum is active
export function useCurriculumActive(curriculum: CurriculumType): boolean {
  const { isCurriculumActive } = useCurriculum()
  return isCurriculumActive(curriculum)
}

// Wrapper component to conditionally render based on feature
export interface FeatureGateProps {
  feature: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function FeatureGate({ feature, children, fallback = null }: FeatureGateProps) {
  const isEnabled = useFeature(feature)
  return isEnabled ? children : fallback
}

// Wrapper component to conditionally render based on curriculum
export interface CurriculumGateProps {
  curriculum: CurriculumType
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function CurriculumGate({ curriculum, children, fallback = null }: CurriculumGateProps) {
  const isActive = useCurriculumActive(curriculum)
  return isActive ? children : fallback
}
