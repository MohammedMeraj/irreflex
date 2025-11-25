-- Create the admin table
CREATE TABLE admin (
  admin_id BIGSERIAL PRIMARY KEY,
  
  -- Authentication & Contact
  email TEXT NOT NULL UNIQUE,
  phone_number TEXT,
  password TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  
  -- Role & Permissions
  role TEXT NOT NULL DEFAULT 'admin',
  access_level INTEGER NOT NULL DEFAULT 1,
  
  -- Personal Information
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  gender TEXT,
  date_of_birth DATE,
  
  -- Organization
  campus_id BIGINT,
  department_id BIGINT,
  college_name TEXT,
  college_address TEXT,
  
  -- Profile
  profile_image_url TEXT,
  
  -- Address
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  country TEXT DEFAULT 'India',
  
  -- Verification Status
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  
  -- Two-Factor Authentication
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  password_changed_at TIMESTAMPTZ,
  
  -- Security
  failed_login_attempts INTEGER DEFAULT 0,
  is_locked BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  last_ip_address TEXT,
  login_device_info JSONB,
  
  -- Additional Info
  notes TEXT,
  
  -- Constraints
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT phone_format CHECK (phone_number IS NULL OR phone_number ~* '^\+?[0-9]{10,15}$'),
  CONSTRAINT valid_gender CHECK (gender IS NULL OR gender IN ('Male', 'Female', 'Other', 'Prefer not to say')),
  CONSTRAINT valid_access_level CHECK (access_level >= 1 AND access_level <= 10),
  CONSTRAINT valid_failed_attempts CHECK (failed_login_attempts >= 0)
);

-- Create indexes for faster lookups
CREATE INDEX idx_admin_email ON admin(email);
CREATE INDEX idx_admin_phone ON admin(phone_number) WHERE phone_number IS NOT NULL;
CREATE INDEX idx_admin_campus ON admin(campus_id) WHERE campus_id IS NOT NULL;
CREATE INDEX idx_admin_department ON admin(department_id) WHERE department_id IS NOT NULL;
CREATE INDEX idx_admin_role ON admin(role);
CREATE INDEX idx_admin_is_active ON admin(is_active);
CREATE INDEX idx_admin_last_login ON admin(last_login_at);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at on any UPDATE
CREATE TRIGGER update_admin_updated_at
  BEFORE UPDATE ON admin
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_updated_at_column();

-- Create a function to reset failed login attempts after successful login
CREATE OR REPLACE FUNCTION reset_failed_login_attempts()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.last_login_at > OLD.last_login_at OR (OLD.last_login_at IS NULL AND NEW.last_login_at IS NOT NULL) THEN
    NEW.failed_login_attempts = 0;
    NEW.is_locked = FALSE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to reset failed attempts on successful login
CREATE TRIGGER reset_admin_failed_attempts
  BEFORE UPDATE OF last_login_at ON admin
  FOR EACH ROW
  EXECUTE FUNCTION reset_failed_login_attempts();

-- Enable Row Level Security
ALTER TABLE admin ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for testing only)
-- WARNING: This allows unrestricted access - use only for testing!
-- In production, implement proper authentication-based policies
CREATE POLICY "Allow all operations" ON admin
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Optional: Insert sample admin data
-- Note: In production, use proper password hashing (bcrypt, argon2, etc.)
INSERT INTO admin (
  email, 
  phone_number,
  password,
  password_hash, 
  role, 
  access_level, 
  first_name, 
  middle_name, 
  last_name, 
  gender, 
  date_of_birth,
  profile_image_url,
  address_line1,
  city,
  state,
  pincode,
  country,
  email_verified,
  phone_verified,
  two_factor_enabled,
  is_active,
  last_login_at,
  password_changed_at
) VALUES
  (
    'super.admin@irreflex.com',
    '+919876543210',
    'SuperAdmin@123',
    '$2b$10$examplehashedpassword123456789012',
    'super_admin',
    10,
    'Super',
    'Admin',
    'User',
    'Male',
    '1990-01-15',
    'https://i.pravatar.cc/150?img=10',
    '123 Admin Street',
    'Mumbai',
    'Maharashtra',
    '400001',
    'India',
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
  ),
  (
    'admin@irreflex.com',
    '+919876543211',
    'Admin@123',
    '$2b$10$examplehashedpassword123456789013',
    'admin',
    5,
    'John',
    'Michael',
    'Doe',
    'Male',
    '1992-05-20',
    'https://i.pravatar.cc/150?img=11',
    '456 Admin Avenue',
    'Delhi',
    'Delhi',
    '110001',
    'India',
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '30 days'
  ),
  (
    'manager@irreflex.com',
    '+919876543212',
    'Manager@123',
    '$2b$10$examplehashedpassword123456789014',
    'manager',
    3,
    'Jane',
    'Elizabeth',
    'Smith',
    'Female',
    '1995-08-10',
    'https://i.pravatar.cc/150?img=12',
    '789 Manager Road',
    'Bangalore',
    'Karnataka',
    '560001',
    'India',
    TRUE,
    FALSE,
    FALSE,
    TRUE,
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '60 days'
  );

-- Create view for admin list without sensitive data
CREATE OR REPLACE VIEW admin_list_view AS
SELECT 
  admin_id,
  email,
  phone_number,
  role,
  access_level,
  first_name,
  middle_name,
  last_name,
  gender,
  profile_image_url,
  campus_id,
  department_id,
  college_name,
  college_address,
  email_verified,
  phone_verified,
  two_factor_enabled,
  created_at,
  updated_at,
  last_login_at,
  is_active,
  is_locked
FROM admin;
