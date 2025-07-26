
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle, Bug, Stethoscope } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useLanguage } from '@/hooks/use-language';

const advisories = [
    { type: 'Pest', titleKey: 'advisories.pest', level: 'Low', icon: Bug },
    { type: 'Disease', titleKey: 'advisories.disease', level: 'Moderate', icon: Stethoscope },
    { type: 'Risk', titleKey: 'advisories.risk', level: 'High', icon: AlertTriangle },
];

const levelColors: { [key: string]: string } = {
    Low: 'bg-green-200 text-green-800',
    Moderate: 'bg-yellow-200 text-yellow-800',
    High: 'bg-red-200 text-red-800',
}


export function Advisories() {
    const { t } = useLanguage();
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">{t('advisories.title')}</CardTitle>
                <CardDescription>{t('advisories.description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {advisories.map((advisory, index) => (
                        <li key={index} className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                                <advisory.icon className="h-5 w-5 text-secondary-foreground" />
                            </div>
                            <div className="flex-grow">
                                <p className="font-semibold">{t(advisory.titleKey)}</p>
                                <p className="text-sm text-muted-foreground">{t(`advisories.types.${advisory.type.toLowerCase()}`)}</p>
                            </div>
                            <Badge className={levelColors[advisory.level]}>{t(`advisories.levels.${advisory.level.toLowerCase()}`)}</Badge>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}
