
'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  Home,
  LineChart,
  Leaf,
  Landmark,
  User,
} from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

export function AppSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const links = [
    { href: '/dashboard', label: t('sidebar.dashboard'), icon: Home },
    { href: '/market-advisory', label: t('sidebar.market'), icon: LineChart },
    { href: '/schemes', label: t('sidebar.schemes'), icon: Landmark },
    { href: '/profile', label: t('sidebar.profile'), icon: User },
  ];

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-headline text-lg font-semibold">
            {t('appName')}
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(link.href)}
                tooltip={{ children: link.label }}
              >
                <Link href={link.href}>
                  <link.icon />
                  <span>{link.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
