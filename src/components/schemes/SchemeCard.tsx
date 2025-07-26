
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
import { useLanguage } from '@/hooks/use-language';

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
  const { t } = useLanguage();

  const handleExplain = () => {
    toast({
        title: t('schemes.card.toast.title'),
        description: t('schemes.card.toast.description'),
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
             <CardFooter className="justify-end">
                 <Button variant="outline" size="sm">
                    <span>{t('schemes.card.learnMore')}</span>
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
                <DetailSection title={t('schemes.card.descriptionTitle')} content={description} />
                <DetailSection title={t('schemes.card.eligibilityTitle')} content={eligibility} />
                <DetailSection title={t('schemes.card.benefitsTitle')} content={benefits} />
                <DetailSection title={t('schemes.card.howToApplyTitle')} content={howToApply} />
            </div>
            <Separator />
            <DialogFooter className="pt-4 gap-2 sm:justify-between">
                 <Button onClick={handleExplain} variant="outline">
                    <Volume2 className="mr-2 h-4 w-4" />
                    {t('schemes.card.explain')}
                </Button>
                <DialogClose asChild>
                    <Button asChild className="bg-foreground text-primary hover:bg-foreground/90">
                    <a href={link} target="_blank" rel="noopener noreferrer">
                        <Globe className="mr-2 h-4 w-4" />
                        {t('schemes.card.website')}
                    </a>
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}
