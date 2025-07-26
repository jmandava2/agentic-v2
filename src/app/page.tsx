
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf, Mic, Languages } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

export default function LandingPage() {
  const { t } = useLanguage();
  return (
    <div
      className="flex min-h-screen flex-col p-8 md:p-16"
      style={{ backgroundColor: 'hsl(120 50% 97%)' }}
    >
      <header className="flex items-center gap-3 mb-16">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Leaf className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="font-headline text-2xl font-bold text-foreground">
          {t('landing.appName')}
        </h1>
      </header>

      <main className="flex-grow flex flex-col justify-center">
        <div className="max-w-3xl">
          <h2 className="font-headline text-5xl font-bold text-foreground leading-tight md:text-6xl">
            {t('landing.headline.part1')},{' '}
            <span className="text-primary">{t('landing.headline.part2')}</span>
          </h2>
          <p className="mt-4 font-body text-xl text-muted-foreground md:text-2xl">
            {t('landing.tagline')}
          </p>
          <Button asChild size="lg" className="mt-10 h-14 px-8 text-lg">
            <Link href="/dashboard">
                <span>{t('landing.cta')}</span>
                <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </main>

       <footer className="flex items-center gap-6 text-muted-foreground">
          <div className='flex items-center gap-2'>
            <Mic className="h-5 w-5" />
            <span>{t('landing.footer.voice')}</span>
          </div>
           <div className='flex items-center gap-2'>
            <Languages className="h-5 w-5" />
            <span>{t('landing.footer.languages')}</span>
          </div>
      </footer>
    </div>
  );
}
