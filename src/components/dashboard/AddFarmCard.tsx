
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

export function AddFarmCard() {

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Logic to add a new farm will go here
    console.log('Adding new farm...');
  }

  return (
    <Card className="h-full border-2 border-dashed bg-secondary/50">
      <CardHeader className="text-center">
        <CardTitle className="font-headline">Add a New Farm</CardTitle>
        <CardDescription>
          Enter the details for your new farm.
        </CardDescription>
      </CardHeader>
       <form onSubmit={handleSubmit}>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div>
            <Label htmlFor="farmName" className="mb-2 block">Farm Name</Label>
            <Input id="farmName" placeholder="e.g., Green Acres" />
          </div>
           <div>
            <Label htmlFor="crop" className="mb-2 block">Current Crop</Label>
            <Input id="crop" placeholder="e.g., Sona Masoori Rice" />
          </div>
           <div>
            <Label htmlFor="sowingDate" className="mb-2 block">Sowing Date</Label>
            <Input id="sowingDate" type="date" />
          </div>
           <div>
            <Label htmlFor="soilType" className="mb-2 block">Soil Type</Label>
            <Input id="soilType" placeholder="e.g., Clay Loam" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
          <Button type="submit" className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Farm
          </Button>
      </CardFooter>
       </form>
    </Card>
  );
}
