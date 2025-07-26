
'use client';

import { type ReactNode } from 'react';
import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { AssistantBar } from '@/components/AssistantBar';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Sidebar variant="sidebar" collapsible="icon">
        <AppSidebar />
      </Sidebar>
      <SidebarInset className="p-4 md:p-6 pb-24 md:pb-6">{children}</SidebarInset>
      <AssistantBar />
    </>
  );
}
