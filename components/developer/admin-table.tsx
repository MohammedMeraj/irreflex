'use client';

import React from 'react';
import { Admin } from '@/types/admin';
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
  Lock,
  Unlock,
  ToggleLeft,
  ToggleRight,
  Eye,
} from 'lucide-react';

interface AdminTableProps {
  admins: Admin[];
  onEdit: (admin: Admin) => void;
  onDelete: (admin: Admin) => void;
  onToggleActive: (admin: Admin) => void;
  onUnlock: (admin: Admin) => void;
  onView: (admin: Admin) => void;
}

export function AdminTable({
  admins,
  onEdit,
  onDelete,
  onToggleActive,
  onUnlock,
  onView,
}: AdminTableProps) {
  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'super_admin':
        return 'destructive';
      case 'admin':
        return 'default';
      case 'manager':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (admins.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">No admins found</p>
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
              <TableHead>Role</TableHead>
              <TableHead>Access Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.admin_id}>
                <TableCell className="font-medium">{admin.admin_id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {admin.profile_image_url ? (
                      <img
                        src={admin.profile_image_url}
                        alt={admin.first_name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {admin.first_name[0]}
                          {admin.last_name[0]}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="font-medium">
                        {admin.first_name} {admin.middle_name ? admin.middle_name + ' ' : ''}
                        {admin.last_name}
                      </div>
                      {admin.phone_number && (
                        <div className="text-xs text-muted-foreground">
                          {admin.phone_number}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm">{admin.email}</span>
                    <div className="flex gap-1">
                      {admin.email_verified && (
                        <Badge variant="outline" className="text-xs">
                          ✓ Email
                        </Badge>
                      )}
                      {admin.phone_verified && (
                        <Badge variant="outline" className="text-xs">
                          ✓ Phone
                        </Badge>
                      )}
                      {admin.two_factor_enabled && (
                        <Badge variant="outline" className="text-xs">
                          2FA
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeColor(admin.role)}>
                    {admin.role.replace('_', ' ').toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{admin.access_level}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge
                      variant={admin.is_active ? 'default' : 'secondary'}
                      className="w-fit"
                    >
                      {admin.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    {admin.is_locked && (
                      <Badge variant="destructive" className="w-fit">
                        🔒 Locked
                      </Badge>
                    )}
                    {admin.failed_login_attempts > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {admin.failed_login_attempts} failed attempts
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {formatDate(admin.last_login_at)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(admin)}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(admin)}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onToggleActive(admin)}
                      title={admin.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {admin.is_active ? (
                        <ToggleRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ToggleLeft className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                    {admin.is_locked && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onUnlock(admin)}
                        title="Unlock Account"
                      >
                        <Unlock className="h-4 w-4 text-orange-600" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(admin)}
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
