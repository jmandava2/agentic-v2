
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wheat, Calendar, Spade, HeartPulse } from 'lucide-react';

export function FarmInfoCard() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline">My Digital Farm</CardTitle>
        <CardDescription>
          A snapshot of your current farm setup.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          <div className="flex items-center gap-4">
            <Wheat className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-base text-muted-foreground">Current Crop</p>
              <p className="text-lg font-semibold">Sona Masoori Rice</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Calendar className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-base text-muted-foreground">Sowing Date</p>
              <p className="text-lg font-semibold">June 15, 2024</p>
            </div>
          </div>
           <div className="flex items-center gap-4">
            <Spade className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-base text-muted-foreground">Soil Type</p>
              <p className="text-lg font-semibold">Clay Loam</p>
            </div>
          </div>
           <div className="flex items-center gap-4">
            <HeartPulse className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-base text-muted-foreground">Current Health</p>
              <p className="text-lg font-semibold text-green-600">Healthy</p>
            </div>
          </div>
          <div>
            <p className="mb-2 text-base text-muted-foreground">
              Lifecycle Stage
            </p>
            <Badge variant="secondary" className="text-base px-3 py-1">Vegetative</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
