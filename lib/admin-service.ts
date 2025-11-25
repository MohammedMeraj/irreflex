import { supabase } from './supabase';
import { Admin, AdminFormData } from '@/types/admin';

export const adminService = {
  // Get all admins
  async getAllAdmins(): Promise<Admin[]> {
    const { data, error } = await supabase
      .from('admin')
      .select('*')
      .order('admin_id', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get admin by ID
  async getAdminById(id: number): Promise<Admin> {
    const { data, error } = await supabase
      .from('admin')
      .select('*')
      .eq('admin_id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new admin
  async createAdmin(adminData: AdminFormData): Promise<Admin> {
    // Clean up the data: convert empty strings to null for optional fields
    const cleanData: any = {
      ...adminData,
      password_hash: adminData.password || 'temp_password_hash', // In production, hash properly
      date_of_birth: adminData.date_of_birth || null,
      campus_id: adminData.campus_id || null,
      department_id: adminData.department_id || null,
      college_name: adminData.college_name || null,
      college_address: adminData.college_address || null,
      phone_number: adminData.phone_number || null,
      middle_name: adminData.middle_name || null,
      gender: adminData.gender || null,
      profile_image_url: adminData.profile_image_url || null,
      address_line1: adminData.address_line1 || null,
      address_line2: adminData.address_line2 || null,
      city: adminData.city || null,
      state: adminData.state || null,
      pincode: adminData.pincode || null,
      notes: adminData.notes || null,
    };

    const { data, error } = await supabase
      .from('admin')
      .insert([cleanData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update admin
  async updateAdmin(id: number, adminData: Partial<AdminFormData>): Promise<Admin> {
    const updateData: any = { ...adminData };
    
    // Clean up the data: convert empty strings to null for optional fields
    if (updateData.date_of_birth === '') updateData.date_of_birth = null;
    if (updateData.campus_id === '') updateData.campus_id = null;
    if (updateData.department_id === '') updateData.department_id = null;
    if (updateData.college_name === '') updateData.college_name = null;
    if (updateData.college_address === '') updateData.college_address = null;
    if (updateData.phone_number === '') updateData.phone_number = null;
    if (updateData.middle_name === '') updateData.middle_name = null;
    if (updateData.gender === '') updateData.gender = null;
    if (updateData.profile_image_url === '') updateData.profile_image_url = null;
    if (updateData.address_line1 === '') updateData.address_line1 = null;
    if (updateData.address_line2 === '') updateData.address_line2 = null;
    if (updateData.city === '') updateData.city = null;
    if (updateData.state === '') updateData.state = null;
    if (updateData.pincode === '') updateData.pincode = null;
    if (updateData.notes === '') updateData.notes = null;
    
    // If password is provided, update password_hash
    if (adminData.password) {
      updateData.password_hash = adminData.password; // In production, hash properly
      delete updateData.password;
      updateData.password_changed_at = new Date().toISOString();
    } else {
      delete updateData.password;
    }

    const { data, error } = await supabase
      .from('admin')
      .update(updateData)
      .eq('admin_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete admin
  async deleteAdmin(id: number): Promise<void> {
    const { error } = await supabase
      .from('admin')
      .delete()
      .eq('admin_id', id);

    if (error) throw error;
  },

  // Toggle admin active status
  async toggleActiveStatus(id: number, isActive: boolean): Promise<Admin> {
    const { data, error } = await supabase
      .from('admin')
      .update({ is_active: isActive })
      .eq('admin_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Unlock admin account
  async unlockAdmin(id: number): Promise<Admin> {
    const { data, error } = await supabase
      .from('admin')
      .update({ 
        is_locked: false, 
        failed_login_attempts: 0 
      })
      .eq('admin_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Reset password
  async resetPassword(id: number, newPassword: string): Promise<Admin> {
    const { data, error } = await supabase
      .from('admin')
      .update({ 
        password_hash: newPassword, // In production, hash properly
        password_changed_at: new Date().toISOString()
      })
      .eq('admin_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Search admins
  async searchAdmins(searchTerm: string): Promise<Admin[]> {
    const { data, error } = await supabase
      .from('admin')
      .select('*')
      .or(`email.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`)
      .order('admin_id', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};
