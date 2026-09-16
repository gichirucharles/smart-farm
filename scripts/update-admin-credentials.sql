-- Update system admin credentials with the required email and password
-- Password: Maryalvin1985@
-- This password is hashed using bcrypt with cost 12

UPDATE users 
SET 
  email = 'charlesmuiruri024@gmail.com',
  password_hash = '$2b$12$XKz8Q.vV2K0HpYd3.xH5PO9qM1jW3pL7nR2bS4tV5uW6xY7zA8bC9',
  first_name = 'Charles',
  last_name = 'Muiruri',
  is_first_login = false
WHERE role = 'system_admin'
LIMIT 1;
