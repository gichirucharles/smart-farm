/**
 * Curriculum Management System for ShuleVerse
 * Manages different curriculum offerings: CBC, KCSE, IGCSE, IB
 */

export type CurriculumType = 'cbc' | 'kcse' | 'igcse' | 'ib'

export interface CurriculumConfig {
  type: CurriculumType
  name: string
  description: string
  grades: string[]
  gradeScale: 'numeric' | 'letter' | 'points'
  minGrade: number | string
  maxGrade: number | string
  isActive: boolean
}

export interface SchoolCurriculumSettings {
  schoolId: string
  curriculaOffered: CurriculumType[]
  primaryCurriculum: CurriculumType
  gradeMapping: Record<string, CurriculumType> // Maps grades to curricula
  assessmentConfig: Record<CurriculumType, any>
  updatedAt: string
}

// Curriculum Definitions
export const CURRICULUM_DEFINITIONS: Record<CurriculumType, CurriculumConfig> = {
  cbc: {
    type: 'cbc',
    name: 'Competency-Based Curriculum (CBC)',
    description: 'Kenyan CBC for Grades 1-9',
    grades: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'],
    gradeScale: 'numeric',
    minGrade: 1,
    maxGrade: 7,
    isActive: true,
  },
  kcse: {
    type: 'kcse',
    name: 'Kenya Certificate of Secondary Education (KCSE)',
    description: 'Kenyan KCSE for Grades 10-12',
    grades: ['Form 1', 'Form 2', 'Form 3', 'Form 4'],
    gradeScale: 'points',
    minGrade: 1,
    maxGrade: 12,
    isActive: true,
  },
  igcse: {
    type: 'igcse',
    name: 'International General Certificate of Secondary Education (IGCSE)',
    description: 'Cambridge IGCSE',
    grades: ['Year 10', 'Year 11'],
    gradeScale: 'letter',
    minGrade: 'U',
    maxGrade: 'A*',
    isActive: true,
  },
  ib: {
    type: 'ib',
    name: 'International Baccalaureate (IB)',
    description: 'IB Diploma Programme',
    grades: ['Grade 11', 'Grade 12'],
    gradeScale: 'points',
    minGrade: 0,
    maxGrade: 45,
    isActive: true,
  },
}

// Features that are curriculum-specific
export interface CurriculumFeatures {
  assessments: boolean
  gradebook: boolean
  reportCards: boolean
  competencies: boolean
  cbcLevels: boolean
  igcseComponents: boolean
  ibCoreActivities: boolean
}

// Get features available for specific curriculum
export function getCurriculumFeatures(curriculum: CurriculumType): CurriculumFeatures {
  switch (curriculum) {
    case 'cbc':
      return {
        assessments: true,
        gradebook: false,
        reportCards: true,
        competencies: true,
        cbcLevels: true,
        igcseComponents: false,
        ibCoreActivities: false,
      }
    case 'kcse':
      return {
        assessments: true,
        gradebook: true,
        reportCards: true,
        competencies: false,
        cbcLevels: false,
        igcseComponents: false,
        ibCoreActivities: false,
      }
    case 'igcse':
      return {
        assessments: true,
        gradebook: true,
        reportCards: true,
        competencies: false,
        cbcLevels: false,
        igcseComponents: true,
        ibCoreActivities: false,
      }
    case 'ib':
      return {
        assessments: true,
        gradebook: true,
        reportCards: true,
        competencies: false,
        cbcLevels: false,
        igcseComponents: false,
        ibCoreActivities: true,
      }
    default:
      return {
        assessments: false,
        gradebook: false,
        reportCards: false,
        competencies: false,
        cbcLevels: false,
        igcseComponents: false,
        ibCoreActivities: false,
      }
  }
}

// Check if feature is available for school's curricula
export function isFeatureAvailable(
  curriculaOffered: CurriculumType[],
  featureName: keyof CurriculumFeatures,
): boolean {
  return curriculaOffered.some((curriculum) => {
    const features = getCurriculumFeatures(curriculum)
    return features[featureName]
  })
}

// Check if a curriculum is being offered
export function isCurriculumOffered(curriculaOffered: CurriculumType[], curriculum: CurriculumType): boolean {
  return curriculaOffered.includes(curriculum)
}

// Get grades for a specific curriculum
export function getGradesForCurriculum(curriculum: CurriculumType): string[] {
  return CURRICULUM_DEFINITIONS[curriculum]?.grades || []
}

// Get all available grades across all offered curricula
export function getAllGrades(curriculaOffered: CurriculumType[]): string[] {
  const grades: string[] = []
  curriculaOffered.forEach((curriculum) => {
    grades.push(...getGradesForCurriculum(curriculum))
  })
  return [...new Set(grades)] // Remove duplicates
}

// Validate curriculum offering
export function validateCurriculumOffering(curricula: CurriculumType[]): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!curricula || curricula.length === 0) {
    errors.push('At least one curriculum must be offered')
  }

  // Check for invalid curriculum types
  curricula.forEach((curriculum) => {
    if (!Object.keys(CURRICULUM_DEFINITIONS).includes(curriculum)) {
      errors.push(`Invalid curriculum type: ${curriculum}`)
    }
  })

  return {
    valid: errors.length === 0,
    errors,
  }
}

// Map student to curriculum based on grade
export function mapStudentToCurriculum(
  grade: string,
  gradeMapping: Record<string, CurriculumType>,
): CurriculumType | null {
  return gradeMapping[grade] || null
}
