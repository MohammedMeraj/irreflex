import { supabase } from './supabase';
import { Faculty, FacultyFormData } from '@/types/faculty';

// Get all faculty
export async function getAllFaculty(adminEmail?: string): Promise<Faculty[]> {
  let query = supabase
    .from('faculty')
    .select('*');
  
  // Filter by admin email if provided
  if (adminEmail) {
    query = query.eq('admin_email', adminEmail);
  }
  
  const { data, error } = await query.order('unique_id', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Get faculty by ID
export async function getFacultyById(id: number): Promise<Faculty> {
  const { data, error } = await supabase
    .from('faculty')
    .select('*')
    .eq('unique_id', id)
    .single();

  if (error) throw error;
  return data;
}

// Create new faculty
export async function createFaculty(facultyData: FacultyFormData, adminEmail: string): Promise<Faculty> {
  const cleanData: any = {
    ...facultyData,
    admin_email: adminEmail,
    faculty_phone: facultyData.faculty_phone || null,
    faculty_gender: facultyData.faculty_gender || null,
    // Faculty cannot be active if not assigned to a department
    is_active: (facultyData.faculty_department && facultyData.faculty_department !== 'No Department') ? true : false,
  };

  const { data, error } = await supabase
    .from('faculty')
    .insert([cleanData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update faculty
export async function updateFaculty(id: number, facultyData: Partial<FacultyFormData>): Promise<Faculty> {
  const updateData: any = { ...facultyData };
  
  // Clean up empty strings
  if (updateData.faculty_phone === '') updateData.faculty_phone = null;
  if (updateData.faculty_gender === '') updateData.faculty_gender = null;

  // If department is being changed to 'No Department' or empty, set is_active to false
  if (updateData.faculty_department === 'No Department' || !updateData.faculty_department) {
    updateData.is_active = false;
  }

  const { data, error } = await supabase
    .from('faculty')
    .update(updateData)
    .eq('unique_id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete faculty
export async function deleteFaculty(id: number): Promise<void> {
  // First, check if this faculty is HOD of any department and remove them
  const { data: departments, error: deptError } = await supabase
    .from('department')
    .select('*')
    .eq('department_hod_id', id);

  if (deptError) throw deptError;

  // If faculty is HOD of any department, remove them and deactivate those departments
  if (departments && departments.length > 0) {
    const { error: updateError } = await supabase
      .from('department')
      .update({
        department_hod_id: null,
        is_department_active: false
      })
      .eq('department_hod_id', id);

    if (updateError) throw updateError;
  }

  // Now delete the faculty
  const { error } = await supabase
    .from('faculty')
    .delete()
    .eq('unique_id', id);

  if (error) throw error;
}

// Toggle faculty active status
export async function toggleActiveStatus(id: number, isActive: boolean): Promise<Faculty> {
  // If trying to activate, check if faculty has a department assigned
  if (isActive) {
    const { data: faculty, error: fetchError } = await supabase
      .from('faculty')
      .select('faculty_department')
      .eq('unique_id', id)
      .single();

    if (fetchError) throw fetchError;
    
    // Prevent activation if faculty is not assigned to a department
    if (!faculty.faculty_department || faculty.faculty_department === 'No Department') {
      throw new Error('Faculty cannot be activated without being assigned to a department');
    }
  }

  const { data, error } = await supabase
    .from('faculty')
    .update({ is_active: isActive })
    .eq('unique_id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Promote to HOD
export async function promoteToHOD(id: number, isHOD: boolean): Promise<Faculty> {
  const { data, error } = await supabase
    .from('faculty')
    .update({ is_hod: isHOD })
    .eq('unique_id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Search faculty
export async function searchFaculty(searchTerm: string, adminEmail?: string): Promise<Faculty[]> {
  let query = supabase
    .from('faculty')
    .select('*')
    .or(`faculty_email.ilike.%${searchTerm}%,faculty_first_name.ilike.%${searchTerm}%,faculty_last_name.ilike.%${searchTerm}%,faculty_department.ilike.%${searchTerm}%`);
  
  // Filter by admin email if provided
  if (adminEmail) {
    query = query.eq('admin_email', adminEmail);
  }
  
  const { data, error } = await query.order('unique_id', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Get available HODs (faculty not assigned as HOD to any department)
export async function getAvailableHODs(adminEmail?: string): Promise<Faculty[]> {
  // First get all faculty who are active
  let query = supabase
    .from('faculty')
    .select('*')
    .eq('is_active', true);
  
  // Filter by admin email if provided
  if (adminEmail) {
    query = query.eq('admin_email', adminEmail);
  }
  
  const { data: allFaculty, error: facultyError } = await query.order('faculty_first_name', { ascending: true });

  if (facultyError) throw facultyError;

  // Get all departments with HODs assigned
  let deptQuery = supabase
    .from('department')
    .select('department_hod_id')
    .not('department_hod_id', 'is', null);
  
  // Filter departments by admin email if provided
  if (adminEmail) {
    deptQuery = deptQuery.eq('admin_email', adminEmail);
  }
  
  const { data: departments, error: deptError } = await deptQuery;

  if (deptError) throw deptError;

  // Extract HOD IDs that are already assigned
  const assignedHODIds = new Set(departments?.map(d => d.department_hod_id) || []);

  // Filter out faculty who are already assigned as HOD
  const availableFaculty = (allFaculty || []).filter(
    faculty => !assignedHODIds.has(faculty.unique_id)
  );

  return availableFaculty;
}

// Replace HOD with another faculty from the same department or disable department
export async function replaceHOD(
  currentHODId: number, 
  newHODId: number | null, 
  keepDepartmentActive: boolean = true,
  deactivateOldHOD: boolean = false
): Promise<void> {
  // Get current HOD details
  const { data: currentHOD, error: currentHODError } = await supabase
    .from('faculty')
    .select('*')
    .eq('unique_id', currentHODId)
    .single();

  if (currentHODError) throw currentHODError;

  // Get the department
  const { data: department, error: deptError } = await supabase
    .from('department')
    .select('*')
    .eq('department_hod_id', currentHODId)
    .single();

  if (deptError) throw deptError;

  if (keepDepartmentActive) {
    // Must have a new HOD to keep department active
    if (!newHODId) {
      throw new Error('New HOD must be selected to keep department active');
    }

    // Get new HOD details
    const { data: newHOD, error: newHODError } = await supabase
      .from('faculty')
      .select('*')
      .eq('unique_id', newHODId)
      .single();

    if (newHODError) throw newHODError;

    // Verify both faculty are from the same department
    if (currentHOD.faculty_department !== newHOD.faculty_department) {
      throw new Error('New HOD must be from the same department as the current HOD');
    }

    // Verify new HOD is active
    if (!newHOD.is_active) {
      throw new Error('New HOD must be an active faculty member');
    }

    // Update department with new HOD (keep active)
    const { error: updateDeptError } = await supabase
      .from('department')
      .update({ 
        department_hod_id: newHODId,
        is_active: true 
      })
      .eq('department_id', department.department_id);

    if (updateDeptError) throw updateDeptError;

    // Promote new HOD
    const { error: promoteError } = await supabase
      .from('faculty')
      .update({ is_hod: true })
      .eq('unique_id', newHODId);

    if (promoteError) throw promoteError;
  } else {
    // Disable department (no new HOD)
    const { error: updateDeptError } = await supabase
      .from('department')
      .update({ 
        department_hod_id: null,
        is_active: false 
      })
      .eq('department_id', department.department_id);

    if (updateDeptError) throw updateDeptError;
  }

  // Demote current HOD (and optionally deactivate)
  const { error: demoteError } = await supabase
    .from('faculty')
    .update({ 
      is_hod: false, 
      is_active: deactivateOldHOD ? false : currentHOD.is_active 
    })
    .eq('unique_id', currentHODId);

  if (demoteError) throw demoteError;
}
