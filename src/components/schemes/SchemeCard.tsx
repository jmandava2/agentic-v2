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
import { TranslationKey } from '@/lib/translations';

type SchemeCardProps = {
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  eligibilityKey: TranslationKey;
  benefitsKey: TranslationKey;
  howToApplyKey: TranslationKey;
  link: string;
};

const DetailSection = ({ title, content }: { title: string, content: string }) => (
    <div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-muted-foreground">{content}</p>
    </div>
);


export function SchemeCard({ titleKey, descriptionKey, eligibilityKey, benefitsKey, howToApplyKey, link }: SchemeCardProps) {
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleExplain = () => {
    toast({
        title: t('schemes.card.toast.title'),
        description: t('schemes.card.toast.description'),
    })
  }

  const title = t(titleKey);
  const description = t(descriptionKey);
  const eligibility = t(eligibilityKey);
  const benefits = t(benefitsKey);
  const howToApply = t(howToApplyKey);

  return (
    <Dialog>
        <DialogTrigger asChild>
            <Card className="flex flex-col cursor-pointer hover:border-primary/50 transition-colors">
            <CardHeader className="flex-grow">
                <CardTitle className="font-headline text-lg md:text-xl">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
             <CardFooter className="justify-end">
                 <Button size="sm" className="bg-foreground text-primary hover:bg-foreground/90">
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
            <DialogFooter className="pt-4 sm:justify-between gap-2">
                 <Button onClick={handleExplain} className="w-full sm:w-auto bg-foreground text-primary hover:bg-foreground/90">
                    <Volume2 className="mr-2 h-4 w-4" />
                    {t('schemes.card.explain')}
                </Button>
                <DialogClose asChild>
                    <Button asChild variant="outline" className="w-full sm:w-auto">
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
