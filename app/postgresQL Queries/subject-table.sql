-- Create the subject table
CREATE TABLE subject (
  unique_subject_id BIGSERIAL PRIMARY KEY,
  
  -- Subject Information
  subject_name TEXT NOT NULL,
  admin_email TEXT NOT NULL,
  department_id BIGINT REFERENCES department(department_id) ON DELETE SET NULL,
  credits INTEGER NOT NULL,
  
  -- Timestamps
  created_date TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT admin_email_format CHECK (admin_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_credits CHECK (credits >= 1 AND credits <= 8)
);

-- Create indexes for faster lookups
CREATE INDEX idx_subject_name ON subject(subject_name);
CREATE INDEX idx_subject_admin_email ON subject(admin_email);
CREATE INDEX idx_subject_department_id ON subject(department_id);
CREATE INDEX idx_subject_credits ON subject(credits);

-- Enable Row Level Security
ALTER TABLE subject ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (same as other tables)
CREATE POLICY "Allow all operations" ON subject
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Sample insert data
INSERT INTO subject (
  subject_name,
  admin_email,
  department_id,
  credits
) VALUES
  (
    'Data Structures and Algorithms',
    'admin@irreflex.com',
    1,
    4
  ),
  (
    'Database Management Systems',
    'admin@irreflex.com',
    1,
    4
  ),
  (
    'Digital Electronics',
    'admin@irreflex.com',
    2,
    3
  ),
  (
    'Thermodynamics',
    'super.admin@irreflex.com',
    3,
    4
  );

-- Create view for subject list
CREATE OR REPLACE VIEW subject_list_view AS
SELECT 
  unique_subject_id,
  subject_name,
  admin_email,
  department_id,
  credits,
  created_date
FROM subject;
