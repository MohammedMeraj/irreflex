import { supabase } from './supabase';
import { Class, ClassFormData } from '@/types/class';

// Get all classes
export async function getAllClasses(adminEmail?: string): Promise<Class[]> {
  let query = supabase
    .from('class')
    .select('*');
  
  // Filter by admin email if provided
  if (adminEmail) {
    query = query.eq('admin_email', adminEmail);
  }
  
  const { data, error } = await query.order('class_id', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Search classes
export async function searchClasses(searchTerm: string, adminEmail?: string): Promise<Class[]> {
  let query = supabase
    .from('class')
    .select('*')
    .or(`class_name.ilike.%${searchTerm}%,batch_year.eq.${parseInt(searchTerm) || 0}`);
  
  // Filter by admin email if provided
  if (adminEmail) {
    query = query.eq('admin_email', adminEmail);
  }
  
  const { data, error } = await query.order('class_id', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Create a new class
export async function createClass(classData: ClassFormData, adminEmail: string): Promise<Class> {
  const { data, error } = await supabase
    .from('class')
    .insert([
      {
        ...classData,
        admin_email: adminEmail,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update a class
export async function updateClass(classId: number, classData: ClassFormData): Promise<Class> {
  // If assigning a class coordinator, update faculty table
  if (classData.class_coordinator_id) {
    // Check if this faculty is already a coordinator for another class
    const { data: existingClass } = await supabase
      .from('class')
      .select('class_id')
      .eq('class_coordinator_id', classData.class_coordinator_id)
      .neq('class_id', classId)
      .single();

    if (existingClass) {
      throw new Error('This faculty member is already a class coordinator for another class');
    }
  }

  const { data, error } = await supabase
    .from('class')
    .update(classData)
    .eq('class_id', classId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete a class
export async function deleteClass(classId: number): Promise<void> {
  const { error } = await supabase
    .from('class')
    .delete()
    .eq('class_id', classId);

  if (error) throw error;
}

// Toggle class active status
export async function toggleClassActiveStatus(classId: number, isActive: boolean): Promise<Class> {
  const { data, error } = await supabase
    .from('class')
    .update({ is_active: isActive })
    .eq('class_id', classId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Get available class coordinators (faculty not assigned as coordinators)
export async function getAvailableClassCoordinators(adminEmail?: string): Promise<any[]> {
  // First get all active faculty
  let facultyQuery = supabase
    .from('faculty')
    .select('*')
    .eq('is_active', true);
  
  // Filter by admin email if provided
  if (adminEmail) {
    facultyQuery = facultyQuery.eq('admin_email', adminEmail);
  }
  
  const { data: allFaculty, error: facultyError } = await facultyQuery.order('faculty_first_name', { ascending: true });

  if (facultyError) throw facultyError;

  // Get all classes with coordinators assigned
  let classQuery = supabase
    .from('class')
    .select('class_coordinator_id')
    .not('class_coordinator_id', 'is', null);
  
  // Filter classes by admin email if provided
  if (adminEmail) {
    classQuery = classQuery.eq('admin_email', adminEmail);
  }
  
  const { data: classes, error: classError } = await classQuery;

  if (classError) throw classError;

  // Extract coordinator IDs that are already assigned
  const assignedCoordinatorIds = new Set(classes?.map(c => c.class_coordinator_id) || []);

  // Filter out faculty who are already assigned as coordinators
  const availableFaculty = (allFaculty || []).filter(
    faculty => !assignedCoordinatorIds.has(faculty.unique_id)
  );

  return availableFaculty;
}

// Get faculty by ID
export async function getFacultyById(facultyId: number): Promise<any> {
  const { data, error } = await supabase
    .from('faculty')
    .select('*')
    .eq('unique_id', facultyId)
    .single();

  if (error) throw error;
  return data;
}
