
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
import { useLanguage } from '@/hooks/use-language';

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
  const { t } = useLanguage();
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
            <CardTitle className="font-headline mt-4">{t('addCrop.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              {t('addCrop.button')}
            </Button>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">{t('addCrop.form.title')}</DialogTitle>
          <DialogDescription>
            {t('addCrop.form.description')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('addCrop.form.area.label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('addCrop.form.area.placeholder')} {...field} />
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
                  <FormLabel>{t('addCrop.form.breed.label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('addCrop.form.breed.placeholder')} {...field} />
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
                  <FormLabel>{t('addCrop.form.plantingDate.label')}</FormLabel>
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
                            <span>{t('addCrop.form.plantingDate.placeholder')}</span>
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
                  <FormLabel>{t('addCrop.form.yield.label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('addCrop.form.yield.placeholder')} {...field} />
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
                  <FormLabel>{t('addCrop.form.stage.label')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('addCrop.form.stage.placeholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="seedling">{t('addCrop.form.stage.seedling')}</SelectItem>
                      <SelectItem value="vegetative">{t('addCrop.form.stage.vegetative')}</SelectItem>
                      <SelectItem value="flowering">{t('addCrop.form.stage.flowering')}</SelectItem>
                       <SelectItem value="maturity">{t('addCrop.form.stage.maturity')}</SelectItem>
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
                  <FormLabel>{t('addCrop.form.soil.label')}</FormLabel>
                   <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('addCrop.form.soil.placeholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="alluvial">{t('addCrop.form.soil.alluvial')}</SelectItem>
                      <SelectItem value="black">{t('addCrop.form.soil.black')}</SelectItem>
                      <SelectItem value="red">{t('addCrop.form.soil.red')}</SelectItem>
                      <SelectItem value="laterite">{t('addCrop.form.soil.laterite')}</SelectItem>
                      <SelectItem value="arid">{t('addCrop.form.soil.arid')}</SelectItem>
                      <SelectItem value="forest">{t('addCrop.form.soil.forest')}</SelectItem>
                      <SelectItem value="peat">{t('addCrop.form.soil.peat')}</SelectItem>
                      <SelectItem value="saline">{t('addCrop.form.soil.saline')}</SelectItem>
                      <SelectItem value="loam">{t('addCrop.form.soil.loam')}</SelectItem>
                      <SelectItem value="sandy">{t('addCrop.form.soil.sandy')}</SelectItem>
                      <SelectItem value="clay">{t('addCrop.form.soil.clay')}</SelectItem>
                      <SelectItem value="silt">{t('addCrop.form.soil.silt')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="submit">{t('addCrop.form.save')}</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
