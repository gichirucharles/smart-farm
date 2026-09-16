'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Eye, Share2 } from 'lucide-react';

interface StudentReport {
  name: string;
  admissionNumber: string;
  grade: string;
  term: string;
  academicYear: string;
}

interface CompetencyAssessment {
  competency: string;
  level: number;
  evidence: string;
}

interface NarrativeTemplate {
  level: number;
  template: string;
}

const performanceLevelNarratives: NarrativeTemplate[] = [
  {
    level: 1,
    template:
      '{student} requires significant support in {competency}. While {she/he} attempts the tasks, there is difficulty in {specific_area}. Continued scaffolding and targeted practice will help {student} progress.',
  },
  {
    level: 2,
    template:
      '{student} is developing in {competency} but still requires guidance. {She/He} can {emerging_skills} with support but needs more practice in {areas_for_growth}.',
  },
  {
    level: 3,
    template:
      '{student} is approaching the expected standard in {competency}. {She/He} demonstrates {growing_skills} and is beginning to {developing_skills}. With continued practice, {student} will meet expectations.',
  },
  {
    level: 4,
    template:
      '{student} is very close to meeting the expected standard in {competency}. {She/He} confidently {key_skills} and shows good understanding of {core_concepts}. A little more effort will lead to full mastery.',
  },
  {
    level: 5,
    template:
      '{student} meets the expected standard in {competency}. {She/He} demonstrates solid understanding and can {apply_skills} effectively. Continue to encourage application in diverse contexts.',
  },
  {
    level: 6,
    template:
      '{student} clearly demonstrates competency in {competency}. {She/He} consistently {demonstrate_skills} and shows strong problem-solving abilities in {application_areas}. Consider leadership opportunities.',
  },
  {
    level: 7,
    template:
      '{student} exceeds expectations in {competency}. {She/He} demonstrates advanced understanding and can {advanced_skills}. {Student} shows excellent critical thinking and can apply learning in novel situations.',
  },
];

const competencyGuidance = {
  reading: {
    'Level 1': 'Recognizes some letters; struggles with simple words',
    'Level 2': 'Reads simple words with support; limited comprehension',
    'Level 3': 'Reads grade-level texts with support; basic comprehension',
    'Level 4': 'Reads grade-level texts independently; good comprehension',
    'Level 5': 'Reads with fluency; demonstrates good understanding',
    'Level 6': 'Analyzes text; makes predictions; excellent comprehension',
    'Level 7': 'Critically analyzes complex texts; draws sophisticated inferences',
  },
  writing: {
    'Level 1': 'Attempts to write; marks on paper; no letter formation',
    'Level 2': 'Forms some letters; short simple words; minimal sentence structure',
    'Level 3': 'Writes simple sentences; basic punctuation; emerging organization',
    'Level 4': 'Writes multiple sentences; adequate punctuation; clear ideas',
    'Level 5': 'Writes coherent paragraphs; good grammar; clear communication',
    'Level 6': 'Writes well-organized essays; sophisticated vocabulary; persuasive',
    'Level 7': 'Writes compelling pieces; varied sentence structure; excellent expression',
  },
  mathematics: {
    'Level 1': 'Struggles with number recognition; minimal computation',
    'Level 2': 'Recognizes numbers; solves simple problems with concrete materials',
    'Level 3': 'Solves problems with some strategies; emerging reasoning',
    'Level 4': 'Solves problems using multiple strategies; adequate reasoning',
    'Level 5': 'Solves problems efficiently; demonstrates clear mathematical thinking',
    'Level 6': 'Applies concepts to new situations; explains reasoning clearly',
    'Level 7': 'Masters concepts; applies to complex problems; mentors peers',
  },
};

export default function CBCReportGenerator() {
  const [selectedStudent, setSelectedStudent] = useState<StudentReport | null>(null);
  const [selectedCompetency, setSelectedCompetency] = useState<CompetencyAssessment | null>(null);
  const [customNarrative, setCustomNarrative] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);

  const mockStudent: StudentReport = {
    name: 'Mary Omondi',
    admissionNumber: 'ADM002',
    grade: 'Grade 3',
    term: 'Term 1',
    academicYear: '2025',
  };

  const mockAssessments: CompetencyAssessment[] = [
    {
      competency: 'Reading and Comprehension',
      level: 5,
      evidence: 'Can read Grade 3 level texts fluently. Understands main ideas and details.',
    },
    {
      competency: 'Writing and Expression',
      level: 4,
      evidence: 'Writes simple paragraphs. Needs work on punctuation and spelling.',
    },
    {
      competency: 'Mathematical Problem Solving',
      level: 6,
      evidence: 'Solves multi-step problems. Explains reasoning clearly.',
    },
    {
      competency: 'Scientific Inquiry',
      level: 5,
      evidence: 'Conducts simple experiments. Records observations systematically.',
    },
  ];

  const generateNarrative = (competency: string, level: number): string => {
    const template = performanceLevelNarratives.find((n) => n.level === level)?.template || '';
    let narrative = template
      .replace(/{student}/g, mockStudent.name)
      .replace(/{she\/he}/gi, 'She')
      .replace(/{competency}/g, competency);

    // Add competency-specific descriptors
    const descriptor = competencyGuidance[competency.toLowerCase().split(' ')[0]]?.[`Level ${level}`];
    narrative = narrative.replace(/{specific_descriptor}/g, descriptor || 'specific skills');

    // Add contextual phrases
    if (level <= 2) {
      narrative += ' Please schedule a meeting to discuss support strategies.';
    } else if (level >= 6) {
      narrative += ' Consider providing opportunities for extension activities.';
    }

    return narrative;
  };

  const getLevelColor = (level: number) => {
    if (level === 1 || level === 2) return 'bg-red-100 text-red-900';
    if (level === 3 || level === 4) return 'bg-blue-100 text-blue-900';
    if (level === 5 || level === 6) return 'bg-green-100 text-green-900';
    return 'bg-orange-100 text-orange-900';
  };

  const getLevelName = (level: number) => {
    const names = ['', 'BE2', 'BE1', 'AE2', 'AE1', 'ME2', 'ME1', 'EE'];
    return names[level];
  };

  return (
    <div className="w-full space-y-6 p-6 bg-gradient-to-br from-[#b8d4f0] to-[#a8c8e8] min-h-screen">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-[#1e3a8a]">CBC Report Generator</h1>
          <p className="text-[#1e3a8a]/70 mt-2">Generate narrative reports with performance assessments</p>
        </div>
      </div>

      <Tabs defaultValue="builder" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/80">
          <TabsTrigger value="builder">Report Builder</TabsTrigger>
          <TabsTrigger value="templates">Narrative Templates</TabsTrigger>
          <TabsTrigger value="preview">Preview & Export</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-4">
          <Card className="bg-white/90 border-white/50">
            <CardHeader>
              <CardTitle className="text-[#1e3a8a]">Build Student Report</CardTitle>
              <CardDescription>Select student and competencies to generate report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Student Selection */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="font-semibold text-[#1e3a8a]">Student: {mockStudent.name}</p>
                <p className="text-sm text-[#1e3a8a]/60">{mockStudent.admissionNumber} | {mockStudent.grade}</p>
                <p className="text-sm text-[#1e3a8a]/60">
                  {mockStudent.term}, {mockStudent.academicYear}
                </p>
              </div>

              {/* Competency Assessment Cards */}
              <div className="space-y-3">
                <h3 className="font-semibold text-[#1e3a8a]">Performance by Competency</h3>
                {mockAssessments.map((assessment, idx) => (
                  <Card
                    key={idx}
                    className={`cursor-pointer border-2 transition-all ${
                      selectedCompetency === assessment
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-blue-100 hover:border-blue-200'
                    }`}
                    onClick={() => setSelectedCompetency(assessment)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-[#1e3a8a]">{assessment.competency}</p>
                          <p className="text-sm text-[#1e3a8a]/60 mt-1">{assessment.evidence}</p>
                        </div>
                        <Badge className={getLevelColor(assessment.level)}>
                          Level {assessment.level} ({getLevelName(assessment.level)})
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Narrative Preview */}
              {selectedCompetency && (
                <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-[#1e3a8a]">Generated Narrative</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-4 bg-white/70 rounded border border-white/50">
                      <p className="text-sm text-[#1e3a8a] leading-relaxed">
                        {generateNarrative(selectedCompetency.competency, selectedCompetency.level)}
                      </p>
                    </div>
                    <textarea
                      value={customNarrative}
                      onChange={(e) => setCustomNarrative(e.target.value)}
                      placeholder="Edit or add additional notes..."
                      className="w-full px-3 py-2 border border-blue-200 rounded text-sm focus:ring-2 focus:ring-blue-400 min-h-20"
                    />
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" className="border-blue-300 text-[#1e3a8a] bg-transparent">
                  Save Draft
                </Button>
                <Button className="bg-gradient-to-r from-blue-500 to-blue-600">
                  Add to Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card className="bg-white/90 border-white/50">
            <CardHeader>
              <CardTitle className="text-[#1e3a8a]">Narrative Templates</CardTitle>
              <CardDescription>Pre-written narratives for each performance level</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {performanceLevelNarratives.map((template) => (
                <Card key={template.level} className="bg-blue-50 border-blue-100">
                  <CardContent className="p-4">
                    <div className="mb-2">
                      <Badge className={getLevelColor(template.level)} variant="outline">
                        Level {template.level} ({getLevelName(template.level)})
                      </Badge>
                    </div>
                    <p className="text-sm text-[#1e3a8a] leading-relaxed italic">
                      "{template.template}"
                    </p>
                    <p className="text-xs text-[#1e3a8a]/60 mt-3">
                      Placeholders: {'{student}'}, {'{competency}'}, {'{she/he}'}, {'{specific_area}'}, etc.
                    </p>
                  </CardContent>
                </Card>
              ))}

              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-sm text-[#1e3a8a]">Tips for Effective Narratives</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>✓ Be specific about skills observed, not just general comments</p>
                  <p>✓ Include evidence: "Mary can solve multi-step problems" not "Mary is good at math"</p>
                  <p>✓ Focus on growth and next steps, not deficits</p>
                  <p>✓ Use student name and pronouns correctly</p>
                  <p>✓ Match narrative to actual performance level assigned</p>
                  <p>✓ Keep language age-appropriate for parents reading</p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card className="bg-white/90 border-white/50">
            <CardHeader>
              <CardTitle className="text-[#1e3a8a]">Report Preview</CardTitle>
              <CardDescription>View and download student report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Full Report Preview */}
              <div className="border-2 border-blue-200 rounded-lg p-6 bg-white/50">
                <div className="mb-6 pb-4 border-b-2 border-blue-100">
                  <h2 className="text-2xl font-bold text-[#1e3a8a]">Term Report</h2>
                  <p className="text-[#1e3a8a]/60">
                    {mockStudent.name} | {mockStudent.grade} | {mockStudent.term} {mockStudent.academicYear}
                  </p>
                </div>

                {/* Performance Summary */}
                <div className="mb-6">
                  <h3 className="font-bold text-[#1e3a8a] mb-3">Performance Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {mockAssessments.map((assessment, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-100">
                        <span className="text-sm text-[#1e3a8a]">{assessment.competency}</span>
                        <Badge className={getLevelColor(assessment.level)}>
                          {assessment.level}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detailed Narratives */}
                <div className="space-y-4">
                  <h3 className="font-bold text-[#1e3a8a]">Detailed Feedback</h3>
                  {mockAssessments.map((assessment, idx) => (
                    <div key={idx} className="p-4 bg-white/70 rounded border border-blue-100">
                      <p className="font-semibold text-[#1e3a8a] mb-2">{assessment.competency}</p>
                      <p className="text-sm text-[#1e3a8a]/80 leading-relaxed">
                        {generateNarrative(assessment.competency, assessment.level)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Overall Comment */}
                <div className="mt-6 p-4 bg-green-50 rounded border border-green-200">
                  <p className="font-semibold text-[#1e3a8a] mb-2">Overall Comment</p>
                  <p className="text-sm text-[#1e3a8a] leading-relaxed">
                    Mary has made excellent progress this term. She demonstrates strong competencies in Reading and
                    Mathematical Problem Solving. With continued focus on Writing skills, she will reach her full
                    potential. We encourage daily reading and practice at home to support her learning journey.
                  </p>
                </div>
              </div>

              {/* Export Options */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600" onClick={() => setShowPreview(!showPreview)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Full Preview
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-green-500 to-green-600">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" className="flex-1 border-blue-300 text-[#1e3a8a] bg-transparent">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share with Parent
                </Button>
              </div>

              {/* Export Format Options */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <p className="text-sm font-semibold text-[#1e3a8a] mb-3">Choose Export Format:</p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="format" defaultChecked />
                      <span className="text-sm text-[#1e3a8a]">PDF (Print-friendly)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="format" />
                      <span className="text-sm text-[#1e3a8a]">Word (.docx)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="format" />
                      <span className="text-sm text-[#1e3a8a]">Print to Portal (Parents view online)</span>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
