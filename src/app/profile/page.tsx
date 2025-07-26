
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { User, Phone, Mail, LogOut } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background text-primary">
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
    const [language, setLanguage] = useState('en');
    const router = useRouter();

    const handleLogout = () => {
        router.push('/');
    }
    
    return (
        <div className="space-y-8">
            <h1 className="font-headline text-3xl font-bold">Profile & Settings</h1>
            
            <Card>
                <CardHeader>
                    <CardTitle>Language</CardTitle>
                    <CardDescription>Choose your preferred language for the app.</CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup value={language} onValueChange={setLanguage} className="flex gap-8">
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
                    <CardTitle>My Account</CardTitle>
                    <CardDescription>View your account details and support options.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-muted-foreground">User</h3>
                        <InfoRow 
                            icon={<User />}
                            label="User"
                            value="farmer@krushi.co"
                        />
                    </div>
                     <Separator />
                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-muted-foreground">Support</h3>
                        <div className="space-y-2">
                            <InfoRow 
                                icon={<Phone />}
                                label="Phone"
                                value="+91-9876543210"
                            />
                             <InfoRow 
                                icon={<Mail />}
                                label="Email"
                                value="help@krushi.co"
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="mt-4">
                     <Button variant="destructive" className="w-full" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </CardFooter>
            </Card>

        </div>
    )
}
