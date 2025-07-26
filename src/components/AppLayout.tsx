
'use client';

import type { ReactNode } from 'react';
import { Sidebar, SidebarInset, useSidebar } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Header } from '@/components/Header';
import { useState, useEffect } from 'react';

export function AppLayout({ children }: { children: ReactNode }) {
  const { isMobile } = useSidebar();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  return (
    <>
      {isClient && (
        <>
          <Sidebar variant="sidebar" collapsible="icon">
            <AppSidebar />
          </Sidebar>
          <Header />
        </>
      )}
      <SidebarInset className="p-4 pt-16 md:p-6 md:pt-[4.5rem]">
        {children}
      </SidebarInset>
    </>
  );
}
