
'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { FarmInfoCard } from './FarmInfoCard';
import { AddFarmCard } from './AddFarmCard';

export function FarmInfoCarousel() {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        <CarouselItem>
          <FarmInfoCard />
        </CarouselItem>
        <CarouselItem>
          <AddFarmCard />
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
}
