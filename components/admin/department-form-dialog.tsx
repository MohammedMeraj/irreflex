'use client';

import React, { useState, useEffect } from 'react';
import { Department, DepartmentFormData } from '@/types/department';
import { Faculty } from '@/types/faculty';
import { getAvailableHODs, getFacultyById } from '@/lib/faculty-service';
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

interface DepartmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department?: Department | null;
  onSave: (data: DepartmentFormData) => Promise<void>;
  isEdit?: boolean;
}

export function DepartmentFormDialog({
  open,
  onOpenChange,
  department,
  onSave,
  isEdit = false,
}: DepartmentFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [availableHODs, setAvailableHODs] = useState<Faculty[]>([]);
  const [currentHOD, setCurrentHOD] = useState<Faculty | null>(null);
  const [loadingHODs, setLoadingHODs] = useState(false);
  const [formData, setFormData] = useState<DepartmentFormData>({
    department_name: '',
    establish_year: null,
    department_hod_id: null,
    is_department_active: false,
  });

  // Load available HODs when dialog opens
  useEffect(() => {
    if (open) {
      loadAvailableHODs();
    }
  }, [open]);

  const loadAvailableHODs = async () => {
    try {
      setLoadingHODs(true);
      const hods = await getAvailableHODs();
      
      // If editing and current department has a HOD, fetch their details
      if (isEdit && department?.department_hod_id) {
        try {
          const hodDetails = await getFacultyById(department.department_hod_id);
          setCurrentHOD(hodDetails);
          // Add current HOD to the list if not already present
          const hasCurrentHOD = hods.some(h => h.unique_id === department.department_hod_id);
          if (!hasCurrentHOD) {
            setAvailableHODs([hodDetails, ...hods]);
          } else {
            setAvailableHODs(hods);
          }
        } catch (error) {
          console.error('Error fetching current HOD:', error);
          setAvailableHODs(hods);
        }
      } else {
        setCurrentHOD(null);
        setAvailableHODs(hods);
      }
    } catch (error) {
      console.error('Error loading available HODs:', error);
    } finally {
      setLoadingHODs(false);
    }
  };

  useEffect(() => {
    if (department && isEdit) {
      setFormData({
        department_name: department.department_name,
        establish_year: department.establish_year,
        department_hod_id: department.department_hod_id,
        is_department_active: department.is_department_active,
      });
    } else if (!open) {
      // Reset form when dialog closes
      setFormData({
        department_name: '',
        establish_year: null,
        department_hod_id: null,
        is_department_active: false,
      });
    }
  }, [department, isEdit, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving department:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Department' : 'Add New Department'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update department information.'
              : 'Fill in the details to add a new department.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="department_name">Department Name *</Label>
              <Input
                id="department_name"
                required
                value={formData.department_name}
                onChange={(e) =>
                  setFormData({ ...formData, department_name: e.target.value })
                }
                placeholder="e.g., Computer Science"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="establish_year">Established Year</Label>
                <Input
                  id="establish_year"
                  type="number"
                  value={formData.establish_year || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      establish_year: e.target.value ? parseInt(e.target.value) : null,
                    })
                  }
                  placeholder="e.g., 2010"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department_hod_id">Head of Department</Label>
                <Select
                  value={formData.department_hod_id?.toString() || 'none'}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      department_hod_id: value === 'none' ? null : parseInt(value),
                    })
                  }
                  disabled={loadingHODs}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingHODs ? "Loading..." : "Select HOD (Optional)"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No HOD</SelectItem>
                    {availableHODs.map((hod) => (
                      <SelectItem key={hod.unique_id} value={hod.unique_id.toString()}>
                        {hod.faculty_first_name} {hod.faculty_last_name}
                        {currentHOD && currentHOD.unique_id === hod.unique_id && ' ✓'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {isEdit && currentHOD 
                    ? `Current HOD: ${currentHOD.faculty_first_name} ${currentHOD.faculty_last_name}` 
                    : 'Only shows faculty not currently assigned as HOD'}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="is_department_active">Status</Label>
              <Select
                value={formData.is_department_active ? 'active' : 'inactive'}
                onValueChange={(value) =>
                  setFormData({ ...formData, is_department_active: value === 'active' })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Note: Department can only be activated if a HOD is assigned
              </p>
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
              {loading ? 'Saving...' : isEdit ? 'Update Department' : 'Add Department'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
