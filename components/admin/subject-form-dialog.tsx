'use client';

import React, { useState, useEffect } from 'react';
import { Subject, SubjectFormData } from '@/types/subject';
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

interface SubjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject?: Subject | null;
  departments?: Department[];
  onSave: (data: SubjectFormData) => Promise<void>;
  isEdit?: boolean;
}

export function SubjectFormDialog({
  open,
  onOpenChange,
  subject,
  departments = [],
  onSave,
  isEdit = false,
}: SubjectFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SubjectFormData>({
    subject_name: '',
    department_id: null,
    credits: 4,
  });

  useEffect(() => {
    if (subject && isEdit) {
      setFormData({
        subject_name: subject.subject_name,
        department_id: subject.department_id,
        credits: subject.credits,
      });
    } else if (!open) {
      // Reset form when dialog closes
      setFormData({
        subject_name: '',
        department_id: null,
        credits: 4,
      });
    }
  }, [subject, isEdit, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving subject:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Subject' : 'Add New Subject'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update subject information.'
              : 'Fill in the details to add a new subject.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject_name">Subject Name *</Label>
              <Input
                id="subject_name"
                required
                value={formData.subject_name}
                onChange={(e) =>
                  setFormData({ ...formData, subject_name: e.target.value })
                }
                placeholder="e.g., Data Structures and Algorithms"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department_id">Department</Label>
                <Select
                  value={formData.department_id?.toString() || 'none'}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      department_id: value === 'none' ? null : parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department (Optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Department</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept.department_id} value={dept.department_id.toString()}>
                        {dept.department_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="credits">Credits *</Label>
                <Select
                  value={formData.credits.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, credits: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((credit) => (
                      <SelectItem key={credit} value={credit.toString()}>
                        {credit} {credit === 1 ? 'Credit' : 'Credits'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              {loading ? 'Saving...' : isEdit ? 'Update Subject' : 'Add Subject'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
