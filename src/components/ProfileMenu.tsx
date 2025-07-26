
'use client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, LifeBuoy, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/use-language';


export function ProfileMenu() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const { t } = useLanguage();

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
        <span className="sr-only">{t('profile.open')}</span>
    </Button>
  );
}
