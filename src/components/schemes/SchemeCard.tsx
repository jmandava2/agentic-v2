
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
import { ArrowRight, Globe, Volume2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter
} from '@/components/ui/dialog';
import { Separator } from '../ui/separator';
import { useToast } from '@/hooks/use-toast';

type SchemeCardProps = {
  title: string;
  description: string;
  eligibility: string;
  benefits: string;
  howToApply: string;
  link: string;
};

const DetailSection = ({ title, content }: { title: string, content: string }) => (
    <div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-muted-foreground">{content}</p>
    </div>
);


export function SchemeCard({ title, description, eligibility, benefits, howToApply, link }: SchemeCardProps) {
  const { toast } = useToast();

  const handleExplain = () => {
    toast({
        title: "Voice Explanation (Mock)",
        description: "This will play an audio explanation of the scheme.",
    })
  }

  return (
    <Dialog>
        <DialogTrigger asChild>
            <Card className="flex flex-col cursor-pointer hover:border-primary/50 transition-colors">
            <CardHeader className="flex-grow">
                <CardTitle className="font-headline">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
             <CardFooter>
                 <Button variant="link" size="sm" className="w-full justify-end text-primary">
                    <span>Learn More</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </CardFooter>
            </Card>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
            <DialogHeader>
            <DialogTitle className="font-headline text-2xl">{title}</DialogTitle>
            </DialogHeader>
            <Separator />
            <div className="space-y-4 py-4">
                <DetailSection title="Description" content={description} />
                <DetailSection title="Eligibility Criteria" content={eligibility} />
                <DetailSection title="Benefits" content={benefits} />
                <DetailSection title="How To Apply" content={howToApply} />
            </div>
            <Separator />
            <DialogFooter className="pt-4 gap-2 sm:justify-between">
                 <Button onClick={handleExplain} variant="outline">
                    <Volume2 className="mr-2 h-4 w-4" />
                    Explain in Voice
                </Button>
                <DialogClose asChild>
                    <Button asChild>
                    <a href={link} target="_blank" rel="noopener noreferrer">
                        <Globe className="mr-2 h-4 w-4" />
                        Official Website
                    </a>
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}
