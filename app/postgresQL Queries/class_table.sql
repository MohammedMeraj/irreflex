-- Create the class table
CREATE TABLE IF NOT EXISTS class (
  class_id BIGSERIAL PRIMARY KEY,
  
  -- Class Information
  class_name TEXT NOT NULL,
  department_id BIGINT REFERENCES department(department_id) ON DELETE CASCADE,
  admin_email TEXT NOT NULL,
  batch_year INTEGER NOT NULL,
  class_coordinator_id BIGINT UNIQUE REFERENCES faculty(unique_id) ON DELETE SET NULL,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT admin_email_format CHECK (admin_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_batch_year CHECK (batch_year >= 1900 AND batch_year <= 2100)
);

-- Create indexes for faster lookups
CREATE INDEX idx_class_name ON class(class_name);
CREATE INDEX idx_class_department_id ON class(department_id);
CREATE INDEX idx_class_admin_email ON class(admin_email);
CREATE INDEX idx_class_coordinator_id ON class(class_coordinator_id);
CREATE INDEX idx_class_is_active ON class(is_active);
CREATE INDEX idx_class_batch_year ON class(batch_year);

-- Create a function to automatically update the updated_date timestamp
CREATE OR REPLACE FUNCTION update_class_updated_date_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_date = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_date on any UPDATE
CREATE TRIGGER update_class_updated_date
  BEFORE UPDATE ON class
  FOR EACH ROW
  EXECUTE FUNCTION update_class_updated_date_column();

-- Enable Row Level Security
ALTER TABLE class ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (same as other tables)
CREATE POLICY "Allow all operations" ON class
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Sample insert data
INSERT INTO class (
  class_name,
  department_id,
  admin_email,
  batch_year,
  class_coordinator_id,
  is_active
) VALUES
  (
    'CSE - A',
    1,
    'mdmomin7517@gmail.com',
    2024,
    1,
    TRUE
  ),
  (
    'CSE - B',
    NULL,
    'mdmerere@gmail.com',
    2024,
    NULL,
    TRUE
  ),
  (
    'ECE - A',
    NULL,
    'mdmerere7517@gmail.com',
    2023,
    NULL,
    TRUE
  ),
  (
    'ME - A',
    NULL,
    'mdsdmerere@gmail.com',
    2024,
    NULL,
    FALSE
  );

-- Create view for class list
CREATE OR REPLACE VIEW class_list_view AS
SELECT 
  class_id,
  class_name,
  department_id,
  admin_email,
  batch_year,
  class_coordinator_id,
  is_active,
  created_date,
  updated_date
FROM class;
