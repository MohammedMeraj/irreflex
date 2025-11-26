'use client';

import React, { useState, useEffect } from 'react';
import { Faculty, FacultyFormData } from '@/types/faculty';
import { Department } from '@/types/department';
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

interface FacultyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faculty?: Faculty | null;
  departments?: Department[];
  onSave: (data: FacultyFormData) => Promise<void>;
  isEdit?: boolean;
}

export function FacultyFormDialog({
  open,
  onOpenChange,
  faculty,
  departments = [],
  onSave,
  isEdit = false,
}: FacultyFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [useCustomDepartment, setUseCustomDepartment] = useState(false);
  const [formData, setFormData] = useState<FacultyFormData>({
    faculty_first_name: '',
    faculty_last_name: '',
    faculty_department: '',
    faculty_email: '',
    faculty_phone: '',
    faculty_gender: '',
  });

  useEffect(() => {
    if (faculty && isEdit) {
      setFormData({
        faculty_first_name: faculty.faculty_first_name,
        faculty_last_name: faculty.faculty_last_name,
        faculty_department: faculty.faculty_department,
        faculty_email: faculty.faculty_email,
        faculty_phone: faculty.faculty_phone || '',
        faculty_gender: faculty.faculty_gender || '',
      });
    } else if (!open) {
      // Reset form when dialog closes
      setFormData({
        faculty_first_name: '',
        faculty_last_name: '',
        faculty_department: '',
        faculty_email: '',
        faculty_phone: '',
        faculty_gender: '',
      });
    }
  }, [faculty, isEdit, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving faculty:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Faculty' : 'Add New Faculty'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update faculty member information.'
              : 'Fill in the details to add a new faculty member.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="faculty_first_name">First Name *</Label>
                <Input
                  id="faculty_first_name"
                  required
                  value={formData.faculty_first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, faculty_first_name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="faculty_last_name">Last Name *</Label>
                <Input
                  id="faculty_last_name"
                  required
                  value={formData.faculty_last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, faculty_last_name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="faculty_department">Department *</Label>
                {!useCustomDepartment ? (
                  <div className="space-y-2">
                    <Select
                      value={formData.faculty_department}
                      onValueChange={(value) => {
                        if (value === '__custom__') {
                          setUseCustomDepartment(true);
                          setFormData({ ...formData, faculty_department: '' });
                        } else {
                          setFormData({ ...formData, faculty_department: value });
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select or add department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.department_id} value={dept.department_name}>
                            {dept.department_name}
                          </SelectItem>
                        ))}
                        <SelectItem value="__custom__" className="text-primary font-medium">
                          + Add New Department
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Select from list or click "Add New Department" to enter custom
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Input
                      id="faculty_department"
                      required
                      value={formData.faculty_department}
                      onChange={(e) =>
                        setFormData({ ...formData, faculty_department: e.target.value })
                      }
                      placeholder="e.g., Computer Science"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setUseCustomDepartment(false);
                        setFormData({ ...formData, faculty_department: '' });
                      }}
                      className="text-xs"
                    >
                      ← Back to department list
                    </Button>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="faculty_gender">Gender</Label>
                <Select
                  value={formData.faculty_gender}
                  onValueChange={(value) =>
                    setFormData({ ...formData, faculty_gender: value })
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
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="faculty_email">Email *</Label>
                <Input
                  id="faculty_email"
                  type="email"
                  required
                  value={formData.faculty_email}
                  onChange={(e) =>
                    setFormData({ ...formData, faculty_email: e.target.value })
                  }
                  placeholder="faculty@college.edu"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="faculty_phone">Phone Number</Label>
                <Input
                  id="faculty_phone"
                  type="tel"
                  value={formData.faculty_phone}
                  onChange={(e) =>
                    setFormData({ ...formData, faculty_phone: e.target.value })
                  }
                  placeholder="+91XXXXXXXXXX"
                />
              </div>
            </div>
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
              {loading ? 'Saving...' : isEdit ? 'Update Faculty' : 'Add Faculty'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
