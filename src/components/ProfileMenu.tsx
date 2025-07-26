
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
import { useIsMobile } from '@/hooks/use-mobile';
import { useRouter } from 'next/navigation';


export function ProfileMenu() {
  const isMobile = useIsMobile();
  const router = useRouter();

  if (isMobile) {
    // On mobile, this menu is replaced by the bottom nav link, so we render nothing.
    return null;
  }

  return (
    <Button
        variant="ghost"
        size="icon"
        className="rounded-full hover:bg-transparent"
        onClick={() => router.push('/profile')}
    >
        <Avatar className="h-8 w-8" data-slot="avatar">
        <AvatarFallback>F</AvatarFallback>
        </Avatar>
        <span className="sr-only">Open profile page</span>
    </Button>
  );
}
