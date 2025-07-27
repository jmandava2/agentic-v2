
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/hooks/use-language';
import Image from 'next/image';
import { Leaf, MapPin, Stethoscope } from 'lucide-react';

const mockHealthData = {
  crop_type: 'Sona Masoori Rice',
  symptoms_text: 'The leaves are showing signs of yellowing and some brown spots are visible. There is also minor wilting observed in the lower leaves, suggesting a possible nutrient deficiency or a fungal infection.',
  location: 'Kolar, Karnataka',
  crop_id: 'CROP-12345',
  create_logs_and_todos: true,
  image_url: 'https://placehold.co/600x400.png',
};

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
            {icon}
        </div>
        <div>
            <p className="font-semibold text-muted-foreground">{label}</p>
            <p className="text-foreground">{value}</p>
        </div>
    </div>
);


export default function HealthPage() {
    const { t } = useLanguage();

    return (
        <div className="space-y-8">
            <h1 className="font-headline text-3xl font-bold">{t('health.title')}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('health.image.title')}</CardTitle>
                            <CardDescription>{t('health.image.description')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="aspect-video w-full overflow-hidden rounded-lg border">
                                <Image
                                    src={mockHealthData.image_url}
                                    alt={mockHealthData.crop_type}
                                    width={600}
                                    height={400}
                                    className="object-cover w-full h-full"
                                    data-ai-hint="sick plant"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                         <CardHeader>
                            <CardTitle>{t('health.actions.title')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                                <Label htmlFor="logs-todos" className="font-semibold text-foreground">
                                    {t('health.actions.create_logs_and_todos')}
                                </Label>
                                <Switch id="logs-todos" defaultChecked={mockHealthData.create_logs_and_todos} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                 <Card>
                    <CardHeader>
                        <CardTitle>{t('health.details.title')}</CardTitle>
                        <CardDescription>{t('health.details.description')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <InfoRow 
                            icon={<Leaf />}
                            label={t('health.details.crop_type')}
                            value={mockHealthData.crop_type}
                        />
                        <Separator />
                        <InfoRow 
                            icon={<MapPin />}
                            label={t('health.details.location')}
                            value={mockHealthData.location}
                        />
                         <Separator />
                        <InfoRow 
                            icon={<Stethoscope />}
                            label={t('health.details.symptoms')}
                            value={mockHealthData.symptoms_text}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
