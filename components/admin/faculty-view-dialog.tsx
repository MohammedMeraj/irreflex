'use client';

import React from 'react';
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
  User, 
  Mail, 
  Phone, 
  Building2, 
  Calendar,
  Crown,
  Shield
} from 'lucide-react';

interface FacultyViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faculty: Faculty | null;
}

export function FacultyViewDialog({
  open,
  onOpenChange,
  faculty,
}: FacultyViewDialogProps) {
  if (!faculty) return null;

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
            Faculty Details
            {faculty.is_hod && (
              <Badge variant="secondary" className="gap-1">
                <Crown className="h-3 w-3" />
                HOD
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Complete information for {faculty.faculty_first_name}{' '}
            {faculty.faculty_last_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Basic Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Faculty ID</p>
                <p className="font-medium">{faculty.unique_id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">
                  {faculty.faculty_first_name} {faculty.faculty_last_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium">{faculty.faculty_gender || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={faculty.is_active ? 'default' : 'secondary'}>
                  {faculty.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Department Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Department Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{faculty.faculty_department}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <div className="flex items-center gap-2">
                  {faculty.is_hod ? (
                    <Badge variant="secondary" className="gap-1">
                      <Crown className="h-3 w-3" />
                      Head of Department
                    </Badge>
                  ) : (
                    <Badge variant="outline">Faculty Member</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Email Address</p>
                <p className="font-medium break-all">{faculty.faculty_email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="font-medium">
                  {faculty.faculty_phone || 'Not provided'}
                </p>
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
                <p className="font-medium break-all">{faculty.admin_email}</p>
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
                <p className="text-sm text-muted-foreground">Last Login</p>
                <p className="font-medium">{formatDate(faculty.last_login || null)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Created</p>
                <p className="font-medium">{formatDate(faculty.created_date)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">{formatDate(faculty.updated_date)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
