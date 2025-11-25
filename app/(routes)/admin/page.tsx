'use client';

import React, { useState, useEffect } from 'react';
import { Faculty, FacultyFormData } from '@/types/faculty';
import {
  getAllFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  toggleActiveStatus,
  promoteToHOD,
  searchFaculty,
} from '@/lib/faculty-service';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { FacultyTable } from '@/components/admin/faculty-table';
import { FacultyFormDialog } from '@/components/admin/faculty-form-dialog';
import { FacultyViewDialog } from '@/components/admin/faculty-view-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Users, UserCheck, UserX, Crown } from 'lucide-react';
import { toast } from 'sonner';

export const dynamic = 'force-dynamic';

// Current admin user email (hardcoded as per requirements)
const current_user = 'mdmomin7517@gmail.com';

export default function AdminPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);

  // Statistics
  const totalFaculty = faculty.length;
  const activeFaculty = faculty.filter((f) => f.is_active).length;
  const inactiveFaculty = faculty.filter((f) => !f.is_active).length;
  const hodCount = faculty.filter((f) => f.is_hod).length;

  useEffect(() => {
    loadFaculty();
  }, []);

  const loadFaculty = async () => {
    try {
      setLoading(true);
      const data = await getAllFaculty();
      setFaculty(data);
    } catch (error) {
      console.error('Error loading faculty:', error);
      toast.error('Failed to load faculty members');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadFaculty();
      return;
    }

    try {
      setLoading(true);
      const results = await searchFaculty(searchQuery);
      setFaculty(results);
      toast.success(`Found ${results.length} faculty member(s)`);
    } catch (error) {
      console.error('Error searching faculty:', error);
      toast.error('Failed to search faculty');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (data: FacultyFormData) => {
    try {
      await createFaculty(data, current_user);
      toast.success('Faculty member added successfully');
      loadFaculty();
    } catch (error) {
      console.error('Error adding faculty:', error);
      toast.error('Failed to add faculty member');
      throw error;
    }
  };

  const handleEdit = async (data: FacultyFormData) => {
    if (!selectedFaculty) return;

    try {
      await updateFaculty(selectedFaculty.unique_id, data);
      toast.success('Faculty member updated successfully');
      loadFaculty();
    } catch (error) {
      console.error('Error updating faculty:', error);
      toast.error('Failed to update faculty member');
      throw error;
    }
  };

  const handleDelete = async (faculty: Faculty) => {
    if (!confirm(`Are you sure you want to delete ${faculty.faculty_first_name} ${faculty.faculty_last_name}?`)) {
      return;
    }

    try {
      await deleteFaculty(faculty.unique_id);
      toast.success('Faculty member deleted successfully');
      loadFaculty();
    } catch (error) {
      console.error('Error deleting faculty:', error);
      toast.error('Failed to delete faculty member');
    }
  };

  const handleToggleActive = async (faculty: Faculty) => {
    try {
      await toggleActiveStatus(faculty.unique_id, !faculty.is_active);
      toast.success(
        `Faculty ${faculty.is_active ? 'deactivated' : 'activated'} successfully`
      );
      loadFaculty();
    } catch (error) {
      console.error('Error toggling faculty status:', error);
      toast.error('Failed to toggle faculty status');
    }
  };

  const handlePromoteToHOD = async (faculty: Faculty) => {
    if (faculty.is_hod) {
      toast.info('This faculty member is already an HOD');
      return;
    }

    if (!confirm(`Promote ${faculty.faculty_first_name} ${faculty.faculty_last_name} to HOD?`)) {
      return;
    }

    try {
      await promoteToHOD(faculty.unique_id, true);
      toast.success('Faculty member promoted to HOD successfully');
      loadFaculty();
    } catch (error) {
      console.error('Error promoting to HOD:', error);
      toast.error('Failed to promote faculty to HOD');
    }
  };

  const handleView = (faculty: Faculty) => {
    setSelectedFaculty(faculty);
    setIsViewDialogOpen(true);
  };

  const handleEditClick = (faculty: Faculty) => {
    setSelectedFaculty(faculty);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Faculty Management</h1>
              <p className="text-muted-foreground">
                Manage faculty members and their information
              </p>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Faculty
            </Button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Faculty
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalFaculty}</div>
                <p className="text-xs text-muted-foreground">
                  All faculty members
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Faculty
                </CardTitle>
                <UserCheck className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeFaculty}</div>
                <p className="text-xs text-muted-foreground">
                  Currently active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Inactive Faculty
                </CardTitle>
                <UserX className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inactiveFaculty}</div>
                <p className="text-xs text-muted-foreground">
                  Currently inactive
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">HODs</CardTitle>
                <Crown className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hodCount}</div>
                <p className="text-xs text-muted-foreground">
                  Heads of Department
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Search Bar */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by name, email, department..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleSearch} disabled={loading}>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
                {searchQuery && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      loadFaculty();
                    }}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Faculty Table */}
          <Card>
            <CardHeader>
              <CardTitle>Faculty Members</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading faculty...
                </div>
              ) : (
                <FacultyTable
                  faculty={faculty}
                  onView={handleView}
                  onEdit={handleEditClick}
                  onDelete={handleDelete}
                  onToggleActive={handleToggleActive}
                  onPromoteToHOD={handlePromoteToHOD}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Dialogs */}
      <FacultyFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleAdd}
        isEdit={false}
      />

      <FacultyFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        faculty={selectedFaculty}
        onSave={handleEdit}
        isEdit={true}
      />

      <FacultyViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        faculty={selectedFaculty}
      />
    </div>
  );
}