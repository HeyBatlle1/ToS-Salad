-- Legacy app schema - 3 tables only
CREATE TABLE confessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  encrypted_content text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  confession_id uuid REFERENCES confessions,
  email text,
  decrypt_key text
);

CREATE TABLE heartbeats (
  user_id uuid PRIMARY KEY REFERENCES auth.users,
  last_seen timestamptz,
  trigger_after interval
);

-- Enable RLS
ALTER TABLE confessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE heartbeats ENABLE ROW LEVEL SECURITY;

-- Basic policies
CREATE POLICY "Users can manage their own confessions" ON confessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage recipients for their confessions" ON recipients
  FOR ALL USING (confession_id IN (SELECT id FROM confessions WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own heartbeat" ON heartbeats
  FOR ALL USING (auth.uid() = user_id);
