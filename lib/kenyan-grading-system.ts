// Kenyan grading system with color coding
// Based on Competency-Based Curriculum (CBC)

export interface GradeLevel {
  minMarks: number
  maxMarks: number
  points: number
  gradeCode: string
  description: string
  color: string
  bgColor: string
  textColor: string
}

export const KENYAN_GRADE_SCALE: GradeLevel[] = [
  {
    minMarks: 68,
    maxMarks: 72,
    points: 8,
    gradeCode: "EE1",
    description: "Exceeding Expectation 1",
    color: "bg-orange-100",
    bgColor: "bg-orange-500",
    textColor: "text-orange-900",
  },
  {
    minMarks: 60,
    maxMarks: 67,
    points: 7,
    gradeCode: "EE2",
    description: "Exceeding Expectation 2",
    color: "bg-orange-50",
    bgColor: "bg-orange-400",
    textColor: "text-orange-800",
  },
  {
    minMarks: 52,
    maxMarks: 59,
    points: 6,
    gradeCode: "ME1",
    description: "Meeting Expectation 1",
    color: "bg-green-100",
    bgColor: "bg-green-500",
    textColor: "text-green-900",
  },
  {
    minMarks: 43,
    maxMarks: 51,
    points: 5,
    gradeCode: "ME2",
    description: "Meeting Expectation 2",
    color: "bg-green-50",
    bgColor: "bg-green-400",
    textColor: "text-green-800",
  },
  {
    minMarks: 34,
    maxMarks: 42,
    points: 4,
    gradeCode: "AE1",
    description: "Approaching Expectation 1",
    color: "bg-blue-100",
    bgColor: "bg-blue-500",
    textColor: "text-blue-900",
  },
  {
    minMarks: 25,
    maxMarks: 33,
    points: 3,
    gradeCode: "AE2",
    description: "Approaching Expectation 2",
    color: "bg-blue-50",
    bgColor: "bg-blue-400",
    textColor: "text-blue-800",
  },
  {
    minMarks: 16,
    maxMarks: 24,
    points: 2,
    gradeCode: "BE1",
    description: "Below Expectation 1",
    color: "bg-red-100",
    bgColor: "bg-red-500",
    textColor: "text-red-900",
  },
  {
    minMarks: 9,
    maxMarks: 15,
    points: 1,
    gradeCode: "BE2",
    description: "Below Expectation 2",
    color: "bg-red-50",
    bgColor: "bg-red-400",
    textColor: "text-red-800",
  },
]

// Get grade information from marks
export function getGradeFromMarks(marks: number): GradeLevel | null {
  return KENYAN_GRADE_SCALE.find((grade) => marks >= grade.minMarks && marks <= grade.maxMarks) || null
}

// Get points from marks
export function getPointsFromMarks(marks: number): number {
  const grade = getGradeFromMarks(marks)
  return grade ? grade.points : 0
}

// Get grade code from marks
export function getGradeCodeFromMarks(marks: number): string {
  const grade = getGradeFromMarks(marks)
  return grade ? grade.gradeCode : "N/A"
}

// Calculate mean score from multiple subjects
export function calculateMeanScore(grades: number[]): number {
  if (grades.length === 0) return 0
  const sum = grades.reduce((acc, grade) => acc + grade, 0)
  return Math.round((sum / grades.length) * 100) / 100
}

// Calculate mean grade from multiple subjects
export function calculateMeanGrade(marks: number[]): {
  meanScore: number
  meanPoints: number
  meanGrade: string
} {
  const meanScore = calculateMeanScore(marks)
  const meanPoints = getPointsFromMarks(meanScore)
  const meanGrade = getGradeCodeFromMarks(meanScore)

  return {
    meanScore,
    meanPoints,
    meanGrade,
  }
}

// Validate marks are within acceptable range
export function validateMarks(marks: number, maxMarks = 100): { valid: boolean; error?: string } {
  if (marks < 0) return { valid: false, error: "Marks cannot be negative" }
  if (marks > maxMarks) return { valid: false, error: `Marks cannot exceed ${maxMarks}` }
  return { valid: true }
}

// Format grade for display
export function formatGradeForDisplay(marks: number): {
  gradeCode: string
  points: number
  description: string
  color: string
  bgColor: string
  textColor: string
} {
  const grade = getGradeFromMarks(marks)
  if (!grade) {
    return {
      gradeCode: "N/A",
      points: 0,
      description: "No grade",
      color: "bg-gray-100",
      bgColor: "bg-gray-500",
      textColor: "text-gray-900",
    }
  }
  return grade
}
