
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Phone, Mail, LogOut } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/use-language';

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground text-primary">
            {icon}
        </div>
        <div>
            <p className="font-semibold text-foreground">{label}</p>
            <p className="text-sm text-muted-foreground">{value}</p>
        </div>
      </div>
    </div>
);


export default function ProfilePage() {
    const router = useRouter();
    const { language, setLanguage, t } = useLanguage();

    const handleLogout = () => {
        router.push('/');
    }
    
    return (
        <div className="space-y-8">
            <h1 className="font-headline text-3xl font-bold">{t('profile.title')}</h1>
            
            <Card>
                <CardHeader>
                    <CardTitle>{t('profile.language.title')}</CardTitle>
                    <CardDescription>{t('profile.language.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup value={language} onValueChange={(value) => setLanguage(value as 'en' | 'kn')} className="flex gap-8">
                         <div className="flex items-center space-x-2">
                            <RadioGroupItem value="en" id="en" />
                            <Label htmlFor="en" className="text-lg">English</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="kn" id="kn" />
                            <Label htmlFor="kn" className="text-lg">ಕನ್ನಡ</Label>
                        </div>
                    </RadioGroup>
                </CardContent>
            </Card>

            <Card>
                 <CardHeader>
                    <CardTitle>{t('profile.account.title')}</CardTitle>
                    <CardDescription>{t('profile.account.description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div>
                        <h3 className="text-lg font-semibold mb-2 text-muted-foreground">{t('profile.support.title')}</h3>
                        <div className="space-y-2">
                            <InfoRow 
                                icon={<Phone />}
                                label={t('profile.support.phone')}
                                value="+91-9876543210"
                            />
                             <InfoRow 
                                icon={<Mail />}
                                label={t('profile.support.email')}
                                value="help@krushi.co"
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="mt-4">
                     <Button 
                        onClick={handleLogout}
                        className="w-full bg-foreground text-primary hover:bg-foreground/90 hover:text-primary/90"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        {t('profile.logout')}
                    </Button>
                </CardFooter>
            </Card>

        </div>
    )
}
