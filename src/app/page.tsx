
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Leaf } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
          <Leaf className="h-10 w-10 text-primary-foreground" />
        </div>
        <h1 className="font-headline text-5xl font-bold text-foreground">
          Namma Krushi
        </h1>
      </div>
      <p className="font-body text-xl text-muted-foreground mb-8">
        Namma Ooru, Namma Krushi
      </p>
      <Button asChild size="lg">
        <Link href="/dashboard">Enter Dashboard</Link>
      </Button>
    </div>
  );
}
