
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export function AddFarmCard() {
  return (
    <Card className="h-full border-2 border-dashed bg-secondary/50 flex flex-col justify-center">
      <CardHeader className="text-center">
        <div className="mx-auto bg-background/70 rounded-full p-3 w-fit">
          <PlusCircle className="h-10 w-10 text-muted-foreground" />
        </div>
        <CardTitle className="font-headline mt-4">Add a New Crop</CardTitle>
        <CardDescription>
          Expand your digital crop portfolio.
        </CardDescription>
      </CardHeader>
      <CardContent>
          <Button className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Crop
          </Button>
      </CardContent>
    </Card>
  );
}
