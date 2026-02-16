export interface Faculty {
  unique_id: number;
  faculty_first_name: string;
  faculty_last_name: string;
  faculty_department: string;
  faculty_email: string;
  admin_email: string;
  faculty_phone?: string;
  faculty_gender?: string;
  faculty_qualification?: string;
  is_active: boolean;
  is_hod: boolean;
  created_date: string;
  updated_date: string;
  last_login?: string;
  created_at?: string;
}

export interface FacultyFormData {
  faculty_first_name: string;
  faculty_last_name: string;
  faculty_department: string;
  faculty_email: string;
  faculty_phone?: string;
  faculty_gender?: string;
  faculty_qualification?: string;
  is_active?: boolean;
  is_hod?: boolean;
  admin_email?: string;
}
