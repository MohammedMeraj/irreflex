'use client';

import React, { useState, useEffect } from 'react';
import { Admin, AdminFormData } from '@/types/admin';
import { adminService } from '@/lib/admin-service';
import { DeveloperSidebar } from '@/components/developer/developer-sidebar';
import { AdminTable } from '@/components/developer/admin-table';
import { AdminFormDialog } from '@/components/developer/admin-form-dialog';
import { AdminViewDialog } from '@/components/developer/admin-view-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, RefreshCw, Users, UserCheck, UserX, Lock } from 'lucide-react';
import { toast } from 'sonner';

export const dynamic = 'force-dynamic';

const Developer = () => {
  const [activeSection, setActiveSection] = useState('admins');
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // Fetch admins
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllAdmins();
      setAdmins(data);
      setFilteredAdmins(data);
    } catch (error: any) {
      console.error('Error fetching admins:', error);
      toast.error('Error fetching admins', {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAdmins(admins);
    } else {
      const filtered = admins.filter(
        (admin) =>
          admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          admin.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          admin.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          admin.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAdmins(filtered);
    }
  }, [searchTerm, admins]);

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Handle create admin
  const handleCreate = () => {
    setSelectedAdmin(null);
    setIsEdit(false);
    setIsFormOpen(true);
  };

  // Handle edit admin
  const handleEdit = (admin: Admin) => {
    setSelectedAdmin(admin);
    setIsEdit(true);
    setIsFormOpen(true);
  };

  // Handle view admin
  const handleView = (admin: Admin) => {
    setSelectedAdmin(admin);
    setIsViewOpen(true);
  };

  // Handle save admin (create or update)
  const handleSave = async (data: AdminFormData) => {
    try {
      if (isEdit && selectedAdmin) {
        await adminService.updateAdmin(selectedAdmin.admin_id, data);
        toast.success('Admin updated successfully!', {
          description: `${data.first_name} ${data.last_name} has been updated.`,
        });
      } else {
        await adminService.createAdmin(data);
        toast.success('Admin created successfully!', {
          description: `${data.first_name} ${data.last_name} has been added.`,
        });
      }
      fetchAdmins();
    } catch (error: any) {
      console.error('Error saving admin:', error);
      toast.error('Error saving admin', {
        description: error.message,
      });
      throw error;
    }
  };

  // Handle delete admin
  const handleDelete = async (admin: Admin) => {
    toast.warning(`Delete ${admin.first_name} ${admin.last_name}?`, {
      description: 'This action cannot be undone.',
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            await adminService.deleteAdmin(admin.admin_id);
            toast.success('Admin deleted successfully!', {
              description: `${admin.first_name} ${admin.last_name} has been removed.`,
            });
            fetchAdmins();
          } catch (error: any) {
            console.error('Error deleting admin:', error);
            toast.error('Error deleting admin', {
              description: error.message,
            });
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    });
  };

  // Handle toggle active status
  const handleToggleActive = async (admin: Admin) => {
    try {
      await adminService.toggleActiveStatus(admin.admin_id, !admin.is_active);
      toast.success(
        `Admin ${admin.is_active ? 'deactivated' : 'activated'} successfully!`,
        {
          description: `${admin.first_name} ${admin.last_name} is now ${admin.is_active ? 'inactive' : 'active'}.`,
        }
      );
      fetchAdmins();
    } catch (error: any) {
      console.error('Error toggling admin status:', error);
      toast.error('Error toggling admin status', {
        description: error.message,
      });
    }
  };

  // Handle unlock admin
  const handleUnlock = async (admin: Admin) => {
    try {
      await adminService.unlockAdmin(admin.admin_id);
      toast.success('Admin account unlocked successfully!', {
        description: `${admin.first_name} ${admin.last_name} can now log in.`,
      });
      fetchAdmins();
    } catch (error: any) {
      console.error('Error unlocking admin:', error);
      toast.error('Error unlocking admin', {
        description: error.message,
      });
    }
  };

  // Calculate statistics
  const stats = {
    total: admins.length,
    active: admins.filter((a) => a.is_active).length,
    inactive: admins.filter((a) => !a.is_active).length,
    locked: admins.filter((a) => a.is_locked).length,
  };

  const renderContent = () => {
    if (activeSection === 'admins') {
      return (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
                <UserCheck className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.active}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inactive</CardTitle>
                <UserX className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.inactive}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Locked</CardTitle>
                <Lock className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.locked}</div>
              </CardContent>
            </Card>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 w-full sm:max-w-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={fetchAdmins}
                disabled={loading}
                className="flex-1 sm:flex-none"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={handleCreate} className="flex-1 sm:flex-none">
                <Plus className="h-4 w-4 mr-2" />
                Add Admin
              </Button>
            </div>
          </div>

          {/* Admin Table */}
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">Loading admins...</p>
            </div>
          ) : (
            <AdminTable
              admins={filteredAdmins}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
              onUnlock={handleUnlock}
              onView={handleView}
            />
          )}
        </div>
      );
    }

    if (activeSection === 'stats') {
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistics Dashboard</CardTitle>
              <CardDescription>Overview of admin accounts and their activity</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Statistics dashboard coming soon...</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeSection === 'database') {
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Database Management</CardTitle>
              <CardDescription>Database operations and maintenance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Database management tools coming soon...</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeSection === 'settings') {
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Developer area configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Settings panel coming soon...</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <DeveloperSidebar activeSection={activeSection} onSectionChange={setActiveSection}>
        {renderContent()}
      </DeveloperSidebar>

      <AdminFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        admin={selectedAdmin}
        onSave={handleSave}
        isEdit={isEdit}
      />

      <AdminViewDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        admin={selectedAdmin}
      />
    </>
  );
};

export default Developer;