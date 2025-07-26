
'use client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LifeBuoy, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export function ProfileMenu() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const isProfileActive = false; // Add logic here if a profile page is ever created

  if (isMobile) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className={cn(
            'flex flex-col items-center gap-1 p-2 text-gray-400 transition-colors',
            isProfileActive && 'text-primary'
          )}
        >
          <div>
            <User className="h-6 w-6" />
            <span className="text-xs font-medium">Profile</span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 mb-2">
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
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-transparent"
        >
          <Avatar className="h-8 w-8" data-slot="avatar">
            <AvatarFallback>F</AvatarFallback>
          </Avatar>
          <span className="sr-only">Open user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mb-2">
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
  );
}
