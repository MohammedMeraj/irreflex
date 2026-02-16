'use client';

import React from 'react';
import { Class } from '@/types/class';
import { Department } from '@/types/department';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface ClassViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classData: Class | null;
  departments: Department[];
  faculty: any[];
}

export function ClassViewDialog({
  open,
  onOpenChange,
  classData,
  departments,
  faculty,
}: ClassViewDialogProps) {
  if (!classData) return null;

  const department = departments.find(d => d.department_id === classData.department_id);
  const coordinator = faculty.find(f => f.unique_id === classData.class_coordinator_id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Class Details</DialogTitle>
          <DialogDescription>
            Complete information about the class.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Class Name</p>
            <p className="text-base font-semibold">{classData.class_name}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Department</p>
            <p className="text-base">{department?.department_name || 'Not assigned'}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Batch Year</p>
            <p className="text-base">{classData.batch_year}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Class Coordinator</p>
            <p className="text-base">
              {coordinator
                ? `${coordinator.faculty_first_name} ${coordinator.faculty_last_name}`
                : 'Not assigned'}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <Badge variant={classData.is_active ? 'default' : 'secondary'}>
              {classData.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Created Date</p>
            <p className="text-base">
              {new Date(classData.created_date).toLocaleDateString()}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
            <p className="text-base">
              {new Date(classData.updated_date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
