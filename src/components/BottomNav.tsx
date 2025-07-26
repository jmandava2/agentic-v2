
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LineChart, ClipboardCheck, User, Landmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProfileMenu } from './ProfileMenu';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/market-advisory', label: 'Market', icon: LineChart },
  { href: '/check-in', label: 'Check-in', icon: ClipboardCheck },
  { href: '/schemes', label: 'Schemes', icon: Landmark },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-30 border-t bg-background/95 backdrop-blur-sm md:hidden">
      <nav className="flex h-16 items-center justify-around">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center gap-1 p-2 text-muted-foreground',
              pathname.startsWith(item.href) && 'text-foreground'
            )}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
        <div className="flex flex-col items-center gap-1 p-2 text-muted-foreground [&>div]:h-6 [&>div]:w-6">
           <ProfileMenu />
           <span className="text-xs font-medium">Profile</span>
        </div>
      </nav>
    </footer>
  );
}
