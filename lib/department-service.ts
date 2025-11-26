import { supabase } from './supabase';
import { Department, DepartmentFormData } from '@/types/department';
import { promoteToHOD } from './faculty-service';

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

  // If HOD is assigned, promote the faculty to HOD
  if (data.department_hod_id) {
    try {
      await promoteToHOD(data.department_hod_id, true);
      console.log(`Faculty ${data.department_hod_id} promoted to HOD`);
    } catch (hodError) {
      console.error('Error promoting faculty to HOD:', hodError);
      // Don't throw, department is created, just log the error
    }
  }

  return data;
}

// Update department
export async function updateDepartment(id: number, departmentData: Partial<DepartmentFormData>): Promise<Department> {
  // Get the current department to check if HOD changed
  const { data: currentDept, error: fetchError } = await supabase
    .from('department')
    .select('department_hod_id')
    .eq('department_id', id)
    .single();

  if (fetchError) throw fetchError;

  const oldHODId = currentDept?.department_hod_id;
  const newHODId = departmentData.department_hod_id;

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

  // Handle HOD changes
  if (oldHODId !== newHODId) {
    // If old HOD exists and is being removed/changed, demote them
    if (oldHODId) {
      try {
        await promoteToHOD(oldHODId, false);
        console.log(`Faculty ${oldHODId} demoted from HOD`);
      } catch (hodError) {
        console.error('Error demoting old HOD:', hodError);
      }
    }

    // If new HOD is assigned, promote them
    if (newHODId) {
      try {
        await promoteToHOD(newHODId, true);
        console.log(`Faculty ${newHODId} promoted to HOD`);
      } catch (hodError) {
        console.error('Error promoting new HOD:', hodError);
      }
    }
  }

  return data;
}

// Delete department
export async function deleteDepartment(id: number): Promise<void> {
  // Get the department to check if it has an HOD
  const { data: dept, error: fetchError } = await supabase
    .from('department')
    .select('department_hod_id')
    .eq('department_id', id)
    .single();

  if (fetchError) throw fetchError;

  // If department has an HOD, demote them before deleting
  if (dept?.department_hod_id) {
    try {
      await promoteToHOD(dept.department_hod_id, false);
      console.log(`Faculty ${dept.department_hod_id} demoted from HOD before department deletion`);
    } catch (hodError) {
      console.error('Error demoting HOD before deletion:', hodError);
    }
  }

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

// Get department by HOD ID
export async function getDepartmentByHODId(hodId: number): Promise<Department | null> {
  const { data, error } = await supabase
    .from('department')
    .select('*')
    .eq('department_hod_id', hodId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// Remove HOD from department and deactivate it
export async function removeHODAndDeactivateDepartment(hodId: number): Promise<void> {
  const { error } = await supabase
    .from('department')
    .update({ 
      department_hod_id: null,
      is_department_active: false
    })
    .eq('department_hod_id', hodId);

  if (error) throw error;
}
