
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf, Mic, Languages } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background p-8 md:p-16">
      <header className="flex items-center gap-3 mb-16">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Leaf className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="font-headline text-2xl font-bold text-foreground">
          Namma Krushi
        </h1>
      </header>

      <main className="flex-grow flex flex-col justify-center">
        <div className="max-w-3xl">
          <h2 className="font-headline text-5xl font-bold text-foreground leading-tight md:text-6xl">
            Namma Ooru,{' '}
            <span className="text-primary">Namma Krushi.</span>
          </h2>
          <p className="mt-4 font-body text-xl text-muted-foreground md:text-2xl">
            Your AI Farming Ally. Proactive advice for your farm, in your
            language, backed by intelligent analysis.
          </p>
          <Button asChild size="lg" className="mt-10 h-14 px-8 text-lg bg-foreground text-primary hover:bg-foreground/90">
            <Link href="/dashboard">
                <span>Enter Dashboard</span>
                <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </main>

       <footer className="flex items-center gap-6 text-muted-foreground">
          <div className='flex items-center gap-2'>
            <Mic className="h-5 w-5" />
            <span>Voice-Powered</span>
          </div>
           <div className='flex items-center gap-2'>
            <Languages className="h-5 w-5" />
            <span>English & ಕನ್ನಡ</span>
          </div>
      </footer>
    </div>
  );
}
