
'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  Home,
  LineChart,
  Landmark,
  User,
  LogIn,
  LogOut,
  HeartPulse,
  BarChart,
} from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useAuth } from '@/hooks/use-auth';
import { LoginDialog } from '@/components/auth/LoginDialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Logo } from './ui/logo';

export function AppSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const links = [
    { href: '/dashboard', label: t('sidebar.dashboard'), icon: Home },
    { href: '/market', label: t('sidebar.market'), icon: LineChart },
    { href: '/health', label: t('sidebar.health'), icon: HeartPulse },
    { href: '/analytics', label: t('sidebar.analytics'), icon: BarChart },
    { href: '/schemes', label: t('sidebar.schemes'), icon: Landmark },
    { href: '/profile', label: t('sidebar.profile'), icon: User },
  ];

  return (
    <>
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg">
            <Logo />
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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground px-2">
                  Signed in as: {user?.email}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="w-full justify-start"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLoginDialog(true)}
                className="w-full justify-start"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
