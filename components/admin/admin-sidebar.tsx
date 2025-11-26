'use client';

import * as React from 'react';
import {
  Users,
  UserCog,
  Database,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  Building2,
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

interface AdminSidebarProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  {
    title: 'Faculty Management',
    icon: Users,
    section: 'faculty',
  },
  {
    title: 'Departments',
    icon: Building2,
    section: 'departments',
  },
  {
    title: 'Statistics',
    icon: BarChart3,
    section: 'stats',
  },
  {
    title: 'Database',
    icon: Database,
    section: 'database',
  },
  {
    title: 'Settings',
    icon: Settings,
    section: 'settings',
  },
];

export function AdminSidebar({
  children,
  activeSection,
  onSectionChange,
}: AdminSidebarProps) {
  const [open, setOpen] = React.useState(false);

  const SidebarContent_Component = () => (
    <>
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <UserCog className="h-6 w-6" />
          <div>
            <h2 className="text-lg font-bold">Admin Area</h2>
            <p className="text-xs text-muted-foreground">Faculty Management</p>
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
        <Button variant="ghost" className="w-full justify-start" size="sm">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-screen">
        <SidebarProvider>
          <Sidebar>
            <SidebarContent_Component />
          </Sidebar>
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="border-b px-6 py-4 flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">
                {menuItems.find((item) => item.section === activeSection)?.title || 'Admin Dashboard'}
              </h1>
            </header>
            <main className="flex-1 overflow-auto p-6">{children}</main>
          </div>
        </SidebarProvider>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col h-screen">
        <header className="border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            <h1 className="text-lg font-semibold">Admin Area</h1>
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <div className="flex flex-col h-full">
                <div className="border-b px-6 py-4">
                  <div className="flex items-center gap-2">
                    <UserCog className="h-6 w-6" />
                    <div>
                      <h2 className="text-lg font-bold">Admin Area</h2>
                      <p className="text-xs text-muted-foreground">Faculty Management</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-auto p-4">
                  <div className="space-y-1">
                    {menuItems.map((item) => (
                      <Button
                        key={item.section}
                        variant={activeSection === item.section ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => {
                          onSectionChange(item.section);
                          setOpen(false);
                        }}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.title}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="border-t p-4">
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </>
  );
}
