
'use client';
import { FarmInfoCarousel } from '@/components/dashboard/FarmInfoCarousel';
import { WeatherCard } from '@/components/dashboard/WeatherCard';
import { Todos } from '@/components/dashboard/Todos';
import { Advisories } from '@/components/dashboard/Advisories';
import { useLanguage } from '@/hooks/use-language';

export default function DashboardPage() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-headline text-3xl font-bold">{t('dashboard.title')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FarmInfoCarousel />
        </div>
        <WeatherCard />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Todos />
        <Advisories />
      </div>
    </div>
  );
}
