import { supabase } from './supabase';
import { Faculty, FacultyFormData } from '@/types/faculty';

// Get all faculty
export async function getAllFaculty(): Promise<Faculty[]> {
  const { data, error } = await supabase
    .from('faculty')
    .select('*')
    .order('unique_id', { ascending: false });

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
export async function searchFaculty(searchTerm: string): Promise<Faculty[]> {
  const { data, error } = await supabase
    .from('faculty')
    .select('*')
    .or(`faculty_email.ilike.%${searchTerm}%,faculty_first_name.ilike.%${searchTerm}%,faculty_last_name.ilike.%${searchTerm}%,faculty_department.ilike.%${searchTerm}%`)
    .order('unique_id', { ascending: false });

  if (error) throw error;
  return data || [];
}
