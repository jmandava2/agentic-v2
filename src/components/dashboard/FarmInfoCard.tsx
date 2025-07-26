
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wheat, Calendar } from 'lucide-react';

export function FarmInfoCard() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline">My Digital Farm</CardTitle>
        <CardDescription>A snapshot of your current farm setup.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src="https://placehold.co/600x400"
              alt="Farm"
              fill
              className="object-cover"
              data-ai-hint="farm rice paddy"
            />
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <div className="flex items-center gap-4">
              <Wheat className="h-6 w-6 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Current Crop</p>
                <p className="font-semibold">Sona Masoori Rice</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Calendar className="h-6 w-6 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Sowing Date</p>
                <p className="font-semibold">June 15, 2024</p>
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm text-muted-foreground">Lifecycle Stage</p>
              <Badge variant="secondary">Vegetative</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
