
'use client';
import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { VoiceButton } from './voice/VoiceButton';

const pageTitles: { [key: string]: string } = {
  '/': 'Dashboard',
  '/market-advisory': 'Market Advisory',
  '/health-check': 'Health Check-in',
  '/yield-check': 'Yield Check-in',
};

export function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? 'Namma Krushi';

  return (
    <header className="fixed left-0 top-0 z-10 flex h-14 w-full items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm md:h-[4.5rem] md:px-6 peer-data-[variant=sidebar]:pl-14">
      <div className="flex items-center gap-2 md:hidden">
        <SidebarTrigger />
      </div>
      <h1 className="font-headline text-xl font-semibold md:text-2xl">
        {title}
      </h1>
      <div className="ml-auto flex items-center gap-4">
        <VoiceButton />
        <Avatar>
          <AvatarImage src="https://placehold.co/40x40" alt="User" />
          <AvatarFallback>NK</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
