import { supabase } from './supabase';
import { Subject, SubjectFormData } from '@/types/subject';

// Get all subjects
export async function getAllSubjects(adminEmail?: string): Promise<Subject[]> {
  let query = supabase
    .from('subject')
    .select('*');
  
  // Filter by admin email if provided
  if (adminEmail) {
    query = query.eq('admin_email', adminEmail);
  }
  
  const { data, error } = await query.order('unique_subject_id', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Get subject by ID
export async function getSubjectById(id: number): Promise<Subject> {
  const { data, error } = await supabase
    .from('subject')
    .select('*')
    .eq('unique_subject_id', id)
    .single();

  if (error) throw error;
  return data;
}

// Get subjects by department
export async function getSubjectsByDepartment(departmentId: number): Promise<Subject[]> {
  const { data, error } = await supabase
    .from('subject')
    .select('*')
    .eq('department_id', departmentId)
    .order('subject_name', { ascending: true });

  if (error) throw error;
  return data || [];
}

// Create new subject
export async function createSubject(subjectData: SubjectFormData, adminEmail: string): Promise<Subject> {
  const cleanData: any = {
    ...subjectData,
    admin_email: adminEmail,
    department_id: subjectData.department_id || null,
  };

  const { data, error } = await supabase
    .from('subject')
    .insert([cleanData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update subject
export async function updateSubject(id: number, subjectData: Partial<SubjectFormData>): Promise<Subject> {
  const updateData: any = { ...subjectData };
  
  // Clean up empty strings
  if (updateData.department_id === '') updateData.department_id = null;

  const { data, error } = await supabase
    .from('subject')
    .update(updateData)
    .eq('unique_subject_id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete subject
export async function deleteSubject(id: number): Promise<void> {
  const { error } = await supabase
    .from('subject')
    .delete()
    .eq('unique_subject_id', id);

  if (error) throw error;
}

// Search subjects
export async function searchSubjects(searchTerm: string, adminEmail?: string): Promise<Subject[]> {
  let query = supabase
    .from('subject')
    .select('*')
    .ilike('subject_name', `%${searchTerm}%`);
  
  // Filter by admin email if provided
  if (adminEmail) {
    query = query.eq('admin_email', adminEmail);
  }
  
  const { data, error } = await query.order('unique_subject_id', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Bulk assign subjects to department
export async function bulkAssignSubjectsToDepartment(subjectIds: number[], departmentId: number | null): Promise<void> {
  const { error } = await supabase
    .from('subject')
    .update({ department_id: departmentId })
    .in('unique_subject_id', subjectIds);

  if (error) throw error;
}
