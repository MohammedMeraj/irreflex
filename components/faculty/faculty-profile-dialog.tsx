'use client';

import React, { useState, useEffect } from 'react';
import { Faculty, FacultyFormData } from '@/types/faculty';
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
import { toast } from 'sonner';

interface FacultyProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faculty: Faculty | null;
  onSave: (data: Partial<FacultyFormData>) => Promise<void>;
}

export function FacultyProfileDialog({
  open,
  onOpenChange,
  faculty,
  onSave,
}: FacultyProfileDialogProps) {
  const [formData, setFormData] = useState<Partial<FacultyFormData>>({
    faculty_first_name: '',
    faculty_last_name: '',
    faculty_phone: '',
    faculty_qualification: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (faculty) {
      setFormData({
        faculty_first_name: faculty.faculty_first_name,
        faculty_last_name: faculty.faculty_last_name,
        faculty_phone: faculty.faculty_phone || '',
        faculty_qualification: faculty.faculty_qualification || '',
      });
    }
  }, [faculty]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.faculty_first_name?.trim() || !formData.faculty_last_name?.trim()) {
      toast.error('First name and last name are required');
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof FacultyFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your personal information. Email, department, and role cannot be changed.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="faculty_first_name">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="faculty_first_name"
                value={formData.faculty_first_name}
                onChange={(e) => handleChange('faculty_first_name', e.target.value)}
                placeholder="Enter first name"
                required
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="faculty_last_name">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="faculty_last_name"
                value={formData.faculty_last_name}
                onChange={(e) => handleChange('faculty_last_name', e.target.value)}
                placeholder="Enter last name"
                required
              />
            </div>

            {/* Email (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="faculty_email">Email</Label>
              <Input
                id="faculty_email"
                value={faculty?.faculty_email || ''}
                disabled
                className="bg-muted cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="faculty_phone">Phone Number</Label>
              <Input
                id="faculty_phone"
                value={formData.faculty_phone}
                onChange={(e) => handleChange('faculty_phone', e.target.value)}
                placeholder="Enter phone number"
                type="tel"
              />
            </div>

            {/* Department (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="faculty_department">Department</Label>
              <Input
                id="faculty_department"
                value={faculty?.faculty_department || 'No Department'}
                disabled
                className="bg-muted cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">Department is assigned by admin</p>
            </div>

            {/* Qualification */}
            <div className="space-y-2">
              <Label htmlFor="faculty_qualification">Qualification</Label>
              <Input
                id="faculty_qualification"
                value={formData.faculty_qualification}
                onChange={(e) => handleChange('faculty_qualification', e.target.value)}
                placeholder="e.g., M.Tech, Ph.D."
              />
            </div>
          </div>

          {/* Role Status (Read-only) */}
          <div className="p-4 bg-muted rounded-md space-y-2">
            <div className="flex items-center justify-between">
              <Label>Role Status</Label>
              <span className={`text-sm font-medium ${faculty?.is_hod ? 'text-amber-600' : 'text-muted-foreground'}`}>
                {faculty?.is_hod ? '👑 Head of Department' : 'Faculty Member'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <Label>Account Status</Label>
              <span className={`text-sm font-medium ${faculty?.is_active ? 'text-green-600' : 'text-red-600'}`}>
                {faculty?.is_active ? '✓ Active' : '✗ Inactive'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Role and status are managed by admin
            </p>
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
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
