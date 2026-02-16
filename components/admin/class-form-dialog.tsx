'use client';

import React, { useState, useEffect } from 'react';
import { Class, ClassFormData } from '@/types/class';
import { Department } from '@/types/department';
import { getAvailableClassCoordinators, getFacultyById } from '@/lib/class-service';
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

interface ClassFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classData?: Class | null;
  departments: Department[];
  onSave: (data: ClassFormData) => Promise<void>;
  isEdit?: boolean;
  currentUser?: string;
}

export function ClassFormDialog({
  open,
  onOpenChange,
  classData,
  departments,
  onSave,
  isEdit = false,
  currentUser,
}: ClassFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [availableCoordinators, setAvailableCoordinators] = useState<any[]>([]);
  const [currentCoordinator, setCurrentCoordinator] = useState<any | null>(null);
  const [loadingCoordinators, setLoadingCoordinators] = useState(false);
  const [formData, setFormData] = useState<ClassFormData>({
    class_name: '',
    department_id: null,
    batch_year: new Date().getFullYear(),
    class_coordinator_id: null,
    is_active: true,
  });

  // Load available coordinators when dialog opens
  useEffect(() => {
    if (open) {
      loadAvailableCoordinators();
    }
  }, [open]);

  const loadAvailableCoordinators = async () => {
    try {
      setLoadingCoordinators(true);
      const coordinators = await getAvailableClassCoordinators(currentUser);
      
      // If editing and current class has a coordinator, fetch their details
      if (isEdit && classData?.class_coordinator_id) {
        try {
          const coordinatorDetails = await getFacultyById(classData.class_coordinator_id);
          setCurrentCoordinator(coordinatorDetails);
          // Add current coordinator to the list if not already present
          const hasCurrentCoordinator = coordinators.some(c => c.unique_id === classData.class_coordinator_id);
          if (!hasCurrentCoordinator) {
            setAvailableCoordinators([coordinatorDetails, ...coordinators]);
          } else {
            setAvailableCoordinators(coordinators);
          }
        } catch (error) {
          console.error('Error fetching current coordinator:', error);
          setAvailableCoordinators(coordinators);
        }
      } else {
        setCurrentCoordinator(null);
        setAvailableCoordinators(coordinators);
      }
    } catch (error) {
      console.error('Error loading available coordinators:', error);
    } finally {
      setLoadingCoordinators(false);
    }
  };

  useEffect(() => {
    if (classData && isEdit) {
      setFormData({
        class_name: classData.class_name,
        department_id: classData.department_id,
        batch_year: classData.batch_year,
        class_coordinator_id: classData.class_coordinator_id,
        is_active: classData.is_active,
      });
    } else if (!open) {
      // Reset form when dialog closes
      setFormData({
        class_name: '',
        department_id: null,
        batch_year: new Date().getFullYear(),
        class_coordinator_id: null,
        is_active: true,
      });
    }
  }, [classData, isEdit, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving class:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Class' : 'Add New Class'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the class information below.'
              : 'Fill in the details to add a new class.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="class_name">Class Name *</Label>
            <Input
              id="class_name"
              value={formData.class_name}
              onChange={(e) =>
                setFormData({ ...formData, class_name: e.target.value })
              }
              placeholder="e.g., Computer Science - Section A"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department_id">Department *</Label>
            <Select
              value={formData.department_id?.toString() || ''}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  department_id: value ? parseInt(value) : null,
                })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.department_id} value={dept.department_id.toString()}>
                    {dept.department_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="batch_year">Batch Year *</Label>
            <Input
              id="batch_year"
              type="number"
              min="1900"
              max="2100"
              value={formData.batch_year}
              onChange={(e) =>
                setFormData({ ...formData, batch_year: parseInt(e.target.value) })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="class_coordinator_id">Class Coordinator</Label>
            <Select
              value={formData.class_coordinator_id?.toString() || ''}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  class_coordinator_id: value ? parseInt(value) : null,
                })
              }
              disabled={loadingCoordinators}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingCoordinators ? "Loading..." : "Select coordinator (optional)"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">None</SelectItem>
                {availableCoordinators.map((faculty) => (
                  <SelectItem key={faculty.unique_id} value={faculty.unique_id.toString()}>
                    {faculty.faculty_first_name} {faculty.faculty_last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="is_active">Status *</Label>
            <Select
              value={formData.is_active.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, is_active: value === 'true' })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
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
              {loading ? 'Saving...' : isEdit ? 'Update Class' : 'Add Class'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
