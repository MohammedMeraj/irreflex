export interface Subject {
  unique_subject_id: number;
  subject_name: string;
  admin_email: string;
  department_id: number | null;
  credits: number;
  created_date: string;
}

export interface SubjectFormData {
  subject_name: string;
  department_id: number | null;
  credits: number;
}
