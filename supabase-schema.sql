-- Supabase Database Schema for NovaQR Studio
-- 
-- IMPORTANT: This application uses the Supabase Service Role Key server-side only.
-- The service role key bypasses RLS, so all security checks are handled in server actions.
-- Never expose the service role key to the client!

-- Users table to track user limits
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  qr_count INTEGER DEFAULT 0 CHECK (qr_count >= 0),
  ai_suggestions_used INTEGER DEFAULT 0 CHECK (ai_suggestions_used >= 0)
);

-- QR Codes table to store user's QR codes
CREATE TABLE IF NOT EXISTS qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  settings JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_user_id ON qr_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_created_at ON qr_codes(created_at DESC);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = clerk_user_id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid()::text = clerk_user_id);

-- Policy: Users can only see their own QR codes
CREATE POLICY "Users can view own QR codes" ON qr_codes
  FOR SELECT USING (
    user_id IN (
      SELECT id FROM users WHERE clerk_user_id = auth.uid()::text
    )
  );

-- Policy: Users can insert their own QR codes
CREATE POLICY "Users can insert own QR codes" ON qr_codes
  FOR INSERT WITH CHECK (
    user_id IN (
      SELECT id FROM users WHERE clerk_user_id = auth.uid()::text
    )
  );

-- Policy: Users can update their own QR codes
CREATE POLICY "Users can update own QR codes" ON qr_codes
  FOR UPDATE USING (
    user_id IN (
      SELECT id FROM users WHERE clerk_user_id = auth.uid()::text
    )
  );

-- Policy: Users can delete their own QR codes
CREATE POLICY "Users can delete own QR codes" ON qr_codes
  FOR DELETE USING (
    user_id IN (
      SELECT id FROM users WHERE clerk_user_id = auth.uid()::text
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_qr_codes_updated_at
  BEFORE UPDATE ON qr_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

