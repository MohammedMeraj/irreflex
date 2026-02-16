'use client';

import React, { useState, useEffect } from 'react';
import { Faculty } from '@/types/faculty';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { AlertTriangle } from 'lucide-react';

interface HODReplacementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentHOD: Faculty | null;
  departmentFaculty: Faculty[];
  onConfirm: (newHODId: number | null, keepDepartmentActive: boolean) => Promise<void>;
  isDeactivation?: boolean;
}

export function HODReplacementDialog({
  open,
  onOpenChange,
  currentHOD,
  departmentFaculty,
  onConfirm,
  isDeactivation = false,
}: HODReplacementDialogProps) {
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>('');
  const [keepDepartmentActive, setKeepDepartmentActive] = useState(true);
  const [loading, setLoading] = useState(false);

  // Reset selection when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedFacultyId('');
      setKeepDepartmentActive(true);
    }
  }, [open]);

  const handleConfirm = async () => {
    // If keeping department active, must select a new HOD
    if (keepDepartmentActive && !selectedFacultyId) {
      return;
    }

    setLoading(true);
    try {
      await onConfirm(
        selectedFacultyId ? parseInt(selectedFacultyId) : null,
        keepDepartmentActive
      );
      onOpenChange(false);
    } catch (error) {
      console.error('Error replacing HOD:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentHOD) return null;

  // Filter out the current HOD from the list
  const availableFaculty = departmentFaculty.filter(
    f => f.unique_id !== currentHOD.unique_id && f.is_active
  );

  const hasAvailableFaculty = availableFaculty.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            {isDeactivation ? 'HOD Deactivation' : 'HOD Demotion'}
          </DialogTitle>
          <DialogDescription>
            {isDeactivation 
              ? 'HODs cannot be deactivated directly. Please select a replacement HOD or disable the department.'
              : 'Select a replacement HOD from the same department or disable the department.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Current HOD (Will be demoted)</Label>
            <div className="p-3 bg-muted rounded-md">
              <p className="font-medium">
                {currentHOD.faculty_first_name} {currentHOD.faculty_last_name}
              </p>
              <p className="text-sm text-muted-foreground">
                {currentHOD.faculty_email}
              </p>
              <p className="text-sm text-muted-foreground">
                Department: {currentHOD.faculty_department}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-md">
              <div className="space-y-0.5">
                <Label htmlFor="keep-dept-active" className="font-medium">
                  Keep Department Active
                </Label>
                <p className="text-sm text-muted-foreground">
                  {keepDepartmentActive 
                    ? 'Department will remain active with new HOD' 
                    : 'Department will be deactivated without HOD'}
                </p>
              </div>
              <Switch
                id="keep-dept-active"
                checked={keepDepartmentActive}
                onCheckedChange={setKeepDepartmentActive}
                disabled={!hasAvailableFaculty}
              />
            </div>

            {!hasAvailableFaculty && (
              <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm font-medium text-red-900 dark:text-red-100">
                  No Eligible Faculty Available
                </p>
                <p className="text-sm text-red-800 dark:text-red-200 mt-1">
                  There are no other active faculty members in this department. The department will be deactivated.
                </p>
              </div>
            )}

            {keepDepartmentActive && (
              <div className="space-y-2">
                <Label htmlFor="new_hod">Select New HOD *</Label>
                <Select
                  value={selectedFacultyId}
                  onValueChange={setSelectedFacultyId}
                  required={keepDepartmentActive}
                  disabled={!hasAvailableFaculty}
                >
                  <SelectTrigger id="new_hod">
                    <SelectValue placeholder="Select faculty to promote as HOD" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFaculty.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground text-center">
                        No other active faculty in this department
                      </div>
                    ) : (
                      availableFaculty.map((faculty) => (
                        <SelectItem key={faculty.unique_id} value={faculty.unique_id.toString()}>
                          {faculty.faculty_first_name} {faculty.faculty_last_name} ({faculty.faculty_email})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Only active faculty from {currentHOD.faculty_department} department are shown
                </p>
              </div>
            )}
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
              What will happen:
            </p>
            <ul className="text-sm text-amber-800 dark:text-amber-200 mt-2 space-y-1 list-disc list-inside">
              <li>Current HOD will be demoted to regular faculty</li>
              {isDeactivation && <li>Current HOD will be deactivated</li>}
              {keepDepartmentActive ? (
                <>
                  <li>Selected faculty will be promoted to HOD</li>
                  <li>Department will remain active</li>
                </>
              ) : (
                <>
                  <li>Department will be deactivated</li>
                  <li>Department HOD will be removed</li>
                </>
              )}
              
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={(keepDepartmentActive && !selectedFacultyId) || loading}
          >
            {loading ? 'Processing...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
