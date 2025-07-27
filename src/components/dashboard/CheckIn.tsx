
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Camera, X, Loader2 } from 'lucide-react';
import { useCamera } from '@/hooks/use-camera';
import { useToast } from '@/hooks/use-toast';
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

type CheckInProps = {
  cropName: string;
  onCheckIn: (note: string, photo?: string) => void;
  children: React.ReactNode;
};

export function CheckIn({ cropName, onCheckIn, children }: CheckInProps) {
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { openCamera } = useCamera({
    onCapture: (dataUrl) => {
      setPhoto(dataUrl);
    },
  });
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!note && !photo) {
      toast({
        variant: 'destructive',
        title: 'Empty Check-in',
        description: 'Please add a note or a photo.',
      });
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      onCheckIn(note, photo || undefined);
      setLoading(false);
      setNote('');
      setPhoto(null);
      setIsOpen(false);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Check-in for {cropName}</DialogTitle>
          <DialogDescription>
            Add a note and an optional photo to log the current state of your
            crop.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="E.g., Signs of yellowing on lower leaves..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
          />
          {photo ? (
            <div className="relative w-32 h-32">
              <Image
                src={photo}
                alt="Check-in preview"
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                onClick={() => setPhoto(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={openCamera}>
              <Camera className="mr-2 h-4 w-4" />
              Add Photo
            </Button>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Save Check-in
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
