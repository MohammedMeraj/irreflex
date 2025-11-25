'use client';

import React, { useState, useEffect } from 'react';
import { Admin, AdminFormData } from '@/types/admin';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AdminFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admin?: Admin | null;
  onSave: (data: AdminFormData) => Promise<void>;
  isEdit?: boolean;
}

export function AdminFormDialog({
  open,
  onOpenChange,
  admin,
  onSave,
  isEdit = false,
}: AdminFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AdminFormData>({
    email: '',
    phone_number: '',
    password: '',
    role: 'admin',
    access_level: 1,
    first_name: '',
    middle_name: '',
    last_name: '',
    gender: '',
    date_of_birth: '',
    campus_id: undefined,
    department_id: undefined,
    college_name: '',
    college_address: '',
    profile_image_url: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    notes: '',
  });

  useEffect(() => {
    if (admin && isEdit) {
      setFormData({
        email: admin.email,
        phone_number: admin.phone_number || '',
        password: '', // Don't populate password for security
        role: admin.role,
        access_level: admin.access_level,
        first_name: admin.first_name,
        middle_name: admin.middle_name || '',
        last_name: admin.last_name,
        gender: admin.gender || '',
        date_of_birth: admin.date_of_birth || '',
        campus_id: admin.campus_id,
        department_id: admin.department_id,
        college_name: admin.college_name || '',
        college_address: admin.college_address || '',
        profile_image_url: admin.profile_image_url || '',
        address_line1: admin.address_line1 || '',
        address_line2: admin.address_line2 || '',
        city: admin.city || '',
        state: admin.state || '',
        pincode: admin.pincode || '',
        country: admin.country || 'India',
        notes: admin.notes || '',
      });
    } else if (!open) {
      // Reset form when dialog closes
      setFormData({
        email: '',
        phone_number: '',
        password: '',
        role: 'admin',
        access_level: 1,
        first_name: '',
        middle_name: '',
        last_name: '',
        gender: '',
        date_of_birth: '',
        campus_id: undefined,
        department_id: undefined,
        college_name: '',
        college_address: '',
        profile_image_url: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        notes: '',
      });
    }
  }, [admin, isEdit, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving admin:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Admin' : 'Add New Admin'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update admin information. Leave password empty to keep current password.'
              : 'Fill in the details to create a new admin account.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  required
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middle_name">Middle Name</Label>
                <Input
                  id="middle_name"
                  value={formData.middle_name}
                  onChange={(e) =>
                    setFormData({ ...formData, middle_name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  required
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) =>
                    setFormData({ ...formData, gender: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                    <SelectItem value="Prefer not to say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) =>
                    setFormData({ ...formData, date_of_birth: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Contact & Authentication */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Contact & Authentication</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) =>
                    setFormData({ ...formData, phone_number: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password {isEdit ? '(leave empty to keep current)' : '*'}
                </Label>
                <Input
                  id="password"
                  type="password"
                  required={!isEdit}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile_image_url">Profile Image URL</Label>
                <Input
                  id="profile_image_url"
                  type="url"
                  value={formData.profile_image_url}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      profile_image_url: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Role & Access */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Role & Access</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="access_level">Access Level (1-10) *</Label>
                <Input
                  id="access_level"
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={formData.access_level}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      access_level: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="campus_id">Campus ID</Label>
                <Input
                  id="campus_id"
                  type="number"
                  value={formData.campus_id || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      campus_id: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department_id">Department ID</Label>
                <Input
                  id="department_id"
                  type="number"
                  value={formData.department_id || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      department_id: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="college_name">College Name</Label>
                <Input
                  id="college_name"
                  value={formData.college_name}
                  onChange={(e) =>
                    setFormData({ ...formData, college_name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="college_address">College Address</Label>
                <Input
                  id="college_address"
                  value={formData.college_address}
                  onChange={(e) =>
                    setFormData({ ...formData, college_address: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address_line1">Address Line 1</Label>
                <Input
                  id="address_line1"
                  value={formData.address_line1}
                  onChange={(e) =>
                    setFormData({ ...formData, address_line1: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address_line2">Address Line 2</Label>
                <Input
                  id="address_line2"
                  value={formData.address_line2}
                  onChange={(e) =>
                    setFormData({ ...formData, address_line2: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) =>
                    setFormData({ ...formData, pincode: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              className="w-full min-h-[80px] px-3 py-2 border border-input rounded-md"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Admin' : 'Create Admin'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
