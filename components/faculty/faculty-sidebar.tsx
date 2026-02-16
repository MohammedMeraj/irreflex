'use client';

import * as React from 'react';
import {
  Home,
  Users,
  ClipboardCheck,
  UserCircle,
  Settings,
  LogOut,
  Menu,
  GraduationCap,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface FacultySidebarProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  {
    title: 'Home',
    icon: Home,
    section: 'home',
  },
  {
    title: 'Students',
    icon: Users,
    section: 'students',
  },
  {
    title: 'Add Attendance',
    icon: ClipboardCheck,
    section: 'attendance',
  },
  {
    title: 'Profile',
    icon: UserCircle,
    section: 'profile',
  },
  {
    title: 'Settings',
    icon: Settings,
    section: 'settings',
  },
];

export function FacultySidebar({
  children,
  activeSection,
  onSectionChange,
}: FacultySidebarProps) {
  const [open, setOpen] = React.useState(false);

  const SidebarContent_Component = () => (
    <>
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6" />
          <div>
            <h2 className="text-lg font-bold">Faculty Portal</h2>
            <p className="text-xs text-muted-foreground">Teaching Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.section}>
                  <SidebarMenuButton
                    onClick={() => {
                      onSectionChange(item.section);
                      setOpen(false);
                    }}
                    isActive={activeSection === item.section}
                    className="cursor-pointer"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <Button variant="outline" className="w-full justify-start" size="sm">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </SidebarFooter>
    </>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <div className="flex items-center gap-2 p-4 border-b">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <SidebarProvider>
                <Sidebar>
                  <SidebarContent_Component />
                </Sidebar>
              </SidebarProvider>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            <h1 className="text-lg font-bold">Faculty Portal</h1>
          </div>
        </div>
        <main className="p-4 md:p-6">{children}</main>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <Sidebar className="border-r">
              <SidebarContent_Component />
            </Sidebar>
            <div className="flex-1 flex flex-col">
              <header className="border-b p-4 flex items-center gap-2">
                <SidebarTrigger />
                <h1 className="text-xl font-bold">Faculty Dashboard</h1>
              </header>
              <main className="flex-1 p-6 overflow-auto">{children}</main>
            </div>
          </div>
        </SidebarProvider>
      </div>
    </>
  );
}
