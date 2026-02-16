// Class type definition
export interface Class {
  class_id: number;
  class_name: string;
  department_id: number | null;
  admin_email: string;
  batch_year: number;
  class_coordinator_id: number | null;
  is_active: boolean;
  created_date: string;
  updated_date: string;
}

// Class form data (for create/update operations)
export interface ClassFormData {
  class_name: string;
  department_id: number | null;
  batch_year: number;
  class_coordinator_id: number | null;
  is_active: boolean;
}
