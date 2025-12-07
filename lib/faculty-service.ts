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
