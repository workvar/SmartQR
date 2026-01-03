-- Migration: Add Dynamic QR Codes Support
-- This migration adds support for dynamic QR codes with unique identifiers

-- Dynamic QR Codes table
CREATE TABLE IF NOT EXISTS dynamic_qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_code_id UUID NOT NULL REFERENCES qr_codes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  unique_id TEXT UNIQUE NOT NULL, -- Unique identifier for the scan URL
  destination_url TEXT NOT NULL, -- The URL to redirect to
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL, -- Expiry date (15 days for free tier)
  deleted_at TIMESTAMPTZ NULL -- Soft delete
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_dynamic_qr_codes_unique_id ON dynamic_qr_codes(unique_id);
CREATE INDEX IF NOT EXISTS idx_dynamic_qr_codes_user_id ON dynamic_qr_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_dynamic_qr_codes_qr_code_id ON dynamic_qr_codes(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_dynamic_qr_codes_expires_at ON dynamic_qr_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_dynamic_qr_codes_deleted_at ON dynamic_qr_codes(deleted_at) WHERE deleted_at IS NULL;

-- Row Level Security (RLS) Policies
ALTER TABLE dynamic_qr_codes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own dynamic QR codes
CREATE POLICY "Users can view own dynamic QR codes" ON dynamic_qr_codes
  FOR SELECT USING (
    user_id IN (
      SELECT id FROM users WHERE clerk_user_id = auth.uid()::text
    )
  );

-- Policy: Users can insert their own dynamic QR codes
CREATE POLICY "Users can insert own dynamic QR codes" ON dynamic_qr_codes
  FOR INSERT WITH CHECK (
    user_id IN (
      SELECT id FROM users WHERE clerk_user_id = auth.uid()::text
    )
  );

-- Policy: Users can update their own dynamic QR codes
CREATE POLICY "Users can update own dynamic QR codes" ON dynamic_qr_codes
  FOR UPDATE USING (
    user_id IN (
      SELECT id FROM users WHERE clerk_user_id = auth.uid()::text
    )
  );

-- Policy: Users can delete their own dynamic QR codes
CREATE POLICY "Users can delete own dynamic QR codes" ON dynamic_qr_codes
  FOR DELETE USING (
    user_id IN (
      SELECT id FROM users WHERE clerk_user_id = auth.uid()::text
    )
  );

-- Policy: Allow public read access for scanning (no auth required)
-- This allows the scan route to look up dynamic QR codes without authentication
CREATE POLICY "Public can view active dynamic QR codes for scanning" ON dynamic_qr_codes
  FOR SELECT USING (
    deleted_at IS NULL AND
    expires_at > NOW()
  );

-- Trigger to automatically update updated_at
CREATE TRIGGER update_dynamic_qr_codes_updated_at
  BEFORE UPDATE ON dynamic_qr_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

