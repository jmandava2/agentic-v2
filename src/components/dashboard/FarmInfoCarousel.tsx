
'use client';
import { useState, useEffect } from 'react';
import type { EmblaCarouselType } from 'embla-carousel-react';
import { format } from 'date-fns';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { FarmInfoCard, FarmHistory } from './FarmInfoCard';
import { AddFarmCard } from './AddFarmCard';
import { Wheat } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';


const TomatoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-full w-full text-red-500"
  >
    <path d="M12 2C8.13 2 5 5.13 5 9c0 1.94.78 3.69 2.03 4.94.31-.91.78-1.75 1.38-2.5C7.68 10.59 7 9.22 7 8c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.22-.68 2.59-1.41 3.44.6.75 1.07 1.59 1.38 2.5C18.22 12.69 19 10.94 19 9c0-3.87-3.13-7-7-7zm-1 18.88C9.38 20.93 8.35 21 7.5 21c-2.49 0-4.5-2.01-4.5-4.5 0-.75.2-1.44.54-2.04.6.67 1.34 1.2 2.18 1.58-.52.79-.82 1.74-.82 2.76 0 2.37 1.93 4.3 4.3 4.3.28 0 .55-.03.82-.08zM12 22c-2.49 0-4.5-2.01-4.5-4.5 0-1.02.3-1.97.82-2.76C9.16 14.36 9.9 13.83 10.5 13.24 11.23 12.59 12 11.53 12 10.5c0-1.03-.77-2.09-1.5-2.74-.6-.59-1.34-1.12-2.18-1.58C8.8 6.56 9 7.25 9 8c0 1.65 1.35 3 3 3s3-1.35 3-3c0-.75-.2-1.44-.54-2.04C13.84 6.63 13.1 7.17 12.5 7.76c.73.65 1.5 1.71 1.5 2.74 0 1.03.77 2.09 1.5 2.74.6.59 1.34 1.12 2.18 1.58C17.2 13.31 17 12.62 17 12c0-1.65-1.35-3-3-3s-3 1.35 3 3zm5.68-4.24c.52.79.82 1.74.82 2.76 0 2.37-1.93 4.3-4.3 4.3-.28 0-.55-.03-.82-.08.62-.05 1.65-.12 2.32-1.12.87-1.28 1.1-2.91.6-4.38.31.25.6.52.88.82zm-1.14-1.34c-.84-.38-1.58-.91-2.18-1.58.52-.79.82-1.74.82-2.76 0-1.65-1.35-3-3-3-.26 0-.52.04-.77.1.66.53 1.25 1.22 1.77 2.05.89 1.43.99 3.2.27 4.75.25-.13.48-.28.7-.45z" />
  </svg>
);

const initialFarms = [
  {
    id: 1,
    cropNameKey: 'crops.sonaMasooriRice',
    cropIcon: <Wheat className="h-full w-full" />,
    area: '5 Acres',
    mandiPrice: '₹2500/q',
    yieldDate: 'Oct 15',
    suggestions: [
      {
        title: 'Optimize Irrigation',
        description:
          'Based on the current vegetative stage and humidity, consider reducing irrigation by 10% to prevent blast risk without affecting growth.',
      },
      {
        title: 'Nutrient Management',
        description:
          'A top dressing of nitrogen is recommended in the next 7 days to support maximum tillering. Our soil analysis shows sufficient phosphorus.',
      },
       {
        title: 'Pest Monitoring',
        description:
          'Low levels of leafhoppers detected. While not critical, continue monitoring. No pesticide application is needed at this time.',
      },
    ],
    history: [
      {
        date: 'July 1, 2024',
        event: 'Health Check',
        details: 'Initial check-in. Crop appears healthy. No pests or diseases detected.',
      },
      {
        date: 'July 15, 2024',
        event: 'Pest Alert',
        details: 'Minor leafhopper presence detected via image analysis. Advised to monitor.',
      },
       {
        date: 'August 1, 2024',
        event: 'Yield Log',
        details: 'Logged a partial harvest from a test plot. Yield was nominal.',
      },
    ],
  },
  {
    id: 2,
    cropNameKey: 'crops.tomato',
    cropIcon: <TomatoIcon />,
    area: '2 Acres',
    mandiPrice: '₹1800/q',
    yieldDate: 'Sep 25',
    suggestions: [
      {
        title: 'Staking & Pruning',
        description:
          'Ensure all plants are properly staked to support fruit weight. Prune lower suckers to improve air circulation and direct energy to fruit development.',
      },
      {
        title: 'Calcium Supplement',
        description: 'To prevent blossom-end rot, a foliar spray of calcium nitrate is recommended this week.',
      },
    ],
    history: [
        {
        date: 'July 5, 2024',
        event: 'Health Check',
        details: 'Signs of early blight detected on lower leaves. Recommended removal of affected leaves and application of a fungicide.',
      },
       {
        date: 'July 20, 2024',
        event: 'Health Check',
        details: 'Follow-up check shows the blight is under control. New growth appears healthy.',
      }
    ],
  },
];

export function FarmInfoCarousel() {
  const [api, setApi] = useState<EmblaCarouselType | undefined>();
  const [current, setCurrent] = useState(0);
  const [farms, setFarms] = useState(initialFarms);
  const { t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());
    const onSelect = (api: EmblaCarouselType) => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  const handleCheckIn = (farmId: number, note: string, photo?: string) => {
    const newHistoryEntry: FarmHistory = {
      date: format(new Date(), 'MMM d, yyyy'),
      event: 'Manual Check-in',
      details: note,
      photo: !!photo,
    };

    setFarms(prevFarms => 
      prevFarms.map(farm => 
        farm.id === farmId 
          ? { ...farm, history: [newHistoryEntry, ...farm.history] } 
          : farm
      )
    );

    toast({
      title: 'Check-in Logged',
      description: `New entry added to the history of ${t(farms.find(f => f.id === farmId)?.cropNameKey as any)}.`,
    });
  };

  const slideCount = farms.length + 1; // +1 for AddFarmCard

  return (
    <div>
    <Carousel setApi={setApi} className="w-full">
      <CarouselContent>
        {farms.map((farm, index) => (
          <CarouselItem key={index}>
            <FarmInfoCard
              {...farm}
              cropName={t(farm.cropNameKey as any)}
            />
          </CarouselItem>
        ))}
        <CarouselItem>
          <AddFarmCard />
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
     <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: slideCount }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "h-2 w-2 rounded-full transition-colors",
              current === index ? "bg-primary" : "bg-muted"
            )}
          />
        ))}
      </div>
    </div>
  );
}
