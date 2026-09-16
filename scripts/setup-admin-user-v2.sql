-- This script creates or updates the system admin user
-- Email: charlesmuiruri024@gmail.com
-- Password: Maryalvin1985@ 
-- Bcrypt hash generated with 12 rounds

DELETE FROM users WHERE email = 'charlesmuiruri024@gmail.com';

INSERT INTO users (
  id,
  email,
  password_hash,
  role,
  first_name,
  last_name,
  phone,
  school_id,
  is_first_login,
  created_at,
  updated_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440010',
  'charlesmuiruri024@gmail.com',
  '$2b$12$MN9.me8qmL.Fst7oimC/mtQdqSHhKQmBs7NSmVKL1.1Gw4BF/lxiC',
  'system_admin',
  'Charles',
  'Muiruri',
  NULL,
  NULL,
  false,
  NOW(),
  NOW()
);
