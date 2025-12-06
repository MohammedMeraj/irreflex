'use client';

import React from 'react';
import { Subject } from '@/types/subject';
import { Department } from '@/types/department';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Edit,
  Trash2,
  Eye,
  BookOpen,
} from 'lucide-react';

interface SubjectTableProps {
  subjects: Subject[];
  departments: Department[];
  onEdit: (subject: Subject) => void;
  onDelete: (subject: Subject) => void;
  onView: (subject: Subject) => void;
  selectedSubjects?: number[];
  onSelectionChange?: (subjectIds: number[]) => void;
}

export function SubjectTable({
  subjects,
  departments,
  onEdit,
  onDelete,
  onView,
  selectedSubjects = [],
  onSelectionChange,
}: SubjectTableProps) {
  const getDepartmentName = (deptId: number | null) => {
    if (!deptId) return 'No Department';
    const dept = departments.find(d => d.department_id === deptId);
    return dept ? dept.department_name : `Unknown (ID: ${deptId})`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      onSelectionChange(subjects.map(s => s.unique_subject_id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectSubject = (subjectId: number, checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      onSelectionChange([...selectedSubjects, subjectId]);
    } else {
      onSelectionChange(selectedSubjects.filter(id => id !== subjectId));
    }
  };

  const isAllSelected = subjects.length > 0 && selectedSubjects.length === subjects.length;
  const isSomeSelected = selectedSubjects.length > 0 && selectedSubjects.length < subjects.length;

  if (subjects.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">No subjects found</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {onSelectionChange && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all subjects"
                    className={isSomeSelected ? 'data-[state=checked]:bg-primary/50' : ''}
                  />
                </TableHead>
              )}
              <TableHead>Subject Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Admin Email</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.map((subject) => (
              <TableRow key={subject.unique_subject_id}>
                {onSelectionChange && (
                  <TableCell>
                    <Checkbox
                      checked={selectedSubjects.includes(subject.unique_subject_id)}
                      onCheckedChange={(checked) => handleSelectSubject(subject.unique_subject_id, checked as boolean)}
                      aria-label={`Select ${subject.subject_name}`}
                    />
                  </TableCell>
                )}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div className="font-medium">{subject.subject_name}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {getDepartmentName(subject.department_id)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{subject.credits} Credits</Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {subject.admin_email}
                </TableCell>
                <TableCell className="text-sm">
                  {formatDate(subject.created_date)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(subject)}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(subject)}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(subject)}
                      title="Delete"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
