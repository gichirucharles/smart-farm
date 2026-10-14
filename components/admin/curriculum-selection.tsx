'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Globe, Zap, Award } from 'lucide-react'

interface CurriculumSelectionProps {
  selectedCurricula: string[]
  onCurriculaChange: (curricula: string[]) => void
}

const CURRICULA = [
  {
    id: 'CBC',
    name: 'CBC (Competency-Based)',
    description: 'Grades 1-9: Focus on competencies and continuous assessment',
    grades: 'Grades 1-9',
    icon: Zap,
  },
  {
    id: 'KCSE',
    name: 'KCSE (National Certificate)',
    description: 'Forms 1-4: Kenya National Examination Council certification',
    grades: 'Forms 1-4',
    icon: Award,
  },
  {
    id: 'IGCSE',
    name: 'IGCSE (International)',
    description: 'Years 10-11: Cambridge International General Certificate',
    grades: 'Years 10-11',
    icon: Globe,
  },
  {
    id: 'IB',
    name: 'IB (International Baccalaureate)',
    description: 'Grades 11-12: International Baccalaureate Program',
    grades: 'Grades 11-12',
    icon: BookOpen,
  },
]

export function CurriculumSelection({ selectedCurricula, onCurriculaChange }: CurriculumSelectionProps) {
  const toggleCurriculum = (curriculumId: string) => {
    const updated = selectedCurricula.includes(curriculumId)
      ? selectedCurricula.filter((c) => c !== curriculumId)
      : [...selectedCurricula, curriculumId]
    onCurriculaChange(updated)
  }

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Curriculum Offerings
        </CardTitle>
        <CardDescription>
          Select which curricula your school offers. This determines which features and assessment tools will be available.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {CURRICULA.map((curriculum) => {
            const Icon = curriculum.icon
            const isSelected = selectedCurricula.includes(curriculum.id)
            return (
              <div key={curriculum.id} className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-accent">
                <Checkbox
                  id={curriculum.id}
                  checked={isSelected}
                  onCheckedChange={() => toggleCurriculum(curriculum.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <Label htmlFor={curriculum.id} className="cursor-pointer font-semibold">
                      {curriculum.name}
                    </Label>
                    <Badge variant={isSelected ? 'default' : 'outline'} className="ml-auto">
                      {curriculum.grades}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{curriculum.description}</p>
                </div>
              </div>
            )
          })}

          {selectedCurricula.length > 0 && (
            <div className="mt-6 rounded-lg bg-blue-50 p-4">
              <h4 className="font-semibold text-blue-900">Selected Curricula</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedCurricula.map((id) => {
                  const curriculum = CURRICULA.find((c) => c.id === id)
                  return (
                    <Badge key={id} variant="secondary">
                      {curriculum?.name}
                    </Badge>
                  )
                })}
              </div>
              {selectedCurricula.length === 1 && (
                <p className="mt-2 text-sm text-blue-800">
                  You have selected a single curriculum. Students will only use {selectedCurricula[0]} features.
                </p>
              )}
              {selectedCurricula.length > 1 && (
                <p className="mt-2 text-sm text-blue-800">
                  You have selected multiple curricula. School admins can assign students to each curriculum, and the
                  system will show curriculum-specific features and assessments.
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
