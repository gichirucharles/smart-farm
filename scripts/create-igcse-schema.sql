-- IGCSE Assessment Schema for ShuleVerse
-- Cambridge International IGCSE Assessment Management

-- Create enum for curriculum type
CREATE TYPE curriculum_type AS ENUM ('cbc', 'kcse', 'igcse', 'ib');

-- Update schools table to support curriculum type if not exists
ALTER TABLE schools ADD COLUMN IF NOT EXISTS curriculum_type curriculum_type DEFAULT 'cbc';
ALTER TABLE classes ADD COLUMN IF NOT EXISTS curriculum_type curriculum_type DEFAULT 'cbc';

-- IGCSE Subjects Table
CREATE TABLE IF NOT EXISTS igcse_subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  code VARCHAR(10) NOT NULL,
  name VARCHAR(255) NOT NULL,
  cambridge_code VARCHAR(10),
  description TEXT,
  total_components INT DEFAULT 2,
  has_practical BOOLEAN DEFAULT false,
  practical_percentage NUMERIC(5,2) DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(school_id, code)
);

-- IGCSE Subject Components Table
CREATE TABLE IF NOT EXISTS igcse_components (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID NOT NULL REFERENCES igcse_subjects(id) ON DELETE CASCADE,
  component_name VARCHAR(255) NOT NULL,
  component_type VARCHAR(50) NOT NULL, -- 'paper', 'practical', 'coursework'
  percentage_weighting NUMERIC(5,2) NOT NULL,
  total_marks INT DEFAULT 100,
  sequence_order INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(subject_id, component_name)
);

-- IGCSE Student Assessments Table
CREATE TABLE IF NOT EXISTS igcse_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES igcse_subjects(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES users(id),
  exam_series VARCHAR(20), -- e.g., 'May/June 2025', 'October/November 2024'
  exam_session VARCHAR(50),
  assessment_date DATE,
  component_id UUID REFERENCES igcse_components(id),
  obtained_marks NUMERIC(10,2),
  total_marks INT DEFAULT 100,
  percentage NUMERIC(5,2),
  grade CHAR(2), -- A*, A, B, C, D, E, F, G, U
  notes TEXT,
  evidence_url VARCHAR(500), -- URL to scanned papers or evidence
  marked_by_teacher BOOLEAN DEFAULT false,
  moderation_status VARCHAR(50) DEFAULT 'pending', -- pending, submitted, moderated
  moderation_notes TEXT,
  moderated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, subject_id, component_id, exam_session)
);

-- IGCSE Composite Grades Table
CREATE TABLE IF NOT EXISTS igcse_composite_grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES igcse_subjects(id) ON DELETE CASCADE,
  exam_series VARCHAR(20),
  exam_session VARCHAR(50),
  component_1_marks NUMERIC(10,2),
  component_1_percentage NUMERIC(5,2),
  component_2_marks NUMERIC(10,2),
  component_2_percentage NUMERIC(5,2),
  component_3_marks NUMERIC(10,2) DEFAULT NULL,
  component_3_percentage NUMERIC(5,2) DEFAULT NULL,
  practical_marks NUMERIC(10,2) DEFAULT NULL,
  practical_percentage NUMERIC(5,2) DEFAULT NULL,
  composite_marks NUMERIC(10,2),
  composite_percentage NUMERIC(5,2),
  final_grade CHAR(2),
  ucas_points INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, subject_id, exam_session)
);

-- IGCSE Student Results Summary Table
CREATE TABLE IF NOT EXISTS igcse_results_summary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  exam_series VARCHAR(20),
  exam_session VARCHAR(50),
  total_subjects_registered INT,
  total_subjects_completed INT,
  total_ucas_points INT,
  grade_distribution TEXT, -- JSON: {A*: 2, A: 3, B: 2, etc}
  average_grade CHAR(2),
  highest_grade CHAR(2),
  lowest_grade CHAR(2),
  pass_rate NUMERIC(5,2), -- % of E or above
  distinction_rate NUMERIC(5,2), -- % of A* and A
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, exam_session)
);

-- IGCSE Reports Table (for transcripts and reports)
CREATE TABLE IF NOT EXISTS igcse_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  exam_series VARCHAR(20),
  exam_session VARCHAR(50),
  report_type VARCHAR(50) DEFAULT 'transcript', -- transcript, certificate, analysis
  report_content TEXT, -- JSON with comprehensive report
  generated_by UUID NOT NULL REFERENCES users(id),
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- IGCSE Practical Assessment Register Table
CREATE TABLE IF NOT EXISTS igcse_practical_register (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES igcse_subjects(id),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES users(id),
  practical_date DATE,
  experiment_title VARCHAR(255),
  marks_obtained NUMERIC(10,2),
  total_marks INT DEFAULT 100,
  percentage NUMERIC(5,2),
  observer_comments TEXT,
  safety_rating VARCHAR(20), -- excellent, good, acceptable, poor
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(school_id, student_id, subject_id, practical_date)
);

-- IGCSE Class Timetable Table
CREATE TABLE IF NOT EXISTS igcse_timetable (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES igcse_subjects(id),
  teacher_id UUID NOT NULL REFERENCES users(id),
  day_of_week VARCHAR(20),
  start_time TIME,
  end_time TIME,
  room_number VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_igcse_assessments_student_subject ON igcse_assessments(student_id, subject_id);
CREATE INDEX IF NOT EXISTS idx_igcse_assessments_exam_session ON igcse_assessments(exam_session);
CREATE INDEX IF NOT EXISTS idx_igcse_composite_grades_exam ON igcse_composite_grades(exam_session, school_id);
CREATE INDEX IF NOT EXISTS idx_igcse_results_summary_student ON igcse_results_summary(student_id, exam_session);
CREATE INDEX IF NOT EXISTS idx_igcse_practical_register_teacher ON igcse_practical_register(teacher_id, practical_date);

-- Create view for IGCSE student reports
CREATE OR REPLACE VIEW igcse_student_subject_summary AS
SELECT
  ics.student_id,
  ics.school_id,
  s.name as subject_name,
  s.code as subject_code,
  ics.exam_series,
  ics.exam_session,
  ics.composite_percentage,
  ics.final_grade,
  ics.ucas_points,
  COUNT(ia.id) as total_components_submitted,
  AVG(ia.percentage) as average_component_percentage
FROM igcse_composite_grades ics
JOIN igcse_subjects s ON ics.subject_id = s.id
LEFT JOIN igcse_assessments ia ON ics.subject_id = ia.subject_id 
  AND ics.student_id = ia.student_id 
  AND ics.exam_session = ia.exam_session
GROUP BY ics.id, ics.student_id, ics.school_id, s.name, s.code, 
         ics.exam_series, ics.exam_session, ics.composite_percentage, 
         ics.final_grade, ics.ucas_points;

-- Permissions
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO postgres;
