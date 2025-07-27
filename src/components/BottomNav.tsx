
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LineChart, User, Landmark, HeartPulse } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProfileMenu } from './ProfileMenu';
import { useLanguage } from '@/hooks/use-language';

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: '/dashboard', label: t('sidebar.dashboard'), icon: Home },
    { href: '/market-advisory', label: t('sidebar.market'), icon: LineChart },
    { href: '/health', label: t('sidebar.health'), icon: HeartPulse },
    { href: '/schemes', label: t('sidebar.schemes'), icon: Landmark },
    { href: '/profile', label: t('sidebar.profile'), icon: User },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-30 bg-black md:hidden">
      <nav className="flex h-16 items-center justify-around">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center gap-1 p-2 text-gray-400 transition-colors',
              pathname.startsWith(item.href) && 'text-primary'
            )}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </footer>
  );
}
