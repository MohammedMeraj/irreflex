'use client';

import React from 'react';
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
  Crown,
} from 'lucide-react';

interface FacultyTableProps {
  faculty: Faculty[];
  onEdit: (faculty: Faculty) => void;
  onDelete: (faculty: Faculty) => void;
  onToggleActive: (faculty: Faculty) => void;
  onPromoteToHOD: (faculty: Faculty) => void;
  onView: (faculty: Faculty) => void;
}

export function FacultyTable({
  faculty,
  onEdit,
  onDelete,
  onToggleActive,
  onPromoteToHOD,
  onView,
}: FacultyTableProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (faculty.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">No faculty found</p>
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
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faculty.map((fac) => (
              <TableRow key={fac.unique_id}>
                <TableCell className="font-medium">{fac.unique_id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {fac.faculty_first_name[0]}
                        {fac.faculty_last_name[0]}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {fac.faculty_first_name} {fac.faculty_last_name}
                        {fac.is_hod && (
                          <Crown className="h-3 w-3 text-yellow-600" />
                        )}
                      </div>
                      {fac.faculty_gender && (
                        <div className="text-xs text-muted-foreground">
                          {fac.faculty_gender}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{fac.faculty_email}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{fac.faculty_department}</Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {fac.faculty_phone || '-'}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge
                      variant={fac.is_active ? 'default' : 'secondary'}
                      className="w-fit"
                    >
                      {fac.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    {fac.is_hod && (
                      <Badge variant="default" className="w-fit bg-yellow-600">
                        HOD
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {formatDate(fac.last_login)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(fac)}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(fac)}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onToggleActive(fac)}
                      title={fac.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {fac.is_active ? (
                        <ToggleRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ToggleLeft className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onPromoteToHOD(fac)}
                      title={fac.is_hod ? 'Remove HOD' : 'Promote to HOD'}
                      className={fac.is_hod ? 'text-yellow-600' : ''}
                    >
                      <Crown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(fac)}
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
