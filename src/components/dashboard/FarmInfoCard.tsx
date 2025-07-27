
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '../ui/separator';
import { useLanguage } from '@/hooks/use-language';
import { CheckIn } from './CheckIn';
import { Logbook } from 'lucide-react';

export type FarmHistory = { date: string; event: string; details: string, photo?: boolean };

type FarmInfoCardProps = {
  cropName: string;
  cropIcon: React.ReactNode;
  area: string;
  mandiPrice: string;
  yieldDate: string;
  suggestions: { title: string; description: string }[];
  history: FarmHistory[];
  onCheckIn: (note: string, photo?: string) => void;
};

const InfoChip = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg bg-background/60 p-3 text-center shadow-md backdrop-blur-sm flex-1">
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <p className="text-lg font-bold text-foreground">{value}</p>
  </div>
);

export function FarmInfoCard({
  cropName,
  cropIcon,
  area,
  mandiPrice,
  yieldDate,
  suggestions,
  history,
  onCheckIn,
}: FarmInfoCardProps) {
  const { t } = useLanguage();
  return (
    <Card className="relative h-full min-h-[350px] w-full overflow-hidden p-4 flex flex-col justify-between">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent"></div>
       <CardHeader className="relative z-10 grid grid-cols-3 gap-3 p-0">
        <InfoChip label={t('farmCard.area')} value={area} />
        <InfoChip label={t('farmCard.mandiPrice')} value={mandiPrice} />
        <InfoChip label={t('farmCard.estYield')} value={yieldDate} />
      </CardHeader>

      <CardContent className="relative z-0 flex h-full flex-col items-center justify-center p-0">
        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-background/50 text-primary shadow-inner backdrop-blur-xl">
           <div className="h-20 w-20">{cropIcon}</div>
        </div>
         <p className="font-headline text-2xl font-bold mt-2">{cropName}</p>
      </CardContent>

      <CardFooter className="relative z-10 flex justify-between items-center p-0">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">{t('farmCard.suggestions.button')}</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t('farmCard.suggestions.title', { cropName })}</DialogTitle>
              <DialogDescription>
                {t('farmCard.suggestions.description')}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4 mt-4">
                {suggestions.map((item, index) => (
                  <div key={index} className="p-3 bg-secondary rounded-lg">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <CheckIn cropName={cropName} onCheckIn={onCheckIn}>
          <Button>
            <Logbook className="mr-2 h-4 w-4" />
            Log Check-in
          </Button>
        </CheckIn>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">{t('farmCard.history.button')}</Button>
          </DialogTrigger>
           <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t('farmCard.history.title', { cropName })}</DialogTitle>
              <DialogDescription>
                {t('farmCard.history.description')}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-4">
                <div className="space-y-4 mt-4">
                    {history.map((item, index) => (
                        <div key={index} className='p-3 bg-secondary rounded-lg'>
                           <div className="flex justify-between items-baseline">
                             <p className="font-semibold">{item.event}</p>
                             <p className="text-xs text-muted-foreground">{item.date}</p>
                           </div>
                            <Separator className="my-2" />
                            <p className="text-sm text-muted-foreground">{item.details}</p>
                             {item.photo && <p className="text-xs text-primary mt-1">Photo attached</p>}
                        </div>
                    ))}
                </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
