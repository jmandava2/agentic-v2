'use client';

import { useState, useEffect } from 'react';
import { cropsApi, type Crop } from '@/lib/crops-api';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { LoginDialog } from '@/components/auth/LoginDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Wheat, Leaf, Calendar, TrendingUp, MapPin, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

export function CropsCarousel() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCrops();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchCrops = async () => {
    try {
      setLoading(true);
      const cropsData = await cropsApi.getCrops();
      setCrops(cropsData);
    } catch (error) {
      console.error('Failed to fetch crops:', error);
      if (error instanceof Error && error.message.includes('Authentication required')) {
        setShowLoginDialog(true);
      } else {
        toast({
          title: 'Failed to Load Crops',
          description: 'Please try again later.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getCropIcon = (cropName?: string) => {
    if (!cropName) {
      return <Leaf className="h-12 w-12 text-green-500" />;
    }
    const name = cropName.toLowerCase();
    if (name.includes('rice') || name.includes('wheat') || name.includes('cotton')) {
      return <Wheat className="h-12 w-12 text-primary" />;
    }
    return <Leaf className="h-12 w-12 text-green-500" />;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
        <Card className="h-full border-2 border-dashed bg-secondary/50 flex flex-col justify-center">
          <CardHeader className="text-center">
            <div className="mx-auto bg-background/70 rounded-full p-3 w-fit">
              <Leaf className="h-10 w-10 text-muted-foreground" />
            </div>
            <CardTitle className="font-headline mt-4">Login Required</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => setShowLoginDialog(true)}>
              Sign In to View Crops
            </Button>
          </CardContent>
        </Card>
      </>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-full">
            <CardHeader>
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (crops.length === 0) {
    return (
      <Card className="h-full border-2 border-dashed bg-secondary/50 flex flex-col justify-center">
        <CardHeader className="text-center">
          <div className="mx-auto bg-background/70 rounded-full p-3 w-fit">
            <Leaf className="h-10 w-10 text-muted-foreground" />
          </div>
          <CardTitle className="font-headline mt-4">No Crops Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground mb-4">
            Start by adding your first crop to track your farming progress.
          </p>
          <Button className="w-full" onClick={fetchCrops}>
            Refresh
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-headline text-2xl font-bold">My Crops</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchCrops}
          disabled={loading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {crops.map((crop) => (
          <Card key={crop.id} className="h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                {getCropIcon(crop.crop_name)}
                <div>
                  <CardTitle className="text-lg">{crop.crop_name || 'Unknown Crop'}</CardTitle>
                  {crop.crop_variety && (
                    <p className="text-sm text-muted-foreground">{crop.crop_variety}</p>
                  )}
                  {crop.crop_code && (
                    <p className="text-xs text-muted-foreground font-mono">{crop.crop_code}</p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{crop.total_area_acres} acres total ({crop.cultivable_area_acres} cultivable)</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Planted: {formatDate(crop.planting_date)}</span>
              </div>
              
              {crop.expected_harvest_date && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Harvest: {formatDate(crop.expected_harvest_date)}</span>
                </div>
              )}
              
              {crop.average_yield && (
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span>Avg Yield: {crop.average_yield} quintals</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                  {crop.crop_stage}
                </span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  Health: {crop.crop_health_score}%
                </span>
              </div>
              
              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>Location:</strong> {crop.village}, {crop.district}, {crop.state}</p>
                <p><strong>Soil:</strong> {crop.soil_type}</p>
                <p><strong>Water:</strong> {crop.water_source} ({crop.irrigation_type})</p>
                {crop.current_crop && crop.current_crop !== crop.crop_name && (
                  <p><strong>Current Crop:</strong> {crop.current_crop}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}