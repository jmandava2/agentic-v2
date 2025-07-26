
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

type SchemeCardProps = {
  title: string;
  description: string;
  eligibility: string;
  link: string;
};

export function SchemeCard({ title, description, eligibility, link }: SchemeCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
            <h4 className="font-semibold text-sm">Eligibility</h4>
            <p className="text-sm text-muted-foreground">{eligibility}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" variant="outline">
          <a href={link} target="_blank" rel="noopener noreferrer">
            Learn More <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
