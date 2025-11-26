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
  // If assigning a HOD, check if they're already HOD (faculty.is_hod = true)
  if (departmentData.department_hod_id) {
    const { data: faculty, error: facultyError } = await supabase
      .from('faculty')
      .select('is_hod, faculty_first_name, faculty_last_name')
      .eq('unique_id', departmentData.department_hod_id)
      .single();

    if (facultyError) throw facultyError;

    if (faculty?.is_hod) {
      // Check which department they're HOD of
      const { data: existingDept } = await supabase
        .from('department')
        .select('department_name')
        .eq('department_hod_id', departmentData.department_hod_id)
        .single();

      throw new Error(`${faculty.faculty_first_name} ${faculty.faculty_last_name} is already HOD of "${existingDept?.department_name || 'another department'}". A faculty member can only be HOD of one department.`);
    }
  }

  const cleanData: any = {
    ...departmentData,
    admin_email: adminEmail,
    establish_year: departmentData.establish_year || null,
    department_hod_id: departmentData.department_hod_id || null,
    is_department_active: departmentData.is_department_active ?? true,
  };

  console.log('Creating department with data:', cleanData);

  // Create department and update faculty in a transaction-like manner
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

  // If HOD is assigned, update faculty.is_hod = true
  if (data.department_hod_id) {
    const { error: hodError } = await supabase
      .from('faculty')
      .update({ is_hod: true })
      .eq('unique_id', data.department_hod_id);

    if (hodError) {
      console.error('Error promoting faculty to HOD:', hodError);
      // Rollback: delete the department if faculty update fails
      await supabase.from('department').delete().eq('department_id', data.department_id);
      throw new Error('Failed to assign HOD. Department creation rolled back.');
    }
    console.log(`Faculty ${data.department_hod_id} promoted to HOD in faculty table`);
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

  // If assigning a new HOD, check if they're already HOD (faculty.is_hod = true)
  if (newHODId && newHODId !== oldHODId) {
    const { data: faculty, error: facultyError } = await supabase
      .from('faculty')
      .select('is_hod, faculty_first_name, faculty_last_name')
      .eq('unique_id', newHODId)
      .single();

    if (facultyError) throw facultyError;

    if (faculty?.is_hod) {
      // Check which department they're HOD of
      const { data: existingDept } = await supabase
        .from('department')
        .select('department_name')
        .eq('department_hod_id', newHODId)
        .neq('department_id', id)
        .single();

      throw new Error(`${faculty.faculty_first_name} ${faculty.faculty_last_name} is already HOD of "${existingDept?.department_name || 'another department'}". A faculty member can only be HOD of one department.`);
    }
  }

  const updateData: any = { ...departmentData };
  
  // Clean up empty strings
  if (updateData.establish_year === '') updateData.establish_year = null;
  if (updateData.department_hod_id === '') updateData.department_hod_id = null;

  // Update department table
  const { data, error } = await supabase
    .from('department')
    .update(updateData)
    .eq('department_id', id)
    .select()
    .single();

  if (error) throw error;

  // Handle HOD changes - update faculty table
  if (oldHODId !== newHODId) {
    // If old HOD exists and is being removed/changed, set is_hod = false
    if (oldHODId) {
      const { error: demoteError } = await supabase
        .from('faculty')
        .update({ is_hod: false })
        .eq('unique_id', oldHODId);

      if (demoteError) {
        console.error('Error demoting old HOD in faculty table:', demoteError);
      } else {
        console.log(`Faculty ${oldHODId} demoted from HOD (is_hod = false)`);
      }
    }

    // If new HOD is assigned, set is_hod = true
    if (newHODId) {
      const { error: promoteError } = await supabase
        .from('faculty')
        .update({ is_hod: true })
        .eq('unique_id', newHODId);

      if (promoteError) {
        console.error('Error promoting new HOD in faculty table:', promoteError);
        // Rollback: revert department changes
        await supabase
          .from('department')
          .update({ department_hod_id: oldHODId })
          .eq('department_id', id);
        throw new Error('Failed to assign HOD. Changes rolled back.');
      } else {
        console.log(`Faculty ${newHODId} promoted to HOD (is_hod = true)`);
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

  // If department has an HOD, set is_hod = false in faculty table before deleting
  if (dept?.department_hod_id) {
    const { error: demoteError } = await supabase
      .from('faculty')
      .update({ is_hod: false })
      .eq('unique_id', dept.department_hod_id);

    if (demoteError) {
      console.error('Error demoting HOD before deletion:', demoteError);
    } else {
      console.log(`Faculty ${dept.department_hod_id} demoted from HOD (is_hod = false) before department deletion`);
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
  // Update department: remove HOD and deactivate
  const { error: deptError } = await supabase
    .from('department')
    .update({ 
      department_hod_id: null,
      is_department_active: false
    })
    .eq('department_hod_id', hodId);

  if (deptError) throw deptError;

  // Update faculty: set is_hod = false
  const { error: facultyError } = await supabase
    .from('faculty')
    .update({ is_hod: false })
    .eq('unique_id', hodId);

  if (facultyError) {
    console.error('Error updating faculty is_hod status:', facultyError);
  } else {
    console.log(`Faculty ${hodId} is_hod set to false in faculty table`);
  }
}
