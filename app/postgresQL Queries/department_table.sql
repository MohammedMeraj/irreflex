-- Create department table
CREATE TABLE IF NOT EXISTS department (
    department_id BIGSERIAL PRIMARY KEY,
    department_name VARCHAR(255) NOT NULL,
    establish_year INTEGER,
    department_hod_id INTEGER UNIQUE,
    admin_email VARCHAR(255) NOT NULL,
    is_department_active BOOLEAN DEFAULT true,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_department_name ON department(department_name);
CREATE INDEX IF NOT EXISTS idx_department_hod_id ON department(department_hod_id);
CREATE INDEX IF NOT EXISTS idx_admin_email ON department(admin_email);
CREATE INDEX IF NOT EXISTS idx_is_department_active ON department(is_department_active);

-- Create trigger to auto-update updated_date
CREATE OR REPLACE FUNCTION update_department_updated_date()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_date = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER department_updated_date_trigger
    BEFORE UPDATE ON department
    FOR EACH ROW
    EXECUTE FUNCTION update_department_updated_date();

-- Enable Row Level Security
ALTER TABLE department ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (same as other tables)
CREATE POLICY "Allow all operations" ON department
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Sample data (optional - remove if not needed)
INSERT INTO department (department_name, establish_year, department_hod_id, admin_email, is_department_active)
VALUES 
    ('Computer Science', 2010, 1, 'mdmomin7517@gmail.com', true),
    ('Electronics', 2012, 2, 'mdmomin7517@gmail.com', true),
    ('Mechanical Engineering', 2008, 3, 'mdmomin7517@gmail.com', true)
ON CONFLICT DO NOTHING;
