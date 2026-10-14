-- Create tables for managing multiple parents/guardians per child and parent access credentials

-- Parent-Child relationships table (allowing up to 2 parents/guardians per child)
CREATE TABLE parent_child_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  relationship VARCHAR(50) NOT NULL, -- mother, father, guardian, etc.
  is_primary BOOLEAN DEFAULT false, -- Primary contact
  access_credentials JSONB DEFAULT '{"default_password_used": true, "password_changed_on": null}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(parent_user_id, student_id) -- Prevent duplicate parent-child relationships
);

-- Parent access log for tracking first login and password changes
CREATE TABLE parent_access_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL, -- 'first_login', 'password_changed', 'login', etc.
  login_timestamp TIMESTAMP WITH TIME ZONE,
  ip_address VARCHAR(45),
  user_agent TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Parent email notifications log
CREATE TABLE parent_email_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  notification_type VARCHAR(50) NOT NULL, -- 'welcome', 'password_change_prompt', etc.
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  is_sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE,
  email_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_parent_child_relationships_parent ON parent_child_relationships(parent_user_id);
CREATE INDEX idx_parent_child_relationships_student ON parent_child_relationships(student_id);
CREATE INDEX idx_parent_access_logs_parent ON parent_access_logs(parent_user_id);
CREATE INDEX idx_parent_access_logs_student ON parent_access_logs(student_id);
CREATE INDEX idx_parent_email_notifications_parent ON parent_email_notifications(parent_user_id);
CREATE INDEX idx_parent_email_notifications_sent ON parent_email_notifications(is_sent);

-- Create triggers for updated_at
CREATE TRIGGER update_parent_child_relationships_updated_at BEFORE UPDATE ON parent_child_relationships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add parent-specific fields to users table for storing multiple parents
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS parent_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS parent_2_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Create an index for quick parent lookup
CREATE INDEX idx_students_parent_2_id ON students(parent_2_id);
