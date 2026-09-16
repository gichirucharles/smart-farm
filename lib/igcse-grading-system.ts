// IGCSE Grading System
// Cambridge International IGCSE grading scale A* to G/U

export interface IGCSEGrade {
  minMarks: number
  maxMarks: number
  grade: string
  description: string
  color: string
  bgColor: string
  textColor: string
  ucas_points?: number // For university application
}

export const IGCSE_GRADE_SCALE: IGCSEGrade[] = [
  {
    minMarks: 90,
    maxMarks: 100,
    grade: "A*",
    description: "Outstanding",
    color: "bg-purple-100",
    bgColor: "bg-purple-600",
    textColor: "text-purple-900",
    ucas_points: 8,
  },
  {
    minMarks: 80,
    maxMarks: 89,
    grade: "A",
    description: "Excellent",
    color: "bg-purple-50",
    bgColor: "bg-purple-500",
    textColor: "text-purple-800",
    ucas_points: 7,
  },
  {
    minMarks: 70,
    maxMarks: 79,
    grade: "B",
    description: "Good",
    color: "bg-blue-100",
    bgColor: "bg-blue-600",
    textColor: "text-blue-900",
    ucas_points: 6,
  },
  {
    minMarks: 60,
    maxMarks: 69,
    grade: "C",
    description: "Satisfactory",
    color: "bg-blue-50",
    bgColor: "bg-blue-500",
    textColor: "text-blue-800",
    ucas_points: 5,
  },
  {
    minMarks: 50,
    maxMarks: 59,
    grade: "D",
    description: "Acceptable",
    color: "bg-green-100",
    bgColor: "bg-green-600",
    textColor: "text-green-900",
    ucas_points: 4,
  },
  {
    minMarks: 40,
    maxMarks: 49,
    grade: "E",
    description: "Minimal (Pass)",
    color: "bg-green-50",
    bgColor: "bg-green-500",
    textColor: "text-green-800",
    ucas_points: 3,
  },
  {
    minMarks: 30,
    maxMarks: 39,
    grade: "F",
    description: "Poor",
    color: "bg-orange-100",
    bgColor: "bg-orange-600",
    textColor: "text-orange-900",
    ucas_points: 2,
  },
  {
    minMarks: 0,
    maxMarks: 29,
    grade: "G",
    description: "Very Poor",
    color: "bg-red-100",
    bgColor: "bg-red-600",
    textColor: "text-red-900",
    ucas_points: 1,
  },
  {
    minMarks: -1,
    maxMarks: -1,
    grade: "U",
    description: "Ungraded",
    color: "bg-gray-100",
    bgColor: "bg-gray-600",
    textColor: "text-gray-900",
    ucas_points: 0,
  },
]

export interface IGCSESubject {
  code: string
  name: string
  componentWeighting: {
    name: string
    percentage: number
  }[]
  totalComponents: number
  hasPractical: boolean
  practicalPercentage?: number
}

export const IGCSE_SUBJECTS: IGCSESubject[] = [
  {
    code: "0511",
    name: "English Language",
    componentWeighting: [
      { name: "Reading & Writing", percentage: 50 },
      { name: "Listening & Speaking", percentage: 50 },
    ],
    totalComponents: 2,
    hasPractical: false,
  },
  {
    code: "0580",
    name: "Mathematics",
    componentWeighting: [
      { name: "Paper 1 (Non-Calculator)", percentage: 50 },
      { name: "Paper 2 (Calculator)", percentage: 50 },
    ],
    totalComponents: 2,
    hasPractical: false,
  },
  {
    code: "0610",
    name: "Biology",
    componentWeighting: [
      { name: "Paper 1", percentage: 36.25 },
      { name: "Paper 2", percentage: 36.25 },
      { name: "Practical Assessment", percentage: 27.5 },
    ],
    totalComponents: 3,
    hasPractical: true,
    practicalPercentage: 27.5,
  },
  {
    code: "0620",
    name: "Chemistry",
    componentWeighting: [
      { name: "Paper 1", percentage: 36.25 },
      { name: "Paper 2", percentage: 36.25 },
      { name: "Practical Assessment", percentage: 27.5 },
    ],
    totalComponents: 3,
    hasPractical: true,
    practicalPercentage: 27.5,
  },
  {
    code: "0625",
    name: "Physics",
    componentWeighting: [
      { name: "Paper 1", percentage: 36.25 },
      { name: "Paper 2", percentage: 36.25 },
      { name: "Practical Assessment", percentage: 27.5 },
    ],
    totalComponents: 3,
    hasPractical: true,
    practicalPercentage: 27.5,
  },
  {
    code: "0653",
    name: "Combined Science (Double Award)",
    componentWeighting: [
      { name: "Biology Papers", percentage: 24.17 },
      { name: "Chemistry Papers", percentage: 24.17 },
      { name: "Physics Papers", percentage: 24.17 },
      { name: "Practical Assessment", percentage: 27.5 },
    ],
    totalComponents: 4,
    hasPractical: true,
    practicalPercentage: 27.5,
  },
  {
    code: "0680",
    name: "History",
    componentWeighting: [
      { name: "Paper 1 (Core Content)", percentage: 50 },
      { name: "Paper 2 (Depth Study)", percentage: 50 },
    ],
    totalComponents: 2,
    hasPractical: false,
  },
  {
    code: "0686",
    name: "Geography",
    componentWeighting: [
      { name: "Paper 1", percentage: 35 },
      { name: "Paper 2", percentage: 35 },
      { name: "Fieldwork Assessment", percentage: 30 },
    ],
    totalComponents: 3,
    hasPractical: true,
    practicalPercentage: 30,
  },
  {
    code: "0984",
    name: "Computer Science",
    componentWeighting: [
      { name: "Paper 1 (Theory)", percentage: 50 },
      { name: "Paper 2 (Problem Solving)", percentage: 50 },
    ],
    totalComponents: 2,
    hasPractical: false,
  },
  {
    code: "0500",
    name: "First Language English",
    componentWeighting: [
      { name: "Reading", percentage: 50 },
      { name: "Writing", percentage: 50 },
    ],
    totalComponents: 2,
    hasPractical: false,
  },
]

export function getIGCSEGrade(marks: number): IGCSEGrade {
  return (
    IGCSE_GRADE_SCALE.find(
      (grade) => marks >= grade.minMarks && marks <= grade.maxMarks
    ) || IGCSE_GRADE_SCALE[IGCSE_GRADE_SCALE.length - 1]
  )
}

export function calculateSubjectMarks(
  subjectCode: string,
  componentMarks: { [key: string]: number }
): number {
  const subject = IGCSE_SUBJECTS.find((s) => s.code === subjectCode)
  if (!subject) return 0

  let totalMarks = 0
  let totalPercentage = 0

  subject.componentWeighting.forEach((component) => {
    const marks = componentMarks[component.name] || 0
    totalMarks += marks * (component.percentage / 100)
    totalPercentage += component.percentage
  })

  return totalPercentage > 0 ? Math.round(totalMarks) : 0
}

export function calculatePointsFromMarks(marks: number): number {
  const grade = getIGCSEGrade(marks)
  return grade.ucas_points || 0
}
