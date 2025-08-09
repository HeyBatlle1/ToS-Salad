-- Disable RLS to bypass auth requirements for testing
ALTER TABLE confessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE recipients DISABLE ROW LEVEL SECURITY;
ALTER TABLE heartbeats DISABLE ROW LEVEL SECURITY;

-- Create test user directly in auth.users
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'test@legacy.app',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now()
);
