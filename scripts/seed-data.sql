-- Insert system admin
INSERT INTO users (id, email, password_hash, role, first_name, last_name, is_first_login) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'charlesmuiruri024@gmail.com', '$2b$12$XF7Ol7y7v0d7X9jqJ8K8ju9KjK8J7i6H5G4F3E2D1C0B9A8Z7Y6X5', 'system_admin', 'Charles', 'Muiruri', false)
ON CONFLICT (email) DO UPDATE SET 
  password_hash = '$2b$12$XF7Ol7y7v0d7X9jqJ8K8ju9KjK8J7i6H5G4F3E2D1C0B9A8Z7Y6X5',
  role = 'system_admin',
  first_name = 'Charles',
  last_name = 'Muiruri',
  is_first_login = false;

-- Insert sample schools
INSERT INTO schools (id, name, address, phone, email, registration_number, subscription_plan, subscription_status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Greenwood Academy', '123 Education Street, Nairobi', '+254712345678', 'info@greenwood.ac.ke', 'SCH001', 'premium', 'active'),
('550e8400-e29b-41d4-a716-446655440002', 'Sunrise Primary School', '456 Learning Avenue, Mombasa', '+254723456789', 'admin@sunrise.ac.ke', 'SCH002', 'basic', 'active'),
('550e8400-e29b-41d4-a716-446655440003', 'Excellence High School', '789 Knowledge Road, Kisumu', '+254734567890', 'contact@excellence.ac.ke', 'SCH003', 'enterprise', 'active');

-- Insert school directors
INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone, school_id, is_first_login) VALUES
('550e8400-e29b-41d4-a716-446655440011', 'director@greenwood.ac.ke', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'director', 'Mary', 'Johnson', '+254712345678', '550e8400-e29b-41d4-a716-446655440001', false),
('550e8400-e29b-41d4-a716-446655440012', 'director@sunrise.ac.ke', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'director', 'James', 'Kimani', '+254723456789', '550e8400-e29b-41d4-a716-446655440002', false),
('550e8400-e29b-41d4-a716-446655440013', 'director@excellence.ac.ke', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'director', 'Grace', 'Wanjiku', '+254734567890', '550e8400-e29b-41d4-a716-446655440003', false);

-- Update schools with director IDs
UPDATE schools SET director_id = '550e8400-e29b-41d4-a716-446655440011' WHERE id = '550e8400-e29b-41d4-a716-446655440001';
UPDATE schools SET director_id = '550e8400-e29b-41d4-a716-446655440012' WHERE id = '550e8400-e29b-41d4-a716-446655440002';
UPDATE schools SET director_id = '550e8400-e29b-41d4-a716-446655440013' WHERE id = '550e8400-e29b-41d4-a716-446655440003';

-- Insert head teachers
INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone, school_id, is_first_login) VALUES
('550e8400-e29b-41d4-a716-446655440014', 'headteacher@greenwood.ac.ke', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'head_teacher', 'Sarah', 'Wilson', '+254712345679', '550e8400-e29b-41d4-a716-446655440001', false),
('550e8400-e29b-41d4-a716-446655440015', 'headteacher@sunrise.ac.ke', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'head_teacher', 'Peter', 'Mwangi', '+254723456790', '550e8400-e29b-41d4-a716-446655440002', false);

-- Insert class teachers
INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone, school_id, is_first_login) VALUES
('550e8400-e29b-41d4-a716-446655440016', 'teacher1@greenwood.ac.ke', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'class_teacher', 'Emily', 'Davis', '+254712345680', '550e8400-e29b-41d4-a716-446655440001', false),
('550e8400-e29b-41d4-a716-446655440017', 'teacher2@greenwood.ac.ke', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'class_teacher', 'Michael', 'Brown', '+254712345681', '550e8400-e29b-41d4-a716-446655440001', false),
('550e8400-e29b-41d4-a716-446655440018', 'teacher1@sunrise.ac.ke', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'class_teacher', 'Lucy', 'Njeri', '+254723456791', '550e8400-e29b-41d4-a716-446655440002', false);

-- Insert school nurse and counselor
INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone, school_id, is_first_login) VALUES
('550e8400-e29b-41d4-a716-446655440019', 'nurse@greenwood.ac.ke', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'school_nurse', 'Jennifer', 'Miller', '+254712345682', '550e8400-e29b-41d4-a716-446655440001', false),
('550e8400-e29b-41d4-a716-446655440020', 'counselor@greenwood.ac.ke', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'school_counselor', 'David', 'Taylor', '+254712345683', '550e8400-e29b-41d4-a716-446655440001', false);

-- Insert parents
INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone, school_id, is_first_login) VALUES
('550e8400-e29b-41d4-a716-446655440021', 'john.doe@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'parent', 'John', 'Doe', '+254712345684', '550e8400-e29b-41d4-a716-446655440001', true),
('550e8400-e29b-41d4-a716-446655440022', 'jane.smith@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'parent', 'Jane', 'Smith', '+254712345685', '550e8400-e29b-41d4-a716-446655440001', true),
('550e8400-e29b-41d4-a716-446655440023', 'robert.johnson@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'parent', 'Robert', 'Johnson', '+254723456792', '550e8400-e29b-41d4-a716-446655440002', true);

-- Insert classes
INSERT INTO classes (id, name, level, stream, school_id, class_teacher_id, academic_year) VALUES
('550e8400-e29b-41d4-a716-446655440030', 'Grade 1A', 'Grade 1', 'A', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440016', '2024-2025'),
('550e8400-e29b-41d4-a716-446655440031', 'Grade 2B', 'Grade 2', 'B', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440017', '2024-2025'),
('550e8400-e29b-41d4-a716-446655440032', 'Standard 3', 'Standard 3', NULL, '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440018', '2024-2025');

-- Insert students
INSERT INTO students (id, first_name, last_name, date_of_birth, gender, class_id, school_id, parent_id, admission_number) VALUES
('550e8400-e29b-41d4-a716-446655440040', 'Alex', 'Doe', '2017-03-15', 'male', '550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440021', 'GW001'),
('550e8400-e29b-41d4-a716-446655440041', 'Emma', 'Smith', '2016-07-22', 'female', '550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440022', 'GW002'),
('550e8400-e29b-41d4-a716-446655440042', 'Michael', 'Johnson', '2015-11-08', 'male', '550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440023', 'SP001');

-- Insert subjects
INSERT INTO subjects (id, name, code, school_id) VALUES
('550e8400-e29b-41d4-a716-446655440050', 'Mathematics', 'MATH', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440051', 'English', 'ENG', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440052', 'Science', 'SCI', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440053', 'Kiswahili', 'KIS', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440054', 'Mathematics', 'MATH', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440055', 'English', 'ENG', '550e8400-e29b-41d4-a716-446655440002');

-- Insert sample grades
INSERT INTO grades (student_id, subject_id, class_id, term, academic_year, assessment_type, score, max_score, teacher_id) VALUES
('550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440030', 'term_1', '2024-2025', 'cat', 85.5, 100.0, '550e8400-e29b-41d4-a716-446655440016'),
('550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440030', 'term_1', '2024-2025', 'cat', 78.0, 100.0, '550e8400-e29b-41d4-a716-446655440016'),
('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440031', 'term_1', '2024-2025', 'cat', 92.0, 100.0, '550e8400-e29b-41d4-a716-446655440017'),
('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440031', 'term_1', '2024-2025', 'cat', 88.5, 100.0, '550e8400-e29b-41d4-a716-446655440017');

-- Insert system logs
INSERT INTO system_logs (user_id, action, entity_type, entity_id, details) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'login', 'user', '550e8400-e29b-41d4-a716-446655440010', '{"ip_address": "192.168.1.1", "user_agent": "Mozilla/5.0"}'),
('550e8400-e29b-41d4-a716-446655440011', 'school_created', 'school', '550e8400-e29b-41d4-a716-446655440001', '{"school_name": "Greenwood Academy"}'),
('550e8400-e29b-41d4-a716-446655440016', 'student_registered', 'student', '550e8400-e29b-41d4-a716-446655440040', '{"student_name": "Alex Doe", "admission_number": "GW001"}');
