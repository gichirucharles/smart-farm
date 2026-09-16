-- Add teacher roles table
CREATE TABLE teacher_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  subject_ids UUID[] DEFAULT '{}',
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role, class_id) -- Prevent duplicate class teacher roles
);

-- Add role reassignment tracking table
CREATE TABLE role_reassignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  original_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  new_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role UUID NOT NULL REFERENCES teacher_roles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Add teacher assignment history for audit trail
CREATE TABLE teacher_assignment_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  role VARCHAR(50),
  class_id UUID REFERENCES classes(id),
  previous_assignment TEXT,
  new_assignment TEXT,
  reason TEXT,
  performed_by UUID NOT NULL REFERENCES users(id),
  school_id UUID NOT NULL REFERENCES schools(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_teacher_roles_user_id ON teacher_roles(user_id);
CREATE INDEX idx_teacher_roles_school_id ON teacher_roles(school_id);
CREATE INDEX idx_teacher_roles_class_id ON teacher_roles(class_id);
CREATE INDEX idx_role_reassignments_status ON role_reassignments(status);
CREATE INDEX idx_assignment_history_teacher_id ON teacher_assignment_history(teacher_id);

-- Create trigger for teacher_roles updated_at
CREATE TRIGGER update_teacher_roles_updated_at BEFORE UPDATE ON teacher_roles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
