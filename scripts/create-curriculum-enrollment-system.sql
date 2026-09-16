-- Create student_curriculum_enrollment table
CREATE TABLE IF NOT EXISTS student_curriculum_enrollment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  curriculum_type VARCHAR(50) NOT NULL CHECK (curriculum_type IN ('CBC', 'IGCSE', 'KCSE', 'IB')),
  academic_year INTEGER NOT NULL,
  grade_level VARCHAR(20) NOT NULL,
  start_date TIMESTAMP DEFAULT NOW(),
  end_date TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'transferred', 'graduated')),
  notes TEXT,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, school_id, curriculum_type, academic_year)
);

-- Create curriculum_subjects table for subject mapping per curriculum
CREATE TABLE IF NOT EXISTS curriculum_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  curriculum_type VARCHAR(50) NOT NULL,
  subject_name VARCHAR(100) NOT NULL,
  subject_code VARCHAR(20),
  grade_levels VARCHAR(100),
  component_weighting JSONB, -- For IGCSE component weightings
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(school_id, curriculum_type, subject_code)
);

-- Create student_subject_enrollment table
CREATE TABLE IF NOT EXISTS student_subject_enrollment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_curriculum_enrollment_id UUID NOT NULL REFERENCES student_curriculum_enrollment(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES curriculum_subjects(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES users(id),
  enrollment_date TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_curriculum_enrollment_id, subject_id)
);

-- Create student_results table (curriculum-agnostic)
CREATE TABLE IF NOT EXISTS student_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_curriculum_enrollment_id UUID NOT NULL REFERENCES student_curriculum_enrollment(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES curriculum_subjects(id),
  term INTEGER,
  academic_year INTEGER,
  marks_obtained NUMERIC(5,2),
  total_marks NUMERIC(5,2),
  percentage NUMERIC(5,2),
  -- CBC grading (1-7)
  cbc_performance_level INTEGER CHECK (cbc_performance_level >= 1 AND cbc_performance_level <= 7),
  -- IGCSE grading (A*-U)
  igcse_grade VARCHAR(2),
  -- KCSE grading (A+-E)
  kcse_grade VARCHAR(2),
  -- IB grading (1-7)
  ib_points INTEGER CHECK (ib_points >= 1 AND ib_points <= 7),
  grade_recorded_by UUID REFERENCES users(id),
  recorded_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create curriculum_features_status table to track which features are active per school
CREATE TABLE IF NOT EXISTS curriculum_features_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL UNIQUE REFERENCES schools(id) ON DELETE CASCADE,
  offers_cbc BOOLEAN DEFAULT FALSE,
  offers_igcse BOOLEAN DEFAULT FALSE,
  offers_kcse BOOLEAN DEFAULT FALSE,
  offers_ib BOOLEAN DEFAULT FALSE,
  cbc_active BOOLEAN DEFAULT FALSE,
  igcse_active BOOLEAN DEFAULT FALSE,
  kcse_active BOOLEAN DEFAULT FALSE,
  ib_active BOOLEAN DEFAULT FALSE,
  curriculum_configured_by UUID REFERENCES users(id),
  configured_at TIMESTAMP,
  last_updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_student_curriculum_enrollment_student_id ON student_curriculum_enrollment(student_id);
CREATE INDEX idx_student_curriculum_enrollment_school_id ON student_curriculum_enrollment(school_id);
CREATE INDEX idx_student_curriculum_enrollment_curriculum ON student_curriculum_enrollment(curriculum_type);
CREATE INDEX idx_student_curriculum_enrollment_academic_year ON student_curriculum_enrollment(academic_year);

CREATE INDEX idx_student_results_student_curriculum ON student_results(student_curriculum_enrollment_id);
CREATE INDEX idx_student_results_subject ON student_results(subject_id);
CREATE INDEX idx_student_results_year_term ON student_results(academic_year, term);

CREATE INDEX idx_curriculum_subjects_school_curriculum ON curriculum_subjects(school_id, curriculum_type);

CREATE INDEX idx_student_subject_enrollment_curriculum ON student_subject_enrollment(student_curriculum_enrollment_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_student_curriculum_enrollment_updated_at
  BEFORE UPDATE ON student_curriculum_enrollment
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_results_updated_at
  BEFORE UPDATE ON student_results
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create views for easier querying
CREATE OR REPLACE VIEW student_active_enrollments AS
SELECT 
  sce.id,
  sce.student_id,
  sce.school_id,
  sce.curriculum_type,
  sce.academic_year,
  sce.grade_level,
  cfs.offers_cbc,
  cfs.offers_igcse,
  cfs.offers_kcse,
  cfs.offers_ib
FROM student_curriculum_enrollment sce
JOIN curriculum_features_status cfs ON sce.school_id = cfs.school_id
WHERE sce.status = 'active';

-- Function to get student's curriculum by school
CREATE OR REPLACE FUNCTION get_student_curriculum(
  p_student_id UUID,
  p_school_id UUID,
  p_academic_year INTEGER
)
RETURNS TABLE (
  curriculum_id UUID,
  curriculum_type VARCHAR,
  grade_level VARCHAR,
  status VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sce.id,
    sce.curriculum_type,
    sce.grade_level,
    sce.status
  FROM student_curriculum_enrollment sce
  WHERE sce.student_id = p_student_id
    AND sce.school_id = p_school_id
    AND sce.academic_year = p_academic_year
    AND sce.status = 'active';
END;
$$ LANGUAGE plpgsql;

-- Function to check if curriculum is active for school
CREATE OR REPLACE FUNCTION is_curriculum_active(
  p_school_id UUID,
  p_curriculum_type VARCHAR
)
RETURNS BOOLEAN AS $$
DECLARE
  v_is_active BOOLEAN;
BEGIN
  SELECT CASE p_curriculum_type
    WHEN 'CBC' THEN cbc_active
    WHEN 'IGCSE' THEN igcse_active
    WHEN 'KCSE' THEN kcse_active
    WHEN 'IB' THEN ib_active
    ELSE FALSE
  END INTO v_is_active
  FROM curriculum_features_status
  WHERE school_id = p_school_id;
  
  RETURN COALESCE(v_is_active, FALSE);
END;
$$ LANGUAGE plpgsql;
