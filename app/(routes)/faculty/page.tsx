'use client';

import React, { useState, useEffect } from 'react';
import { Faculty, FacultyFormData } from '@/types/faculty';
import { updateFaculty } from '@/lib/faculty-service';
import { FacultySidebar } from '@/components/faculty/faculty-sidebar';
import { FacultyProfileDialog } from '@/components/faculty/faculty-profile-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Home, 
  Users, 
  ClipboardCheck, 
  UserCircle, 
  Settings,
  Crown,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  Edit,
  CheckCircle2,
  XCircle,
  BookOpen,
  TrendingUp,
  Award,
  Bell,
  Lock,
  Eye,
  Download,
  Filter,
  Search,
  Save,
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

export const dynamic = 'force-dynamic';

// Current faculty user email (hardcoded for now - will be from auth later)
const current_user = 'faculty1@example.com';

const FacultyPage = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [facultyData, setFacultyData] = useState<Faculty | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

  // Settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [attendanceReminders, setAttendanceReminders] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Attendance state
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [attendanceList, setAttendanceList] = useState<any[]>([]);

  // Fetch current faculty data
  const fetchFacultyData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('faculty')
        .select('*')
        .eq('faculty_email', current_user)
        .single();

      if (error) throw error;
      setFacultyData(data);
    } catch (error) {
      console.error('Error fetching faculty data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacultyData();
  }, []);

  // Handle profile update
  const handleProfileUpdate = async (data: Partial<FacultyFormData>) => {
    if (!facultyData) return;

    try {
      await updateFaculty(facultyData.unique_id, {
        faculty_first_name: data.faculty_first_name!,
        faculty_last_name: data.faculty_last_name!,
        faculty_email: facultyData.faculty_email,
        faculty_department: facultyData.faculty_department,
        faculty_phone: data.faculty_phone,
        faculty_qualification: data.faculty_qualification,
        is_active: facultyData.is_active,
        is_hod: facultyData.is_hod,
        admin_email: facultyData.admin_email,
      });
      
      toast.success('Profile updated successfully');
      fetchFacultyData();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      throw error;
    }
  };

  // Handle settings save
  const handleSaveSettings = () => {
    // Save settings logic here
    toast.success('Settings saved successfully');
  };

  // Handle attendance submission
  const handleSubmitAttendance = () => {
    if (!selectedClass || !selectedSubject) {
      toast.error('Please select class and subject');
      return;
    }
    toast.success('Attendance marked successfully');
  };

  const renderContent = () => {
    if (activeSection === 'home') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Welcome back, {facultyData?.faculty_first_name || 'Faculty'}!
            </h2>
            <p className="text-muted-foreground">
              Here's an overview of your teaching dashboard
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Across all classes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">This semester</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0%</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Department</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold truncate">
                  {facultyData?.faculty_department || 'Not Assigned'}
                </div>
                {facultyData?.is_hod && (
                  <p className="text-xs text-amber-600 font-medium flex items-center gap-1">
                    <Crown className="h-3 w-3" />
                    HOD
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" />
                  Attendance Overview
                </CardTitle>
                <CardDescription>Recent attendance statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <div>
                      <p className="font-medium">This Week</p>
                      <p className="text-sm text-muted-foreground">0 sessions marked</p>
                    </div>
                    <div className="text-2xl font-bold">0%</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <div>
                      <p className="font-medium">This Month</p>
                      <p className="text-sm text-muted-foreground">0 sessions marked</p>
                    </div>
                    <div className="text-2xl font-bold">0%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Recent Achievements
                </CardTitle>
                <CardDescription>Your recent milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <div>
                      <p className="font-medium">Perfect Attendance</p>
                      <p className="text-sm text-muted-foreground">100% attendance marked this week</p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-3">
                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-4"
                  onClick={() => setActiveSection('attendance')}
                >
                  <div className="flex flex-col items-start gap-1 w-full">
                    <div className="flex items-center gap-2">
                      <ClipboardCheck className="h-4 w-4" />
                      <span className="font-semibold">Mark Attendance</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Record student attendance</span>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-4"
                  onClick={() => setActiveSection('students')}
                >
                  <div className="flex flex-col items-start gap-1 w-full">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span className="font-semibold">View Students</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Manage your students</span>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-4"
                  onClick={() => setActiveSection('profile')}
                >
                  <div className="flex flex-col items-start gap-1 w-full">
                    <div className="flex items-center gap-2">
                      <UserCircle className="h-4 w-4" />
                      <span className="font-semibold">Update Profile</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Edit your information</span>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeSection === 'students') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Students</h2>
            <p className="text-muted-foreground">
              Manage and view your students
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Student Management</CardTitle>
              <CardDescription>View and manage students assigned to your classes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Student management coming soon...</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeSection === 'attendance') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Mark Attendance</h2>
            <p className="text-muted-foreground">
              Record student attendance for your classes
            </p>
          </div>

          {/* Attendance Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Class Details</CardTitle>
              <CardDescription>Choose class, subject, and date to mark attendance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="class">Class *</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger id="class">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="class1">Class 1-A</SelectItem>
                      <SelectItem value="class2">Class 1-B</SelectItem>
                      <SelectItem value="class3">Class 2-A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="math">Mathematics</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => toast.info('Loading students...')}>
                  <Search className="h-4 w-4 mr-2" />
                  Load Students
                </Button>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Attendance List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Student Attendance</CardTitle>
                  <CardDescription>Mark students as present or absent</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedClass && selectedSubject ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <div className="flex items-center gap-3">
                      <Checkbox id="select-all" />
                      <Label htmlFor="select-all" className="font-medium cursor-pointer">
                        Select All Present
                      </Label>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      0 students loaded
                    </div>
                  </div>

                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No students to display</p>
                    <p className="text-sm">Click "Load Students" to fetch the student list</p>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button onClick={handleSubmitAttendance} className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Submit Attendance
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setSelectedClass('');
                      setSelectedSubject('');
                      setSelectedDate(new Date().toISOString().split('T')[0]);
                    }}>
                      Reset
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <ClipboardCheck className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Select class and subject to begin</p>
                  <p className="text-sm">Choose the required fields above to load students</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeSection === 'profile') {
      if (loading) {
        return (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        );
      }

      if (!facultyData) {
        return (
          <div className="flex items-center justify-center py-12">
            <p className="text-red-500">Failed to load profile data</p>
          </div>
        );
      }

      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
              <p className="text-muted-foreground">
                Manage your personal information
              </p>
            </div>
            <Button onClick={() => setIsProfileDialogOpen(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Personal Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCircle className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                  <p className="text-lg font-semibold">
                    {facultyData.faculty_first_name} {facultyData.faculty_last_name}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <p className="text-base">{facultyData.faculty_email}</p>
                  <p className="text-xs text-muted-foreground mt-1">Cannot be changed</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <p className="text-base">
                    {facultyData.faculty_phone || 'Not provided'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Qualification
                  </Label>
                  <p className="text-base">
                    {facultyData.faculty_qualification || 'Not provided'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Department & Role Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Department & Role
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Department</Label>
                  <p className="text-lg font-semibold">
                    {facultyData.faculty_department || 'Not Assigned'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Assigned by admin</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Role</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {facultyData.is_hod ? (
                      <>
                        <Crown className="h-5 w-5 text-amber-600" />
                        <span className="text-base font-semibold text-amber-600">
                          Head of Department
                        </span>
                      </>
                    ) : (
                      <span className="text-base">Faculty Member</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Role assigned by admin</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Account Status</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {facultyData.is_active ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span className="text-base font-semibold text-green-600">Active</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-red-600" />
                        <span className="text-base font-semibold text-red-600">Inactive</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <Label className="text-sm font-medium text-muted-foreground">Account Created</Label>
                  <p className="text-sm">
                    {facultyData.created_at 
                      ? new Date(facultyData.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : new Date(facultyData.created_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Important Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                • You can update your name, phone number, and qualification
              </p>
              <p className="text-sm text-muted-foreground">
                • Email address cannot be changed once set
              </p>
              <p className="text-sm text-muted-foreground">
                • Department assignment and role (HOD/Faculty) are managed by admin
              </p>
              <p className="text-sm text-muted-foreground">
                • Contact your admin if you need changes to restricted fields
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeSection === 'settings') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">
              Manage your preferences and account settings
            </p>
          </div>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notif" className="text-base font-medium">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  id="email-notif"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notif" className="text-base font-medium">
                    Push Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications in browser
                  </p>
                </div>
                <Switch
                  id="push-notif"
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="attendance-remind" className="text-base font-medium">
                    Attendance Reminders
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Daily reminders to mark attendance
                  </p>
                </div>
                <Switch
                  id="attendance-remind"
                  checked={attendanceReminders}
                  onCheckedChange={setAttendanceReminders}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security
              </CardTitle>
              <CardDescription>
                Manage your password and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                />
              </div>

              <Button className="w-full" onClick={() => toast.success('Password updated successfully')}>
                Update Password
              </Button>
            </CardContent>
          </Card>

          {/* Display Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Display Preferences
              </CardTitle>
              <CardDescription>
                Customize your viewing experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                    <SelectItem value="mr">Marathi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="ist">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ist">IST (India Standard Time)</SelectItem>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">EST</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-format">Date Format</Label>
                <Select defaultValue="dd-mm-yyyy">
                  <SelectTrigger id="date-format">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                    <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                    <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Save Settings Button */}
          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} size="lg">
              <Save className="h-4 w-4 mr-2" />
              Save All Settings
            </Button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <FacultySidebar activeSection={activeSection} onSectionChange={setActiveSection}>
        {renderContent()}
      </FacultySidebar>

      <FacultyProfileDialog
        open={isProfileDialogOpen}
        onOpenChange={setIsProfileDialogOpen}
        faculty={facultyData}
        onSave={handleProfileUpdate}
      />
    </>
  );
};

export default FacultyPage;