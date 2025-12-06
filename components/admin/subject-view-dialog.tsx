'use client';

import React from 'react';
import { Subject } from '@/types/subject';
import { Department } from '@/types/department';
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
  BookOpen, 
  Calendar,
  Building2,
  Mail,
  Award
} from 'lucide-react';

interface SubjectViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject: Subject | null;
  departments: Department[];
}

export function SubjectViewDialog({
  open,
  onOpenChange,
  subject,
  departments,
}: SubjectViewDialogProps) {
  if (!subject) return null;

  const getDepartmentName = (deptId: number | null) => {
    if (!deptId) return 'No Department';
    const dept = departments.find(d => d.department_id === deptId);
    return dept ? dept.department_name : `Unknown (ID: ${deptId})`;
  };

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
            Subject Details
          </DialogTitle>
          <DialogDescription>
            Complete information for {subject.subject_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Basic Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Subject Name</p>
                <p className="font-medium">{subject.subject_name}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Department</p>
                <Badge variant="outline" className="mt-1">
                  <Building2 className="h-3 w-3 mr-1" />
                  {getDepartmentName(subject.department_id)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Credits Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="h-4 w-4" />
                Credit Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <p className="text-sm text-muted-foreground">Credits</p>
                <Badge variant="secondary" className="mt-1">
                  {subject.credits} {subject.credits === 1 ? 'Credit' : 'Credits'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Admin Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Admin Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <p className="text-sm text-muted-foreground">Created By Admin</p>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <p className="font-medium break-all">{subject.admin_email}</p>
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
            <CardContent>
              <div>
                <p className="text-sm text-muted-foreground">Created Date</p>
                <p className="font-medium">{formatDate(subject.created_date)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
