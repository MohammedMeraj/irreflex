'use client';

import React from 'react';
import { Class } from '@/types/class';
import { Department } from '@/types/department';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Pencil, Trash2 } from 'lucide-react';

interface ClassTableProps {
  classes: Class[];
  departments: Department[];
  faculty: any[];
  onEdit: (classData: Class) => void;
  onDelete: (classData: Class) => void;
  onView: (classData: Class) => void;
  onToggleActive: (classData: Class) => void;
}

export function ClassTable({
  classes,
  departments,
  faculty,
  onEdit,
  onDelete,
  onView,
  onToggleActive,
}: ClassTableProps) {
  const getDepartmentName = (departmentId: number | null) => {
    if (!departmentId) return 'Not assigned';
    const dept = departments.find(d => d.department_id === departmentId);
    return dept?.department_name || 'Unknown';
  };

  const getCoordinatorName = (coordinatorId: number | null) => {
    if (!coordinatorId) return 'Not assigned';
    const coord = faculty.find(f => f.unique_id === coordinatorId);
    return coord ? `${coord.faculty_first_name} ${coord.faculty_last_name}` : 'Unknown';
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Class Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Batch Year</TableHead>
            <TableHead>Coordinator</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No classes found
              </TableCell>
            </TableRow>
          ) : (
            classes.map((classData) => (
              <TableRow key={classData.class_id}>
                <TableCell className="font-medium">{classData.class_name}</TableCell>
                <TableCell>{getDepartmentName(classData.department_id)}</TableCell>
                <TableCell>{classData.batch_year}</TableCell>
                <TableCell>{getCoordinatorName(classData.class_coordinator_id)}</TableCell>
                <TableCell>
                  <Badge
                    variant={classData.is_active ? 'default' : 'secondary'}
                    className="cursor-pointer"
                    onClick={() => onToggleActive(classData)}
                  >
                    {classData.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(classData)}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(classData)}
                      title="Edit Class"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(classData)}
                      title="Delete Class"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
