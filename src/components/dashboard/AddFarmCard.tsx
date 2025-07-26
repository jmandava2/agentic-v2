
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function AddFarmCard() {

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Logic to add a new farm will go here
    console.log('Adding new farm...');
  }

  return (
    <Card className="h-full border-2 border-dashed bg-secondary/50 flex flex-col justify-center">
      <CardHeader className="text-center">
        <div className="mx-auto bg-background/70 rounded-full p-3 w-fit">
          <PlusCircle className="h-10 w-10 text-muted-foreground" />
        </div>
        <CardTitle className="font-headline mt-4">Add a New Farm</CardTitle>
        <CardDescription>
          Expand your digital farm portfolio.
        </CardDescription>
      </CardHeader>
      <CardContent>
          <Button className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Farm
          </Button>
      </CardContent>
    </Card>
  );
}
