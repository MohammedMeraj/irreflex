'use client';

import React, { useState, useEffect } from 'react';
import { Faculty, FacultyFormData } from '@/types/faculty';
import { Department, DepartmentFormData } from '@/types/department';
import { Subject, SubjectFormData } from '@/types/subject';
import {
  getAllFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  toggleActiveStatus,
  promoteToHOD,
  searchFaculty,
} from '@/lib/faculty-service';
import {
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  toggleDepartmentActiveStatus,
  searchDepartments,
  getDepartmentByHODId,
  removeHODAndDeactivateDepartment,
} from '@/lib/department-service';
import {
  getAllSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  searchSubjects,
  bulkAssignSubjectsToDepartment,
} from '@/lib/subject-service';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { FacultyTable } from '@/components/admin/faculty-table';
import { FacultyFormDialog } from '@/components/admin/faculty-form-dialog';
import { FacultyViewDialog } from '@/components/admin/faculty-view-dialog';
import { DepartmentTable } from '@/components/admin/department-table';
import { DepartmentFormDialog } from '@/components/admin/department-form-dialog';
import { DepartmentViewDialog } from '@/components/admin/department-view-dialog';
import { SubjectTable } from '@/components/admin/subject-table';
import { SubjectFormDialog } from '@/components/admin/subject-form-dialog';
import { SubjectViewDialog } from '@/components/admin/subject-view-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Users, UserCheck, UserX, Crown, Building2, CheckCircle2, XCircle, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export const dynamic = 'force-dynamic';

// Current admin user email (hardcoded as per requirements)
const current_user = 'mdmomin7517@gmail.com';

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState('faculty');
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Faculty dialogs
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);

  // Department dialogs
  const [isDeptAddDialogOpen, setIsDeptAddDialogOpen] = useState(false);
  const [isDeptEditDialogOpen, setIsDeptEditDialogOpen] = useState(false);
  const [isDeptViewDialogOpen, setIsDeptViewDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  // Subject dialogs
  const [isSubjectAddDialogOpen, setIsSubjectAddDialogOpen] = useState(false);
  const [isSubjectEditDialogOpen, setIsSubjectEditDialogOpen] = useState(false);
  const [isSubjectViewDialogOpen, setIsSubjectViewDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<number[]>([]);

  // Statistics
  const totalFaculty = faculty.length;
  const activeFaculty = faculty.filter((f) => f.is_active).length;
  const inactiveFaculty = faculty.filter((f) => !f.is_active).length;
  const hodCount = faculty.filter((f) => f.is_hod).length;

  const totalDepartments = departments.length;
  const activeDepartments = departments.filter((d) => d.is_department_active).length;
  const inactiveDepartments = departments.filter((d) => !d.is_department_active).length;

  const totalSubjects = subjects.length;
  const subjectsWithDept = subjects.filter((s) => s.department_id !== null).length;
  const subjectsWithoutDept = subjects.filter((s) => s.department_id === null).length;

  useEffect(() => {
    if (activeSection === 'faculty') {
      loadFaculty();
      // Load departments for the dropdown in faculty form
      if (departments.length === 0) {
        loadDepartments();
      }
    } else if (activeSection === 'departments') {
      loadDepartments();
      // Load faculty for the HOD names in department table
      if (faculty.length === 0) {
        loadFaculty();
      }
    } else if (activeSection === 'subjects') {
      loadSubjects();
      // Load departments for the dropdown in subject form
      if (departments.length === 0) {
        loadDepartments();
      }
    }
  }, [activeSection]);

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

  const loadDepartments = async () => {
    try {
      setLoading(true);
      console.log('Loading departments...');
      const data = await getAllDepartments();
      console.log('Departments loaded:', data);
      setDepartments(data);
    } catch (error) {
      console.error('Error loading departments:', error);
      toast.error('Failed to load departments: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const data = await getAllSubjects();
      setSubjects(data);
    } catch (error) {
      console.error('Error loading subjects:', error);
      toast.error('Failed to load subjects');
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
    // Check if faculty is HOD
    if (faculty.is_hod) {
      // Get the department this faculty is HOD of
      const department = await getDepartmentByHODId(faculty.unique_id);
      
      if (department) {
        const warningMessage = `⚠️ SERIOUS WARNING ⚠️

${faculty.faculty_first_name} ${faculty.faculty_last_name} is currently the HOD of "${department.department_name}".

Deleting this faculty will:

1. Remove them as HOD from "${department.department_name}"
2. DEACTIVATE the department "${department.department_name}"
3. Remove all HOD assignments from the Department table
4. PERMANENTLY DELETE the faculty member
5. This action CANNOT be undone

Department: ${department.department_name}
Current Status: ${department.is_department_active ? 'Active' : 'Inactive'}

Are you absolutely sure you want to proceed with deletion?`;

        if (!confirm(warningMessage)) {
          return;
        }
      } else {
        // Faculty is marked as HOD but no department found (data inconsistency)
        const warningMessage = `⚠️ WARNING ⚠️

${faculty.faculty_first_name} ${faculty.faculty_last_name} is marked as HOD but no department assignment found.

Deleting this faculty will permanently remove them from the system.

Are you sure you want to proceed?`;

        if (!confirm(warningMessage)) {
          return;
        }
      }
    } else {
      // Regular faculty deletion confirmation
      if (!confirm(`Are you sure you want to delete ${faculty.faculty_first_name} ${faculty.faculty_last_name}?`)) {
        return;
      }
    }

    try {
      await deleteFaculty(faculty.unique_id);
      toast.success('Faculty member deleted successfully' + (faculty.is_hod ? ' and removed as HOD from department' : ''));
      loadFaculty();
      // Reload departments if faculty was HOD
      if (faculty.is_hod) {
        loadDepartments();
      }
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
    const newStatus = !faculty.is_hod;
    const action = newStatus ? 'promote' : 'demote';
    const actionText = newStatus ? 'Promote' : 'Demote';
    
    // If demoting, check if faculty is HOD of a department and show serious warning
    if (!newStatus && faculty.is_hod) {
      // Get the department this faculty is HOD of
      const department = await getDepartmentByHODId(faculty.unique_id);
      
      if (department) {
        const warningMessage = `⚠️ SERIOUS WARNING ⚠️

Demoting ${faculty.faculty_first_name} ${faculty.faculty_last_name} as HOD will:

1. Remove them as HOD from "${department.department_name}"
2. DEACTIVATE the department "${department.department_name}"
3. Update both Faculty and Department tables
4. This action cannot be easily undone

Department: ${department.department_name}
Current Status: ${department.is_department_active ? 'Active' : 'Inactive'}

Are you absolutely sure you want to proceed?`;

        if (!confirm(warningMessage)) {
          return;
        }

        // Perform the demotion with department deactivation
        try {
          // This function now updates both faculty.is_hod and department tables
          await removeHODAndDeactivateDepartment(faculty.unique_id);
          
          toast.success(`Faculty demoted from HOD and department "${department.department_name}" has been deactivated`);
          loadFaculty();
          loadDepartments();
        } catch (error) {
          console.error('Error demoting HOD:', error);
          toast.error('Failed to demote faculty from HOD');
        }
        return;
      }
    }
    
    // Normal promote action - but HOD can only be assigned through department management
    if (newStatus) {
      toast.error('Faculty can only be promoted to HOD by assigning them as HOD in Department Management section');
      return;
    }

    // If somehow trying to demote without department (shouldn't happen)
    if (!confirm(`${actionText} ${faculty.faculty_first_name} ${faculty.faculty_last_name} ${newStatus ? 'to' : 'from'} HOD?`)) {
      return;
    }

    try {
      await promoteToHOD(faculty.unique_id, newStatus);
      toast.success(`Faculty member ${action}d ${newStatus ? 'to' : 'from'} HOD successfully`);
      loadFaculty();
    } catch (error) {
      console.error(`Error ${action}ing HOD:`, error);
      toast.error(`Failed to ${action} faculty ${newStatus ? 'to' : 'from'} HOD`);
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

  // Department handlers
  const handleDepartmentSearch = async () => {
    if (!searchQuery.trim()) {
      loadDepartments();
      return;
    }

    try {
      setLoading(true);
      const results = await searchDepartments(searchQuery);
      setDepartments(results);
      toast.success(`Found ${results.length} department(s)`);
    } catch (error) {
      console.error('Error searching departments:', error);
      toast.error('Failed to search departments');
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentAdd = async (data: DepartmentFormData) => {
    // Validate: Cannot create active department without HOD
    if (data.is_department_active && !data.department_hod_id) {
      toast.error('Cannot create an active department without assigning a HOD');
      throw new Error('HOD is required for active departments');
    }

    try {
      console.log('Adding department:', data);
      await createDepartment(data, current_user);
      toast.success('Department added successfully' + (data.department_hod_id ? ' and HOD assigned' : ''));
      loadDepartments();
      // Reload faculty to reflect HOD status changes
      if (data.department_hod_id) {
        loadFaculty();
      }
    } catch (error) {
      console.error('Error adding department:', error);
      toast.error('Failed to add department: ' + (error as Error).message);
      throw error;
    }
  };

  const handleDepartmentEdit = async (data: DepartmentFormData) => {
    if (!selectedDepartment) return;

    // Validate: Cannot make department active without HOD
    if (data.is_department_active && !data.department_hod_id) {
      toast.error('Cannot activate department without assigning a HOD');
      throw new Error('HOD is required for active departments');
    }

    try {
      await updateDepartment(selectedDepartment.department_id, data);
      toast.success('Department updated successfully');
      loadDepartments();
      // Reload faculty to reflect HOD status changes
      loadFaculty();
    } catch (error) {
      console.error('Error updating department:', error);
      toast.error('Failed to update department');
      throw error;
    }
  };

  const handleDepartmentDelete = async (department: Department) => {
    if (!confirm(`Are you sure you want to delete ${department.department_name}?`)) {
      return;
    }

    try {
      await deleteDepartment(department.department_id);
      toast.success('Department deleted successfully');
      loadDepartments();
      // Reload faculty to reflect HOD status changes if department had HOD
      if (department.department_hod_id) {
        loadFaculty();
      }
    } catch (error) {
      console.error('Error deleting department:', error);
      const errorMessage = (error as Error).message;
      // Display the full error message which includes faculty count details
      toast.error(errorMessage || 'Failed to delete department');
    }
  };

  const handleDepartmentToggleActive = async (department: Department) => {
    // If trying to activate, check if HOD is assigned
    if (!department.is_department_active && !department.department_hod_id) {
      toast.error('Cannot activate department without a HOD. Please assign a HOD first.');
      return;
    }

    try {
      await toggleDepartmentActiveStatus(department.department_id, !department.is_department_active);
      toast.success(
        `Department ${department.is_department_active ? 'deactivated' : 'activated'} successfully`
      );
      loadDepartments();
    } catch (error) {
      console.error('Error toggling department status:', error);
      toast.error('Failed to toggle department status');
    }
  };

  const handleDepartmentView = (department: Department) => {
    setSelectedDepartment(department);
    setIsDeptViewDialogOpen(true);
  };

  const handleDepartmentEditClick = (department: Department) => {
    setSelectedDepartment(department);
    setIsDeptEditDialogOpen(true);
  };

  // Subject handlers
  const handleSubjectSearch = async () => {
    if (!searchQuery.trim()) {
      loadSubjects();
      return;
    }

    try {
      setLoading(true);
      const results = await searchSubjects(searchQuery);
      setSubjects(results);
      toast.success(`Found ${results.length} subject(s)`);
    } catch (error) {
      console.error('Error searching subjects:', error);
      toast.error('Failed to search subjects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectAdd = async (data: SubjectFormData) => {
    try {
      await createSubject(data, current_user);
      toast.success('Subject added successfully');
      loadSubjects();
    } catch (error) {
      console.error('Error adding subject:', error);
      toast.error('Failed to add subject: ' + (error as Error).message);
      throw error;
    }
  };

  const handleSubjectEdit = async (data: SubjectFormData) => {
    if (!selectedSubject) return;

    try {
      await updateSubject(selectedSubject.unique_subject_id, data);
      toast.success('Subject updated successfully');
      loadSubjects();
    } catch (error) {
      console.error('Error updating subject:', error);
      toast.error('Failed to update subject');
      throw error;
    }
  };

  const handleSubjectDelete = async (subject: Subject) => {
    if (!confirm(`Are you sure you want to delete "${subject.subject_name}"?`)) {
      return;
    }

    try {
      await deleteSubject(subject.unique_subject_id);
      toast.success('Subject deleted successfully');
      loadSubjects();
    } catch (error) {
      console.error('Error deleting subject:', error);
      toast.error('Failed to delete subject');
    }
  };

  const handleSubjectView = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsSubjectViewDialogOpen(true);
  };

  const handleSubjectEditClick = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsSubjectEditDialogOpen(true);
  };

  const handleBulkAssignDepartment = async (departmentId: number | null) => {
    if (selectedSubjectIds.length === 0) {
      toast.error('Please select at least one subject');
      return;
    }

    const action = departmentId === null ? 'unassign' : 'assign';
    const deptName = departmentId 
      ? departments.find(d => d.department_id === departmentId)?.department_name 
      : 'No Department';

    if (!confirm(`Are you sure you want to ${action} ${selectedSubjectIds.length} subject(s) ${departmentId ? `to "${deptName}"` : 'from their department'}?`)) {
      return;
    }

    try {
      await bulkAssignSubjectsToDepartment(selectedSubjectIds, departmentId);
      toast.success(`Successfully ${action}ed ${selectedSubjectIds.length} subject(s)`);
      setSelectedSubjectIds([]);
      loadSubjects();
    } catch (error) {
      console.error('Error assigning subjects:', error);
      toast.error(`Failed to ${action} subjects`);
    }
  };

  return (
    <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection}>
      <div className="space-y-6">
        {activeSection === 'faculty' && (
          <>
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
          </>
        )}

        {activeSection === 'departments' && (
          <>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">Department Management</h1>
                <p className="text-muted-foreground">
                  Manage departments and their information
                </p>
              </div>
              <Button onClick={() => setIsDeptAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Department
              </Button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Departments
                  </CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalDepartments}</div>
                  <p className="text-xs text-muted-foreground">
                    All departments
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Departments
                  </CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeDepartments}</div>
                  <p className="text-xs text-muted-foreground">
                    Currently active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Inactive Departments
                  </CardTitle>
                  <XCircle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{inactiveDepartments}</div>
                  <p className="text-xs text-muted-foreground">
                    Currently inactive
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
                      placeholder="Search by department name or admin email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleDepartmentSearch()}
                      className="pl-10"
                    />
                  </div>
                  <Button onClick={handleDepartmentSearch} disabled={loading}>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                  {searchQuery && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery('');
                        loadDepartments();
                      }}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Department Table */}
            <Card>
              <CardHeader>
                <CardTitle>Departments</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading departments...
                  </div>
                ) : (
                  <DepartmentTable
                    departments={departments}
                    faculty={faculty}
                    onView={handleDepartmentView}
                    onEdit={handleDepartmentEditClick}
                    onDelete={handleDepartmentDelete}
                    onToggleActive={handleDepartmentToggleActive}
                  />
                )}
              </CardContent>
            </Card>
          </>
        )}

        {activeSection === 'subjects' && (
          <>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">Subject Management</h1>
                <p className="text-muted-foreground">
                  Manage subjects and their information
                </p>
              </div>
              <Button onClick={() => setIsSubjectAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Subject
              </Button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Subjects
                  </CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalSubjects}</div>
                  <p className="text-xs text-muted-foreground">
                    All subjects
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    With Department
                  </CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{subjectsWithDept}</div>
                  <p className="text-xs text-muted-foreground">
                    Assigned to departments
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Without Department
                  </CardTitle>
                  <XCircle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{subjectsWithoutDept}</div>
                  <p className="text-xs text-muted-foreground">
                    Not assigned
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
                      placeholder="Search by subject name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubjectSearch()}
                      className="pl-10"
                    />
                  </div>
                  <Button onClick={handleSubjectSearch} disabled={loading}>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                  {searchQuery && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery('');
                        loadSubjects();
                      }}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Bulk Actions */}
            {selectedSubjectIds.length > 0 && (
              <Card className="border-primary">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1">
                      <p className="font-medium">
                        {selectedSubjectIds.length} subject{selectedSubjectIds.length > 1 ? 's' : ''} selected
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Assign or unassign selected subjects to/from departments
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <select
                        className="px-3 py-2 border rounded-md text-sm"
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value) {
                            handleBulkAssignDepartment(value === 'none' ? null : parseInt(value));
                            e.target.value = '';
                          }
                        }}
                        defaultValue=""
                      >
                        <option value="" disabled>Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept.department_id} value={dept.department_id}>
                            {dept.department_name}
                          </option>
                        ))}
                        <option value="none">Unassign from Department</option>
                      </select>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedSubjectIds([])}
                      >
                        Clear Selection
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Subject Table */}
            <Card>
              <CardHeader>
                <CardTitle>Subjects</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading subjects...
                  </div>
                ) : (
                  <SubjectTable
                    subjects={subjects}
                    departments={departments}
                    onView={handleSubjectView}
                    onEdit={handleSubjectEditClick}
                    onDelete={handleSubjectDelete}
                    selectedSubjects={selectedSubjectIds}
                    onSelectionChange={setSelectedSubjectIds}
                  />
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Faculty Dialogs */}
      <FacultyFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        departments={departments}
        onSave={handleAdd}
        isEdit={false}
      />

      <FacultyFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        faculty={selectedFaculty}
        departments={departments}
        onSave={handleEdit}
        isEdit={true}
      />

      <FacultyViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        faculty={selectedFaculty}
      />

      {/* Department Dialogs */}
      <DepartmentFormDialog
        open={isDeptAddDialogOpen}
        onOpenChange={setIsDeptAddDialogOpen}
        onSave={handleDepartmentAdd}
        isEdit={false}
      />

      <DepartmentFormDialog
        open={isDeptEditDialogOpen}
        onOpenChange={setIsDeptEditDialogOpen}
        department={selectedDepartment}
        onSave={handleDepartmentEdit}
        isEdit={true}
      />

      <DepartmentViewDialog
        open={isDeptViewDialogOpen}
        onOpenChange={setIsDeptViewDialogOpen}
        department={selectedDepartment}
        faculty={faculty}
      />

      {/* Subject Dialogs */}
      <SubjectFormDialog
        open={isSubjectAddDialogOpen}
        onOpenChange={setIsSubjectAddDialogOpen}
        onSave={handleSubjectAdd}
        departments={departments}
        isEdit={false}
      />

      <SubjectFormDialog
        open={isSubjectEditDialogOpen}
        onOpenChange={setIsSubjectEditDialogOpen}
        onSave={handleSubjectEdit}
        subject={selectedSubject}
        departments={departments}
        isEdit={true}
      />

      <SubjectViewDialog
        open={isSubjectViewDialogOpen}
        onOpenChange={setIsSubjectViewDialogOpen}
        subject={selectedSubject}
        departments={departments}
      />
    </AdminSidebar>
  );
}