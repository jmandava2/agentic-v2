
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
            <Select name="crop">
                <SelectTrigger id="crop">
                    <SelectValue placeholder="Select a crop" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Sona Masoori Rice">Sona Masoori Rice</SelectItem>
                    <SelectItem value="Wheat">Wheat</SelectItem>
                    <SelectItem value="Maize">Maize</SelectItem>
                    <SelectItem value="Sugarcane">Sugarcane</SelectItem>
                    <SelectItem value="Cotton">Cotton</SelectItem>
                    <SelectItem value="Tur (Pigeon Pea)">Tur (Pigeon Pea)</SelectItem>
                    <SelectItem value="Gram (Chickpea)">Gram (Chickpea)</SelectItem>
                    <SelectItem value="Groundnut (Peanut)">Groundnut (Peanut)</SelectItem>
                    <SelectItem value="Mustard">Mustard</SelectItem>
                    <SelectItem value="Soybean">Soybean</SelectItem>
                    <SelectItem value="Jowar (Sorghum)">Jowar (Sorghum)</SelectItem>
                    <SelectItem value="Bajra (Pearl Millet)">Bajra (Pearl Millet)</SelectItem>
                    <SelectItem value="Ragi (Finger Millet)">Ragi (Finger Millet)</SelectItem>
                    <SelectItem value="Tomato">Tomato</SelectItem>
                    <SelectItem value="Onion">Onion</SelectItem>
                    <SelectItem value="Potato">Potato</SelectItem>
                </SelectContent>
            </Select>
          </div>
           <div>
            <Label htmlFor="sowingDate" className="mb-2 block">Sowing Date</Label>
            <Input id="sowingDate" type="date" />
          </div>
           <div>
            <Label htmlFor="soilType" className="mb-2 block">Soil Type</Label>
             <Select name="soilType">
                <SelectTrigger id="soilType">
                    <SelectValue placeholder="Select soil type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Alluvial">Alluvial</SelectItem>
                    <SelectItem value="Black (Regur)">Black (Regur)</SelectItem>
                    <SelectItem value="Red and Yellow">Red and Yellow</SelectItem>
                    <SelectItem value="Laterite">Laterite</SelectItem>
                    <SelectItem value="Arid (Desert)">Arid (Desert)</SelectItem>
                    <SelectItem value="Saline (Usara)">Saline (Usara)</SelectItem>
                    <SelectItem value="Peaty and Marshy">Peaty and Marshy</SelectItem>
                    <SelectItem value="Forest">Forest</SelectItem>
                    <SelectItem value="Clay Loam">Clay Loam</SelectItem>
                    <SelectItem value="Sandy Loam">Sandy Loam</SelectItem>
                </SelectContent>
            </Select>
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
