'use client';

import React from 'react';
import { Department } from '@/types/department';
import { Faculty } from '@/types/faculty';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building2, 
  Calendar,
  Crown,
  Shield,
  Mail
} from 'lucide-react';

interface DepartmentViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
  faculty?: Faculty[];
}

export function DepartmentViewDialog({
  open,
  onOpenChange,
  department,
  faculty = [],
}: DepartmentViewDialogProps) {
  if (!department) return null;

  // Find HOD details
  const hodDetails = department.department_hod_id 
    ? faculty.find(f => f.unique_id === department.department_hod_id)
    : null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Department Details
          </DialogTitle>
          <DialogDescription>
            Complete information for {department.department_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Basic Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Department ID</p>
                <p className="font-medium">{department.department_id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Department Name</p>
                <p className="font-medium">{department.department_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Established Year</p>
                <p className="font-medium">{department.establish_year || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={department.is_department_active ? 'default' : 'secondary'}>
                  {department.is_department_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* HOD Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Crown className="h-4 w-4" />
                Head of Department
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">HOD Name</p>
                {hodDetails ? (
                  <div>
                    <p className="font-medium">
                      {hodDetails.faculty_first_name} {hodDetails.faculty_last_name}
                    </p>
                    <Badge variant="outline" className="mt-1">
                      Faculty ID: {department.department_hod_id}
                    </Badge>
                  </div>
                ) : department.department_hod_id ? (
                  <div>
                    <Badge variant="outline">Faculty ID: {department.department_hod_id}</Badge>
                    <p className="text-xs text-muted-foreground mt-1">Details not available</p>
                  </div>
                ) : (
                  <p className="font-medium text-muted-foreground">Not assigned</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Admin Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Created By Admin</p>
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <p className="font-medium break-all">{department.admin_email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Activity Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Created Date</p>
                <p className="font-medium">{formatDate(department.created_date)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">{formatDate(department.updated_date)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
