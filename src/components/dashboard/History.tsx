
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Notebook } from 'lucide-react';
import type { Crop } from '@/lib/crops-api';

// Mock history entries. This should come from an API in a real app.
const mockHistory: { [key: number]: { date: string; event: string; details: string, photo?: boolean }[] } = {
    1: [
      {
        date: 'July 1, 2024',
        event: 'Health Check',
        details: 'Initial check-in. Crop appears healthy. No pests or diseases detected.',
      },
      {
        date: 'July 15, 2024',
        event: 'Pest Alert',
        details: 'Minor leafhopper presence detected via image analysis. Advised to monitor.',
      },
       {
        date: 'August 1, 2024',
        event: 'Yield Log',
        details: 'Logged a partial harvest from a test plot. Yield was nominal.',
      },
    ],
    2: [
        {
        date: 'July 5, 2024',
        event: 'Health Check',
        details: 'Signs of early blight detected on lower leaves. Recommended removal of affected leaves and application of a fungicide.',
      },
       {
        date: 'July 20, 2024',
        event: 'Health Check',
        details: 'Follow-up check shows the blight is under control. New growth appears healthy.',
      }
    ],
};

export function History({ crop }: { crop: Crop }) {
  const history = mockHistory[crop.id] || [];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Notebook />
            History for {crop.crop_name}
        </CardTitle>
        <CardDescription>Past observations and health check-ins.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[250px] pr-4">
            <div className="space-y-4">
                {history.length > 0 ? history.map((item, index) => (
                    <div key={index} className='p-3 bg-secondary rounded-lg'>
                       <div className="flex justify-between items-baseline">
                         <p className="font-semibold">{item.event}</p>
                         <p className="text-xs text-muted-foreground">{item.date}</p>
                       </div>
                        <Separator className="my-2" />
                        <p className="text-sm text-muted-foreground">{item.details}</p>
                         {item.photo && <p className="text-xs text-foreground mt-1">Photo attached</p>}
                    </div>
                )) : (
                    <div className="text-center text-muted-foreground p-8">
                        <p>No history records found for this crop.</p>
                    </div>
                )}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
