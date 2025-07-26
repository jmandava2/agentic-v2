
'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { VoiceButton } from './voice/VoiceButton';
import { User, LifeBuoy, LogOut } from 'lucide-react';

const pageTitles: { [key: string]: string } = {
  '/dashboard': 'Dashboard',
  '/market-advisory': 'Market Advisory',
  '/health-check': 'Health Check-in',
  '/yield-check': 'Yield Check-in',
};

export function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? 'Namma Krushi';

  return (
    <header className="fixed left-0 top-0 z-10 flex h-14 w-full items-center border-b bg-background/95 backdrop-blur-sm md:h-[4.5rem] peer-data-[variant=sidebar]:pl-14">
      <div className="flex h-full flex-grow items-center px-4 md:px-6">
        <div className="flex items-center gap-2 md:hidden">
          <SidebarTrigger />
        </div>
        <h1 className="font-headline text-xl font-semibold md:text-2xl">
          {title}
        </h1>
        <div className="ml-auto flex items-center gap-4">
          <VoiceButton />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src="https://placehold.co/40x40" alt="User" data-ai-hint="person portrait" />
                <AvatarFallback>NK</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>User: farmer@krushi.co</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Support</DropdownMenuLabel>
              <DropdownMenuItem>
                <LifeBuoy className="mr-2 h-4 w-4" />
                <span>Phone: +91-9876543210</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Email: help@krushi.co</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
