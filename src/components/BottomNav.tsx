
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LineChart, HeartPulse, Wheat, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VoiceButton } from './voice/VoiceButton';
import { ProfileMenu } from './Header';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/market-advisory', label: 'Market', icon: LineChart },
  { href: '/health-check', label: 'Health', icon: HeartPulse },
  { href: '/yield-check', label: 'Yield', icon: Wheat },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-20 border-t bg-background/95 backdrop-blur-sm md:hidden">
      <nav className="flex h-16 items-center justify-around">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex flex-col items-center gap-1 p-2 rounded-md text-xs font-medium transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <link.icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
        <VoiceButton />
        <ProfileMenu />
      </nav>
    </footer>
  );
}
