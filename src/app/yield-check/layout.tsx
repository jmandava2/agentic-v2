
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppLayout } from '@/components/AppLayout';

export default function YieldCheckLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppLayout>{children}</AppLayout>
    </SidebarProvider>
  );
}
