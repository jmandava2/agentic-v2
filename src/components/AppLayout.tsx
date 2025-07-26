'use client';

import type { ReactNode } from 'react';
import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Sidebar variant="sidebar" collapsible="icon">
        <AppSidebar />
      </Sidebar>
      <Header />
      <SidebarInset className="p-4 pt-16 md:p-6 md:pt-[4.5rem] pb-24 md:pb-6">
        {children}
      </SidebarInset>
      <BottomNav />
    </>
  );
}
