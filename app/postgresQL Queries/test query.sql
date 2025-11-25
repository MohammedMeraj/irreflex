-- Create the test table
CREATE TABLE test (
  id BIGSERIAL PRIMARY KEY,
  firstname TEXT NOT NULL,
  middlename TEXT,
  lastname TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age > 0 AND age < 150),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE test ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for testing only)
-- WARNING: This allows unrestricted access - use only for testing!
CREATE POLICY "Allow all operations" ON test
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Optional: Insert some sample data
INSERT INTO test (firstname, middlename, lastname, age) VALUES
  ('John', 'Michael', 'Doe', 25),
  ('Jane', 'Elizabeth', 'Smith', 30),
  ('Bob', 'James', 'Johnson', 35);
