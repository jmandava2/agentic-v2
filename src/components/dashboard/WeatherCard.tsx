
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sun, Droplets, Wind } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

export function WeatherCard() {
  const { t } = useLanguage();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{t('weather.title')}</CardTitle>
        <CardDescription>{t('weather.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Sun className="h-8 w-8 text-yellow-500" />
                <span className="text-4xl font-bold">28°C</span>
            </div>
            <p className="text-right text-muted-foreground">{t('weather.condition')}</p>
        </div>
        <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span>{t('weather.humidity')}: 72%</span>
            </div>
            <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-slate-500" />
                <span>{t('weather.wind')}: 12 km/h</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
