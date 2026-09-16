-- Add curriculum support to ShuleVerse
-- This migration adds curriculum selection and feature activation

-- 1. Add curriculum fields to schools table
ALTER TABLE schools ADD COLUMN IF NOT EXISTS curricula_offered TEXT[] DEFAULT ARRAY['cbc'];
ALTER TABLE schools ADD COLUMN IF NOT EXISTS primary_curriculum TEXT DEFAULT 'cbc';
ALTER TABLE schools ADD COLUMN IF NOT EXISTS curriculum_settings JSONB DEFAULT '{"cbc": {}, "kcse": {}, "igcse": {}, "ib": {}}';
ALTER TABLE schools ADD COLUMN IF NOT EXISTS grade_curriculum_mapping JSONB DEFAULT '{}';

-- 2. Create curriculum_offerings table for detailed tracking
CREATE TABLE IF NOT EXISTS curriculum_offerings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  curriculum_type TEXT NOT NULL CHECK (curriculum_type IN ('cbc', 'kcse', 'igcse', 'ib')),
  is_active BOOLEAN DEFAULT true,
  start_year INTEGER,
  end_year INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(school_id, curriculum_type)
);

-- 3. Create table for curriculum-grade mappings
CREATE TABLE IF NOT EXISTS curriculum_grade_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  grade TEXT NOT NULL,
  curriculum_type TEXT NOT NULL CHECK (curriculum_type IN ('cbc', 'kcse', 'igcse', 'ib')),
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(school_id, grade)
);

-- 4. Create table for curriculum feature configurations
CREATE TABLE IF NOT EXISTS curriculum_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  curriculum_type TEXT NOT NULL,
  feature_name TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  configuration JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(school_id, curriculum_type, feature_name)
);

-- 5. Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_curriculum_offerings_school ON curriculum_offerings(school_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_offerings_type ON curriculum_offerings(curriculum_type);
CREATE INDEX IF NOT EXISTS idx_grade_mappings_school ON curriculum_grade_mappings(school_id);
CREATE INDEX IF NOT EXISTS idx_grade_mappings_grade ON curriculum_grade_mappings(grade);
CREATE INDEX IF NOT EXISTS idx_curriculum_features_school ON curriculum_features(school_id);

-- 6. Create function to check if curriculum is offered
CREATE OR REPLACE FUNCTION is_curriculum_offered(
  p_school_id UUID,
  p_curriculum TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM curriculum_offerings
    WHERE school_id = p_school_id
    AND curriculum_type = p_curriculum
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 7. Create function to get active curricula for a school
CREATE OR REPLACE FUNCTION get_active_curricula(p_school_id UUID)
RETURNS TEXT[] AS $$
BEGIN
  RETURN ARRAY(
    SELECT curriculum_type FROM curriculum_offerings
    WHERE school_id = p_school_id AND is_active = true
    ORDER BY curriculum_type
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- 8. Create function to get curriculum for a grade
CREATE OR REPLACE FUNCTION get_curriculum_for_grade(
  p_school_id UUID,
  p_grade TEXT
)
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT curriculum_type FROM curriculum_grade_mappings
    WHERE school_id = p_school_id AND grade = p_grade
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- 9. Create audit log for curriculum changes
CREATE TABLE IF NOT EXISTS curriculum_change_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  changed_by UUID,
  change_type TEXT NOT NULL, -- 'added', 'removed', 'activated', 'deactivated'
  curriculum_type TEXT,
  change_details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_curriculum_log_school ON curriculum_change_log(school_id);

-- Sample data: Default curriculum offerings for new schools
-- Adjust these based on your requirements
INSERT INTO curriculum_offerings (school_id, curriculum_type, is_active)
SELECT id, 'cbc', true FROM schools WHERE curricula_offered IS NULL OR curricula_offered = ARRAY['cbc']
ON CONFLICT (school_id, curriculum_type) DO NOTHING;
