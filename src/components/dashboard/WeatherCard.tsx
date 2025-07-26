
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sun, Droplets, Wind } from 'lucide-react';

export function WeatherCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Weather Today</CardTitle>
        <CardDescription>Current conditions and forecast.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Sun className="h-8 w-8 text-primary" />
                <span className="text-4xl font-bold">28°C</span>
            </div>
            <p className="text-right text-muted-foreground">Partly Cloudy</p>
        </div>
        <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-muted-foreground" />
                <span>Humidity: 72%</span>
            </div>
            <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-muted-foreground" />
                <span>Wind: 12 km/h</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
