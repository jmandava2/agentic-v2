
'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Camera, Upload, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function HealthCheckPane() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setUploadSuccess(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    // Mock upload logic
    if (!imagePreview) {
      toast({
        variant: 'destructive',
        title: 'No Image',
        description: 'Please capture or select an image first.',
      });
      return;
    }

    toast({
      title: 'Uploading...',
      description: 'Analyzing crop health. This is a mock action.',
    });

    setTimeout(() => {
      setUploadSuccess(true);
      toast({
        title: 'Analysis Complete',
        description:
          'The crop appears to be healthy. No major issues detected.',
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="aspect-video w-full rounded-lg border-2 border-dashed bg-secondary/50 flex items-center justify-center">
        {imagePreview ? (
          <Image
            src={imagePreview}
            alt="Crop preview"
            width={600}
            height={400}
            className="object-contain h-full w-full rounded-md"
          />
        ) : (
          <div className="text-center text-muted-foreground">
            <Camera className="mx-auto h-12 w-12" />
            <p>Image preview will appear here.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Label htmlFor="camera-input" className="w-full">
          <Button asChild className="w-full" variant="outline">
            <span>
              <Camera className="mr-2 h-4 w-4" /> Capture with Camera
            </span>
          </Button>
          <Input
            type="file"
            id="camera-input"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
        </Label>
        <Button onClick={handleUpload} disabled={!imagePreview}>
          <Upload className="mr-2 h-4 w-4" />
          Analyze Image
        </Button>
      </div>

      {uploadSuccess && (
        <div className="flex items-center gap-3 rounded-lg bg-green-100 p-4 text-green-800 dark:bg-green-900/50 dark:text-green-200">
          <CheckCircle className="h-6 w-6" />
          <p className="font-medium">Analysis successful: Crop is healthy.</p>
        </div>
      )}
    </div>
  );
}
