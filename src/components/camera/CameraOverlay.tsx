
'use client';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CameraPane } from './CameraPane';

type CameraOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CameraOverlay({ isOpen, onClose }: CameraOverlayProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      <div className="relative h-full w-full bg-accent/95 p-4 shadow-lg backdrop-blur-md">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 h-8 w-8 rounded-full bg-muted/70 text-white hover:bg-muted"
        >
          <X className="h-4 w-4" strokeWidth={3} />
          <span className="sr-only">Close Camera</span>
        </Button>
        <div className="flex h-full flex-col items-center justify-center">
          <CameraPane />
        </div>
      </div>
    </div>
  );
}
