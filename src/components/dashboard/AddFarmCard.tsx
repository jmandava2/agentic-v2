
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
import { cropsApi } from '@/lib/crops-api';
import { useAuth } from '@/hooks/use-auth';
import { LoginDialog } from '@/components/auth/LoginDialog';
import { useState, useEffect } from 'react';
import { MapPin, Loader2, Mic } from 'lucide-react';

const formSchema = z.object({
  crop_name: z.string().min(1, 'Crop name is required'),
  crop_variety: z.string().min(1, 'Variety is required'),
  current_crop: z.string().min(1, 'Current crop is required'),
  latitude: z.number().min(-90).max(90, 'Invalid latitude'),
  longitude: z.number().min(-180).max(180, 'Invalid longitude'),
  address: z.string().min(1, 'Address is required'),
  village: z.string().min(1, 'Village is required'),
  district: z.string().min(1, 'District is required'),
  state: z.string().min(1, 'State is required'),
  total_area_acres: z.string().min(1, 'Total area is required'),
  cultivable_area_acres: z.string().min(1, 'Cultivable area is required'),
  soil_type: z.string({ required_error: 'Please select a soil type.' }),
  water_source: z.string({ required_error: 'Please select a water source.' }),
  irrigation_type: z.string({ required_error: 'Please select an irrigation type.' }),
  planting_date: z.date({ required_error: 'Planting date is required' }),
  expected_harvest_date: z.date({ required_error: 'Expected harvest date is required' }),
  crop_stage: z.string({ required_error: 'Please select a crop stage.' }),
});

type FormData = z.infer<typeof formSchema>;

export function AddFarmCard() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Device location not available');
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);

    // Use device's native getCurrentPosition with optimized settings
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        form.setValue('latitude', latitude);
        form.setValue('longitude', longitude);
        setIsGettingLocation(false);
        
        toast({
          title: 'Device Location',
          description: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        });
      },
      (error) => {
        setIsGettingLocation(false);
        let errorMessage = 'Device location failed';
        
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage = 'Enable location in device settings';
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage = 'Device location unavailable';
            break;
          case 3: // TIMEOUT
            errorMessage = 'Device location timeout';
            break;
        }
        
        setLocationError(errorMessage);
        toast({
          title: 'Location Error',
          description: errorMessage,
          variant: 'destructive',
        });
      },
      {
        enableHighAccuracy: false, // Use device's fastest method
        timeout: 10000, // 10 seconds
        maximumAge: 300000, // Use 5-minute cached location
      }
    );
  };

  // Auto-get location when dialog opens
  useEffect(() => {
    const latitude = form.getValues('latitude');
    const longitude = form.getValues('longitude');
    
    if (!latitude && !longitude) {
      // Add a small delay to avoid immediate location request
      setTimeout(() => {
        getCurrentLocation();
      }, 1000);
    }
  }, [form]);

  async function onSubmit(values: FormData) {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const cropData = {
        crop_name: values.crop_name,
        latitude: values.latitude,
        longitude: values.longitude,
        address: values.address,
        village: values.village,
        district: values.district,
        state: values.state,
        total_area_acres: parseFloat(values.total_area_acres),
        cultivable_area_acres: parseFloat(values.cultivable_area_acres),
        soil_type: values.soil_type,
        water_source: values.water_source,
        irrigation_type: values.irrigation_type,
        current_crop: values.current_crop,
        crop_variety: values.crop_variety,
        planting_date: values.planting_date.toISOString().split('T')[0],
        expected_harvest_date: values.expected_harvest_date.toISOString().split('T')[0],
        crop_stage: values.crop_stage,
      };

      await cropsApi.createCrop(cropData);
      
      toast({
        title: 'Crop Added Successfully',
        description: `${values.crop_name} (${values.crop_variety}) has been added to your farm.`,
      });
      form.reset();
    } catch (error) {
      console.error('Failed to create crop:', error);
      toast({
        title: 'Failed to Add Crop',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
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
            <Button className="w-full bg-foreground text-primary hover:bg-foreground/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              {t('addCrop.button')}
            </Button>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="font-headline">Add New Crop</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new crop to your farm
              </DialogDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                toast({
                  title: 'Voice Mode',
                  description: 'Use the Voice Crop Creator card for voice input',
                });
              }}
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="crop_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crop Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Rice, Tomato, Wheat" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="crop_variety"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crop Variety</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., textiles, basmati" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="current_crop"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Crop</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., cotton, rice" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="total_area_acres"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Area (acres)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 5" type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cultivable_area_acres"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cultivable Area (acres)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 5" type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Location Coordinates</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                >
                  {isGettingLocation ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Getting Location...
                    </>
                  ) : (
                    <>
                      <MapPin className="mr-2 h-4 w-4" />
                      Get Current Location
                    </>
                  )}
                </Button>
              </div>
              
              {locationError && (
                <p className="text-sm text-destructive">{locationError}</p>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Auto-filled from GPS" 
                          type="number" 
                          step="0.0001" 
                          value={field.value || ''}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          readOnly
                          className="bg-muted"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Auto-filled from GPS" 
                          type="number" 
                          step="0.0001" 
                          value={field.value || ''}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          readOnly
                          className="bg-muted"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Medavakkam" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="planting_date"
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
                            <span>Select planting date</span>
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
              name="expected_harvest_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Expected Harvest Date</FormLabel>
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
                            <span>Select harvest date</span>
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
                        disabled={(date) => date < new Date()}
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
              name="crop_stage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crop Stage</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select crop stage" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="seedling">Seedling</SelectItem>
                      <SelectItem value="vegetative">Vegetative</SelectItem>
                      <SelectItem value="flowering">Flowering</SelectItem>
                      <SelectItem value="maturity">Maturity</SelectItem>
                      <SelectItem value="golden">Golden</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="soil_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Soil Type</FormLabel>
                   <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select soil type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="alluvial">Alluvial</SelectItem>
                      <SelectItem value="black">Black</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                      <SelectItem value="laterite">Laterite</SelectItem>
                      <SelectItem value="clay fertile">Clay Fertile</SelectItem>
                      <SelectItem value="loam">Loam</SelectItem>
                      <SelectItem value="sandy">Sandy</SelectItem>
                      <SelectItem value="clay">Clay</SelectItem>
                      <SelectItem value="silt">Silt</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="village"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Village</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., kanchipuram" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Bangalore" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Karnataka" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="water_source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Water Source</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select water source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ground water">Ground Water</SelectItem>
                        <SelectItem value="river water">River Water</SelectItem>
                        <SelectItem value="rain water">Rain Water</SelectItem>
                        <SelectItem value="canal water">Canal Water</SelectItem>
                        <SelectItem value="bore well">Bore Well</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="irrigation_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Irrigation Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select irrigation type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="drop system">Drop System</SelectItem>
                        <SelectItem value="drip irrigation">Drip Irrigation</SelectItem>
                        <SelectItem value="sprinkler">Sprinkler</SelectItem>
                        <SelectItem value="flood irrigation">Flood Irrigation</SelectItem>
                        <SelectItem value="furrow irrigation">Furrow Irrigation</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="bg-foreground text-primary hover:bg-foreground/90">
                {isSubmitting ? 'Adding Crop...' : 'Add Crop'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
    </>
  );
}
