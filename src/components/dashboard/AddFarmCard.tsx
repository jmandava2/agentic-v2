
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  area: z.string().min(1, 'Area is required'),
  breed: z.string().min(1, 'Breed is required'),
  plantingDate: z.date({ required_error: 'Planting date is required' }),
  expectedYield: z.string().min(1, 'Expected yield is required'),
  cropStage: z.string({ required_error: 'Please select a crop stage.' }),
  soil: z.string({ required_error: 'Please select a soil type.' }),
});

type FormData = z.infer<typeof formSchema>;

export function AddFarmCard() {
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: FormData) {
    console.log(values);
    toast({
      title: 'Crop Added (Mock)',
      description: `New crop with breed ${values.breed} has been added.`,
    });
    form.reset();
  }

  return (
    <Dialog onOpenChange={(open) => !open && form.reset()}>
      <DialogTrigger asChild>
        <Card className="h-full border-2 border-dashed bg-secondary/50 flex flex-col justify-center cursor-pointer hover:border-primary/80 transition-colors">
          <CardHeader className="text-center">
            <div className="mx-auto bg-background/70 rounded-full p-3 w-fit">
              <PlusCircle className="h-10 w-10 text-muted-foreground" />
            </div>
            <CardTitle className="font-headline mt-4">Add a New Crop</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Crop
            </Button>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Add New Crop</DialogTitle>
          <DialogDescription>
            Enter the details for your new crop.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area (e.g., 5 Acres)</FormLabel>
                  <FormControl>
                    <Input placeholder="5 Acres" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="breed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Breed</FormLabel>
                  <FormControl>
                    <Input placeholder="Sona Masoori" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="plantingDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Planting Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="expectedYield"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Yield (e.g., 25 quintals)</FormLabel>
                  <FormControl>
                    <Input placeholder="25 quintals" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cropStage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Crop Stage</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a stage" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="seedling">Seedling</SelectItem>
                      <SelectItem value="vegetative">Vegetative</SelectItem>
                      <SelectItem value="flowering">Flowering</SelectItem>
                       <SelectItem value="maturity">Maturity</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="soil"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Soil Type</FormLabel>
                   <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a soil type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="alluvial">Alluvial Soil</SelectItem>
                      <SelectItem value="black">Black Soil</SelectItem>
                      <SelectItem value="red">Red Soil</SelectItem>
                      <SelectItem value="laterite">Laterite Soil</SelectItem>
                      <SelectItem value="arid">Arid Soil</SelectItem>
                      <SelectItem value="forest">Forest Soil</SelectItem>
                      <SelectItem value="peat">Peat Soil</SelectItem>
                      <SelectItem value="saline">Saline Soil</SelectItem>
                      <SelectItem value="loam">Loam Soil</SelectItem>
                      <SelectItem value="sandy">Sandy Soil</SelectItem>
                      <SelectItem value="clay">Clay Loam</SelectItem>
                      <SelectItem value="silt">Silt Soil</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="submit">Save Crop</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
