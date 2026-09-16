-- CBC Assessment System Database Schema for Kenya Education
-- Supports Competency-Based Curriculum (Grades 1-9)
-- Performance Levels: 1-7 scale

-- Add curriculum type enum
ALTER TYPE assessment_type ADD VALUE 'cbc_performance' IF NOT EXISTS;

-- Create curriculum type enum
CREATE TYPE curriculum_type AS ENUM ('cbc', 'kcse', 'igcse', 'ib');
CREATE TYPE performance_level AS ENUM ('1', '2', '3', '4', '5', '6', '7');
CREATE TYPE competency_domain AS ENUM (
  'communication_and_collaboration',
  'critical_thinking_and_problem_solving',
  'creativity_and_imagination',
  'citizenship_and_patriotism',
  'digital_literacy',
  'learning_to_learn',
  'personal_and_social_development'
);

-- Update schools table to support multiple curriculum types
ALTER TABLE schools 
ADD COLUMN curriculum_type curriculum_type DEFAULT 'cbc',
ADD COLUMN established_year INTEGER,
ADD COLUMN principal_name VARCHAR(100);

-- CBC Learning Areas table (replaces subjects for grades 1-9)
CREATE TABLE IF NOT EXISTS cbc_learning_areas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  code VARCHAR(10) NOT NULL,
  grade_level INTEGER NOT NULL CHECK (grade_level BETWEEN 1 AND 9),
  description TEXT,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(code, school_id, grade_level)
);

-- CBC Competencies table
CREATE TABLE IF NOT EXISTS cbc_competencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  learning_area_id UUID NOT NULL REFERENCES cbc_learning_areas(id) ON DELETE CASCADE,
  competency_number INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  domain competency_domain,
  grade_level INTEGER NOT NULL,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(learning_area_id, competency_number)
);

-- Performance Level Indicators (descriptors for each level 1-7)
CREATE TABLE IF NOT EXISTS performance_level_indicators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competency_id UUID NOT NULL REFERENCES cbc_competencies(id) ON DELETE CASCADE,
  level performance_level NOT NULL,
  descriptor TEXT NOT NULL,
  mark_range_min DECIMAL(5,2),
  mark_range_max DECIMAL(5,2),
  grade_letter VARCHAR(2),
  narrative_template TEXT,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(competency_id, level, school_id)
);

-- CBC Student Assessment Results (replaces grades table for CBC schools)
CREATE TABLE IF NOT EXISTS cbc_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  learning_area_id UUID NOT NULL REFERENCES cbc_learning_areas(id) ON DELETE CASCADE,
  competency_id UUID NOT NULL REFERENCES cbc_competencies(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  term term NOT NULL,
  academic_year VARCHAR(9) NOT NULL,
  performance_level performance_level NOT NULL,
  evidence_notes TEXT,
  assessment_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, competency_id, term, academic_year)
);

-- CBC Term Report Summary (aggregated performance per term)
CREATE TABLE IF NOT EXISTS cbc_term_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  term term NOT NULL,
  academic_year VARCHAR(9) NOT NULL,
  teacher_narrative TEXT,
  overall_comment TEXT,
  areas_of_strength TEXT,
  areas_for_improvement TEXT,
  generated_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  generated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, term, academic_year)
);

-- CBC Learning Competency Summary (overall competency mastery)
CREATE TABLE IF NOT EXISTS cbc_competency_summary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  learning_area_id UUID NOT NULL REFERENCES cbc_learning_areas(id) ON DELETE CASCADE,
  academic_year VARCHAR(9) NOT NULL,
  average_performance_level DECIMAL(2,1),
  mastery_status VARCHAR(50), -- 'mastered', 'developing', 'beginning'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, learning_area_id, academic_year)
);

-- School Curriculum Configuration (tracks schools' curriculum types and transition status)
CREATE TABLE IF NOT EXISTS school_curriculum_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  primary_curriculum curriculum_type NOT NULL,
  cbc_grades_implemented VARCHAR(20), -- e.g., "1-9", "1-6", "1-3"
  kcse_grades_active VARCHAR(20), -- e.g., "10-12"
  migration_status VARCHAR(50), -- 'planning', 'in_progress', 'completed'
  migration_start_date DATE,
  migration_completion_date DATE,
  teacher_training_percentage INTEGER DEFAULT 0,
  resource_readiness DECIMAL(3,2), -- 0.0 to 1.0
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(school_id)
);

-- Teacher Assessment Load Tracking (helps manage teacher workload for continuous assessment)
CREATE TABLE IF NOT EXISTS teacher_assessment_load (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  academic_year VARCHAR(9) NOT NULL,
  term term NOT NULL,
  total_students_assessed INTEGER DEFAULT 0,
  total_competencies_to_assess INTEGER DEFAULT 0,
  assessments_completed INTEGER DEFAULT 0,
  assessments_pending INTEGER DEFAULT 0,
  percentage_complete DECIMAL(5,2) DEFAULT 0,
  last_assessment_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(teacher_id, academic_year, term)
);

-- Parent Communication Log (tracking parent engagement with CBC performance levels)
CREATE TABLE IF NOT EXISTS parent_engagement_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  interaction_type VARCHAR(50), -- 'report_viewed', 'question_asked', 'meeting_attended', 'report_downloaded'
  interaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cbc_assessments_student_id ON cbc_assessments(student_id);
CREATE INDEX IF NOT EXISTS idx_cbc_assessments_teacher_id ON cbc_assessments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_cbc_assessments_learning_area ON cbc_assessments(learning_area_id);
CREATE INDEX IF NOT EXISTS idx_cbc_assessments_term ON cbc_assessments(term, academic_year);
CREATE INDEX IF NOT EXISTS idx_cbc_term_reports_student_id ON cbc_term_reports(student_id);
CREATE INDEX IF NOT EXISTS idx_cbc_competency_summary ON cbc_competency_summary(student_id, academic_year);
CREATE INDEX IF NOT EXISTS idx_school_curriculum_config ON school_curriculum_config(school_id);
CREATE INDEX IF NOT EXISTS idx_teacher_assessment_load ON teacher_assessment_load(teacher_id, academic_year);
CREATE INDEX IF NOT EXISTS idx_learning_areas_grade ON cbc_learning_areas(grade_level);

-- Enable Row Level Security on sensitive tables
ALTER TABLE cbc_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cbc_term_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_engagement_log ENABLE ROW LEVEL SECURITY;
