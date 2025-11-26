import { supabase } from './supabase';
import { Department, DepartmentFormData } from '@/types/department';

// Get all departments
export async function getAllDepartments(): Promise<Department[]> {
  console.log('Fetching departments from Supabase...');
  const { data, error } = await supabase
    .from('department')
    .select('*')
    .order('department_id', { ascending: false });

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }
  console.log('Departments fetched:', data);
  return data || [];
}

// Get department by ID
export async function getDepartmentById(id: number): Promise<Department> {
  const { data, error } = await supabase
    .from('department')
    .select('*')
    .eq('department_id', id)
    .single();

  if (error) throw error;
  return data;
}

// Create new department
export async function createDepartment(departmentData: DepartmentFormData, adminEmail: string): Promise<Department> {
  const cleanData: any = {
    ...departmentData,
    admin_email: adminEmail,
    establish_year: departmentData.establish_year || null,
    department_hod_id: departmentData.department_hod_id || null,
    is_department_active: departmentData.is_department_active ?? true,
  };

  console.log('Creating department with data:', cleanData);

  const { data, error } = await supabase
    .from('department')
    .insert([cleanData])
    .select()
    .single();

  if (error) {
    console.error('Supabase create error:', error);
    throw error;
  }
  console.log('Department created:', data);
  return data;
}

// Update department
export async function updateDepartment(id: number, departmentData: Partial<DepartmentFormData>): Promise<Department> {
  const updateData: any = { ...departmentData };
  
  // Clean up empty strings
  if (updateData.establish_year === '') updateData.establish_year = null;
  if (updateData.department_hod_id === '') updateData.department_hod_id = null;

  const { data, error } = await supabase
    .from('department')
    .update(updateData)
    .eq('department_id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete department
export async function deleteDepartment(id: number): Promise<void> {
  const { error } = await supabase
    .from('department')
    .delete()
    .eq('department_id', id);

  if (error) throw error;
}

// Toggle department active status
export async function toggleDepartmentActiveStatus(id: number, isActive: boolean): Promise<Department> {
  const { data, error } = await supabase
    .from('department')
    .update({ is_department_active: isActive })
    .eq('department_id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Search departments
export async function searchDepartments(searchTerm: string): Promise<Department[]> {
  const { data, error } = await supabase
    .from('department')
    .select('*')
    .or(`department_name.ilike.%${searchTerm}%,admin_email.ilike.%${searchTerm}%`)
    .order('department_id', { ascending: false });

  if (error) throw error;
  return data || [];
}
