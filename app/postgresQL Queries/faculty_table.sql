-- Create the Faculty table
CREATE TABLE faculty (
  unique_id BIGSERIAL PRIMARY KEY,
  
  -- Faculty Information
  faculty_first_name TEXT NOT NULL,
  faculty_last_name TEXT NOT NULL,
  faculty_department TEXT NOT NULL,
  faculty_email TEXT NOT NULL UNIQUE,      -- ensure unique
  admin_email TEXT NOT NULL,
  faculty_phone TEXT,
  faculty_gender TEXT,

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_hod BOOLEAN DEFAULT FALSE,            -- NEW FIELD

  -- Timestamps
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ,

  -- Constraints
  CONSTRAINT faculty_email_format CHECK (faculty_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT admin_email_format CHECK (admin_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT faculty_phone_format CHECK (faculty_phone IS NULL OR faculty_phone ~* '^\+?[0-9]{10,15}$'),
  CONSTRAINT valid_faculty_gender CHECK (faculty_gender IS NULL OR faculty_gender IN ('Male', 'Female', 'Other', 'Prefer not to say'))
);

-- Create indexes for faster lookups
CREATE INDEX idx_faculty_email ON faculty(faculty_email);
CREATE INDEX idx_faculty_admin_email ON faculty(admin_email);
CREATE INDEX idx_faculty_department ON faculty(faculty_department);
CREATE INDEX idx_faculty_last_login ON faculty(last_login);
CREATE INDEX idx_faculty_is_active ON faculty(is_active);
CREATE INDEX idx_faculty_is_hod ON faculty(is_hod);

-- Auto update updated_date column
CREATE OR REPLACE FUNCTION update_faculty_updated_date_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_date = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_faculty_updated_date
  BEFORE UPDATE ON faculty
  FOR EACH ROW
  EXECUTE FUNCTION update_faculty_updated_date_column();

-- Enable Row Level Security
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations" ON faculty
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Sample insert data
INSERT INTO faculty (
  faculty_first_name,
  faculty_last_name,
  faculty_department,
  faculty_email,
  admin_email,
  faculty_phone,
  faculty_gender,
  is_active,
  is_hod,
  last_login
) VALUES
  (
    'Robert',
    'Johnson',
    'Computer Science',
    'robert.johnson@college.edu',
    'admin@irreflex.com',
    '+919876543220',
    'Male',
    TRUE,
    TRUE,
    NOW()
  ),
  (
    'Sarah',
    'Williams',
    'Electronics',
    'sarah.williams@college.edu',
    'admin@irreflex.com',
    '+919876543221',
    'Female',
    TRUE,
    FALSE,
    NOW() - INTERVAL '1 day'
  ),
  (
    'David',
    'Brown',
    'Mechanical Engineering',
    'david.brown@college.edu',
    'super.admin@irreflex.com',
    '+919876543222',
    'Male',
    FALSE,
    FALSE,
    NOW() - INTERVAL '3 days'
  );

-- Create view for faculty list
CREATE OR REPLACE VIEW faculty_list_view AS
SELECT 
  unique_id,
  faculty_first_name,
  faculty_last_name,
  faculty_department,
  faculty_email,
  admin_email,
  faculty_phone,
  faculty_gender,
  is_active,
  is_hod,
  created_date,
  updated_date,
  last_login
FROM faculty;
