"use client"

import { formatGradeForDisplay, KENYAN_GRADE_SCALE } from "@/lib/kenyan-grading-system"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface GradeDisplayProps {
  marks: number
  maxMarks?: number
  showDescription?: boolean
  size?: "sm" | "md" | "lg"
}

export function GradeDisplay({ marks, maxMarks = 100, showDescription = true, size = "md" }: GradeDisplayProps) {
  const grade = formatGradeForDisplay(marks)

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div
          className={`${grade.bgColor} text-white rounded-lg px-3 py-2 ${sizeClasses[size]} font-bold text-center min-w-16`}
        >
          {grade.gradeCode}
        </div>
        <div className={sizeClasses[size]}>
          <div className="font-semibold text-gray-900">
            {marks}/{maxMarks} marks
          </div>
          <div className="text-sm text-gray-600">{grade.points} points</div>
        </div>
      </div>

      {showDescription && (
        <div className="bg-gray-50 rounded px-3 py-2 border border-gray-200">
          <p className="text-xs font-medium text-gray-700">{grade.description}</p>
        </div>
      )}
    </div>
  )
}

export function GradeScale() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Kenyan Grade Scale</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {KENYAN_GRADE_SCALE.map((grade) => (
            <div key={grade.gradeCode} className="flex items-center justify-between p-2 rounded border border-gray-200">
              <div className="flex items-center gap-3 flex-1">
                <div className={`${grade.bgColor} text-white rounded px-2 py-1 font-bold min-w-12 text-center text-xs`}>
                  {grade.gradeCode}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {grade.minMarks}-{grade.maxMarks} marks
                  </div>
                  <div className="text-xs text-gray-600">{grade.description}</div>
                </div>
              </div>
              <Badge variant="outline" className="ml-2">
                {grade.points} pts
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
