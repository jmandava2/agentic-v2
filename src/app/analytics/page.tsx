
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/hooks/use-language';
import { MapPin,Maximize, BarChart, CalendarClock } from 'lucide-react';
import { cn } from '@/lib/utils';

const mockAnalyticsData = {
    location: "Kolar, Karnataka",
    farm_size_acres: 5,
    analysis_type: "Yield Prediction",
    analysis_period_months: 6,
    create_logs_and_todos: true,
};

const InfoRow = ({ icon, label, value, colorClass }: { icon: React.ReactNode; label: string; value: string | number, colorClass: string }) => (
    <div className="flex items-start gap-4">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg text-black", colorClass)}>
            {icon}
        </div>
        <div>
            <p className="font-semibold text-muted-foreground">{label}</p>
            <p className="text-foreground">{value}</p>
        </div>
    </div>
);


export default function AnalyticsPage() {
    const { t } = useLanguage();

    return (
        <div className="space-y-8">
            <h1 className="font-headline text-3xl font-bold">{t('analytics.title')}</h1>

             <Card>
                <CardHeader>
                    <CardTitle>{t('analytics.details.title')}</CardTitle>
                    <CardDescription>{t('analytics.details.description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoRow
                            icon={<MapPin />}
                            label={t('analytics.details.location')}
                            value={mockAnalyticsData.location}
                            colorClass="bg-blue-100"
                        />
                        <InfoRow
                            icon={<Maximize />}
                            label={t('analytics.details.farm_size')}
                            value={`${mockAnalyticsData.farm_size_acres} Acres`}
                            colorClass="bg-green-100"
                        />
                        <InfoRow
                            icon={<BarChart />}
                            label={t('analytics.details.analysis_type')}
                            value={mockAnalyticsData.analysis_type}
                            colorClass="bg-yellow-100"
                        />
                        <InfoRow
                            icon={<CalendarClock />}
                            label={t('analytics.details.analysis_period')}
                            value={`${mockAnalyticsData.analysis_period_months} Months`}
                            colorClass="bg-purple-100"
                        />
                    </div>
                    <Separator />
                     <div className="flex items-center justify-between">
                        <Label htmlFor="logs-todos" className="font-semibold text-foreground">
                           {t('analytics.details.create_logs_and_todos')}
                        </Label>
                        <Switch id="logs-todos" defaultChecked={mockAnalyticsData.create_logs_and_todos} />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
