
'use client';
import { CropsCarousel } from '@/components/dashboard/CropsCarousel';
import { WeatherCard } from '@/components/dashboard/WeatherCard';
import { Todos } from '@/components/dashboard/Todos';
import { Advisories } from '@/components/dashboard/Advisories';
import { useLanguage } from '@/hooks/use-language';
import { AddFarmCard } from '@/components/dashboard/AddFarmCard';
import { VoiceCropCreator } from '@/components/dashboard/VoiceCropCreator';
import { Suggestions } from '@/components/dashboard/Suggestions';
import { History } from '@/components/dashboard/History';
import { Separator } from '@/components/ui/separator';
import { AppContext } from '@/components/AppLayout';
import { useContext } from 'react';
import { Logo } from '@/components/ui/logo';

export default function DashboardPage() {
  const { t } = useLanguage();
  const appContext = useContext(AppContext);
  const activeCrop = appContext?.crops.find(c => c.id === appContext.activeCropId);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3 md:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg">
          <Logo />
        </div>
        <h1 className="font-headline text-2xl font-bold text-foreground">
          {t('appName')}
        </h1>
      </div>
      <h1 className="hidden font-headline text-3xl font-bold md:block">{t('dashboard.title')}</h1>
      
      <div>
        <h2 className="font-headline text-2xl font-bold mb-4">Add New Crop</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AddFarmCard />
          <VoiceCropCreator />
        </div>
      </div>
      
      <div>
        <CropsCarousel />
      </div>

      {activeCrop && (
        <>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Suggestions crop={activeCrop} />
                <History crop={activeCrop} />
            </div>
        </>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Todos />
            <Advisories />
        </div>
        <WeatherCard />
      </div>
      
    </div>
  );
}
