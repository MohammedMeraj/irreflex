-- Create the developer table
CREATE TABLE developer (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create index on email for faster lookups
CREATE INDEX idx_developer_email ON developer(email);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at on any UPDATE
CREATE TRIGGER update_developer_updated_at
  BEFORE UPDATE ON developer
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE developer ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for testing only)
-- WARNING: This allows unrestricted access - use only for testing!
-- In production, implement proper authentication-based policies
CREATE POLICY "Allow all operations" ON developer
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Optional: Insert sample developer data
-- Note: In production, passwords should be hashed using bcrypt or similar
INSERT INTO developer (email, password, image, last_login_at) VALUES
  ('john.doe@example.com', 'hashed_password_123', 'https://i.pravatar.cc/150?img=1', NOW()),
  ('jane.smith@example.com', 'hashed_password_456', 'https://i.pravatar.cc/150?img=2', NOW() - INTERVAL '2 days'),
  ('bob.johnson@example.com', 'hashed_password_789', 'https://i.pravatar.cc/150?img=3', NOW() - INTERVAL '5 days');
