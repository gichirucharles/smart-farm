-- Update grades table to include Kenyan grading system
ALTER TABLE grades ADD COLUMN IF NOT EXISTS grade_code VARCHAR(5);
ALTER TABLE grades ADD COLUMN IF NOT EXISTS grade_points INT;
ALTER TABLE grades ADD COLUMN IF NOT EXISTS grade_description VARCHAR(100);

-- Create subject teacher assignment table
CREATE TABLE IF NOT EXISTS subject_teacher_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  academic_year VARCHAR(9) NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(teacher_id, subject_id, class_id, academic_year)
);

-- Create student performance summary
CREATE TABLE IF NOT EXISTS student_performance_summary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  academic_year VARCHAR(9) NOT NULL,
  term VARCHAR(10) NOT NULL,
  mean_score DECIMAL(5,2),
  mean_points INT,
  mean_grade VARCHAR(5),
  overall_rank INT,
  subjects_count INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, class_id, academic_year, term)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subject_teacher_assignments_teacher_id ON subject_teacher_assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_subject_teacher_assignments_class_id ON subject_teacher_assignments(class_id);
CREATE INDEX IF NOT EXISTS idx_subject_teacher_assignments_academic_year ON subject_teacher_assignments(academic_year);
CREATE INDEX IF NOT EXISTS idx_student_performance_student_id ON student_performance_summary(student_id);
CREATE INDEX IF NOT EXISTS idx_student_performance_academic_year ON student_performance_summary(academic_year);

-- Create triggers
CREATE TRIGGER IF NOT EXISTS update_subject_teacher_assignments_updated_at BEFORE UPDATE ON subject_teacher_assignments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_student_performance_updated_at BEFORE UPDATE ON student_performance_summary
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
