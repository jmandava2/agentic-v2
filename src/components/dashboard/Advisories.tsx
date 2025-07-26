
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle, Bug, Stethoscope } from 'lucide-react';
import { Badge } from '../ui/badge';

const advisories = [
    { type: 'Pest', title: 'Leafhopper Alert', level: 'Low', icon: Bug },
    { type: 'Disease', title: 'Blast Risk', level: 'Moderate', icon: Stethoscope },
    { type: 'Risk', title: 'Heavy Rain Forecast', level: 'High', icon: AlertTriangle },
];

const levelColors: { [key: string]: string } = {
    Low: 'bg-green-200 text-green-800',
    Moderate: 'bg-yellow-200 text-yellow-800',
    High: 'bg-red-200 text-red-800',
}


export function Advisories() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Latest Advisories</CardTitle>
                <CardDescription>Pest, disease, and risk alerts.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {advisories.map((advisory, index) => (
                        <li key={index} className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                                <advisory.icon className="h-5 w-5 text-secondary-foreground" />
                            </div>
                            <div className="flex-grow">
                                <p className="font-semibold">{advisory.title}</p>
                                <p className="text-sm text-muted-foreground">{advisory.type}</p>
                            </div>
                            <Badge className={levelColors[advisory.level]}>{advisory.level}</Badge>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}
