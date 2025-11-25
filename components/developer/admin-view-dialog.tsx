'use client';

import React from 'react';
import { Admin } from '@/types/admin';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface AdminViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admin: Admin | null;
}

export function AdminViewDialog({
  open,
  onOpenChange,
  admin,
}: AdminViewDialogProps) {
  if (!admin) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Admin Details</DialogTitle>
          <DialogDescription>
            Complete information for admin ID: {admin.admin_id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                {admin.profile_image_url ? (
                  <img
                    src={admin.profile_image_url}
                    alt={admin.first_name}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-medium">
                      {admin.first_name[0]}
                      {admin.last_name[0]}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold">
                    {admin.first_name} {admin.middle_name}{' '}
                    {admin.last_name}
                  </h3>
                  <p className="text-muted-foreground">{admin.email}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="default">{admin.role.replace('_', ' ').toUpperCase()}</Badge>
                    <Badge variant="secondary">Level {admin.access_level}</Badge>
                    {admin.is_active ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                    {admin.is_locked && <Badge variant="destructive">Locked</Badge>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium">{admin.gender || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="font-medium">
                  {admin.date_of_birth
                    ? new Date(admin.date_of_birth).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="font-medium">{admin.phone_number || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Campus ID</p>
                <p className="font-medium">{admin.campus_id || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Department ID</p>
                <p className="font-medium">{admin.department_id || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">College Name</p>
                <p className="font-medium">{admin.college_name || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">College Address</p>
                <p className="font-medium">{admin.college_address || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>{admin.address_line1 || 'N/A'}</p>
                {admin.address_line2 && <p>{admin.address_line2}</p>}
                <p>
                  {admin.city && `${admin.city}, `}
                  {admin.state && `${admin.state} `}
                  {admin.pincode}
                </p>
                <p className="font-medium">{admin.country || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Verification & Security */}
          <Card>
            <CardHeader>
              <CardTitle>Verification & Security</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Email Verified</p>
                <Badge variant={admin.email_verified ? 'default' : 'secondary'}>
                  {admin.email_verified ? '✓ Verified' : '✗ Not Verified'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone Verified</p>
                <Badge variant={admin.phone_verified ? 'default' : 'secondary'}>
                  {admin.phone_verified ? '✓ Verified' : '✗ Not Verified'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Two-Factor Auth</p>
                <Badge variant={admin.two_factor_enabled ? 'default' : 'secondary'}>
                  {admin.two_factor_enabled ? '✓ Enabled' : '✗ Disabled'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Failed Login Attempts</p>
                <p className="font-medium">{admin.failed_login_attempts}</p>
              </div>
            </CardContent>
          </Card>

          {/* Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="font-medium">{formatDate(admin.created_at)}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">{formatDate(admin.updated_at)}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Last Login</p>
                <p className="font-medium">{formatDate(admin.last_login_at)}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Password Changed</p>
                <p className="font-medium">
                  {formatDate(admin.password_changed_at)}
                </p>
              </div>
              {admin.last_ip_address && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Last IP Address</p>
                    <p className="font-medium font-mono">{admin.last_ip_address}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          {admin.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{admin.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
