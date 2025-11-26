export interface Department {
  department_id: number;
  department_name: string;
  establish_year: number | null;
  department_hod_id: number | null;
  admin_email: string;
  is_department_active: boolean;
  created_date: string;
  updated_date: string;
}

export interface DepartmentFormData {
  department_name: string;
  establish_year?: number | null;
  department_hod_id?: number | null;
  is_department_active?: boolean;
}
