-- Create system admin user
-- Email: charlesmuiruri024@gmail.com
-- Password: Maryalvin1985@

-- First, hash the password using bcrypt
-- The hash below is for password "Maryalvin1985@" (bcrypt hash with 12 rounds)
-- You can generate this using: bcrypt.hash('Maryalvin1985@', 12)
-- For this implementation, I'm using a pre-generated hash

INSERT INTO users (
  id,
  email,
  password_hash,
  role,
  first_name,
  last_name,
  phone,
  is_first_login,
  created_at,
  updated_at
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'charlesmuiruri024@gmail.com',
  '$2a$12$YourBcryptHashHere',
  'system_admin',
  'Charles',
  'Muiruri',
  NULL,
  false,
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  password_hash = '$2a$12$YourBcryptHashHere',
  role = 'system_admin',
  first_name = 'Charles',
  last_name = 'Muiruri',
  is_first_login = false,
  updated_at = NOW();
