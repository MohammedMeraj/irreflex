'use client';

import React from 'react';
import { Department } from '@/types/department';
import { Faculty } from '@/types/faculty';
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
import {
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Eye,
  Building2,
} from 'lucide-react';

interface DepartmentTableProps {
  departments: Department[];
  faculty: Faculty[];
  onEdit: (department: Department) => void;
  onDelete: (department: Department) => void;
  onToggleActive: (department: Department) => void;
  onView: (department: Department) => void;
}

export function DepartmentTable({
  departments,
  faculty,
  onEdit,
  onDelete,
  onToggleActive,
  onView,
}: DepartmentTableProps) {
  const getHODName = (hodId: number | null) => {
    if (!hodId) return null;
    const hod = faculty.find(f => f.unique_id === hodId);
    if (!hod) return `Unknown (ID: ${hodId})`;
    return `${hod.faculty_first_name} ${hod.faculty_last_name}`;
  };
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (departments.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">No departments found</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Department Name</TableHead>
              <TableHead>Established Year</TableHead>
              <TableHead>Head of Department</TableHead>
              <TableHead>Admin Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((dept) => (
              <TableRow key={dept.department_id}>
                <TableCell className="font-medium">{dept.department_id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div className="font-medium">{dept.department_name}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {dept.establish_year || '-'}
                </TableCell>
                <TableCell>
                  {dept.department_hod_id ? (
                    <Badge variant="outline" className="font-medium">
                      {getHODName(dept.department_hod_id)}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">No HOD</span>
                  )}
                </TableCell>
                <TableCell className="text-sm">
                  {dept.admin_email}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={dept.is_department_active ? 'default' : 'secondary'}
                    className="w-fit"
                  >
                    {dept.is_department_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {formatDate(dept.created_date)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(dept)}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(dept)}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onToggleActive(dept)}
                      title={dept.is_department_active ? 'Deactivate' : 'Activate'}
                    >
                      {dept.is_department_active ? (
                        <ToggleRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ToggleLeft className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(dept)}
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
